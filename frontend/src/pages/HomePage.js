import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Leaf, Heart } from 'lucide-react';
import { Button } from '../components/ui/button';

const HomePage = () => {
  return (
    <div className="min-h-screen" data-testid="home-page">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/3373716/pexels-photo-3373716.jpeg"
            alt="Natural beauty"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
        </div>
        
        <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 w-full">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] font-medium text-muted-foreground mb-6" data-testid="hero-subtitle">
              La Boutique de Léa
            </p>
            <h1 className="text-5xl md:text-7xl font-medium tracking-tight leading-[1.1] mb-6" data-testid="hero-title">
              Beauté Naturelle & Artisanale
            </h1>
            <p className="text-lg md:text-xl font-light leading-relaxed mb-8 text-muted-foreground" data-testid="hero-description">
              Découvrez mes produits de beauté naturels, faits avec soin et passion pour sublimer votre peau.
            </p>
            <Link to="/products" data-testid="hero-cta">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8 rounded-full font-medium tracking-wide transition-all duration-300"
              >
                Découvrir la Collection
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="bg-surface p-8 md:p-12 border border-border/50 hover:border-primary/20 transition-colors duration-500" data-testid="feature-1">
              <Sparkles className="h-10 w-10 text-secondary mb-6" />
              <h3 className="text-2xl md:text-3xl font-normal mb-4">Luxe Naturel</h3>
              <p className="text-base font-light leading-relaxed text-muted-foreground">
                Des ingrédients précieux sélectionnés pour leur pureté et leur efficacité.
              </p>
            </div>

            <div className="bg-surface p-8 md:p-12 border border-border/50 hover:border-primary/20 transition-colors duration-500" data-testid="feature-2">
              <Leaf className="h-10 w-10 text-secondary mb-6" />
              <h3 className="text-2xl md:text-3xl font-normal mb-4">Éco-Responsable</h3>
              <p className="text-base font-light leading-relaxed text-muted-foreground">
                Engagés pour la planète avec des emballages durables et éthiques.
              </p>
            </div>

            <div className="bg-surface p-8 md:p-12 border border-border/50 hover:border-primary/20 transition-colors duration-500" data-testid="feature-3">
              <Heart className="h-10 w-10 text-secondary mb-6" />
              <h3 className="text-2xl md:text-3xl font-normal mb-4">Fait avec Amour</h3>
              <p className="text-base font-light leading-relaxed text-muted-foreground">
                Chaque produit est créé avec soin et passion pour votre bien-être.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-primary text-primary-foreground">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 text-center">
          <h2 className="text-4xl md:text-5xl font-normal tracking-tight mb-6" data-testid="cta-title">
            Prête à Rayonner ?
          </h2>
          <p className="text-lg md:text-xl font-light leading-relaxed mb-8 max-w-2xl mx-auto text-primary-foreground/80" data-testid="cta-description">
            Explorez notre collection et trouvez les produits parfaits pour sublimer votre beauté naturelle.
          </p>
          <Link to="/products" data-testid="cta-button">
            <Button
              size="lg"
              variant="secondary"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 h-12 px-8 rounded-full font-medium tracking-wide transition-all duration-300"
            >
              Voir Tous les Produits
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;