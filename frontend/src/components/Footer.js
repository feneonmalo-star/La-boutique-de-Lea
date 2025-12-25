import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-24" data-testid="footer">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-heading font-medium mb-4">Lumière & Nature</h3>
            <p className="text-sm text-primary-foreground/80">
              Votre boutique de beauté naturelle et luxueuse.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="hover:text-secondary transition-colors">
                  Produits
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-secondary transition-colors">
                  Mon Compte
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium mb-4">Contact</h4>
            <p className="text-sm text-primary-foreground/80">
              Email: contact@lumierenature.com<br />
              Tél: +33 1 23 45 67 89
            </p>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/80">
          <p>© 2024 Lumière & Nature. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;