// Authentication Management System
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.setupAuthEventListeners();
        this.updateUIForAuth();
    }

    // Check if user is logged in
    isLoggedIn() {
        return localStorage.getItem('isLoggedIn') === 'true';
    }

    // Get current user data
    getCurrentUser() {
        if (this.isLoggedIn()) {
            return {
                id: localStorage.getItem('userId'),
                email: localStorage.getItem('userEmail'),
                name: localStorage.getItem('userName') || 'Utilisateur',
                avatar: localStorage.getItem('userAvatar') || null
            };
        }
        return null;
    }

    // Login function
    async login(email, password) {
        try {
            // Show loading state
            this.showLoadingState(true);

            // Simulate API call - replace with actual API endpoint
            const response = await this.simulateAPICall({
                endpoint: '/api/login',
                method: 'POST',
                data: { email, password }
            });

            if (response.success) {
                // Store user data
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userId', response.user.id);
                localStorage.setItem('userEmail', response.user.email);
                localStorage.setItem('userName', response.user.name);
                localStorage.setItem('authToken', response.token);

                this.currentUser = response.user;
                this.updateUIForAuth();
                
                // Show success message
                this.showToast('Connexion réussie !', 'success');
                
                // Redirect to profile or previous page
                setTimeout(() => {
                    const redirectUrl = localStorage.getItem('redirectAfterLogin') || 'profile.html';
                    localStorage.removeItem('redirectAfterLogin');
                    window.location.href = redirectUrl;
                }, 1500);

                return { success: true, user: response.user };
            } else {
                throw new Error(response.message || 'Erreur de connexion');
            }
        } catch (error) {
            this.showToast(error.message || 'Erreur de connexion', 'error');
            return { success: false, error: error.message };
        } finally {
            this.showLoadingState(false);
        }
    }

    // Register function
    async register(userData) {
        try {
            // Validate input
            const validation = this.validateRegistrationData(userData);
            if (!validation.isValid) {
                throw new Error(validation.errors.join(', '));
            }

            // Show loading state
            this.showLoadingState(true);

            // Simulate API call - replace with actual API endpoint
            const response = await this.simulateAPICall({
                endpoint: '/api/register',
                method: 'POST',
                data: userData
            });

            if (response.success) {
                // Auto-login after successful registration
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userId', response.user.id);
                localStorage.setItem('userEmail', response.user.email);
                localStorage.setItem('userName', response.user.name);
                localStorage.setItem('authToken', response.token);

                this.currentUser = response.user;
                this.updateUIForAuth();
                
                // Show success message
                this.showToast('Inscription réussie ! Bienvenue !', 'success');
                
                // Redirect to profile
                setTimeout(() => {
                    window.location.href = 'profile.html';
                }, 1500);

                return { success: true, user: response.user };
            } else {
                throw new Error(response.message || 'Erreur d\'inscription');
            }
        } catch (error) {
            this.showToast(error.message || 'Erreur d\'inscription', 'error');
            return { success: false, error: error.message };
        } finally {
            this.showLoadingState(false);
        }
    }

    // Logout function
    logout() {
        // Clear all auth data
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        localStorage.removeItem('userAvatar');
        localStorage.removeItem('authToken');

        this.currentUser = null;
        this.updateUIForAuth();
        
        // Show success message
        this.showToast('Déconnexion réussie !', 'info');
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }

    // Update user profile
    async updateProfile(userData) {
        try {
            this.showLoadingState(true);

            // Simulate API call
            const response = await this.simulateAPICall({
                endpoint: '/api/profile',
                method: 'PUT',
                data: userData
            });

            if (response.success) {
                // Update stored user data
                localStorage.setItem('userName', response.user.name);
                localStorage.setItem('userEmail', response.user.email);
                
                this.currentUser = response.user;
                this.updateUIForAuth();
                
                this.showToast('Profil mis à jour avec succès !', 'success');
                return { success: true, user: response.user };
            } else {
                throw new Error(response.message || 'Erreur de mise à jour');
            }
        } catch (error) {
            this.showToast(error.message || 'Erreur de mise à jour', 'error');
            return { success: false, error: error.message };
        } finally {
            this.showLoadingState(false);
        }
    }

    // Check authentication status on page load
    checkAuthStatus() {
        if (this.isLoggedIn()) {
            this.currentUser = this.getCurrentUser();
        }
    }

    // Update UI based on authentication status
    updateUIForAuth() {
        const isLoggedIn = this.isLoggedIn();
        const user = this.getCurrentUser();

        // Update navigation links
        const accountLinks = document.querySelectorAll('a[href="login.html"], a[href="profile.html"]');
        accountLinks.forEach(link => {
            if (isLoggedIn) {
                link.textContent = 'Mon Compte';
                link.href = 'profile.html';
            } else {
                link.textContent = 'Connexion';
                link.href = 'login.html';
            }
        });

        // Update user info in profile page
        if (user && window.location.pathname.includes('profile.html')) {
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            
            if (nameInput) nameInput.value = user.name;
            if (emailInput) emailInput.value = user.email;
        }

        // Protect authenticated pages
        this.protectAuthenticatedPages();
    }

    // Protect pages that require authentication
    protectAuthenticatedPages() {
        const protectedPages = ['profile.html', 'checkout.html'];
        const currentPage = window.location.pathname.split('/').pop();
        
        if (protectedPages.includes(currentPage) && !this.isLoggedIn()) {
            // Store current page for redirect after login
            localStorage.setItem('redirectAfterLogin', currentPage);
            
            // Show message and redirect to login
            this.showToast('Veuillez vous connecter pour accéder à cette page', 'info');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    }

    // Setup event listeners for auth forms
    setupAuthEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(loginForm);
                const email = formData.get('email');
                const password = formData.get('password');
                
                await this.login(email, password);
            });
        }

        // Register form
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(registerForm);
                const userData = {
                    name: formData.get('name'),
                    email: formData.get('email'),
                    password: formData.get('password'),
                    passwordConfirm: formData.get('password-confirm')
                };
                
                await this.register(userData);
            });
        }

        // Profile form
        const profileForm = document.getElementById('profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(profileForm);
                const userData = {
                    name: formData.get('name'),
                    email: formData.get('email')
                };
                
                await this.updateProfile(userData);
            });
        }

        // Logout links
        document.querySelectorAll('a[href="#logout"], .logout-btn').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        });
    }

    // Validate registration data
    validateRegistrationData(userData) {
        const errors = [];

        // Name validation
        if (!userData.name || userData.name.trim().length < 2) {
            errors.push('Le nom doit contenir au moins 2 caractères');
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!userData.email || !emailRegex.test(userData.email)) {
            errors.push('Email invalide');
        }

        // Password validation
        if (!userData.password || userData.password.length < 6) {
            errors.push('Le mot de passe doit contenir au moins 6 caractères');
        }

        // Password confirmation
        if (userData.password !== userData.passwordConfirm) {
            errors.push('Les mots de passe ne correspondent pas');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Simulate API call (replace with actual API calls)
    async simulateAPICall({ endpoint, method, data }) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate different responses based on endpoint
                if (endpoint === '/api/login') {
                    // Simple validation for demo
                    if (data.email && data.password.length >= 6) {
                        resolve({
                            success: true,
                            user: {
                                id: '1',
                                email: data.email,
                                name: data.email.split('@')[0]
                            },
                            token: 'demo-token-' + Date.now()
                        });
                    } else {
                        resolve({
                            success: false,
                            message: 'Email ou mot de passe invalide'
                        });
                    }
                } else if (endpoint === '/api/register') {
                    resolve({
                        success: true,
                        user: {
                            id: Date.now().toString(),
                            email: data.email,
                            name: data.name
                        },
                        token: 'demo-token-' + Date.now()
                    });
                } else if (endpoint === '/api/profile') {
                    resolve({
                        success: true,
                        user: {
                            id: localStorage.getItem('userId'),
                            email: data.email,
                            name: data.name
                        }
                    });
                }
            }, 1000); // Simulate network delay
        });
    }

    // Show loading state
    showLoadingState(isLoading) {
        const submitButtons = document.querySelectorAll('button[type="submit"]');
        submitButtons.forEach(button => {
            if (isLoading) {
                button.disabled = true;
                button.innerHTML = `
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Chargement...
                `;
            } else {
                button.disabled = false;
                // Restore original button text based on context
                if (button.closest('#login-form')) {
                    button.textContent = 'Se connecter';
                } else if (button.closest('#register-form')) {
                    button.textContent = 'S\'inscrire';
                } else if (button.closest('#profile-form')) {
                    button.textContent = 'Mettre à jour';
                }
            }
        });
    }

    // Show toast notification
    showToast(message, type = 'info') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        
        if (toast && toastMessage) {
            toastMessage.textContent = message;
            
            // Set toast color based on type
            const colorClasses = {
                success: 'bg-green-500',
                error: 'bg-red-500',
                info: 'bg-blue-500',
                warning: 'bg-yellow-500'
            };
            
            toast.className = `fixed top-20 right-4 ${colorClasses[type] || 'bg-blue-500'} text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 z-50`;
            
            // Show toast
            toast.classList.remove('translate-x-full');
            
            // Hide toast after 4 seconds
            setTimeout(() => {
                toast.classList.add('translate-x-full');
            }, 4000);
        }
    }

    // Get user orders (simulation)
    async getUserOrders() {
        try {
            const response = await this.simulateAPICall({
                endpoint: '/api/orders',
                method: 'GET'
            });

            return response.orders || [];
        } catch (error) {
            console.error('Error fetching orders:', error);
            return [];
        }
    }

    // Password strength checker
    checkPasswordStrength(password) {
        let strength = 0;
        const checks = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            numbers: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        strength = Object.values(checks).filter(Boolean).length;

        return {
            score: strength,
            checks: checks,
            level: strength < 2 ? 'weak' : strength < 4 ? 'medium' : 'strong'
        };
    }
}

// Initialize authentication manager
const authManager = new AuthManager();

// Export for use in other files
window.authManager = authManager;

