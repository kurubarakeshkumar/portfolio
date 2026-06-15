// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       Current Year Footer Update
       ========================================================================== */
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    /* ==========================================================================
       Mobile Menu Toggle
       ========================================================================== */
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileMenuBtn && navMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    /* ==========================================================================
       Theme Toggle (Dark / Light Mode)
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check localStorage for saved theme, default to dark if not set
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    /* ==========================================================================
       Sticky Navbar Scroll Effect
       ========================================================================== */
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       Typewriter Effect
       ========================================================================== */
    const typewriterElement = document.getElementById('typewriter');
    const words = ["AI Specializations.", "Full Stack Apps.", "Intelligent Backends.", "Machine Learning."];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        if (!typewriterElement) return;

        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Deleting is faster
        } else {
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // Normal typing speed
        }

        // State control
        if (!isDeleting && charIndex === currentWord.length) {
            typingSpeed = 2000; // Pause at the end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Pause before typing next word
        }

        setTimeout(type, typingSpeed);
    }

    // Initialize typewriter
    setTimeout(type, 1000);

    /* ==========================================================================
       Scroll Active Link Indicator
       ========================================================================== */
    const sections = document.querySelectorAll('section');
    
    function makeNavActiveOnScroll() {
        let scrollPosition = window.scrollY + 150; // Offset for navbar height

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', makeNavActiveOnScroll);

    /* ==========================================================================
       Scroll Reveal Animation using Intersection Observer
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Animates only once
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Offset bottom threshold slightly
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    /* ==========================================================================
       Contact Form Submission Handler (FormSubmit.co API Integration)
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formStatus = document.getElementById('form-status');

    if (contactForm && submitBtn && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Honeypot check to block bots
            const honeyInput = contactForm.querySelector('input[name="_honey"]');
            if (honeyInput && honeyInput.value) {
                // Silently drop spam submission but act like it succeeded to the bot
                showStatus('Thank you! Your message has been sent successfully.', 'success');
                contactForm.reset();
                return;
            }

            // Basic fields gather
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                showStatus('Please fill in all fields.', 'error');
                return;
            }

            // Show submitting status
            submitBtn.disabled = true;
            const btnText = submitBtn.querySelector('span');
            const originalText = btnText.textContent;
            btnText.textContent = 'Sending...';

            // Send request to FormSubmit AJAX endpoint
            fetch("https://formsubmit.co/ajax/kurubarakeshkumarrk@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message,
                    _subject: `New Contact Form Message from ${name}`
                })
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Network response was not ok.');
                }
            })
            .then(data => {
                // Success feedback
                showStatus('Thank you! Your message has been sent. Note: If this is your first submission, check your Gmail to activate the form.', 'success');
                contactForm.reset();
            })
            .catch(error => {
                console.error('Submission error:', error);
                showStatus('Oops! Something went wrong while sending your message. Please try again.', 'error');
            })
            .finally(() => {
                submitBtn.disabled = false;
                btnText.textContent = originalText;
            });
        });
    }

    function showStatus(message, type) {
        formStatus.textContent = message;
        formStatus.className = 'form-status ' + type;
        formStatus.style.display = 'block'; // Make sure the display property is reset
        
        // Auto-fade status after 5 seconds
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
    }
});
