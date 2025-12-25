import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminPage = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category: 'Soin du visage',
    stock: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchProducts();
  }, [user]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${API}/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Erreur lors du chargement des produits');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock)
    };

    try {
      if (editingProduct) {
        await axios.put(
          `${API}/admin/products/${editingProduct.id}`,
          productData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Produit modifié');
      } else {
        await axios.post(
          `${API}/admin/products`,
          productData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Produit ajouté');
      }
      
      setShowForm(false);
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', image_url: '', category: 'Soin du visage', stock: '' });
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;

    try {
      await axios.delete(`${API}/admin/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Produit supprimé');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      image_url: product.image_url,
      category: product.category,
      stock: product.stock.toString()
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: '', image_url: '', category: 'Soin du visage', stock: '' });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen py-12" data-testid="admin-page">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl md:text-5xl font-normal tracking-tight" data-testid="admin-title">
            Administration
          </h1>
          <Button
            onClick={() => setShowForm(true)}
            data-testid="add-product-button"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un produit
          </Button>
        </div>

        {/* Product Form */}
        {showForm && (
          <div className="mb-12 bg-surface p-8 border border-border" data-testid="product-form">
            <h2 className="text-2xl font-normal mb-6">
              {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du produit</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    data-testid="product-name-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="flex h-12 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                    required
                    data-testid="product-category-input"
                  >
                    <option value="Soin du visage">Soin du visage</option>
                    <option value="Soin du corps">Soin du corps</option>
                    <option value="Maquillage">Maquillage</option>
                    <option value="Parfums">Parfums</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Prix (€)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    data-testid="product-price-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                    data-testid="product-stock-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">URL de l'image</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  required
                  data-testid="product-image-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                  data-testid="product-description-input"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" data-testid="submit-product-button">
                  {editingProduct ? 'Modifier' : 'Ajouter'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} data-testid="cancel-button">
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Products List */}
        <div className="space-y-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-6 p-6 bg-surface border border-border"
              data-testid={`admin-product-${product.id}`}
            >
              <div className="w-20 h-20 bg-muted flex-shrink-0">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-medium mb-1">{product.name}</h3>
                <p className="text-sm text-muted-foreground">{product.category}</p>
                <p className="text-sm">{product.price.toFixed(2)}€ - Stock: {product.stock}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(product)}
                  data-testid={`edit-product-${product.id}`}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(product.id)}
                  data-testid={`delete-product-${product.id}`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
