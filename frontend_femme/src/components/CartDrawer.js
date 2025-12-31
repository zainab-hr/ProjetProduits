import React from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const CartDrawer = () => {
  const { user } = useAuth();
  const {
    cartItems,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
  } = useCart();

  const isHomme = user?.genre === 'HOMME';
  const themeColor = isHomme ? '#4f46e5' : '#ec4899';
  const themeGradient = isHomme 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';

  const handleCheckout = () => {
    toast.success('🎉 Commande passée avec succès!', {
      icon: '🎉'
    });
    clearCart();
    closeCart();
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`cart-overlay ${isCartOpen ? 'open' : ''}`}
        onClick={closeCart}
      />
      
      {/* Cart Drawer */}
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-header" style={{ background: themeGradient }}>
          <h3>
            <i className="fas fa-shopping-cart me-2"></i>
            Mon Panier
          </h3>
          <button className="close-btn" onClick={closeCart}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <i className="fas fa-shopping-basket"></i>
              <h4>Votre panier est vide</h4>
              <p>Ajoutez des produits pour commencer</p>
            </div>
          ) : (
            <div className="cart-items">
              {cartItems.map(item => (
                <div key={item.id} className="cart-item">
                  <div className="item-image">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.nom} />
                    ) : (
                      <div className="placeholder" style={{ background: themeGradient }}>
                        <i className={`fas fa-${isHomme ? 'tshirt' : 'gem'}`}></i>
                      </div>
                    )}
                  </div>
                  <div className="item-details">
                    <h5>{item.nom}</h5>
                    <p className="item-price" style={{ color: themeColor }}>
                      {item.prix?.toFixed(2)} €
                    </p>
                    <div className="quantity-controls">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="qty-btn"
                      >
                        <i className="fas fa-minus"></i>
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="qty-btn"
                      >
                        <i className="fas fa-plus"></i>
                      </button>
                    </div>
                  </div>
                  <div className="item-total">
                    <p>{(item.prix * item.quantity).toFixed(2)} €</p>
                    <button 
                      className="remove-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary">
              <div className="summary-row">
                <span>Sous-total</span>
                <span>{getCartTotal().toFixed(2)} €</span>
              </div>
              <div className="summary-row">
                <span>Livraison</span>
                <span className="free-shipping">Gratuite</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span style={{ color: themeColor }}>{getCartTotal().toFixed(2)} €</span>
              </div>
            </div>
            <button 
              className="checkout-btn"
              style={{ background: themeGradient }}
              onClick={handleCheckout}
            >
              <i className="fas fa-credit-card me-2"></i>
              Commander
            </button>
            <button 
              className="clear-btn"
              onClick={clearCart}
            >
              <i className="fas fa-trash me-2"></i>
              Vider le panier
            </button>
          </div>
        )}
      </div>

      <style jsx="true">{`
        .cart-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
          z-index: 1040;
        }

        .cart-overlay.open {
          opacity: 1;
          visibility: visible;
        }

        .cart-drawer {
          position: fixed;
          top: 0;
          right: -420px;
          width: 400px;
          max-width: 100vw;
          height: 100vh;
          background: white;
          box-shadow: -5px 0 30px rgba(0, 0, 0, 0.2);
          transition: right 0.3s ease;
          z-index: 1050;
          display: flex;
          flex-direction: column;
        }

        .cart-drawer.open {
          right: 0;
        }

        .cart-header {
          padding: 20px;
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .cart-header h3 {
          margin: 0;
          font-size: 1.3rem;
        }

        .close-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }

        .cart-body {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
        }

        .empty-cart {
          text-align: center;
          padding: 60px 20px;
          color: #94a3b8;
        }

        .empty-cart i {
          font-size: 4rem;
          margin-bottom: 20px;
          opacity: 0.5;
        }

        .empty-cart h4 {
          color: #64748b;
          margin-bottom: 10px;
        }

        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .cart-item {
          display: flex;
          gap: 15px;
          padding: 15px;
          background: #f8fafc;
          border-radius: 12px;
          transition: all 0.3s;
        }

        .cart-item:hover {
          background: #f1f5f9;
        }

        .item-image {
          width: 80px;
          height: 80px;
          border-radius: 10px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-image .placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
        }

        .item-details {
          flex: 1;
          min-width: 0;
        }

        .item-details h5 {
          margin: 0 0 5px;
          font-size: 0.95rem;
          color: #1e293b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .item-price {
          font-weight: 600;
          margin: 0 0 10px;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .qty-btn {
          width: 28px;
          height: 28px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          color: #64748b;
          transition: all 0.2s;
        }

        .qty-btn:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }

        .quantity {
          font-weight: 600;
          min-width: 20px;
          text-align: center;
        }

        .item-total {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: space-between;
        }

        .item-total p {
          font-weight: 700;
          margin: 0;
          color: #1e293b;
        }

        .remove-btn {
          background: none;
          border: none;
          color: #ef4444;
          cursor: pointer;
          padding: 5px;
          opacity: 0.6;
          transition: opacity 0.2s;
        }

        .remove-btn:hover {
          opacity: 1;
        }

        .cart-footer {
          padding: 20px;
          border-top: 1px solid #e2e8f0;
          background: #f8fafc;
        }

        .cart-summary {
          margin-bottom: 20px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          color: #64748b;
        }

        .summary-row.total {
          font-size: 1.2rem;
          font-weight: 700;
          color: #1e293b;
          padding-top: 10px;
          border-top: 1px solid #e2e8f0;
        }

        .free-shipping {
          color: #22c55e;
          font-weight: 600;
        }

        .checkout-btn {
          width: 100%;
          padding: 15px;
          border: none;
          border-radius: 12px;
          color: white;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s;
          margin-bottom: 10px;
        }

        .checkout-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        }

        .clear-btn {
          width: 100%;
          padding: 12px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          background: white;
          color: #64748b;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s;
        }

        .clear-btn:hover {
          background: #fee2e2;
          border-color: #fecaca;
          color: #ef4444;
        }

        @media (max-width: 480px) {
          .cart-drawer {
            width: 100%;
            right: -100%;
          }
        }
      `}</style>
    </>
  );
};

export default CartDrawer;
