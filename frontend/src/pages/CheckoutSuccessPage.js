import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Package } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CheckoutSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { token } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState('checking');
  const [attempts, setAttempts] = useState(0);
  const maxAttempts = 5;

  useEffect(() => {
    if (!sessionId || !token) {
      navigate('/');
      return;
    }

    pollPaymentStatus();
  }, [sessionId, token]);

  const pollPaymentStatus = async () => {
    if (attempts >= maxAttempts) {
      setStatus('timeout');
      return;
    }

    try {
      const response = await axios.get(
        `${API}/checkout/status/${sessionId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.payment_status === 'paid') {
        setStatus('success');
        return;
      } else if (response.data.status === 'expired') {
        setStatus('expired');
        return;
      }

      // Continue polling
      setAttempts(prev => prev + 1);
      setTimeout(() => pollPaymentStatus(), 2000);
    } catch (error) {
      console.error('Error checking payment status:', error);
      setStatus('error');
    }
  };

  if (status === 'checking') {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center" data-testid="checking-status">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-6"></div>
          <p className="text-lg text-muted-foreground">Vérification du paiement...</p>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center" data-testid="success-page">
        <div className="text-center max-w-2xl px-6">
          <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-6" />
          <h1 className="text-4xl font-normal tracking-tight mb-4" data-testid="success-title">
            Paiement Réussi !
          </h1>
          <p className="text-lg text-muted-foreground mb-8" data-testid="success-message">
            Merci pour votre commande. Vous allez recevoir un email de confirmation.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => navigate('/account')} data-testid="view-orders-button">
              <Package className="h-4 w-4 mr-2" />
              Voir mes commandes
            </Button>
            <Button variant="outline" onClick={() => navigate('/products')} data-testid="continue-shopping-button">
              Continuer mes achats
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 flex items-center justify-center" data-testid="error-page">
      <div className="text-center max-w-2xl px-6">
        <h1 className="text-4xl font-normal tracking-tight mb-4">Oups...</h1>
        <p className="text-lg text-muted-foreground mb-8">
          {status === 'timeout'
            ? 'La vérification du paiement prend plus de temps que prévu. Veuillez vérifier vos commandes.'
            : status === 'expired'
            ? 'La session de paiement a expiré.'
            : 'Une erreur est survenue.'}
        </p>
        <Button onClick={() => navigate('/account')}>Voir mes commandes</Button>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
