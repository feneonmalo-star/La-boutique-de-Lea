import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { fetchProductsFromCSV, getCategories } from '../utils/csvProducts';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState(['all']);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const productsFromCSV = await fetchProductsFromCSV();
      setProducts(productsFromCSV);
      setFilteredProducts(productsFromCSV);
      
      // Get categories from products
      const cats = getCategories(productsFromCSV);
      setCategories(cats);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Erreur lors du chargement des produits');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const handleAddToCart = async (productId) => {
    if (!user) {
      toast.error('Veuillez vous connecter pour ajouter des produits au panier');
      return;
    }

    try {
      await addToCart(productId, 1);
      toast.success('Produit ajouté au panier');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout au panier');
    }
  };

  return (
    <div className="min-h-screen py-12" data-testid="products-page">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-normal tracking-tight mb-4" data-testid="products-title">
            Notre Collection
          </h1>
          <p className="text-lg font-light text-muted-foreground" data-testid="products-subtitle">
            Découvrez nos produits de beauté naturels et luxueux
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12 space-y-6">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="search-input"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
                data-testid={`category-${category}`}
              >
                {category === 'all' ? 'Tous' : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12" data-testid="loading-spinner">
            <p className="text-muted-foreground">Chargement des produits...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12" data-testid="no-products">
            <p className="text-muted-foreground">Aucun produit trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16" data-testid="products-grid">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group relative bg-transparent overflow-hidden transition-all duration-300 hover:-translate-y-1"
                data-testid={`product-card-${product.id}`}
              >
                <Link to={`/products/${product.id}`}>
                  <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-muted">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </Link>

                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {product.category}
                  </p>
                  <Link to={`/products/${product.id}`}>
                    <h3 className="text-xl font-normal hover:text-primary transition-colors" data-testid={`product-name-${product.id}`}>
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-2xl font-light" data-testid={`product-price-${product.id}`}>
                      {product.price.toFixed(2)}€
                    </span>
                    <Button
                      onClick={() => handleAddToCart(product.id)}
                      size="sm"
                      className="rounded-full"
                      data-testid={`add-to-cart-${product.id}`}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Ajouter
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
