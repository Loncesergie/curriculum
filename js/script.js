// Configuration - À remplacer par vos valeurs
const CONFIG = {
    GITHUB: {
        TOKEN: '', // À remplacer ou utiliser process.env.GITHUB_TOKEN
        REPO_OWNER: 'votre-username',
        REPO_NAME: 'votre-repo'
    },
    HCAPTCHA: {
        SITE_KEY: 'votre-sitekey-hcaptcha'
    },
    CONTACT_EMAIL: 'sergie.king5@gmail.com'
};

// Initialisation après chargement du DOM
document.addEventListener('DOMContentLoaded', function() {
    // Gestion du menu mobile
    initMobileMenu();
    
    // Smooth scrolling
    initSmoothScrolling();
    
    // Animations au scroll
    initScrollAnimations();
    
    // Gestion du formulaire
    if (document.getElementById('contactForm')) {
        initContactForm();
    }
    
    // Mise à jour de l'année dans le footer
    updateCurrentYear();
});

// Menu mobile
function initMobileMenu() {
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li');

    burger?.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        burger.classList.toggle('toggle');
    });

    navLinksItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            burger?.classList.remove('toggle');
        });
    });
}

// Smooth scrolling
function initSmoothScrolling() {
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
}

// Animations
function initScrollAnimations() {
    const animateOnScroll = () => {
        document.querySelectorAll('.section').forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            if (sectionTop < window.innerHeight - 100) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    };

    // Initial state
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
}

// Gestion du formulaire de contact
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const formMessage = document.getElementById('form-message');

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validation du formulaire
        if (!validateForm(contactForm)) {
            return;
        }

        // Préparation des données
        const formData = {
            name: contactForm.name.value.trim(),
            email: contactForm.email.value.trim(),
            subject: contactForm.subject.value.trim(),
            message: contactForm.message.value.trim(),
            'h-captcha-response': window.hcaptcha ? await hcaptcha.getResponse() : null
        };

        // Envoi des données
        try {
            setLoadingState(submitBtn, true);
            
            const response = await sendContactRequest(formData);
            
            if (response.ok) {
                showFormMessage(formMessage, 'Message envoyé avec succès!', 'success');
                contactForm.reset();
                if (window.hcaptcha) hcaptcha.reset();
            } else {
                throw new Error('Erreur lors de l\'envoi du message');
            }
        } catch (error) {
            console.error('Error:', error);
            showFormMessage(formMessage, error.message || 'Une erreur est survenue', 'error');
        } finally {
            setLoadingState(submitBtn, false);
        }
    });
}

// Validation du formulaire
function validateForm(form) {
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const formMessage = document.getElementById('form-message');

    if (!name || name.length < 2) {
        showFormMessage(formMessage, 'Veuillez entrer un nom valide (min 2 caractères)', 'error');
        return false;
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showFormMessage(formMessage, 'Veuillez entrer un email valide', 'error');
        return false;
    }

    if (!message || message.length < 10) {
        showFormMessage(formMessage, 'Le message doit contenir au moins 10 caractères', 'error');
        return false;
    }

    if (window.hcaptcha && !hcaptcha.getResponse()) {
        showFormMessage(formMessage, 'Veuillez compléter la vérification hCaptcha', 'error');
        return false;
    }

    return true;
}

// Envoi de la requête à GitHub
async function sendContactRequest(formData) {
    return await fetch(`https://api.github.com/repos/${CONFIG.GITHUB.REPO_OWNER}/${CONFIG.GITHUB.REPO_NAME}/dispatches`, {
        method: 'POST',
        headers: {
            'Authorization': `token ${CONFIG.GITHUB.TOKEN}`,
            'Accept': 'application/vnd.github.everest-preview+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            event_type: 'contact_form',
            client_payload: formData
        })
    });
}

// Gestion de l'état de chargement
function setLoadingState(button, isLoading) {
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
    } else {
        button.disabled = false;
        button.innerHTML = '<span class="btn-text">Envoyer</span><i class="fas fa-paper-plane"></i>';
    }
}

// Affichage des messages de formulaire
function showFormMessage(element, message, type) {
    if (!element) return;
    
    element.textContent = message;
    element.className = type;
    element.style.display = 'block';
    
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

// Mise à jour de l'année dans le footer
function updateCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Initialisation hCaptcha
if (window.hcaptcha) {
    hcaptcha.onLoad = function() {
        hcaptcha.render('h-captcha', {
            sitekey: CONFIG.HCAPTCHA.SITE_KEY,
            theme: 'light'
        });
    };
}
