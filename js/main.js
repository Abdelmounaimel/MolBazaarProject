
// Moroccan E-commerce JavaScript
class MoroccanEcommerce {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('moroccan_cart')) || [];
        this.wishlist = JSON.parse(localStorage.getItem('moroccan_wishlist')) || [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCartCount();
        this.setupThemeToggle();
        this.setupScrollEffects();
        this.setupMobileMenu();
        this.setupSmoothScroll();
    }

    setupEventListeners() {
        // Add to cart buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productData = JSON.parse(e.target.getAttribute('data-product'));
                this.addToCart(productData);
            });
        });

        // Wishlist buttons
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = e.target.closest('.wishlist-btn').getAttribute('data-product');
                this.toggleWishlist(productId);
            });
        });

        // Cart button
        document.getElementById('cart-btn')?.addEventListener('click', () => {
            this.showCart();
        });

        // Back to top button
        document.getElementById('back-to-top')?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    addToCart(product) {
        const existingItem = this.cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({ ...product, quantity: 1 });
        }

        this.saveCart();
        this.updateCartCount();
        this.showToast(`${product.name} ajouté au panier!`, 'success');
        this.animateCartIcon();
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.showToast('Produit retiré du panier', 'info');
    }

    updateCartQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
                this.updateCartCount();
            }
        }
    }

    toggleWishlist(productId) {
        const index = this.wishlist.indexOf(productId);
        
        if (index > -1) {
            this.wishlist.splice(index, 1);
            this.showToast('Retiré de la liste de souhaits', 'info');
        } else {
            this.wishlist.push(productId);
            this.showToast('Ajouté à la liste de souhaits', 'success');
        }

        this.saveWishlist();
        this.updateWishlistUI();
    }

    saveCart() {
        localStorage.setItem('moroccan_cart', JSON.stringify(this.cart));
    }

    saveWishlist() {
        localStorage.setItem('moroccan_wishlist', JSON.stringify(this.wishlist));
    }

    updateCartCount() {
        const count = this.cart.reduce((total, item) => total + item.quantity, 0);
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = count;
            cartCountElement.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    updateWishlistUI() {
        document.querySelectorAll('.wishlist-btn').forEach(btn => {
            const productId = btn.getAttribute('data-product');
            const icon = btn.querySelector('svg');
            
            if (this.wishlist.includes(productId)) {
                icon.classList.add('fill-current', 'text-moroccan-red');
                icon.classList.remove('text-gray-600');
            } else {
                icon.classList.remove('fill-current', 'text-moroccan-red');
                icon.classList.add('text-gray-600');
            }
        });
    }

    animateCartIcon() {
        const cartBtn = document.getElementById('cart-btn');
        if (cartBtn) {
            cartBtn.classList.add('animate-pulse');
            setTimeout(() => {
                cartBtn.classList.remove('animate-pulse');
            }, 600);
        }
    }

    showCart() {
        // Create cart modal
        const cartModal = this.createCartModal();
        document.body.appendChild(cartModal);
        
        // Show modal with animation
        setTimeout(() => {
            cartModal.classList.remove('opacity-0');
            cartModal.querySelector('.transform').classList.remove('scale-95');
        }, 10);
    }

    createCartModal() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 opacity-0 transition-opacity duration-300';
        modal.id = 'cart-modal';

        const cartTotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);

        modal.innerHTML = `
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto transform scale-95 transition-transform duration-300">
                <div class="flex justify-between items-center mb-6">
                    <h2 class="text-2xl font-bold font-arabic text-gray-900 dark:text-white">Votre Panier</h2>
                    <button class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" onclick="this.closest('#cart-modal').remove()">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                
                <div class="space-y-4">
                    ${this.cart.length === 0 ? 
                        '<p class="text-center text-gray-500 dark:text-gray-400 py-8">Votre panier est vide</p>' :
                        this.cart.map(item => `
                            <div class="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded-lg">
                                <div class="flex-1">
                                    <h3 class="font-semibold text-gray-900 dark:text-white">${item.name}</h3>
                                    <p class="text-moroccan-red font-bold">${item.price}€</p>
                                </div>
                                <div class="flex items-center space-x-2">
                                    <button class="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500" 
                                            onclick="ecommerce.updateCartQuantity(${item.id}, ${item.quantity - 1}); this.closest('#cart-modal').remove(); ecommerce.showCart();">
                                        <span class="text-gray-600 dark:text-gray-300">-</span>
                                    </button>
                                    <span class="w-8 text-center text-gray-900 dark:text-white">${item.quantity}</span>
                                    <button class="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500"
                                            onclick="ecommerce.updateCartQuantity(${item.id}, ${item.quantity + 1}); this.closest('#cart-modal').remove(); ecommerce.showCart();">
                                        <span class="text-gray-600 dark:text-gray-300">+</span>
                                    </button>
                                </div>
                                <button class="text-red-500 hover:text-red-700" 
                                        onclick="ecommerce.removeFromCart(${item.id}); this.closest('#cart-modal').remove(); ecommerce.showCart();">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                    </svg>
                                </button>
                            </div>
                        `).join('')
                    }
                </div>
                
                ${this.cart.length > 0 ? `
                    <div class="border-t border-gray-200 dark:border-gray-600 pt-4 mt-6">
                        <div class="flex justify-between items-center mb-4">
                            <span class="text-lg font-semibold text-gray-900 dark:text-white">Total:</span>
                            <span class="text-2xl font-bold text-moroccan-red">${cartTotal}€</span>
                        </div>
                        <button class="w-full bg-moroccan-red hover:bg-moroccan-red/90 text-white py-3 rounded-lg font-semibold transition-colors duration-200">
                            Procéder au Paiement
                        </button>
                    </div>
                ` : ''}
            </div>
        `;

        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        return modal;
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            
            // Set toast color based on type
            toast.className = `fixed top-20 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 z-50 ${
                type === 'success' ? 'bg-green-500 text-white' : 
                type === 'error' ? 'bg-red-500 text-white' : 
                'bg-blue-500 text-white'
            }`;
            
            // Show toast
            toast.classList.remove('translate-x-full');
            
            // Hide toast after 3 seconds
            setTimeout(() => {
                toast.classList.add('translate-x-full');
            }, 3000);
        }
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const html = document.documentElement;
        
        // Check for saved theme preference or default to light mode
        const savedTheme = localStorage.getItem('theme') || 'light';
        html.classList.toggle('dark', savedTheme === 'dark');
        
        themeToggle?.addEventListener('click', () => {
            html.classList.toggle('dark');
            const isDark = html.classList.contains('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    setupScrollEffects() {
        const navbar = document.getElementById('navbar');
        const backToTop = document.getElementById('back-to-top');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            // Navbar shadow effect
            if (navbar) {
                navbar.classList.toggle('shadow-lg', scrolled > 50);
            }
            
            // Back to top button
            if (backToTop) {
                if (scrolled > 300) {
                    backToTop.classList.remove('opacity-0', 'invisible');
                } else {
                    backToTop.classList.add('opacity-0', 'invisible');
                }
            }
        });
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        
        mobileMenuBtn?.addEventListener('click', () => {
            mobileMenu?.classList.toggle('hidden');
        });
        
        // Close mobile menu when clicking on links
        mobileMenu?.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Initialize the e-commerce functionality
const ecommerce = new MoroccanEcommerce();

// Loading animation
window.addEventListener('load', () => {
    // Hide loading spinner if exists
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = 'none';
    }
});

// Newsletter subscription
document.addEventListener('DOMContentLoaded', () => {
    const newsletterForm = document.querySelector('section form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (email) {
                ecommerce.showToast('Merci pour votre inscription!', 'success');
                this.reset();
            } else {
                ecommerce.showToast('Veuillez entrer une adresse email valide', 'error');
            }
        });
    }
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .animate-fade-in {
        opacity: 1;
        transform: translateY(0);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-fade-in-up {
        opacity: 1;
        transform: translateY(0);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .animate-on-scroll {
        opacity: 0;
        transform: translateY(30px);
    }
    
    .animate-on-load {
        opacity: 0;
        transform: translateY(20px);
    }
`;
document.head.appendChild(style);

// Classe pour gérer le système de filtrage
class ProductFilter {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.searchTerm = '';
        this.selectedCategories = [];
        this.priceRange = 'all';
        this.init();
    }

    init() {
        // Récupérer tous les produits du DOM
        this.getAllProducts();
        
        // Initialiser les écouteurs d'événements
        this.setupEventListeners();
        
        // Afficher le nombre initial de produits
        this.updateProductCount();
    }

    getAllProducts() {
        const productElements = document.querySelectorAll('.product-card');
        this.products = Array.from(productElements).map(card => {
            return {
                element: card,
                name: card.querySelector('.product-name')?.textContent.toLowerCase() || '',
                category: card.dataset.category || '',
                price: parseFloat(card.dataset.price) || 0,
                description: card.querySelector('p')?.textContent.toLowerCase() || ''
            };
        });
        this.filteredProducts = [...this.products];
    }

    setupEventListeners() {
        // Recherche
        const searchInput = document.getElementById('product-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value.toLowerCase();
                this.applyFilters();
            });
        }

        // Filtres de catégorie
        const categoryFilters = document.querySelectorAll('.category-filter');
        categoryFilters.forEach(filter => {
            filter.addEventListener('change', (e) => {
                const category = e.target.value;
                if (e.target.checked) {
                    if (!this.selectedCategories.includes(category)) {
                        this.selectedCategories.push(category);
                    }
                } else {
                    this.selectedCategories = this.selectedCategories.filter(c => c !== category);
                }
                this.applyFilters();
            });
        });

        // Filtres de prix
        const priceFilters = document.querySelectorAll('.price-filter');
        priceFilters.forEach(filter => {
            filter.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.priceRange = e.target.value;
                    this.applyFilters();
                }
            });
        });

        // Bouton de réinitialisation
        const clearButton = document.getElementById('clear-filters');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                this.clearFilters();
            });
        }
    }

    applyFilters() {
        this.filteredProducts = this.products.filter(product => {
            // Filtre de recherche
            const matchesSearch = this.searchTerm === '' || 
                product.name.includes(this.searchTerm) || 
                product.description.includes(this.searchTerm);

            // Filtre de catégorie
            const matchesCategory = this.selectedCategories.length === 0 || 
                this.selectedCategories.includes(product.category);

            // Filtre de prix
            const matchesPrice = this.checkPriceRange(product.price);

            return matchesSearch && matchesCategory && matchesPrice;
        });

        this.displayProducts();
        this.updateProductCount();
    }

    checkPriceRange(price) {
        if (this.priceRange === 'all') return true;

        const [min, max] = this.priceRange.split('-').map(Number);
        return price >= min && price <= max;
    }

    displayProducts() {
        // Masquer tous les produits
        this.products.forEach(product => {
            product.element.style.display = 'none';
            product.element.classList.add('opacity-0');
        });

        // Afficher les produits filtrés avec animation
        this.filteredProducts.forEach((product, index) => {
            setTimeout(() => {
                product.element.style.display = 'block';
                setTimeout(() => {
                    product.element.classList.remove('opacity-0');
                    product.element.classList.add('opacity-100', 'transition-opacity', 'duration-300');
                }, 50);
            }, index * 50); // Animation décalée pour un effet cascade
        });

        // Afficher un message si aucun produit n'est trouvé
        this.handleNoResults();
    }

    handleNoResults() {
        const productGrid = document.getElementById('product-grid');
        let noResultsMessage = document.getElementById('no-results-message');

        if (this.filteredProducts.length === 0) {
            if (!noResultsMessage) {
                noResultsMessage = document.createElement('div');
                noResultsMessage.id = 'no-results-message';
                noResultsMessage.className = 'col-span-full text-center py-12';
                noResultsMessage.innerHTML = `
                    <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-8">
                        <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Aucun produit trouvé
                        </h3>
                        <p class="text-gray-500 dark:text-gray-400">
                            Essayez de modifier vos critères de recherche ou de filtrage
                        </p>
                    </div>
                `;
                productGrid.appendChild(noResultsMessage);
            }
            noResultsMessage.style.display = 'block';
        } else if (noResultsMessage) {
            noResultsMessage.style.display = 'none';
        }
    }

    updateProductCount() {
        const countElement = document.getElementById('filtered-count');
        if (countElement) {
            countElement.textContent = this.filteredProducts.length;
            
            // Animation du compteur
            countElement.classList.add('animate-pulse');
            setTimeout(() => {
                countElement.classList.remove('animate-pulse');
            }, 500);
        }
    }

    clearFilters() {
        // Réinitialiser la recherche
        const searchInput = document.getElementById('product-search');
        if (searchInput) {
            searchInput.value = '';
            this.searchTerm = '';
        }

        // Réinitialiser les catégories
        document.querySelectorAll('.category-filter').forEach(filter => {
            filter.checked = false;
        });
        this.selectedCategories = [];

        // Réinitialiser le prix
        const allPriceFilter = document.querySelector('.price-filter[value="all"]');
        if (allPriceFilter) {
            allPriceFilter.checked = true;
        }
        this.priceRange = 'all';

        // Appliquer les filtres réinitialisés
        this.applyFilters();

        // Feedback visuel
        this.showNotification('Filtres réinitialisés', 'info');
    }

    showNotification(message, type = 'info') {
        // Utiliser la fonction showToast existante si elle est disponible
        if (typeof ecommerce !== 'undefined' && ecommerce.showToast) {
            ecommerce.showToast(message, type);
        }
    }
}

// Système de tri des produits
class ProductSorter {
    constructor(filter) {
        this.filter = filter;
        this.setupSortingOptions();
    }

    setupSortingOptions() {
        // Créer le menu de tri s'il n'existe pas
        this.createSortMenu();
        
        // Ajouter les écouteurs d'événements
        const sortSelect = document.getElementById('sort-products');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortProducts(e.target.value);
            });
        }
    }

    createSortMenu() {
        const filterSection = document.querySelector('aside');
        if (!filterSection || document.getElementById('sort-products')) return;

        const sortDiv = document.createElement('div');
        sortDiv.className = 'mb-6';
        sortDiv.innerHTML = `
            <h4 class="font-semibold mb-3 text-gray-900 dark:text-white">Trier par</h4>
            <select id="sort-products" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-moroccan-gold">
                <option value="default">Par défaut</option>
                <option value="price-asc">Prix croissant</option>
                <option value="price-desc">Prix décroissant</option>
                <option value="name-asc">Nom (A-Z)</option>
                <option value="name-desc">Nom (Z-A)</option>
            </select>
        `;

        // Insérer après les filtres de prix
        const priceFilter = filterSection.querySelector('.mb-6:last-of-type');
        filterSection.insertBefore(sortDiv, priceFilter.nextSibling);
    }

    sortProducts(sortType) {
        switch (sortType) {
            case 'price-asc':
                this.filter.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                this.filter.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                this.filter.filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                this.filter.filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                // Retour à l'ordre original
                this.filter.filteredProducts = this.filter.products.filter(p => 
                    this.filter.filteredProducts.includes(p)
                );
        }

        this.filter.displayProducts();
    }
}

// URL Filter State Management
class FilterStateManager {
    constructor(filter) {
        this.filter = filter;
        this.init();
    }

    init() {
        // Charger l'état des filtres depuis l'URL
        this.loadFromURL();
        
        // Écouter les changements d'URL
        window.addEventListener('popstate', () => {
            this.loadFromURL();
        });
    }

    saveToURL() {
        const params = new URLSearchParams();
        
        if (this.filter.searchTerm) {
            params.set('search', this.filter.searchTerm);
        }
        
        if (this.filter.selectedCategories.length > 0) {
            params.set('categories', this.filter.selectedCategories.join(','));
        }
        
        if (this.filter.priceRange && this.filter.priceRange !== 'all') {
            params.set('price', this.filter.priceRange);
        }

        const newURL = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
        window.history.pushState({}, '', newURL);
    }

    loadFromURL() {
        const params = new URLSearchParams(window.location.search);
        
        // Charger la recherche
        const search = params.get('search');
        if (search) {
            const searchInput = document.getElementById('product-search');
            if (searchInput) {
                searchInput.value = search;
                this.filter.searchTerm = search;
            }
        }
        
        // Charger les catégories
        const categories = params.get('categories');
        if (categories) {
            const categoryArray = categories.split(',');
            categoryArray.forEach(category => {
                const checkbox = document.querySelector(`.category-filter[value="${category}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
            this.filter.selectedCategories = categoryArray;
        }
        
        // Charger le filtre de prix
        const price = params.get('price');
        if (price) {
            const priceRadio = document.querySelector(`.price-filter[value="${price}"]`);
            if (priceRadio) {
                priceRadio.checked = true;
                this.filter.priceRange = price;
            }
        }
        
        this.filter.applyFilters();
    }
}

// Initialisation du système de filtrage
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier si nous sommes sur la page des produits
    const productGrid = document.getElementById('product-grid');
    if (productGrid) {
        // Initialiser le filtre
        const productFilter = new ProductFilter();
        
        // Initialiser le système de tri
        const productSorter = new ProductSorter(productFilter);
        
        // Initialiser la gestion de l'état de l'URL
        const filterStateManager = new FilterStateManager(productFilter);
        
        // Exposer le filtre globalement pour debug si nécessaire
        window.molBazaarFilter = productFilter;
        
        // Ajouter la gestion de l'état de l'URL lors des changements de filtres
        const originalApplyFilters = productFilter.applyFilters.bind(productFilter);
        productFilter.applyFilters = function() {
            originalApplyFilters();
            filterStateManager.saveToURL();
        };
    }
});

// Fonction utilitaire pour le debounce (éviter trop d'appels lors de la frappe)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Appliquer le debounce à la recherche
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('product-search');
    if (searchInput && window.molBazaarFilter) {
        const debouncedSearch = debounce((e) => {
            window.molBazaarFilter.searchTerm = e.target.value.toLowerCase();
            window.molBazaarFilter.applyFilters();
        }, 300);
        
        searchInput.removeEventListener('input', window.molBazaarFilter.applyFilters);
        searchInput.addEventListener('input', debouncedSearch);
    }
});
