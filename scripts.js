document.addEventListener('DOMContentLoaded', () => {
    // Theme Management
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const currentTheme = localStorage.getItem('theme') ||
        (prefersDarkScheme.matches ? 'dark' : 'light');

    // Set initial theme
    function setTheme(theme) {
        document.body.classList.toggle('dark-theme', theme === 'dark');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
            themeToggle.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
            themeToggle.setAttribute('aria-pressed', String(theme === 'dark'));
        }
        localStorage.setItem('theme', theme);
    }

    setTheme(currentTheme);

    // Toggle theme on button click
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.body.classList.contains('dark-theme');
            setTheme(isDark ? 'light' : 'dark');
        });
    }

    // Listen for system theme changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Animate skills on scroll
    const skillSection = document.querySelector('.skills');
    const progressBars = document.querySelectorAll('.progress-bar');
    let animated = false;

    function animateSkills() {
        if (!skillSection) return;
        const sectionPos = skillSection.getBoundingClientRect().top;
        const screenPos = window.innerHeight / 1.3;

        if (sectionPos < screenPos && !animated) {
            progressBars.forEach(bar => {
                const percent = bar.getAttribute('data-percent');
                bar.style.width = percent + '%';
            });
            animated = true;
            window.removeEventListener('scroll', animateSkills);
        }
    }

    if (skillSection) {
        window.addEventListener('scroll', animateSkills);
        animateSkills(); // Check on load
    }

    // Reload animation on hover/click
    const skillItems = document.querySelectorAll('.skill');

    skillItems.forEach(skill => {
        const bar = skill.querySelector('.progress-bar');
        if (!bar) return;
        const percent = bar.getAttribute('data-percent');

        const reloadAnimation = () => {
            bar.style.width = '0%';
            bar.style.transition = 'none';

            setTimeout(() => {
                bar.style.transition = 'width 1s cubic-bezier(0.1, 0.5, 0.5, 1)';
                bar.style.width = percent + '%';
            }, 50);
        };

        skill.addEventListener('mouseenter', reloadAnimation);
        skill.addEventListener('click', reloadAnimation);
    });


    // Smooth scrolling with improved accessibility
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Update URL without page reload
                history.pushState(null, '', targetId);
                
                // Smooth scroll to target
                targetElement.scrollIntoView({
                    behavior: prefersReducedMotion.matches ? 'auto' : 'smooth',
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
    if (backToTopButton) {
        function toggleBackToTop() {
            backToTopButton.classList.toggle('is-visible', window.scrollY > 300);
        }

        window.addEventListener('scroll', toggleBackToTop, { passive: true });
        toggleBackToTop();

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion.matches ? 'auto' : 'smooth'
            });
            
            // Update focus for accessibility
            const mainContent = document.getElementById('main-content');
            if (mainContent) {
                mainContent.focus({ preventScroll: true });
            }
        });
    }

    // Mobile menu handling
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navAnchors = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));

    function closeMobileMenu() {
        if (!navToggle || !navLinks) return;
        navToggle.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('active');
    }

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', String(!isExpanded));
            navLinks.classList.toggle('active');
        });

        navAnchors.forEach(link => link.addEventListener('click', closeMobileMenu));

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                closeMobileMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMobileMenu();
        });
    }

    const observedSections = navAnchors
        .map(link => document.querySelector(link.getAttribute('href')))
        .filter(Boolean);

    if (observedSections.length) {
        const navObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const activeLink = navAnchors.find(link => link.getAttribute('href') === `#${entry.target.id}`);
                navAnchors.forEach(link => link.removeAttribute('aria-current'));
                if (activeLink) activeLink.setAttribute('aria-current', 'page');
            });
        }, { rootMargin: '-35% 0px -55% 0px', threshold: 0.01 });

        observedSections.forEach(section => navObserver.observe(section));
    }

    if (location.hash) {
        const activeLink = navAnchors.find(link => link.getAttribute('href') === location.hash);
        if (activeLink) {
            navAnchors.forEach(link => link.removeAttribute('aria-current'));
            activeLink.setAttribute('aria-current', 'page');
        }
    }

    // Update copyright year
    const currentYearElement = document.getElementById('current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Scroll reveal animations
    function setupScrollReveal() {
        const candidates = [
            ...document.querySelectorAll('section'),
            ...document.querySelectorAll('.project'),
            ...document.querySelectorAll('.highlight-item'),
            ...document.querySelectorAll('.education-item'),
            ...document.querySelectorAll('.experience-item'),
            ...document.querySelectorAll('.skills-container'),
            ...document.querySelectorAll('.certificates-grid'),
            ...document.querySelectorAll('.project-content'),
            ...document.querySelectorAll('.sessions-grid'),
            ...document.querySelectorAll('.session-card')
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
    let lastLightboxTrigger = null;

    function openLightbox(src, caption) {
        if (!lightbox || !lightboxImg || !lightboxCaption) return;
        lightboxImg.src = src;
        lightboxImg.alt = caption ? `Expanded view: ${caption}` : 'Expanded gallery image';
        lightboxCaption.textContent = caption || '';
        lightbox.setAttribute('aria-hidden', 'false');
        if (lightboxClose) lightboxClose.focus();
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.setAttribute('aria-hidden', 'true');
        if (lightboxImg) lightboxImg.src = '';
        document.body.style.overflow = '';
        if (lastLightboxTrigger) lastLightboxTrigger.focus({ preventScroll: true });
        currentGalleryIndex = -1;
        updateNavState();
    }

    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    let currentGalleryIndex = -1;

    function showLightboxAt(index) {
        const item = galleryItems[index];
        if (!item) return;
        const href = item.getAttribute('href');
        const caption = item.getAttribute('data-caption') || item.querySelector('img')?.alt || '';
        lastLightboxTrigger = item;
        openLightbox(href, caption);
        currentGalleryIndex = index;
        updateNavState();
    }

    galleryItems.forEach((item, idx) => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            showLightboxAt(idx);
        });
    });

    const lbPrev = document.getElementById('lightbox-prev');
    const lbNext = document.getElementById('lightbox-next');

    function updateNavState() {
        if (!lightbox) return;
        if (lbPrev) lbPrev.disabled = currentGalleryIndex <= 0;
        if (lbNext) lbNext.disabled = currentGalleryIndex >= galleryItems.length - 1;
    }

    function showPrev() {
        if (currentGalleryIndex > 0) showLightboxAt(currentGalleryIndex - 1);
    }

    function showNext() {
        if (currentGalleryIndex < galleryItems.length - 1) showLightboxAt(currentGalleryIndex + 1);
    }

    if (lbPrev) lbPrev.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
    if (lbNext) lbNext.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });

    lightbox?.addEventListener('click', (e) => {
        if (e.target.hasAttribute('data-close') || e.target === lightboxClose) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox || lightbox.getAttribute('aria-hidden') !== 'false') return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });

    // Animated counters for sessions
    const counters = document.querySelectorAll('.counter');
    if (counters.length) {
        const durationMs = 1200;
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target') || '0', 10);
                const start = performance.now();
                function tick(now) {
                    const t = Math.min(1, (now - start) / durationMs);
                    // easeOutCubic
                    const eased = 1 - Math.pow(1 - t, 3);
                    const value = Math.floor(eased * target);
                    el.textContent = String(value);
                    if (t < 1) requestAnimationFrame(tick);
                }
                requestAnimationFrame(tick);
                counterObserver.unobserve(el);
            });
        }, { threshold: 0.4 });

        counters.forEach(c => counterObserver.observe(c));
    }

    // Stars background animation
    const starsCanvas = document.getElementById('stars-canvas');
    if (starsCanvas) {
        const ctx = starsCanvas.getContext('2d');
        const dpr = Math.max(1, window.devicePixelRatio || 1);
        let width = 0;
        let height = 0;
        let stars = [];
        const STAR_COUNT = 140; // reasonable default
        let rafId;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        function resizeCanvas() {
            width = window.innerWidth;
            height = window.innerHeight;
            starsCanvas.width = Math.floor(width * dpr);
            starsCanvas.height = Math.floor(height * dpr);
            starsCanvas.style.width = width + 'px';
            starsCanvas.style.height = height + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        function getStarColor() {
            return document.body.classList.contains('dark-theme') ? 'rgba(255,255,255,0.9)' : 'rgba(106,13,173,0.8)';
        }

        function seedStars() {
            stars = Array.from({ length: STAR_COUNT }, () => ({
                x: Math.random() * width,
                y: Math.random() * height,
                r: Math.random() * 1.5 + 0.3,
                vy: Math.random() * 0.12 + 0.03, // slow drift
                tw: Math.random() * 0.5 + 0.5 // twinkle base
            }));
        }

        function drawFrame() {
            ctx.clearRect(0, 0, width, height);
            const color = getStarColor();
            for (const s of stars) {
                // twinkle
                const alpha = 0.6 + Math.sin((performance.now() * 0.002 + s.x + s.y)) * 0.4 * s.tw;
                ctx.fillStyle = color.replace(/\d?\.\d+\)$/,'') + (alpha.toFixed(2) + ')');
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fill();

                // drift downward
                s.y += s.vy;
                if (s.y > height + 2) {
                    s.y = -2;
                    s.x = Math.random() * width;
                }
            }
        }

        function tick() {
            drawFrame();
            rafId = requestAnimationFrame(tick);
        }

        // Init
        resizeCanvas();
        seedStars();

        const start = () => {
            if (!prefersReducedMotion.matches && !rafId) rafId = requestAnimationFrame(tick);
            if (prefersReducedMotion.matches) drawFrame(); // static on reduced motion
        };
        const stop = () => {
            if (rafId) cancelAnimationFrame(rafId);
            rafId = undefined;
        };

        // Start/Stop based on visibility and reduced motion
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) stop(); else start();
        });
        prefersReducedMotion.addEventListener('change', () => {
            stop();
            start();
        });

        // React to theme changes by redrawing next frames (handled per frame color)

        // Handle resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                resizeCanvas();
                seedStars();
            }, 150);
        });

        // Cleanup
        window.addEventListener('beforeunload', stop);

        // Let the first paint finish before starting the decorative canvas.
        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(start, { timeout: 1500 });
        } else {
            setTimeout(start, 600);
        }
    }

    function setupAutoScroll(scroller, options = {}) {
        if (!scroller) return;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        let scrollAmount = 0;
        const scrollSpeed = options.speed || 0.5;
        let scrollDirection = 1;
        let isScrolling = true;
        let userInteracting = false;
        let animationFrameId;
        let scrollTimeout;

        function canScroll() {
            return scroller.scrollWidth > scroller.clientWidth + 1;
        }

        function autoScroll() {
            if (prefersReducedMotion.matches) return;

            const maxScroll = scroller.scrollWidth - scroller.clientWidth;
            if (maxScroll <= 0) {
                animationFrameId = undefined;
                return;
            }

            if (!isScrolling || userInteracting) {
                animationFrameId = requestAnimationFrame(autoScroll);
                return;
            }

            if (scrollAmount >= maxScroll) {
                scrollDirection = -1;
            } else if (scrollAmount <= 0) {
                scrollDirection = 1;
            }

            scrollAmount += scrollSpeed * scrollDirection;
            scroller.scrollLeft = scrollAmount;

            animationFrameId = requestAnimationFrame(autoScroll);
        }

        function start() {
            if (!prefersReducedMotion.matches && !animationFrameId && canScroll()) {
                animationFrameId = requestAnimationFrame(autoScroll);
            }
        }

        scroller.addEventListener('mouseenter', () => {
            isScrolling = false;
        });

        scroller.addEventListener('mouseleave', () => {
            isScrolling = true;
        });

        scroller.addEventListener('scroll', () => {
            userInteracting = true;
            clearTimeout(scrollTimeout);
            scrollAmount = scroller.scrollLeft;

            scrollTimeout = setTimeout(() => {
                userInteracting = false;
            }, options.resumeDelay || 1500);
        });

        const stop = () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            animationFrameId = undefined;
        };

        prefersReducedMotion.addEventListener('change', () => {
            stop();
            start();
        });

        setTimeout(() => {
            start();
        }, options.delay || 800);

        if ('ResizeObserver' in window) {
            const resizeObserver = new ResizeObserver(start);
            resizeObserver.observe(scroller);
            window.addEventListener('beforeunload', () => resizeObserver.disconnect());
        } else {
            window.addEventListener('resize', start, { passive: true });
        }

        window.addEventListener('beforeunload', stop);
    }

    setupAutoScroll(document.querySelector('.certificates-grid'), { speed: 0.5, delay: 800 });
    setupAutoScroll(document.querySelector('.gallery-grid'), { speed: 1, delay: 1000, resumeDelay: 2000 });
}
);
