import React from 'react';

const ProductCard = ({ product, onView, onLike, onEdit, onDelete, type }) => {
  const colorClass = type === 'homme' ? 'primary' : 'pink';
  
  return (
    <div className="card product-card h-100 shadow-sm">
      {product.imageUrl ? (
        <img 
          src={product.imageUrl} 
          className="card-img-top" 
          alt={product.nom}
        />
      ) : (
        <div className="product-placeholder">
          <i className={`fas fa-${type === 'homme' ? 'male' : 'female'}`}></i>
        </div>
      )}
      
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h5 className="card-title mb-0">{product.nom}</h5>
          <span className={`badge bg-${type === 'homme' ? 'primary' : 'danger'} category-badge`}>
            {product.categorie}
          </span>
        </div>
        
        <p className="card-text text-muted flex-grow-1">
          {product.description?.substring(0, 100)}
          {product.description?.length > 100 && '...'}
        </p>
        
        <div className="price-tag mb-3">
          {product.prix?.toFixed(2)} €
        </div>
        
        <div className="d-flex gap-2">
          <button 
            className="btn btn-outline-secondary btn-sm flex-grow-1"
            onClick={() => onView && onView(product)}
            title="Voir"
          >
            <i className="fas fa-eye"></i>
          </button>
          <button 
            className="btn btn-outline-danger btn-sm flex-grow-1"
            onClick={() => onLike && onLike(product)}
            title="Like"
          >
            <i className="fas fa-heart"></i>
          </button>
          <button 
            className="btn btn-outline-warning btn-sm flex-grow-1"
            onClick={() => onEdit && onEdit(product)}
            title="Modifier"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button 
            className="btn btn-outline-danger btn-sm flex-grow-1"
            onClick={() => onDelete && onDelete(product)}
            title="Supprimer"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
