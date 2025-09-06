// Moroccan E-commerce JavaScript - Version Premium avec Filtrage Avancé
class MoroccanEcommerce {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('moroccan_cart')) || [];
        this.wishlist = JSON.parse(localStorage.getItem('moroccan_wishlist')) || [];
        this.products = this.getAllProducts();
        this.filteredProducts = [...this.products];
        this.currentPage = 1;
        this.productsPerPage = 12;
        this.filters = {
            search: '',
            categories: [],
            minPrice: 0,
            maxPrice: 4500,
            sortBy: 'default'
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCartCount();
        this.setupThemeToggle();
        this.setupScrollEffects();
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupFilters();
        this.renderProducts();
        this.setupPagination();
    }

    getAllProducts() {
        return [
            // Poterie
            { id: 1, name: 'Tajine Traditionnel', price: 89, image: './assets/images/products/moroccan_crafts_1.jpg', category: 'poterie', description: 'Tajine en terre cuite authentique, façonné à la main selon les traditions ancestrales.' },
            { id: 4, name: 'Vase Berbère Décoratif', price: 65, image: './assets/images/products/moroccan_crafts_4.jpg', category: 'poterie', description: 'Vase décoratif aux motifs berbères traditionnels, idéal pour sublimer votre intérieur.' },
            { id: 7, name: 'Service à Thé Complet', price: 120, image: './assets/images/products/moroccan_crafts_7.jpg', category: 'poterie', description: 'Service à thé complet en céramique peinte à la main avec motifs géométriques.' },
            { id: 13, name: 'Plat à Couscous Traditionnel', price: 95, image: './assets/images/products/moroccan_crafts_13.jpg', category: 'poterie', description: 'Grand plat traditionnel pour couscous, en terre cuite vernissée.' },

            // Tapis
            { id: 2, name: 'Tapis Berbère Authentique', price: 245, image: './assets/images/products/moroccan_crafts_2.jpg', category: 'tapis', description: 'Tapis berbère tissé à la main par les tribus du Haut-Atlas, motifs géométriques ancestraux.' },
            { id: 5, name: 'Tapis Boucherouite Coloré', price: 180, image: './assets/images/products/moroccan_crafts_5.jpg', category: 'tapis', description: 'Tapis écologique en tissus recyclés, aux couleurs vives et motifs modernes.' },
            { id: 8, name: 'Tapis Azilal Vintage', price: 320, image: './assets/images/products/moroccan_crafts_8.jpg', category: 'tapis', description: 'Tapis berbère de la région d\'Azilal, laine naturelle, motifs abstraits.' },
            { id: 14, name: 'Tapis Kilim Plat', price: 150, image: './assets/images/products/moroccan_crafts_14.jpg', category: 'tapis', description: 'Tapis kilim tissé plat, motifs géométriques, parfait pour salon moderne.' },

            // Bijoux
            { id: 3, name: 'Collier Berbère Argent', price: 156, image: './assets/images/products/moroccan_crafts_3.webp', category: 'bijoux', description: 'Collier traditionnel en argent 925, orné de symboles berbères authentiques.' },
            { id: 6, name: 'Bracelet Touareg Massif', price: 95, image: './assets/images/products/moroccan_crafts_6.jpg', category: 'bijoux', description: 'Bracelet touareg en argent massif, gravures traditionnelles du désert.' },
            { id: 9, name: 'Boucles d\'Oreilles Amazigh', price: 75, image: './assets/images/products/moroccan_crafts_9.jpg', category: 'bijoux', description: 'Boucles d\'oreilles traditionnelles amazighs, argent et pierres naturelles.' },
            { id: 15, name: 'Bague Chevalière Berbère', price: 120, image: './assets/images/products/moroccan_crafts_15.jpg', category: 'bijoux', description: 'Chevalière berbère en argent, symboles protecteurs gravés à la main.' },

            // Maroquinerie
            { id: 10, name: 'Sac en Cuir de Fès', price: 135, image: './assets/images/products/moroccan_crafts_10.jpg', category: 'maroquinerie', description: 'Sac à main artisanal en cuir véritable de Fès, travail traditionnel.' },
            { id: 11, name: 'Babouches Authentiques', price: 45, image: './assets/images/products/moroccan_crafts_11.jpg', category: 'maroquinerie', description: 'Babouches traditionnelles en cuir souple, confectionnées dans les souks.' },
            { id: 12, name: 'Portefeuille Gravé Main', price: 55, image: './assets/images/products/moroccan_crafts_12.jpg', category: 'maroquinerie', description: 'Portefeuille en cuir de chèvre, motifs gravés à la main selon l\'art marocain.' },
            { id: 16, name: 'Ceinture Cuir Brodée', price: 85, image: './assets/images/products/moroccan_crafts_16.jpg', category: 'maroquinerie', description: 'Ceinture en cuir brodée de fils dorés, boucle en laiton gravé.' },

            // Céramique
            { id: 17, name: 'Fontaine Zellige Bleue', price: 280, image: './assets/images/products/moroccan_crafts_17.jpg', category: 'ceramique', description: 'Fontaine décorative en zellige bleu de Fès, pièce unique d\'artisan.' },
            { id: 18, name: 'Assiettes Safi Peintes', price: 68, image: './assets/images/products/moroccan_crafts_18.jpg', category: 'ceramique', description: 'Lot de 6 assiettes en céramique de Safi, peintes à la main.' },
            { id: 19, name: 'Lampe Céramique Ajourée', price: 165, image: './assets/images/products/moroccan_crafts_19.jpg', category: 'ceramique', description: 'Lampe d\'ambiance en céramique ajourée, jeux d\'ombres orientaux.' },
            { id: 20, name: 'Carrelage Zellige Vert', price: 35, image: './assets/images/products/moroccan_crafts_20.jpg', category: 'ceramique', description: 'Carreaux zellige verts artisanaux, au m², pour décoration murale.' },

            // Textile
            { id: 21, name: 'Coussin Brodé Berbère', price: 42, image: './assets/images/products/moroccan_crafts_21.jpg', category: 'textile', description: 'Coussin en laine brodée de motifs berbères, rembourrage naturel.' },
            { id: 22, name: 'Plaid Laine d\'Atlas', price: 98, image: './assets/images/products/moroccan_crafts_22.jpg', category: 'textile', description: 'Plaid en pure laine des montagnes de l\'Atlas, couleurs naturelles.' },
            { id: 23, name: 'Tenture Murale Tissée', price: 125, image: './assets/images/products/moroccan_crafts_23.jpg', category: 'textile', description: 'Tenture décorative tissée main, motifs géométriques traditionnels.' },
            { id: 24, name: 'Nappe Brodée Rabat', price: 78, image: './assets/images/products/moroccan_crafts_24.jpg', category: 'textile', description: 'Nappe en lin brodée de soie, artisanat de Rabat, motifs floraux.' }
        ];
    }

    setupEventListeners() {
        // Add to cart buttons - Event delegation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                const productData = JSON.parse(e.target.getAttribute('data-product'));
                this.addToCart(productData);
            }
        });

        // Wishlist buttons - Event delegation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('wishlist-btn') || e.target.closest('.wishlist-btn')) {
                const btn = e.target.classList.contains('wishlist-btn') ? e.target : e.target.closest('.wishlist-btn');
                const productId = btn.getAttribute('data-product');
                this.toggleWishlist(productId);
            }
        });

        // Cart button
        document.getElementById('cart-btn')?.addEventListener('click', () => this.showCart());

        // Back to top button
        document.getElementById('back-to-top')?.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    setupFilters() {
        // Filter toggle
        const filterToggle = document.getElementById('filter-toggle');
        const filterSidebar = document.getElementById('filters-sidebar');
        const filterArrow = document.getElementById('filter-arrow');

        if (filterToggle && filterSidebar) {
            filterToggle.addEventListener('click', () => {
                filterSidebar.classList.toggle('open');
                filterArrow.style.transform = filterSidebar.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0deg)';
            });
        }

        // Filter headers collapse/expand
        document.querySelectorAll('.filter-header').forEach(header => {
            header.addEventListener('click', () => {
                const targetId = header.getAttribute('data-target');
                const content = document.getElementById(targetId);
                const arrow = header.querySelector('svg');
                
                if (content) {
                    content.classList.toggle('hidden');
                    arrow.style.transform = content.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
                }
            });
        });

        // Search input
        const searchInput = document.getElementById('product-search');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.filters.search = e.target.value.toLowerCase();
                    this.applyFilters();
                }, 300);
            });
        }

        // Category filters
        document.querySelectorAll('.category-filter').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const category = e.target.value;
                if (e.target.checked) {
                    if (!this.filters.categories.includes(category)) {
                        this.filters.categories.push(category);
                    }
                } else {
                    this.filters.categories = this.filters.categories.filter(c => c !== category);
                }
                this.applyFilters();
            });
        });

        // Price filters
        const minPriceInput = document.getElementById('min-price');
        const maxPriceInput = document.getElementById('max-price-input');
        const priceSlider = document.getElementById('price-slider');

        if (minPriceInput && maxPriceInput && priceSlider) {
            const updatePriceFilter = () => {
                this.filters.minPrice = parseInt(minPriceInput.value) || 0;
                this.filters.maxPrice = parseInt(maxPriceInput.value) || 4500;
                this.applyFilters();
            };

            minPriceInput.addEventListener('input', updatePriceFilter);
            maxPriceInput.addEventListener('input', updatePriceFilter);
            
            priceSlider.addEventListener('input', (e) => {
                maxPriceInput.value = e.target.value;
                this.filters.maxPrice = parseInt(e.target.value);
                this.applyFilters();
            });
        }

        // Sort dropdown
        const sortSelect = document.getElementById('sort-products');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.filters.sortBy = e.target.value;
                this.applyFilters();
            });
        }
    }

    applyFilters() {
        let filtered = [...this.products];

        // Search filter
        if (this.filters.search) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(this.filters.search) ||
                product.description.toLowerCase().includes(this.filters.search)
            );
        }

        // Category filter
        if (this.filters.categories.length > 0) {
            filtered = filtered.filter(product =>
                this.filters.categories.includes(product.category)
            );
        }

        // Price filter
        filtered = filtered.filter(product =>
            product.price >= this.filters.minPrice && product.price <= this.filters.maxPrice
        );

        // Sort
        switch (this.filters.sortBy) {
            case 'price-asc':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filtered.sort((a, b) => b.name.localeCompare(a.name));
                break;
        }

        this.filteredProducts = filtered;
        this.currentPage = 1;
        this.renderProducts();
        this.updateResultsCount();
        this.setupPagination();
    }

    renderProducts() {
        const grid = document.getElementById('product-grid');
        if (!grid) return;

        const startIndex = (this.currentPage - 1) * this.productsPerPage;
        const endIndex = startIndex + this.productsPerPage;
        const currentProducts = this.filteredProducts.slice(startIndex, endIndex);

        if (currentProducts.length === 0) {
            grid.innerHTML = `
                <div class="col-span-full text-center py-16">
                    <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h3 class="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Aucun produit trouvé</h3>
                    <p class="text-gray-500 dark:text-gray-400">Essayez de modifier vos critères de recherche ou de filtrage</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = currentProducts.map(product => `
            <div class="product-card bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 transform hover:-translate-y-2 transition-all duration-300">
                <div class="relative overflow-hidden">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-64 object-cover transform hover:scale-110 transition-transform duration-500">
                    <div class="absolute top-4 right-4">
                        <button class="bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 wishlist-btn" data-product="${product.id}">
                            <svg class="w-5 h-5 text-gray-600 hover:text-moroccan-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="absolute top-4 left-4">
                        <span class="bg-moroccan-gold text-white px-2 py-1 rounded-full text-xs font-semibold capitalize">
                            ${product.category}
                        </span>
                    </div>
                </div>
                <div class="p-6">
                    <h3 class="text-xl font-bold font-arabic mb-2 text-gray-900 dark:text-white product-name">${product.name}</h3>
                    <p class="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">${product.description}</p>
                    <div class="flex items-center justify-between">
                        <span class="text-2xl font-bold text-moroccan-red">${product.price}€</span>
                        <button class="bg-moroccan-red hover:bg-moroccan-red/90 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 add-to-cart-btn" 
                                data-product='${JSON.stringify(product)}'>
                            Ajouter au Panier
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    setupPagination() {
        const pagination = document.getElementById('pagination');
        if (!pagination) return;

        const totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
        
        if (totalPages <= 1) {
            pagination.innerHTML = '';
            return;
        }

        let paginationHTML = '<nav class="flex items-center space-x-1">';
        
        // Previous button
        paginationHTML += `
            <button class="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-l-md hover:bg-gray-50 dark:hover:bg-gray-700 ${this.currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}" 
                    ${this.currentPage === 1 ? 'disabled' : ''} 
                    onclick="if(${this.currentPage} > 1) { ecommerce.goToPage(${this.currentPage - 1}); }">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
            </button>
        `;

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= this.currentPage - 2 && i <= this.currentPage + 2)) {
                paginationHTML += `
                    <button class="px-3 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 ${
                        i === this.currentPage 
                            ? 'bg-moroccan-red text-white' 
                            : 'text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }" onclick="ecommerce.goToPage(${i})">
                        ${i}
                    </button>
                `;
            } else if (i === this.currentPage - 3 || i === this.currentPage + 3) {
                paginationHTML += `
                    <span class="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                        ...
                    </span>
                `;
            }
        }

        // Next button
        paginationHTML += `
            <button class="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-r-md hover:bg-gray-50 dark:hover:bg-gray-700 ${this.currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}" 
                    ${this.currentPage === totalPages ? 'disabled' : ''} 
                    onclick="if(${this.currentPage} < ${totalPages}) { ecommerce.goToPage(${this.currentPage + 1}); }">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
            </button>
        `;

        paginationHTML += '</nav>';
        pagination.innerHTML = paginationHTML;
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderProducts();
        this.setupPagination();
        // Scroll to top of products
        document.querySelector('#product-grid').scrollIntoView({ behavior: 'smooth' });
    }

    updateResultsCount() {
        const resultsCount = document.getElementById('results-count');
        if (resultsCount) {
            resultsCount.textContent = `${this.filteredProducts.length} Résultat${this.filteredProducts.length !== 1 ? 's' : ''}`;
        }
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

    saveCart() { localStorage.setItem('moroccan_cart', JSON.stringify(this.cart)); }
    saveWishlist() { localStorage.setItem('moroccan_wishlist', JSON.stringify(this.wishlist)); }

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
            if (!icon) return;
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
            setTimeout(() => cartBtn.classList.remove('animate-pulse'), 600);
        }
    }

    showCart() {
        const cartModal = this.createCartModal();
        document.body.appendChild(cartModal);
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
                                            onclick="ecommerce.updateCartQuantity(${item.id}, ${item.quantity - 1}); this.closest('#cart-modal').remove(); ecommerce.showCart();">-</button>
                                    <span class="w-8 text-center text-gray-900 dark:text-white">${item.quantity}</span>
                                    <button class="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-500"
                                            onclick="ecommerce.updateCartQuantity(${item.id}, ${item.quantity + 1}); this.closest('#cart-modal').remove(); ecommerce.showCart();">+</button>
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
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.remove(); });
        return modal;
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.className = `fixed top-20 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 z-50 ${
                type === 'success' ? 'bg-green-500 text-white' :
                type === 'error' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
            }`;
            toast.classList.remove('translate-x-full');
            setTimeout(() => toast.classList.add('translate-x-full'), 3000);
        }
    }

    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const html = document.documentElement;
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
            if (navbar) navbar.classList.toggle('shadow-lg', scrolled > 50);
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
        mobileMenuBtn?.addEventListener('click', () => mobileMenu?.classList.toggle('hidden'));
        mobileMenu?.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
        });
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    }
}

// Initialize the e-commerce functionality
const ecommerce = new MoroccanEcommerce();

// Loading animation
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) loader.style.display = 'none';
});
