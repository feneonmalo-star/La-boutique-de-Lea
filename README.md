# La Boutique de Léa

Site e-commerce pour produits de beauté naturels et artisanaux.

## 🚀 Déploiement

### GitHub Pages

1. **Build le projet**
   ```bash
   cd frontend
   yarn build
   ```

2. **Le dossier `build/` contient le site statique**
   - Déployez ce dossier sur GitHub Pages
   - Le fichier `404.html` permet le routing client-side

3. **Configuration**
   - Toutes les routes (/, /products, /products/:id) fonctionnent
   - Les données sont chargées depuis Google Sheets CSV

### Vercel / Netlify

1. **Build le projet** (même commande)
2. **Configurez le déploiement**
   - Build command: `cd frontend && yarn build`
   - Output directory: `frontend/build`
   - Le fichier `vercel.json` est déjà configuré

## 📊 Gestion des Produits

Les produits sont gérés via Google Sheets :
- URL CSV : [Votre Google Sheets](https://docs.google.com/spreadsheets/d/e/2PACX-1vTCngYZIM0JKHX3GItiN3N8Xo9-K7jBPsg9Z8udpyBLSdzkShRpz-df6Q8lHKFZBtJsVZhQn6F0jBBy/pub?gid=0&single=true&output=csv)

### Colonnes du CSV
- **ID** : Identifiant unique
- **Nom** : Nom du produit
- **Description** : Description du produit
- **Prix** : Prix en euros (format: "19,90€")
- **Stock** : Quantité disponible
- **ImageURL** : Lien vers l'image
- **Catégorie** : Catégorie du produit
- **LienPaiement** : Lien de paiement (Stripe, PayPal, etc.)

### Mise à jour des produits
1. Modifiez votre Google Sheets
2. Les changements apparaissent automatiquement après rechargement du site
3. Aucun redéploiement nécessaire !

## ✨ Fonctionnalités

- ✅ Catalogue de produits avec filtres par catégorie
- ✅ Recherche de produits
- ✅ Pages détaillées de produits
- ✅ Indicateurs de stock visuels
- ✅ Boutons d'achat direct (avec liens externes)
- ✅ Design responsive (mobile, tablette, desktop)
- ✅ 100% statique - Compatible GitHub Pages

## 🎨 Design

- Palette : Deep Forest Green (#1E473B) + Antique Gold (#B28E4B)
- Typographie : Playfair Display (titres) + Manrope (texte)
- Style : Élégant et luxueux

## 📱 Pages

- `/` - Page d'accueil
- `/products` - Catalogue de produits
- `/products/:id` - Détail d'un produit
- `/auth` - Authentification (pour admin)
- `/account` - Compte utilisateur
- `/admin` - Administration des produits
