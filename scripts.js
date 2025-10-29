document.addEventListener('DOMContentLoaded', () => {
    // Theme Management
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme') || 
                        (prefersDarkScheme.matches ? 'dark' : 'light');

    // Set initial theme
    function setTheme(theme) {
        document.body.classList.toggle('dark-theme', theme === 'dark');
        themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
        localStorage.setItem('theme', theme);
    }

    setTheme(currentTheme);

    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-theme');
        setTheme(isDark ? 'light' : 'dark');
    });

    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Progress bars with Intersection Observer
    const progressBars = document.querySelectorAll('.progress-bar');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const percent = entry.target.getAttribute('data-percent');
                entry.target.style.setProperty('--progress', percent + '%');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, { 
        threshold: 0.5,
        rootMargin: '0px'
    });

    progressBars.forEach(bar => observer.observe(bar));

    // Form Validation and Handling
    const form = document.getElementById('contact-form');
    const formInputs = form.querySelectorAll('input, textarea');

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email.toLowerCase());
    }

    function showError(input, message) {
        const formGroup = input.closest('.input-group');
        const errorDiv = formGroup.querySelector('.error-message') || 
                        document.createElement('div');
        
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        if (!formGroup.querySelector('.error-message')) {
            formGroup.appendChild(errorDiv);
        }
        
        input.classList.add('error');
    }

    function clearError(input) {
        const formGroup = input.closest('.input-group');
        const errorDiv = formGroup.querySelector('.error-message');
        
        if (errorDiv) {
            errorDiv.remove();
        }
        
        input.classList.remove('error');
    }

    function validateInput(input) {
        clearError(input);
        
        if (!input.value.trim()) {
            showError(input, 'This field is required');
            return false;
        }

        if (input.type === 'email' && !validateEmail(input.value)) {
            showError(input, 'Please enter a valid email address');
            return false;
        }

        if (input.id === 'message' && input.value.length < 10) {
            showError(input, 'Message must be at least 10 characters long');
            return false;
        }

        return true;
    }

    // Real-time validation
    formInputs.forEach(input => {
        input.addEventListener('blur', () => validateInput(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateInput(input);
            }
        });
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate all inputs
        const isValid = Array.from(formInputs).every(validateInput);
        if (!isValid) return;

        // Add loading state
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.classList.add('loading');
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        try {
            // Simulate form submission (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            form.reset();
            alert('Message sent successfully!');
        } catch (error) {
            alert('Failed to send message. Please try again later.');
        } finally {
            // Remove loading state
            submitButton.classList.remove('loading');
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    });

    // Smooth scrolling with improved accessibility
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Update URL without page reload
                history.pushState(null, '', targetId);
                
                // Smooth scroll to target
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Update focus for accessibility
                targetElement.setAttribute('tabindex', '-1');
                targetElement.focus({ preventScroll: true });
            }
        });
    });

    // Back-to-top button with improved visibility and smooth animation
    const backToTopButton = document.getElementById('back-to-top');
    let isScrolling;

    function toggleBackToTop() {
        if (window.scrollY > 300) {
            backToTopButton.style.opacity = '1';
            backToTopButton.style.visibility = 'visible';
            backToTopButton.style.transform = 'translateY(0)';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.visibility = 'hidden';
            backToTopButton.style.transform = 'translateY(20px)';
        }
    }

    window.addEventListener('scroll', () => {
        // Clear our timeout throughout the scroll
        window.clearTimeout(isScrolling);

        // Set a timeout to run after scrolling ends
        isScrolling = setTimeout(toggleBackToTop, 100);
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        
        // Update focus for accessibility
        document.getElementById('main-content').focus({ preventScroll: true });
    });

    // Mobile menu handling
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    navToggle.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navToggle.setAttribute('aria-expanded', 'false');
            navLinks.classList.remove('active');
        }
    });

    // Typewriter effect with improved performance
    const typewriterText = "Web Developer and Data Scientist";
    const typewriterElement = document.getElementById('typewriter');
    let typewriterIndex = 0;
    let typewriterTimeout;

    function typeWriter() {
        if (!typewriterElement) return;
        if (typewriterIndex < typewriterText.length) {
            typewriterElement.textContent += typewriterText.charAt(typewriterIndex);
            typewriterIndex++;
            typewriterTimeout = setTimeout(typeWriter, 100);
        }
    }

    if (typewriterElement) {
        // Start typewriter effect when element is visible
        const typewriterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    typeWriter();
                    typewriterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        typewriterObserver.observe(typewriterElement);
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        clearTimeout(typewriterTimeout);
    });

    // Update copyright year
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Scroll reveal animations
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    function setupScrollReveal() {
        const candidates = [
            ...document.querySelectorAll('section'),
            ...document.querySelectorAll('.project'),
            ...document.querySelectorAll('.highlight-item'),
            ...document.querySelectorAll('.education-item'),
            ...document.querySelectorAll('.experience-item'),
            ...document.querySelectorAll('.skills-container'),
            ...document.querySelectorAll('.certificates-grid'),
            ...document.querySelectorAll('.project-content')
        ];

        const seen = new Set();
        const targets = candidates.filter(el => {
            if (seen.has(el)) return false;
            seen.add(el);
            return true;
        });

        targets.forEach((el, idx) => {
            el.classList.add('reveal');
            const delay = (idx % 6) * 80; // 0..400ms stagger
            el.style.setProperty('--reveal-delay', `${delay}ms`);
        });

        if (prefersReducedMotion.matches) {
            targets.forEach(el => el.classList.add('in-view'));
            return;
        }

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

        targets.forEach(el => revealObserver.observe(el));
    }

    setupScrollReveal();

    // Photos lightbox
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');

    function openLightbox(src, caption) {
        if (!lightbox) return;
        lightboxImg.src = src;
        lightboxCaption.textContent = caption || '';
        lightbox.setAttribute('aria-hidden', 'false');
        lightboxClose?.focus();
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.setAttribute('aria-hidden', 'true');
        lightboxImg.src = '';
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const href = item.getAttribute('href');
            const caption = item.getAttribute('data-caption') || item.querySelector('img')?.alt || '';
            openLightbox(href, caption);
        });
    });

    lightbox?.addEventListener('click', (e) => {
        if (e.target.hasAttribute('data-close') || e.target === lightboxClose) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeLightbox();
    });
});





