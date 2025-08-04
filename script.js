// script.js for Biologia360
        // Database simulation
        const database = {
            users: JSON.parse(localStorage.getItem('users')) || [],
            currentUser: null,
            
            saveUsers() {
                localStorage.setItem('users', JSON.stringify(this.users));
            },
            
            registerUser(name, email, password) {
                // Check if user already exists
                if (this.users.some(user => user.email === email)) {
                    return { success: false, message: "Email already registered" };
                }
                
                // Create new user
                const newUser = {
                    id: Date.now().toString(),
                    name,
                    email,
                    password,
                    createdAt: new Date().toISOString(),
                    role: "member"
                };
                
                this.users.push(newUser);
                this.saveUsers();
                return { success: true, user: newUser };
            },
            
            loginUser(email, password) {
                const user = this.users.find(user => 
                    user.email === email && user.password === password
                );
                
                if (user) {
                    this.currentUser = user;
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    return { success: true, user };
                } else {
                    return { success: false, message: "Invalid credentials" };
                }
            },
            
            logoutUser() {
                this.currentUser = null;
                localStorage.removeItem('currentUser');
            },
            
            loadCurrentUser() {
                const user = JSON.parse(localStorage.getItem('currentUser'));
                if (user) {
                    this.currentUser = user;
                }
            }
        };

        // DOM Elements
        const authModal = document.getElementById('authModal');
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        const closeModal = document.getElementById('closeModal');
        const loginForm = document.getElementById('loginForm');
        const signupForm = document.getElementById('signupForm');
        const loginToggle = document.getElementById('loginToggle');
        const signupToggle = document.getElementById('signupToggle');
        const userDashboard = document.getElementById('userDashboard');
        const logoutBtn = document.getElementById('logoutBtn');
        const userName = document.getElementById('userName');
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');

        // Initialize
        database.loadCurrentUser();
        updateAuthUI();

        // Event Listeners
        loginBtn.addEventListener('click', () => {
            showModal('login');
        });

        signupBtn.addEventListener('click', () => {
            showModal('signup');
        });

        closeModal.addEventListener('click', () => {
            authModal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === authModal) {
                authModal.style.display = 'none';
            }
            
            // Close user dashboard when clicking outside
            if (!e.target.closest('#userDashboard') && 
                !e.target.closest('#loginBtn') && 
                !e.target.closest('#signupBtn') &&
                userDashboard.style.display === 'block') {
                userDashboard.style.display = 'none';
            }
        });

        loginToggle.addEventListener('click', () => {
            setActiveForm('login');
        });

        signupToggle.addEventListener('click', () => {
            setActiveForm('signup');
        });

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            const result = database.loginUser(email, password);
            if (result.success) {
                updateAuthUI();
                authModal.style.display = 'none';
                showNotification('Login successful!', 'success');
            } else {
                showNotification(result.message, 'error');
            }
        });

        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirm = document.getElementById('signupConfirm').value;
            
            if (password !== confirm) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            const result = database.registerUser(name, email, password);
            if (result.success) {
                database.loginUser(email, password);
                updateAuthUI();
                authModal.style.display = 'none';
                showNotification('Account created successfully!', 'success');
            } else {
                showNotification(result.message, 'error');
            }
        });

        logoutBtn.addEventListener('click', () => {
            database.logoutUser();
            updateAuthUI();
            userDashboard.style.display = 'none';
            showNotification('You have been logged out', 'info');
        });

        // Toggle user dashboard
        document.querySelector('.auth-buttons').addEventListener('click', (e) => {
            if (database.currentUser && 
                (e.target === loginBtn || e.target === signupBtn || 
                 e.target.closest('#loginBtn') || e.target.closest('#signupBtn'))) {
                if (userDashboard.style.display === 'block') {
                    userDashboard.style.display = 'none';
                } else {
                    userName.textContent = database.currentUser.name;
                    userDashboard.style.display = 'block';
                }
                e.preventDefault();
            }
        });

        // Mobile menu toggle
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show');
            menuToggle.classList.toggle('active');
        });

        // Helper functions
        function showModal(formType) {
            authModal.style.display = 'flex';
            setActiveForm(formType);
        }

        function setActiveForm(formType) {
            if (formType === 'login') {
                loginToggle.classList.add('active');
                signupToggle.classList.remove('active');
                loginForm.classList.add('active');
                signupForm.classList.remove('active');
            } else {
                signupToggle.classList.add('active');
                loginToggle.classList.remove('active');
                signupForm.classList.add('active');
                loginForm.classList.remove('active');
            }
        }

        function updateAuthUI() {
            const authButtons = document.querySelector('.auth-buttons');
            if (database.currentUser) {
                authButtons.innerHTML = `
                    <button class="auth-btn" id="userBtn">
                        <i class="fas fa-user"></i> ${database.currentUser.name}
                    </button>
                `;
            } else {
                authButtons.innerHTML = `
                    <button class="auth-btn" id="loginBtn">
                        <i class="fas fa-sign-in-alt"></i> Login
                    </button>
                    <button class="auth-btn secondary" id="signupBtn">
                        <i class="fas fa-user-plus"></i> Sign Up
                    </button>
                `;
                // Reattach event listeners to new buttons
                document.getElementById('loginBtn').addEventListener('click', () => showModal('login'));
                document.getElementById('signupBtn').addEventListener('click', () => showModal('signup'));
            }
        }

        function showNotification(message, type) {
            // Remove existing notifications
            const existing = document.querySelector('.notification');
            if (existing) existing.remove();
            
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                                   type === 'error' ? 'fa-exclamation-circle' : 
                                   'fa-info-circle'}"></i>
                    <span>${message}</span>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            // Show notification
            setTimeout(() => {
                notification.style.opacity = '1';
                notification.style.transform = 'translateY(0)';
            }, 10);
            
            // Hide after 3 seconds
            setTimeout(() => {
                notification.style.opacity = '0';
                notification.style.transform = 'translateY(-20px)';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }

        // CSS for notifications
        const notificationStyle = document.createElement('style');
        notificationStyle.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 25px;
                border-radius: 8px;
                color: white;
                font-weight: 600;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
                z-index: 3000;
                opacity: 0;
                transform: translateY(-20px);
                transition: all 0.3s ease;
            }
            
            .notification.success {
                background: var(--success);
            }
            
            .notification.error {
                background: var(--danger);
            }
            
            .notification.info {
                background: var(--secondary);
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .notification i {
                font-size: 1.2rem;
            }
        `;
        document.head.appendChild(notificationStyle);

        // Hero animations
        const heroElements = document.querySelectorAll('.hero-text h1, .hero-text p, .hero-buttons');
        heroElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.animation = `fadeIn 0.8s ease forwards ${index * 0.3}s`;
        });
        
        // Decoration animations
        const decorationItems = document.querySelectorAll('.decoration-item');
        decorationItems.forEach((item, index) => {
            const delay = Math.random() * 2;
            item.style.animationDelay = `${delay}s`;
        });
        
        // Section animations on scroll
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = `fadeIn 0.8s ease forwards`;
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe all section cards and headers
        document.querySelectorAll('.article-card, .species-card, .research-card, .gallery-item, .section-header').forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });