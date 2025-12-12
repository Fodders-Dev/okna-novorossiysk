/**
 * Main JavaScript entry point
 * Лендинг «Окна и двери в Новороссийске»
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initHeader();
    initMobileMenu();
    initSmoothScroll();
    initFAQ();
    initContactForm();
    initCalculator();
    initReviewsCarousel();
});

/**
 * Theme switching (light/dark mode)
 * - Detects system preference
 * - Saves user choice to localStorage
 * - Provides manual toggle
 */
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;

    // Get saved theme or detect system preference
    const getSavedTheme = () => localStorage.getItem('theme');
    const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    // Apply theme
    const applyTheme = (theme) => {
        root.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    };

    // Initialize theme
    const savedTheme = getSavedTheme();
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme(getSystemTheme());
    }

    // Toggle theme on button click
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = root.getAttribute('data-theme') || getSystemTheme();
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        if (!getSavedTheme()) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
}

/**
 * Header scroll behavior
 */
function initHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
}

/**
 * Mobile menu toggle
 */
function initMobileMenu() {
    const burger = document.getElementById('burger');
    const mobileMenu = document.getElementById('mobile-menu');

    if (!burger || !mobileMenu) return;

    const toggleMenu = () => {
        burger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    };

    burger.addEventListener('click', toggleMenu);

    // Close menu on link click
    const menuLinks = mobileMenu.querySelectorAll('.mobile-menu__link');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const headerHeight = document.getElementById('header')?.offsetHeight || 0;
            const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/**
 * FAQ accordion
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq__item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq__question');
        if (!question) return;

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq__question')?.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current item
            item.classList.toggle('active');
            question.setAttribute('aria-expanded', !isActive);
        });
    });
}

/**
 * Contact form handling
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = form.querySelector('.contact-form__submit');
        const originalText = submitBtn.textContent;

        // Disable button
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправка...';

        // Get form data
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            message: formData.get('message')
        };

        // Simulate form submission (replace with actual backend call)
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Show success message
            showFormMessage(form, 'Заявка отправлена! Мы свяжемся с вами в течение часа.', 'success');
            form.reset();

        } catch (error) {
            // Show error message
            showFormMessage(form, 'Произошла ошибка. Попробуйте позвонить напрямую.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

/**
 * Show form message
 */
function showFormMessage(form, text, type) {
    // Remove existing message
    const existingMessage = form.querySelector('.contact-form__message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create new message
    const message = document.createElement('div');
    message.className = `contact-form__message contact-form__message--${type}`;
    message.textContent = text;

    // Insert at the beginning of the form
    form.insertBefore(message, form.firstChild);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        message.remove();
    }, 5000);
}

/**
 * Price Calculator
 */
function initCalculator() {
    const openBtn = document.getElementById('open-calculator');
    const closeBtn = document.getElementById('close-calculator');
    const modal = document.getElementById('calculator-modal');
    const overlay = modal?.querySelector('.modal__overlay');
    const form = document.getElementById('calculator-form');
    const resultEl = document.getElementById('calc-result');
    const orderBtn = document.getElementById('calc-order');

    if (!modal || !form) return;

    // Price configuration
    const prices = {
        service: { window: 3000, door: 4000, balcony: 8000 },
        size: { small: 0, medium: 1000, large: 2000 },
        extras: { sill: 800, slopes: 1500, mosquito: 1200, dismount: 1000 }
    };

    // Open modal
    openBtn?.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close modal
    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    closeBtn?.addEventListener('click', closeModal);
    overlay?.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Counter buttons
    const counterBtns = form.querySelectorAll('.calculator__counter-btn');
    const quantityInput = form.querySelector('[name="quantity"]');

    counterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            let value = parseInt(quantityInput.value) || 1;

            if (action === 'plus' && value < 20) {
                value++;
            } else if (action === 'minus' && value > 1) {
                value--;
            }

            quantityInput.value = value;
            calculatePrice();
        });
    });

    // Calculate price on any change
    const calculatePrice = () => {
        const service = form.querySelector('[name="service"]:checked')?.value || 'window';
        const size = form.querySelector('[name="size"]:checked')?.value || 'small';
        const quantity = parseInt(quantityInput.value) || 1;
        const extras = Array.from(form.querySelectorAll('[name="extras"]:checked'))
            .map(el => el.value);

        let total = prices.service[service] + prices.size[size];
        extras.forEach(extra => {
            total += prices.extras[extra] || 0;
        });

        total *= quantity;

        resultEl.textContent = `от ${total.toLocaleString('ru-RU')} ₽`;
    };

    // Add listeners for all inputs
    form.querySelectorAll('input').forEach(input => {
        input.addEventListener('change', calculatePrice);
    });

    quantityInput.addEventListener('input', calculatePrice);

    // Order button -> scroll to contacts
    orderBtn?.addEventListener('click', () => {
        closeModal();
        const contacts = document.getElementById('contacts');
        if (contacts) {
            const headerHeight = document.getElementById('header')?.offsetHeight || 0;
            const targetPosition = contacts.getBoundingClientRect().top + window.scrollY - headerHeight;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    });

    // Initial calculation
    calculatePrice();
}

/**
 * Reviews Carousel - Drag to scroll
 */
function initReviewsCarousel() {
    const carousel = document.querySelector('.reviews-carousel');
    const track = carousel?.querySelector('.reviews-carousel__track');

    if (!carousel || !track) return;

    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;
    let animationPaused = false;

    // Pause animation while dragging
    const pauseAnimation = () => {
        if (!animationPaused) {
            carousel.classList.add('dragging');
            animationPaused = true;
        }
    };

    const resumeAnimation = () => {
        // Resume after a short delay
        setTimeout(() => {
            carousel.classList.remove('dragging');
            animationPaused = false;
        }, 3000);
    };

    // Mouse events
    carousel.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
        pauseAnimation();
    });

    carousel.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            resumeAnimation();
        }
    });

    carousel.addEventListener('mouseup', () => {
        isDragging = false;
        resumeAnimation();
    });

    carousel.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
    });

    // Touch events for mobile
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
        pauseAnimation();
    }, { passive: true });

    carousel.addEventListener('touchend', () => {
        resumeAnimation();
    });

    carousel.addEventListener('touchmove', (e) => {
        const x = e.touches[0].pageX - carousel.offsetLeft;
        const walk = (x - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
    }, { passive: true });
}
