🏺 MolBazaar – Plateforme E-commerce de Produits Traditionnels
📖 Description du Projet
MolBazaar est une plateforme e-commerce moderne conçue pour promouvoir et vendre des produits traditionnels marocains authentiques.

Notre objectif est de créer une place de marché numérique où les utilisateurs peuvent facilement découvrir, acheter et interagir avec l'artisanat, les produits faits main et les articles culturels, tout en profitant d'une expérience utilisateur fluide, moderne et responsive.

La plateforme allie la tradition marocaine à la technologie moderne, offrant un design vibrant et coloré qui reflète l'esprit des souks marocains. Développé avec HTML, Tailwind CSS, et JavaScript pour le frontend, et propulsé par Laravel 12 pour le backend, MolBazaar est une solution sécurisée, évolutive et élégante.

🎯 Fonctionnalités Clés
👨‍💻 Frontend (HTML + Tailwind + JavaScript)
🎨 Design Responsive & Mobile-First : Optimisation parfaite pour tous les appareils.

🇲🇦 Thème Marocain Authentique : Couleurs chaudes, motifs artisanaux et animations qui évoquent l'ambiance d'un bazar traditionnel.

🛍️ Annonces de Produits Dynamiques : Affichage des produits avec images, prix et catégorie.

📄 Page de Détail du Produit : Page dédiée avec description, stock, prix et bouton "Ajouter au panier".

🛒 Panier d'Achat & Liste de Souhaits : Gestion du panier, mise à jour des quantités et sauvegarde des produits favoris.

👤 Comptes Utilisateurs : Inscription, connexion, gestion de profil et historique des commandes.

🔍 Recherche & Filtrage : Recherche de produits et filtrage par catégorie, prix ou disponibilité.

🔔 Notifications en Temps Réel : Pop-ups pour l'ajout au panier, la confirmation de commande, etc.

✨ Expérience Utilisateur Fluide : Animations basées sur Tailwind, effets de survol et navigation rapide.

🛠️ Backend (Laravel 12)
🔒 Authentification des Utilisateurs

Inscription, connexion, déconnexion, réinitialisation du mot de passe.

Contrôle d'accès basé sur les rôles (client, admin).

Vérification par e-mail pour les nouveaux comptes.

📦 Gestion des Commandes & du Panier

Passer et suivre les commandes avec des mises à jour de statut.

Sauvegarde du panier en base de données pour les utilisateurs connectés.

Prise en charge de la liste de souhaits par utilisateur.

⚙️ Panneau d'Administration

Tableau de bord avec analyses des ventes, produits les plus vendus, total des commandes.

Gestion CRUD pour les produits, catégories et coupons.

Gestion des utilisateurs et de leurs rôles.

Suivi des commandes : mise à jour du statut (en attente, expédiée, livrée).

🛡️ Sécurité & Performance

Protection CSRF, validation des entrées, middleware pour les routes admin.

Requêtes optimisées et mise en cache pour une meilleure scalabilité.

🔌 Support API

Points de terminaison d'API RESTful pour les produits, catégories, panier, liste de souhaits et commandes (pour une future application mobile).

🧰 Stack Technologique
Catégorie

Technologie

Frontend

HTML5, Tailwind CSS, Vanilla JavaScript

Backend

Laravel 12, PHP 8+, MySQL

Outils

Composer, NPM, Git & GitHub, Laravel Breeze/Fortify, Templates Blade

🚀 Améliorations Futures
🌐 Prise en charge multilingue (Arabe, Français, Anglais).

⭐ Avis et évaluations des produits par les clients.

💳 Intégration d'une passerelle de paiement locale.

📱 Progressive Web App (PWA) pour une expérience hors ligne.

🤖 Recommandations de produits basées sur l'IA pour les utilisateurs.

⏳ Résultat Attendu
MolBazaar se veut être un souk numérique moderne où les utilisateurs peuvent explorer la culture marocaine à travers ses produits, tandis que les vendeurs et administrateurs bénéficient d'un tableau de bord puissant pour gérer les stocks, suivre les ventes et interagir avec les clients.

🏁 Démarrage Rapide
Pour installer et exécuter ce projet localement, suivez ces étapes :

Clonez le dépôt :

git clone [https://github.com/votre-nom-utilisateur/molbazaar.git](https://github.com/votre-nom-utilisateur/molbazaar.git)
cd molbazaar

Installez les dépendances PHP :

composer install

Installez les dépendances JavaScript :

npm install
npm run dev

Configurez l'environnement :

Copiez le fichier .env.example en .env.

Générez la clé de l'application :

php artisan key:generate

Configurez vos informations de base de données dans le fichier .env.

Exécutez les migrations :

php artisan migrate

Lancez le serveur de développement :

php artisan serve

L'application sera disponible à l'adresse http://127.0.0.1:8000.

🤝 Contribution
Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue pour signaler un bug ou proposer une fonctionnalité, ou une pull request pour soumettre vos modifications.

📜 Licence
Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.
