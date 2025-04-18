document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    
    burger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        burger.classList.toggle('active');
    });
    
    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Close mobile menu
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    burger.classList.remove('active');
                }
            }
        });
    });
    
    // Scroll Reveal Animation
    const animateElements = document.querySelectorAll('.animate-card');
    
    function checkScroll() {
        animateElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.style.animation = `fadeInUp 1s forwards`;
                element.style.animationDelay = `${element.dataset.delay || '0.2s'}`;
            }
        });
    }
    
    // Projects Layout Optimizer
    function optimizeProjectsLayout() {
        const projectsSection = document.getElementById('projects');
        if (!projectsSection) return;

        const projectCards = document.querySelectorAll('.project-card');
        const screenWidth = window.innerWidth;

        projectCards.forEach(card => {
            if (screenWidth < 576) {
                card.style.maxWidth = '95%';
            } else if (screenWidth < 768) {
                card.style.maxWidth = '100%';
            } else {
                card.style.maxWidth = '';
            }
        });
    }

    // Current Year
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Event Listeners
    window.addEventListener('load', function() {
        checkScroll();
        optimizeProjectsLayout();
        
        // Force HTTPS
        if (window.location.protocol === 'http:' && window.location.hostname !== 'localhost') {
            window.location.href = 'https:' + window.location.href.substring(5);
        }
    });

    window.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', debounce(function() {
        checkScroll();
        optimizeProjectsLayout();
    }, 100));

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    // External links protection
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        if (!link.href.includes(window.location.hostname)) {
            link.setAttribute('rel', 'noopener noreferrer');
            link.setAttribute('target', '_blank');
        }
    });
});
