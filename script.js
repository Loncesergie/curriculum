document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        burger.classList.toggle('toggle');
    });

    navLinksItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            burger.classList.remove('toggle');
        });
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll reveal animations
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.section, .hero-content > *');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Set initial state for animated elements
    document.querySelectorAll('.hero-content > *').forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.5s ease ${index * 0.2}s, transform 0.5s ease ${index * 0.2}s`;
    });

    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });

    // Trigger animations on load and scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('form-message');
    const submitBtn = contactForm?.querySelector('button[type="submit"]');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Show loading state
            submitBtn.classList.add('btn--loading');
            submitBtn.disabled = true;
            
            try {
                const formData = new FormData(this);
                
                // Add hCaptcha token if exists
                if (window.hcaptcha) {
                    const token = await hcaptcha.getResponse();
                    if (!token) {
                        throw new Error('Veuillez compléter la vérification hCaptcha');
                    }
                    formData.append('h-captcha-response', token);
                }
                
                // Basic form validation
                const name = formData.get('name');
                const email = formData.get('_replyto');
                const message = formData.get('message');
                
                if (!name || name.length < 2) {
                    throw new Error('Veuillez entrer un nom valide (minimum 2 caractères)');
                }
                
                if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    throw new Error('Veuillez entrer une adresse email valide');
                }
                
                if (!message || message.length < 10) {
                    throw new Error('Votre message doit contenir au moins 10 caractères');
                }
                
                const response = await fetch(this.action, {
                    method: 'POST',
                    body: new URLSearchParams(formData),
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                const data = await response.json();
                
                if (data.errors) {
                    throw new Error(data.errors.join(', '));
                }
                
                if (!response.ok || !data.success) {
                    throw new Error(data.message || 'Erreur lors de l\'envoi du message');
                }
                
                showFormMessage('success', 'Message envoyé avec succès !');
                contactForm.reset();
                
                // Reset hCaptcha if exists
                if (window.hcaptcha) {
                    hcaptcha.reset();
                }
                
                // Redirect to thank you page if specified
                const nextPage = this.querySelector('input[name="_next"]')?.value;
                if (nextPage) {
                    setTimeout(() => {
                        window.location.href = nextPage;
                    }, 1500);
                }
            } catch (error) {
                console.error('Error:', error);
                showFormMessage('error', error.message || 'Une erreur est survenue');
            } finally {
                submitBtn.classList.remove('btn--loading');
                submitBtn.disabled = false;
            }
        });
    }

    // Form message display
    function showFormMessage(type, message) {
        if (!formMessage) return;
        
        formMessage.textContent = message;
        formMessage.className = '';
        formMessage.classList.add(type);
        formMessage.style.display = 'block';
        
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }

    // Initialize hCaptcha if loaded
    if (window.hcaptcha) {
        hcaptcha.onLoad = function() {
            hcaptcha.render('h-captcha', {
                sitekey: 'votre-sitekey',
                theme: 'light'
            });
        };
    }

    // Header scroll effect
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'white';
            header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        }
    });

    // Current year in footer
    document.querySelector('footer p').innerHTML = `&copy; ${new Date().getFullYear()} Tous droits réservés`;
});
