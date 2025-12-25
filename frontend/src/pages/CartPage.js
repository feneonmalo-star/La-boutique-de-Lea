import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CartPage = () => {
  const { cartItems, removeFromCart, getCartTotal, loading } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const total = getCartTotal();

  const handleRemoveItem = async (cartItemId) => {
    try {
      await removeFromCart(cartItemId);
      toast.success('Produit retiré du panier');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Veuillez vous connecter pour continuer');
      navigate('/auth');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Votre panier est vide');
      return;
    }

    try {
      setCheckoutLoading(true);
      const originUrl = window.location.origin;
      
      const response = await axios.post(
        `${API}/checkout/session`,
        { origin_url: originUrl },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Redirect to Stripe checkout
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Erreur lors du paiement');
      setCheckoutLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center" data-testid="not-logged-in">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
          <h2 className="text-2xl font-normal mb-4">Connectez-vous pour voir votre panier</h2>
          <Link to="/auth">
            <Button data-testid="login-link">Se connecter</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center" data-testid="loading">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center" data-testid="empty-cart">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 mx-auto mb-6 text-muted-foreground" />
          <h2 className="text-2xl font-normal mb-4">Votre panier est vide</h2>
          <Link to="/products">
            <Button data-testid="shop-button">
              Découvrir nos produits
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12" data-testid="cart-page">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <h1 className="text-4xl md:text-5xl font-normal tracking-tight mb-12" data-testid="cart-title">
          Mon Panier
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div
                key={item.cart_item_id}
                className="flex gap-6 p-6 bg-surface border border-border"
                data-testid={`cart-item-${item.cart_item_id}`}
              >
                <div className="w-24 h-24 bg-muted flex-shrink-0">
                  <img
                    src={item.product.image_url}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium mb-1" data-testid={`item-name-${item.cart_item_id}`}>
                    {item.product.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {item.product.category}
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-sm" data-testid={`item-quantity-${item.cart_item_id}`}>
                      Quantité: {item.quantity}
                    </span>
                    <span className="text-lg font-light" data-testid={`item-price-${item.cart_item_id}`}>
                      {(item.product.price * item.quantity).toFixed(2)}€
                    </span>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveItem(item.cart_item_id)}
                  data-testid={`remove-item-${item.cart_item_id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-surface p-8 border border-border sticky top-24" data-testid="order-summary">
              <h2 className="text-2xl font-normal mb-6">Résumé</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span data-testid="subtotal">{total.toFixed(2)}€</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Livraison</span>
                  <span>Gratuite</span>
                </div>
                <div className="border-t border-border pt-4 flex justify-between text-lg font-medium">
                  <span>Total</span>
                  <span data-testid="total">{total.toFixed(2)}€</span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                size="lg"
                className="w-full rounded-full"
                disabled={checkoutLoading}
                data-testid="checkout-button"
              >
                {checkoutLoading ? 'Redirection...' : 'Passer la commande'}
                {!checkoutLoading && <ArrowRight className="ml-2 h-5 w-5" />}
              </Button>

              <p className="text-xs text-center text-muted-foreground mt-4">
                Paiement sécurisé par Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
