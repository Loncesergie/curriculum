document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li');
    
    burger.addEventListener('click', () => {
        // Toggle Nav
        navLinks.classList.toggle('active');
        
        // Burger Animation
        burger.classList.toggle('toggle');
        
        // Animate Links
        navItems.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
    });
    
    // Scroll Reveal Animation
    const sr = ScrollReveal({
        origin: 'top',
        distance: '30px',
        duration: 1000,
        reset: true
    });
    
    sr.reveal('.hero-content', { delay: 200 });
    sr.reveal('.about-content', { delay: 200 });
    sr.reveal('.section-title', { delay: 200 });
    sr.reveal('.education-card', { interval: 200 });
    sr.reveal('.skill-card', { interval: 200 });
    sr.reveal('.cert-card', { interval: 200 });
    sr.reveal('.ref-card', { interval: 200 });
    
    // Header Scroll Effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        header.classList.toggle('scrolled', window.scrollY > 50);
    });
    
    // Smooth Scrolling for Anchor Links
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
                
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    burger.classList.remove('toggle');
                    navItems.forEach(link => {
                        link.style.animation = '';
                    });
                }
            }
        });
    });
    
    // Timeline Animation on Scroll
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    function checkTimeline() {
        const triggerBottom = window.innerHeight / 5 * 4;
        
        timelineItems.forEach(item => {
            const itemTop = item.getBoundingClientRect().top;
            
            if (itemTop < triggerBottom) {
                item.classList.add('visible');
            }
        });
    }
    
    window.addEventListener('scroll', checkTimeline);
    checkTimeline(); // Run once on load
    
    // Current Year for Footer
    document.querySelector('footer p').innerHTML = `&copy; ${new Date().getFullYear()} Tous droits réservés`;
    
    // Hero Text Animation
    const heroText = document.querySelector('.hero h1');
    const text = heroText.textContent;
    heroText.textContent = '';
    
    let i = 0;
    function typeWriter() {
        if (i < text.length) {
            heroText.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }
    
    // Start animation after a short delay
    setTimeout(typeWriter, 500);
});
