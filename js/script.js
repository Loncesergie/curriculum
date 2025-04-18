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

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form submission with GitHub Actions
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const formMessage = document.getElementById('form-message');
            
            // Validate form
            const name = this.name.value.trim();
            const email = this.email.value.trim();
            const message = this.message.value.trim();
            
            if (!name || name.length < 2) {
                showFormMessage(formMessage, 'Veuillez entrer un nom valide', 'error');
                return;
            }
            
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showFormMessage(formMessage, 'Veuillez entrer un email valide', 'error');
                return;
            }
            
            if (!message || message.length < 10) {
                showFormMessage(formMessage, 'Le message doit contenir au moins 10 caractères', 'error');
                return;
            }
            
            // Verify hCaptcha
            if (window.hcaptcha) {
                const token = await hcaptcha.getResponse();
                if (!token) {
                    showFormMessage(formMessage, 'Veuillez compléter la vérification hCaptcha', 'error');
                    return;
                }
            }
            
            // Prepare payload
            const formData = {
                name,
                email,
                subject: this.subject.value.trim(),
                message,
                'h-captcha-response': window.hcaptcha ? await hcaptcha.getResponse() : null
            };
            
            // Send to GitHub Actions
            try {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
                
                const response = await fetch('https://api.github.com/repos/YOUR_USERNAME/YOUR_REPO/dispatches', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'token YOUR_GITHUB_TOKEN',
                        'Accept': 'application/vnd.github.everest-preview+json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        event_type: 'contact_form',
                        client_payload: formData
                    })
                });
                
                if (response.ok) {
                    showFormMessage(formMessage, 'Message envoyé avec succès!', 'success');
                    this.reset();
                    if (window.hcaptcha) hcaptcha.reset();
                } else {
                    throw new Error('Erreur lors de l\'envoi');
                }
            } catch (error) {
                console.error('Error:', error);
                showFormMessage(formMessage, 'Erreur: ' + error.message, 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span class="btn-text">Envoyer</span><i class="fas fa-paper-plane"></i>';
            }
        });
    }
    
    // Helper function to show form messages
    function showFormMessage(element, message, type) {
        if (!element) return;
        
        element.textContent = message;
        element.className = type;
        element.style.display = 'block';
        
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
    
    // Set current year in footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Scroll animations
    const animateOnScroll = () => {
        document.querySelectorAll('.section').forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop < window.innerHeight - 100) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Initialize animations
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
});
