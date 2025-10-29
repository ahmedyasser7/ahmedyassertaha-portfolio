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

    // Back-to-top button with improved visibility
    const backToTopButton = document.getElementById('back-to-top');
    let isScrolling;

    window.addEventListener('scroll', () => {
        // Clear our timeout throughout the scroll
        window.clearTimeout(isScrolling);

        // Set a timeout to run after scrolling ends
        isScrolling = setTimeout(() => {
            if (window.scrollY > 300) {
                backToTopButton.style.opacity = '1';
                backToTopButton.style.visibility = 'visible';
            } else {
                backToTopButton.style.opacity = '0';
                backToTopButton.style.visibility = 'hidden';
            }
        }, 100);
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Mobile menu handling
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
        hamburger.setAttribute('aria-expanded', !isExpanded);
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.setAttribute('aria-expanded', 'false');
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
});





