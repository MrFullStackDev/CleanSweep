// ===================================
// CleanSweep Website Interactive Script
// Minimal JavaScript for scroll animations and interactions
// ===================================

(function() {
    'use strict';

    // ===================================
    // Intersection Observer for Fade-in Animations
    // ===================================
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const fadeInObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add staggered delay for multiple elements
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with fade-in-up class
    const fadeInElements = document.querySelectorAll('.fade-in-up');
    fadeInElements.forEach(element => {
        fadeInObserver.observe(element);
    });

    // ===================================
    // Smooth Scroll for Navigation Links
    // ===================================
    
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Only prevent default for same-page anchors
            if (href.startsWith('#') && href.length > 1) {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const navHeight = document.querySelector('.nav').offsetHeight;
                    const targetPosition = targetElement.offsetTop - navHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ===================================
    // Navigation Background on Scroll
    // ===================================
    
    const nav = document.querySelector('.nav');
    let lastScrollY = window.scrollY;
    
    function updateNavOnScroll() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 50) {
            nav.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            nav.style.boxShadow = 'none';
        }
        
        lastScrollY = currentScrollY;
    }

    // Throttle scroll event for better performance
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        
        scrollTimeout = window.requestAnimationFrame(() => {
            updateNavOnScroll();
        });
    }, { passive: true });

    // ===================================
    // Feature Cards Tilt Effect (Optional Enhancement)
    // ===================================
    
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'all 0.3s ease-in-out';
        });
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ===================================
    // Button Ripple Effect
    // ===================================
    
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            // Add ripple styles
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.background = 'rgba(255, 255, 255, 0.6)';
            ripple.style.transform = 'scale(0)';
            ripple.style.animation = 'ripple-animation 0.6s ease-out';
            ripple.style.pointerEvents = 'none';
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // Add ripple animation keyframes dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // ===================================
    // Floating Badges Animation Enhancement
    // ===================================
    
    const floatingBadges = document.querySelectorAll('.floating-badge');
    
    floatingBadges.forEach((badge, index) => {
        // Add random slight rotation and movement
        setInterval(() => {
            const randomX = Math.random() * 10 - 5;
            const randomY = Math.random() * 10 - 5;
            const randomRotate = Math.random() * 4 - 2;
            
            badge.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg)`;
        }, 3000 + index * 1000);
    });

    // ===================================
    // Tech Badges Shuffle Animation
    // ===================================
    
    const techBadges = document.querySelectorAll('.tech-badge');
    
    techBadges.forEach((badge, index) => {
        badge.style.animationDelay = `${index * 0.1}s`;
        badge.style.opacity = '0';
        badge.style.animation = 'fadeIn 0.5s ease-out forwards';
    });

    // ===================================
    // Performance Optimization: Lazy Load Images (if any added)
    // ===================================
    
    if ('loading' in HTMLImageElement.prototype) {
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }

    // ===================================
    // Accessibility: Keyboard Navigation Enhancement
    // ===================================
    
    document.addEventListener('keydown', (e) => {
        // Skip to main content with '/' key
        if (e.key === '/') {
            e.preventDefault();
            const hero = document.querySelector('.hero');
            if (hero) {
                hero.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });

    // ===================================
    // Console Easter Egg
    // ===================================
    
    console.log(
        '%c🧹 CleanSweep',
        'font-size: 24px; font-weight: bold; color: #8B5CF6; text-shadow: 2px 2px 4px rgba(139, 92, 246, 0.3);'
    );
    console.log(
        '%cLike what you see? Check out the code on GitHub!',
        'font-size: 14px; color: #A78BFA;'
    );
    console.log(
        '%chttps://github.com/MrFullStackDev/CleanSweep',
        'font-size: 12px; color: #4B5563;'
    );

    // ===================================
    // Analytics Event Tracking (Placeholder)
    // ===================================
    
    // Track CTA button clicks
    const ctaButtons = document.querySelectorAll('.btn-primary');
    ctaButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Placeholder for analytics
            console.log('CTA clicked:', button.textContent.trim());
            
            // You can integrate Google Analytics, Plausible, or other analytics here
            // Example: gtag('event', 'click', { event_category: 'CTA', event_label: button.textContent });
        });
    });

    // ===================================
    // Initialize on Page Load
    // ===================================
    
    console.log('✅ CleanSweep website initialized');
    
    // Add loaded class to body for CSS transitions
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    // ===================================
    // Service Worker Registration (Optional)
    // ===================================
    
    // Uncomment if you want to make this a PWA
    /*
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered:', registration);
                })
                .catch(error => {
                    console.log('SW registration failed:', error);
                });
        });
    }
    */

})();

