import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Minus, Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { fetchProductsFromCSV } from '../utils/csvProducts';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const products = await fetchProductsFromCSV();
      const foundProduct = products.find(p => p.id === id);
      
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        toast.error('Produit non trouvé');
        navigate('/products');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Erreur lors du chargement');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Veuillez vous connecter pour ajouter des produits au panier');
      navigate('/auth');
      return;
    }

    try {
      await addToCart(product.id, quantity);
      toast.success(`${quantity} ${quantity > 1 ? 'produits ajoutés' : 'produit ajouté'} au panier`);
    } catch (error) {
      toast.error('Erreur lors de l\'ajout au panier');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" data-testid="loading">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen py-12" data-testid="product-detail-page">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <Button
          variant="ghost"
          onClick={() => navigate('/products')}
          className="mb-8"
          data-testid="back-button"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux produits
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="aspect-[3/4] bg-muted overflow-hidden sticky top-24">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
              data-testid="product-image"
            />
          </div>

          {/* Details */}
          <div className="space-y-8">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] font-medium text-muted-foreground mb-4" data-testid="product-category">
                {product.category}
              </p>
              <h1 className="text-4xl md:text-5xl font-normal tracking-tight mb-6" data-testid="product-name">
                {product.name}
              </h1>
              <p className="text-3xl font-light mb-8" data-testid="product-price">
                {product.price.toFixed(2)}€
              </p>
            </div>

            <div className="border-t border-b border-border py-8">
              <h2 className="text-lg font-medium mb-4">Description</h2>
              <p className="text-base font-light leading-relaxed text-muted-foreground" data-testid="product-description">
                {product.description}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-4">Quantité</h3>
              <div className="flex items-center gap-4 mb-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  data-testid="decrease-quantity"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-medium w-12 text-center" data-testid="quantity-display">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  data-testid="increase-quantity"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                onClick={handleAddToCart}
                size="lg"
                className="w-full rounded-full"
                disabled={product.stock === 0}
                data-testid="add-to-cart-button"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.stock === 0 ? 'Rupture de stock' : 'Ajouter au panier'}
              </Button>

              {product.stock > 0 && product.stock < 10 && (
                <p className="text-sm text-muted-foreground mt-4" data-testid="stock-warning">
                  Plus que {product.stock} en stock
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
