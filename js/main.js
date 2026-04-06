/**
 * Portfolio Main JavaScript
 * Theme toggle, scroll effects, and navigation
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
    // Image Lightbox for Project Cards
    // ============================================
    function initImageLightbox() {
        const projectImages = document.querySelectorAll('#projects .card-head img');
        const lightboxModal = document.getElementById('imageLightbox');
        const lightboxImage = document.getElementById('lightboxImage');
        const lightboxTitle = document.getElementById('imageLightboxLabel');

        if (!lightboxModal || !projectImages.length) return;

        const modal = new bootstrap.Modal(lightboxModal);

        projectImages.forEach(function(img) {
            // Add cursor pointer to indicate clickable
            img.style.cursor = 'zoom-in';

            img.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                // Get the project title from the card
                const card = this.closest('.card');
                const title = card ? card.querySelector('.card-title')?.textContent : '';

                // Set modal content
                lightboxImage.src = this.src;
                lightboxImage.alt = this.alt;
                lightboxTitle.textContent = title;

                // Show modal
                modal.show();
            });
        });

        // Close modal when clicking on the image
        lightboxImage.addEventListener('click', function() {
            modal.hide();
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
        initImageLightbox();
    });

    // Initialize theme immediately (before DOM ready) to prevent flash
    initTheme();

})();
