 // Mobile menu toggle
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.getElementById('navMenu');
        
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('show');
            menuToggle.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('show');
                menuToggle.classList.remove('active');
            }
        });
        
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