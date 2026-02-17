import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="text-2xl font-heading font-medium tracking-tight text-primary" data-testid="header-logo">
            La Boutique de Léa
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/products" className="text-sm font-medium hover:text-primary transition-colors" data-testid="nav-products">
              Produits
            </Link>
            {user && (
              <Link to="/account" className="text-sm font-medium hover:text-primary transition-colors" data-testid="nav-account">
                Mon Compte
              </Link>
            )}
            {user && (
              <Link to="/admin" className="text-sm font-medium hover:text-primary transition-colors" data-testid="nav-admin">
                Admin
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="hidden md:flex items-center gap-4">
                <span className="text-sm" data-testid="user-name">Bonjour, {user.name}</span>
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  data-testid="logout-button"
                >
                  Déconnexion
                </Button>
              </div>
            ) : (
              <Link to="/auth" data-testid="login-button">
                <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Connexion
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="mobile-menu-button"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t" data-testid="mobile-menu">
            <nav className="flex flex-col gap-4">
              <Link
                to="/products"
                className="text-sm font-medium hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Produits
              </Link>
              {user && (
                <Link
                  to="/account"
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Mon Compte
                </Link>
              )}
              {user && (
                <Link
                  to="/admin"
                  className="text-sm font-medium hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
              {user ? (
                <Button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  variant="ghost"
                  size="sm"
                  className="justify-start"
                >
                  Déconnexion
                </Button>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="ghost" size="sm" className="w-full justify-start">
                    Connexion
                  </Button>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;