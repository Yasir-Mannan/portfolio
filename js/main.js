/**
 * Portfolio Main JavaScript
 * Theme toggle, scroll effects, navigation, image sliders, and lightbox carousel
 */

(function() {
    'use strict';

    // ============================================
    // Theme Toggle (Dark/Light Mode)
    // ============================================
    function initTheme() {
        const localStorageValue = localStorage.getItem("pref-theme");
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)').matches;

        switch (localStorageValue) {
            case "dark":
                document.documentElement.classList.add('dark');
                document.body.classList.add('dark');
                break;
            case "light":
                document.body.classList.remove('dark');
                document.documentElement.classList.remove('dark');
                break;
            default:
                if (mediaQuery) {
                    document.documentElement.classList.add('dark');
                    document.body.classList.add('dark');
                }
                break;
        }
    }

    function toggleTheme() {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        themeToggle.addEventListener('click', function() {
            if (document.body.classList.contains('dark')) {
                document.body.classList.remove('dark');
                document.documentElement.classList.remove('dark');
                localStorage.setItem("pref-theme", "light");
            } else {
                document.body.classList.add('dark');
                document.documentElement.classList.add('dark');
                localStorage.setItem("pref-theme", "dark");
            }
        });
    }

    // ============================================
    // Sticky Header on Scroll
    // ============================================
    function initStickyHeader() {
        let prevScrollPos = window.pageYOffset;

        window.addEventListener("scroll", function() {
            const profileHeaderElem = document.getElementById("profileHeader");
            if (!profileHeaderElem) return;

            const currentScrollPos = window.pageYOffset;
            let resetHeaderStyle = false;
            const showNavBarOnScrollUp = true;
            const showNavBar = showNavBarOnScrollUp ? prevScrollPos > currentScrollPos : currentScrollPos > 0;

            if (showNavBar) {
                profileHeaderElem.classList.add("showHeaderOnTop");
            } else {
                resetHeaderStyle = true;
            }

            if (currentScrollPos === 0) {
                resetHeaderStyle = true;
            }

            if (resetHeaderStyle) {
                profileHeaderElem.classList.remove("showHeaderOnTop");
            }

            prevScrollPos = currentScrollPos;
        });
    }

    // ============================================
    // Smooth Scroll for Anchor Links
    // ============================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });

                    // Close mobile navbar if open
                    const navbarCollapse = document.querySelector('.navbar-collapse');
                    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                        const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                        bsCollapse.hide();
                    }
                }
            });
        });
    }

    // ============================================
    // Initialize Bootstrap Tooltips
    // ============================================
    function initTooltips() {
        const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        if (tooltipTriggerList.length > 0) {
            tooltipTriggerList.forEach(function(tooltipTriggerEl) {
                new bootstrap.Tooltip(tooltipTriggerEl);
            });
        }
    }

    // ============================================
    // Project Card Image Sliders
    // ============================================
    function initProjectSliders() {
        const sliders = document.querySelectorAll('.project-slider');

        sliders.forEach(function(slider) {
            const images = JSON.parse(slider.getAttribute('data-images') || '[]');
            if (images.length <= 1) return;

            const track = slider.querySelector('.slider-track');
            const img = track.querySelector('img');
            const dotsContainer = slider.querySelector('.slider-dots');
            const prevBtn = slider.querySelector('.slider-prev');
            const nextBtn = slider.querySelector('.slider-next');
            let currentIndex = 0;
            let autoInterval = null;
            const autoDelay = parseInt(slider.getAttribute('data-auto')) || 3500;

            // Create dots
            images.forEach(function(_, i) {
                const dot = document.createElement('button');
                dot.className = 'slider-dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('aria-label', 'Go to image ' + (i + 1));
                dot.addEventListener('click', function() {
                    goToSlide(i);
                    resetAuto();
                });
                dotsContainer.appendChild(dot);
            });

            function goToSlide(index) {
                if (index === currentIndex) return;
                currentIndex = index;

                img.classList.add('fading');
                setTimeout(function() {
                    img.src = images[currentIndex];
                    img.alt = img.alt || 'Project screenshot ' + (currentIndex + 1);
                    img.classList.remove('fading');
                }, 200);

                updateDots();
            }

            function updateDots() {
                const dots = dotsContainer.querySelectorAll('.slider-dot');
                dots.forEach(function(dot, i) {
                    dot.classList.toggle('active', i === currentIndex);
                });
            }

            function nextSlide() {
                goToSlide((currentIndex + 1) % images.length);
            }

            function prevSlide() {
                goToSlide((currentIndex - 1 + images.length) % images.length);
            }

            function resetAuto() {
                clearInterval(autoInterval);
                autoInterval = setInterval(nextSlide, autoDelay);
            }

            prevBtn.addEventListener('click', function() {
                prevSlide();
                resetAuto();
            });

            nextBtn.addEventListener('click', function() {
                nextSlide();
                resetAuto();
            });

            // Pause on hover
            slider.addEventListener('mouseenter', function() {
                clearInterval(autoInterval);
            });

            slider.addEventListener('mouseleave', function() {
                autoInterval = setInterval(nextSlide, autoDelay);
            });

            // Start auto-rotation
            autoInterval = setInterval(nextSlide, autoDelay);
        });
    }

    // ============================================
    // Experience Timeline Scroll Animation
    // ============================================
    function initTimelineAnimation() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        const progressBar = document.getElementById('timelineProgress');

        if (!timelineItems.length || !progressBar) return;

        function checkTimeline() {
            const timelineTop = document.querySelector('.experience-timeline').getBoundingClientRect().top;
            const timelineHeight = document.querySelector('.experience-timeline').offsetHeight;
            const windowHeight = window.innerHeight;
            const scrolled = Math.max(0, windowHeight - timelineTop);
            const progress = Math.min(1, scrolled / timelineHeight);
            progressBar.style.height = (progress * 100) + '%';
        }

        window.addEventListener('scroll', checkTimeline, { passive: true });
        checkTimeline();
    }

    // ============================================
    // Image Lightbox with Carousel
    // ============================================
    function initImageLightbox() {
        const lightboxModal = document.getElementById('imageLightbox');
        const lightboxImage = document.getElementById('lightboxImage');
        const lightboxTitle = document.getElementById('imageLightboxLabel');
        const lightboxCounter = document.getElementById('lightboxCounter');
        const lightboxDots = document.getElementById('lightboxDots');
        const lightboxPrev = document.getElementById('lightboxPrev');
        const lightboxNext = document.getElementById('lightboxNext');

        if (!lightboxModal) return;

        const modal = new bootstrap.Modal(lightboxModal);
        let currentImages = [];
        let currentIndex = 0;

        // Handle clicks on slider images
        document.querySelectorAll('#projects .project-slider .slider-track img').forEach(function(img) {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                const card = this.closest('.card');
                const slider = this.closest('.project-slider');
                const title = card ? card.querySelector('.card-title')?.textContent : '';

                currentImages = JSON.parse(slider.getAttribute('data-images') || '[]');

                // Find current slider index by matching src
                const dots = slider.querySelectorAll('.slider-dot');
                let activeIdx = 0;
                dots.forEach(function(dot, i) {
                    if (dot.classList.contains('active')) activeIdx = i;
                });
                currentIndex = activeIdx;

                openLightbox(title);
            });
        });

        // Handle clicks on single-image cards (no slider)
        document.querySelectorAll('#projects .card-head > img').forEach(function(img) {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                const card = this.closest('.card');
                const title = card ? card.querySelector('.card-title')?.textContent : '';

                currentImages = [this.src];
                currentIndex = 0;

                openLightbox(title);
            });
        });

        function openLightbox(title) {
            lightboxTitle.textContent = title;
            updateLightbox();
            modal.show();
        }

        function updateLightbox() {
            lightboxImage.src = currentImages[currentIndex];

            // Counter
            if (currentImages.length > 1) {
                lightboxCounter.textContent = (currentIndex + 1) + ' / ' + currentImages.length;
                lightboxCounter.style.display = '';
            } else {
                lightboxCounter.style.display = 'none';
            }

            // Show/hide nav buttons
            lightboxPrev.style.display = currentImages.length > 1 ? '' : 'none';
            lightboxNext.style.display = currentImages.length > 1 ? '' : 'none';

            // Build dots
            lightboxDots.innerHTML = '';
            if (currentImages.length > 1) {
                currentImages.forEach(function(_, i) {
                    const dot = document.createElement('button');
                    dot.className = 'lightbox-dot' + (i === currentIndex ? ' active' : '');
                    dot.setAttribute('aria-label', 'Go to image ' + (i + 1));
                    dot.addEventListener('click', function() {
                        currentIndex = i;
                        updateLightbox();
                    });
                    lightboxDots.appendChild(dot);
                });
            }
        }

        lightboxPrev.addEventListener('click', function() {
            currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
            updateLightbox();
        });

        lightboxNext.addEventListener('click', function() {
            currentIndex = (currentIndex + 1) % currentImages.length;
            updateLightbox();
        });

        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            if (!lightboxModal.classList.contains('show')) return;

            if (e.key === 'ArrowLeft') {
                currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
                updateLightbox();
            } else if (e.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % currentImages.length;
                updateLightbox();
            }
        });
    }

    // ============================================
    // Initialize on DOM Ready
    // ============================================
    document.addEventListener('DOMContentLoaded', function() {
        initTheme();
        toggleTheme();
        initStickyHeader();
        initSmoothScroll();
        initTooltips();
        initProjectSliders();
        initTimelineAnimation();
        initImageLightbox();
    });

    // Initialize theme immediately (before DOM ready) to prevent flash
    initTheme();

})();
