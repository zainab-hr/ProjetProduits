from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import os
import pandas as pd
import numpy as np
from typing import Optional, List
from decimal import Decimal
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime
from scipy.sparse import hstack

# Initialisation de l'application FastAPI
app = FastAPI(title="API de prédiction de genre de produits")

# Configuration CORS pour permettre les requêtes depuis différentes origines
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration des bases de données - Use Docker container names
DB_CONFIG_HOMME = {
    "host": os.getenv("HOMME_DB_HOST", "postgres-homme"),
    "port": int(os.getenv("HOMME_DB_PORT", "5432")),
    "database": os.getenv("HOMME_DB_NAME", "homme_db"),
    "user": os.getenv("HOMME_DB_USER", "postgres"),
    "password": os.getenv("HOMME_DB_PASSWORD", "postgres"),
}

DB_CONFIG_FEMME = {
    "host": os.getenv("FEMME_DB_HOST", "postgres-femme"),
    "port": int(os.getenv("FEMME_DB_PORT", "5432")),
    "database": os.getenv("FEMME_DB_NAME", "femme_db"),
    "user": os.getenv("FEMME_DB_USER", "postgres"),
    "password": os.getenv("FEMME_DB_PASSWORD", "postgres"),
}

# Modèle Pydantic pour la requête de prédiction
class ProductRequest(BaseModel):
    product_name: str
    product_type: str
    product_group: str = ""

# Modèle Pydantic pour créer un produit avec prédiction automatique
class ProductCreateRequest(BaseModel):
    nom: str
    categorie: str
    prix: float
    description: Optional[str] = None
    image_url: Optional[str] = None

# Modèle Pydantic pour la réponse produit
class ProductResponse(BaseModel):
    id: int
    nom: str
    categorie: str
    prix: float
    description: Optional[str]
    image_url: Optional[str]
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

# Chargement du modèle au démarrage
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'product_gender_classifier.pkl')
model = None

def load_model():
    """Charge le modèle pré-entraîné"""
    global model
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Modèle non trouvé à l'emplacement: {MODEL_PATH}")
    model = joblib.load(MODEL_PATH)

def get_db_connection(db_type: str):
    """Crée une connexion à la base de données spécifiée"""
    config = DB_CONFIG_HOMME if db_type == "homme" else DB_CONFIG_FEMME
    try:
        conn = psycopg2.connect(**config)
        return conn
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur de connexion à la base {db_type}: {str(e)}")

def predict_product_gender(product_name: str, product_type: str, product_group: str = ""):
    """Prédit le genre d'un produit en utilisant le modèle ML"""
    if model is None:
        raise HTTPException(status_code=503, detail="Modèle non chargé")
    
    text = f"{product_name} {product_type} {product_group}"
    
    tfidf = model['tfidf']
    scaler = model['scaler']
    clf = model['clf']
    
    X_text = pd.Series([text])
    X_nums = pd.DataFrame({
        'purchase_count': [0],
        'like_count': [0],
        'cart_count': [0]
    })
    
    X_tfidf = tfidf.transform(X_text)
    X_nums_s = scaler.transform(X_nums)
    
    X_comb = hstack([X_tfidf, X_nums_s])
    
    # Obtenir les probabilités pour chaque classe
    probabilities = clf.predict_proba(X_comb)[0]
    classes = clf.classes_
    
    # Créer un dictionnaire des probabilités
    proba_dict = {class_name: float(prob) for class_name, prob in zip(classes, probabilities)}
    
    # Trouver les probabilités de Homme et Femme
    prob_homme = proba_dict.get("Homme", 0)
    prob_femme = proba_dict.get("Femme", 0)
    
    # Décision basée uniquement sur Homme vs Femme (ignorer Unisexe)
    if prob_homme >= prob_femme:
        final_gender = "Homme"
        confidence = prob_homme / (prob_homme + prob_femme) if (prob_homme + prob_femme) > 0 else 0.5
    else:
        final_gender = "Femme"
        confidence = prob_femme / (prob_homme + prob_femme) if (prob_homme + prob_femme) > 0 else 0.5
    
    print(f"Produit: '{product_name}'")
    print(f"Probabilités: Homme={prob_homme:.3f}, Femme={prob_femme:.3f}, Unisexe={proba_dict.get('Unisexe', 0):.3f}")
    print(f"Décision: {final_gender} (confiance: {confidence:.2%})")
    
    return final_gender, confidence, proba_dict

@app.on_event("startup")
async def startup_event():
    """Charge le modèle au démarrage de l'API"""
    try:
        load_model()
        print("Modèle chargé avec succès")
    except Exception as e:
        print(f"Erreur lors du chargement du modèle: {str(e)}")
        raise

@app.get("/")
async def root():
    """Endpoint de base pour vérifier que l'API fonctionne"""
    return {
        "message": "API de prédiction de genre de produits",
        "endpoints": {
            "/predict": "POST - Prédit le genre d'un produit",
            "/predict-and-save": "POST - Prédit le genre et sauvegarde dans la bonne base",
            "/products/homme": "GET - Liste les produits homme",
            "/products/femme": "GET - Liste les produits femme",
            "/health": "GET - Vérifie l'état de l'API"
        }
    }

@app.get("/health")
async def health_check():
    """Vérifie l'état de l'API et les connexions aux bases de données"""
    db_homme_status = "ok"
    db_femme_status = "ok"
    
    try:
        conn = get_db_connection("homme")
        conn.close()
    except:
        db_homme_status = "error"
    
    try:
        conn = get_db_connection("femme")
        conn.close()
    except:
        db_femme_status = "error"
    
    return {
        "status": "ok" if model and db_homme_status == "ok" and db_femme_status == "ok" else "degraded",
        "model_loaded": model is not None,
        "model_components": list(model.keys()) if model else [],
        "db_homme": db_homme_status,
        "db_femme": db_femme_status
    }

@app.post("/predict")
async def predict_gender(product: ProductRequest):
    """
    Prédit le genre d'un produit en fonction de son nom et de sa catégorie.
    """
    if model is None:
        raise HTTPException(status_code=503, detail="Modèle non chargé")
    
    try:
        predicted_gender, confidence, proba_dict = predict_product_gender(
            product.product_name,
            product.product_type,
            product.product_group
        )
        
        return {
            "product_name": product.product_name,
            "predicted_gender": predicted_gender,
            "probabilities": proba_dict,
            "confidence": confidence
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la prédiction: {str(e)}")

@app.post("/predict-and-save")
async def predict_and_save_product(product: ProductCreateRequest):
    """
    Prédit le genre d'un produit et le sauvegarde automatiquement dans la bonne base de données.
    """
    import traceback
    try:
        print(f"Received product: {product}")
        # Prédire le genre avec la nouvelle fonction qui compare Homme vs Femme
        predicted_gender, confidence, proba_dict = predict_product_gender(
            product.nom, 
            product.categorie, 
            product.description or ""
        )
        print(f"Prediction: {predicted_gender}, confidence: {confidence}")
        
        # Normaliser en minuscules
        gender = predicted_gender.lower()
        
        # Insérer dans la bonne base de données
        table_name = "produits_homme" if gender == "homme" else "produits_femme"
        
        conn = get_db_connection(gender)
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        insert_query = f"""
            INSERT INTO {table_name} (nom, categorie, prix, description, image_url, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, NOW(), NOW())
            RETURNING id, nom, categorie, prix, description, image_url, created_at, updated_at
        """
        
        cursor.execute(insert_query, (
            product.nom,
            product.categorie,
            product.prix,
            product.description,
            product.image_url
        ))
        
        created_product = cursor.fetchone()
        conn.commit()
        cursor.close()
        conn.close()
        
        return {
            "message": f"Produit créé avec succès dans la base {gender}",
            "predicted_gender": gender,
            "confidence": confidence,
            "probabilities": proba_dict,
            "product": dict(created_product)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Erreur lors de la création du produit: {str(e)}")

@app.get("/products/homme", response_model=List[ProductResponse])
async def get_products_homme():
    """Récupère tous les produits de la base homme"""
    try:
        conn = get_db_connection("homme")
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        cursor.execute("SELECT * FROM produits_homme ORDER BY id DESC")
        products = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return [dict(p) for p in products]
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération des produits: {str(e)}")

@app.get("/products/femme", response_model=List[ProductResponse])
async def get_products_femme():
    """Récupère tous les produits de la base femme"""
    try:
        conn = get_db_connection("femme")
        cursor = conn.cursor(cursor_factory=RealDictCursor)
        
        cursor.execute("SELECT * FROM produits_femme ORDER BY id DESC")
        products = cursor.fetchall()
        
        cursor.close()
        conn.close()
        
        return [dict(p) for p in products]
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la récupération des produits: {str(e)}")

@app.post("/products/bulk-import")
async def bulk_import_products(products: List[ProductCreateRequest]):
    """
    Importe plusieurs produits en les classant automatiquement dans la bonne base de données.
    """
    results = {
        "total": len(products),
        "homme": 0,
        "femme": 0,
        "errors": []
    }
    
    for i, product in enumerate(products):
        try:
            predicted_gender, confidence, _ = predict_product_gender(
                product.nom,
                product.categorie,
                ""
            )
            
            gender = "homme" if predicted_gender.lower() in ["homme", "male", "men", "m"] else "femme"
            table_name = "produits_homme" if gender == "homme" else "produits_femme"
            
            conn = get_db_connection(gender)
            cursor = conn.cursor()
            
            insert_query = f"""
                INSERT INTO {table_name} (nom, categorie, prix, description, image_url, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, NOW(), NOW())
            """
            
            cursor.execute(insert_query, (
                product.nom,
                product.categorie,
                product.prix,
                product.description,
                product.image_url
            ))
            
            conn.commit()
            cursor.close()
            conn.close()
            
            results[gender] += 1
            
        except Exception as e:
            results["errors"].append({
                "index": i,
                "product_name": product.nom,
                "error": str(e)
            })
    
    return results

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
