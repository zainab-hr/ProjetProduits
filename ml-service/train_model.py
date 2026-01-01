import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from scipy.sparse import hstack
import joblib
import os

def normalize_gender(v):
    if pd.isna(v): return None
    s = str(v).strip().lower()
    if s in ('male','m','man','homme','h','masculin'): return 'male'
    if s in ('female','f','woman','femme','f','feminin'): return 'female'
    return None

def build_table(df):
    df['gender_norm'] = df['gender'].apply(normalize_gender)
    interactions = df[df['interaction_type'].str.lower().isin(['purchase','like','add to cart','add_to_cart','add-to-cart'])].copy()
    purchases = df[df['interaction_type'].str.lower() == 'purchase'].copy()

    meta = df.groupby('article_id').agg(
        prod_name = ('prod_name','first'),
        product_type_name = ('product_type_name','first'),
        product_group_name = ('product_group_name','first')
    ).reset_index()

    inter_counts = interactions.groupby('article_id').agg(
        total_interactions = ('customer_id','count'),
        male_interactions = ('gender_norm', lambda x: (x=='male').sum()),
        female_interactions = ('gender_norm', lambda x: (x=='female').sum())
    ).reset_index()

    counts = interactions.groupby(['article_id','interaction_type']).size().unstack(fill_value=0).reset_index()
    for col in ['purchase','like','add to cart','add_to_cart','add-to-cart']:
        if col not in counts.columns:
            counts[col] = 0
    counts['purchase_count'] = counts.get('purchase',0)
    counts['like_count'] = counts.get('like',0)
    counts['cart_count'] = counts.get('add to cart',0) + counts.get('add_to_cart',0) + counts.get('add-to-cart',0)
    counts = counts[['article_id','purchase_count','like_count','cart_count']]

    agg_purch = purchases.groupby('article_id').agg(
        total_purchases = ('customer_id','count'),
        male_purchases = ('gender_norm', lambda x: (x=='male').sum()),
        female_purchases = ('gender_norm', lambda x: (x=='female').sum())
    ).reset_index()

    merged = meta.merge(inter_counts, on='article_id', how='left') \
                 .merge(counts, on='article_id', how='left') \
                 .merge(agg_purch, on='article_id', how='left') \
                 .fillna({'total_interactions':0,'male_interactions':0,'female_interactions':0,'purchase_count':0,'like_count':0,'cart_count':0,'total_purchases':0,'male_purchases':0,'female_purchases':0})

    merged['male_pct'] = merged.apply(lambda r: (r['male_interactions']/r['total_interactions']) if r['total_interactions']>0 else 0.0, axis=1)
    merged['female_pct'] = merged.apply(lambda r: (r['female_interactions']/r['total_interactions']) if r['total_interactions']>0 else 0.0, axis=1)
    
    def label_row(r):
        if r['male_pct'] > r['female_pct'] and r['male_pct'] >= 0.4:
            return 'Homme'
        if r['female_pct'] > r['male_pct'] and r['female_pct'] >= 0.4:
            return 'Femme'
        if r['male_pct'] > r['female_pct']:
            return 'Homme'
        if r['female_pct'] > r['male_pct']:
            return 'Femme'
        return 'Unisexe'
    
    merged['target_gender'] = merged.apply(label_row, axis=1)
    return merged, interactions, purchases

def train_text_classifier(article_df, out_dir, test_size=0.2, random_state=42):
    df = article_df.dropna(subset=['target_gender']).copy()
    df['text'] = (df['prod_name'].fillna('') + ' ' + df['product_type_name'].fillna('') + ' ' + df['product_group_name'].fillna('')).str.strip()
    X_text = df['text']
    X_nums = df[['purchase_count','like_count','cart_count']].fillna(0)
    y = df['target_gender']

    X_train_text, X_test_text, X_train_nums, X_test_nums, y_train, y_test = train_test_split(
        X_text, X_nums, y, test_size=test_size, random_state=random_state, stratify=y
    )

    tfidf = TfidfVectorizer(max_features=5000, ngram_range=(1,2))
    scaler = StandardScaler()
    X_train_tfidf = tfidf.fit_transform(X_train_text)
    X_test_tfidf = tfidf.transform(X_test_text)
    scaler.fit(X_train_nums)
    X_train_nums_s = scaler.transform(X_train_nums)
    X_test_nums_s = scaler.transform(X_test_nums)

    X_train_comb = hstack([X_train_tfidf, X_train_nums_s])
    X_test_comb = hstack([X_test_tfidf, X_test_nums_s])

    clf = LogisticRegression(
        max_iter=2000, 
        solver='lbfgs', 
        class_weight='balanced',
        random_state=42
    )
    clf.fit(X_train_comb, y_train)

    model = {
        'tfidf': tfidf,
        'scaler': scaler,
        'clf': clf
    }
    joblib.dump(model, os.path.join(out_dir, 'product_gender_classifier.pkl'))

    acc = clf.score(X_test_comb, y_test)
    return model, acc, len(X_train_text), len(X_test_text)

def main():
    input_file = '/app/data_fusionnee.csv'
    out_dir = '/app'
    
    print(f"Loading data from {input_file}...")
    df = pd.read_csv(input_file)
    print(f"Loaded {len(df)} rows")

    print("Building article table...")
    article_table, interactions, purchases = build_table(df)
    
    print("Training classifier...")
    model, acc, n_train, n_test = train_text_classifier(article_table, out_dir, test_size=0.2)

    summary = article_table['target_gender'].value_counts().to_dict()
    print('=== Repartition par genre ===')
    for k in ['Homme','Femme','Unisexe']:
        print(f"  {k}: {summary.get(k,0)}")
    print(f'\nTrain/Test: {n_train}/{n_test}')
    print(f'Accuracy: {acc:.4f}')
    print(f'Model saved: {os.path.join(out_dir, "product_gender_classifier.pkl")}')

if __name__ == '__main__':
    main()
