import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Package, User } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AccountPage = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen py-12" data-testid="account-page">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <h1 className="text-4xl md:text-5xl font-normal tracking-tight mb-12" data-testid="account-title">
          Mon Compte
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Profile */}
          <div className="lg:col-span-1">
            <div className="bg-surface p-8 border border-border" data-testid="profile-section">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-medium" data-testid="user-name">{user.name}</h2>
                  <p className="text-sm text-muted-foreground" data-testid="user-email">{user.email}</p>
                </div>
              </div>
              <Button
                onClick={logout}
                variant="outline"
                className="w-full"
                data-testid="logout-button"
              >
                Déconnexion
              </Button>
            </div>
          </div>

          {/* Orders */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-normal mb-6">Mes Commandes</h2>
            
            {loading ? (
              <p className="text-muted-foreground" data-testid="loading">Chargement...</p>
            ) : orders.length === 0 ? (
              <div className="text-center py-12 bg-surface border border-border" data-testid="no-orders">
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">Aucune commande pour le moment</p>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-surface p-6 border border-border"
                    data-testid={`order-${order.id}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Commande #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          order.payment_status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                        data-testid={`order-status-${order.id}`}
                      >
                        {order.payment_status === 'paid' ? 'Payé' : 'En attente'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>{item.name} x {item.quantity}</span>
                          <span>{item.subtotal.toFixed(2)}€</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t border-border pt-4 flex justify-between font-medium">
                      <span>Total</span>
                      <span data-testid={`order-total-${order.id}`}>{order.total.toFixed(2)}€</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
