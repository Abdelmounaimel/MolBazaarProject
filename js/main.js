
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

