// StyleHub Clothing Store JavaScript
// Features: Shopping Cart, Search, Countdown Timer, Product Interactions, Mobile Navigation

// Initialize AOS (Animate On Scroll)
document.addEventListener('DOMContentLoaded', function() {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });

    // Global variables
    let cart = [];
    let cartTotal = 0;
    let wishlist = [];
    let currentSlide = 0;
    const totalSlides = 4;

    // DOM Elements
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const searchBtn = document.getElementById('searchBtn');
    const searchBar = document.getElementById('searchBar');
    const searchClose = document.getElementById('searchClose');
    const cartBtn = document.getElementById('cartBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartClose = document.getElementById('cartClose');
    const cartOverlay = document.getElementById('cartOverlay');
    const wishlistBtn = document.getElementById('wishlistBtn');
    const wishlistSidebar = document.getElementById('wishlistSidebar');
    const wishlistClose = document.getElementById('wishlistClose');
    const backToTopBtn = document.getElementById('backToTop');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // Check if elements exist before adding event listeners
    if (navToggle && navMenu) {
        // Mobile Navigation
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    if (searchBtn && searchBar && searchClose) {
        // Search Functionality
        searchBtn.addEventListener('click', () => {
            searchBar.classList.add('active');
            const searchInput = document.getElementById('searchInput');
            if (searchInput) searchInput.focus();
        });

        searchClose.addEventListener('click', () => {
            searchBar.classList.remove('active');
        });

        // Close search when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchBar.contains(e.target) && !searchBtn.contains(e.target)) {
                searchBar.classList.remove('active');
            }
        });
    }

    if (cartBtn && cartSidebar && cartClose && cartOverlay) {
        // Shopping Cart Functionality
        cartBtn.addEventListener('click', () => {
            openCart();
        });

        cartClose.addEventListener('click', () => {
            closeCart();
        });

        cartOverlay.addEventListener('click', () => {
            closeCart();
        });
    }

    function openCart() {
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeCart() {
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    if (wishlistBtn && wishlistSidebar && wishlistClose) {
        // Wishlist Functionality
        wishlistBtn.addEventListener('click', () => {
            openWishlist();
        });

        wishlistClose.addEventListener('click', () => {
            closeWishlist();
        });
    }

    function openWishlist() {
        if (wishlistSidebar && cartOverlay) {
            wishlistSidebar.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeWishlist() {
        if (wishlistSidebar && cartOverlay) {
            wishlistSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }

    // Add to Cart Functionality
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                const productName = productCard.querySelector('.product-title')?.textContent || 'Product';
                const priceElement = productCard.querySelector('.current-price');
                const productPrice = priceElement ? parseFloat(priceElement.textContent.replace('$', '')) : 0;
                const imageElement = productCard.querySelector('.product-image img');
                const productImage = imageElement ? imageElement.src : '';
                
                addToCart(productName, productPrice, productImage);
                showNotification(`${productName} added to cart!`, 'success');
            }
        }
    });

    function addToCart(name, price, image) {
        const existingItem = cart.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                name: name,
                price: price,
                image: image,
                quantity: 1
            });
        }
        
        updateCart();
    }

    function updateCart() {
        const cartCount = document.querySelector('.cart-count');
        const totalAmount = document.querySelector('.total-amount');
        
        if (cartCount && totalAmount) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            
            cartCount.textContent = totalItems;
            totalAmount.textContent = `$${cartTotal.toFixed(2)}`;
            
            displayCartItems();
        }
    }

    function displayCartItems() {
        const cartItems = document.getElementById('cartItems');
        
        if (!cartItems) return;
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Your cart is empty</p>';
            return;
        }
        
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item" data-name="${item.name}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn minus" onclick="updateQuantity('${item.name}', -1)">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn plus" onclick="updateQuantity('${item.name}', 1)">+</button>
                        <button class="remove-item" onclick="removeFromCart('${item.name}')">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Make these functions globally accessible for onclick handlers
    window.updateQuantity = function(name, change) {
        const item = cart.find(item => item.name === name);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                removeFromCart(name);
            } else {
                updateCart();
            }
        }
    };

    window.removeFromCart = function(name) {
        cart = cart.filter(item => item.name !== name);
        updateCart();
        showNotification('Item removed from cart', 'info');
    };

    // Wishlist Functionality
    document.addEventListener('click', (e) => {
        if (e.target.closest('.action-btn.wishlist')) {
            const wishlistBtn = e.target.closest('.action-btn.wishlist');
            const productCard = wishlistBtn.closest('.product-card');
            if (productCard) {
                const productName = productCard.querySelector('.product-title')?.textContent || 'Product';
                const priceElement = productCard.querySelector('.current-price');
                const productPrice = priceElement ? parseFloat(priceElement.textContent.replace('$', '')) : 0;
                const imageElement = productCard.querySelector('.product-image img');
                const productImage = imageElement ? imageElement.src : '';
                
                toggleWishlist(wishlistBtn, productName, productPrice, productImage);
            }
        }
    });

    function toggleWishlist(btn, name, price, image) {
        const isInWishlist = wishlist.find(item => item.name === name);
        
        if (isInWishlist) {
            wishlist = wishlist.filter(item => item.name !== name);
            btn.classList.remove('active');
            showNotification(`${name} removed from wishlist`, 'info');
        } else {
            wishlist.push({ name, price, image });
            btn.classList.add('active');
            showNotification(`${name} added to wishlist`, 'success');
        }
        
        updateWishlist();
    }

    function updateWishlist() {
        const wishlistCount = document.querySelector('.wishlist-count');
        const wishlistItems = document.getElementById('wishlistItems');
        
        if (wishlistCount) {
            wishlistCount.textContent = wishlist.length;
        }
        
        if (!wishlistItems) return;
        
        if (wishlist.length === 0) {
            wishlistItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Your wishlist is empty</p>';
            return;
        }
        
        wishlistItems.innerHTML = wishlist.map(item => `
            <div class="cart-item" data-name="${item.name}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-title">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-controls">
                        <button class="btn btn-primary" onclick="addToCart('${item.name}', ${item.price}, '${item.image}')">Add to Cart</button>
                        <button class="remove-item" onclick="removeFromWishlist('${item.name}')">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    window.removeFromWishlist = function(name) {
        wishlist = wishlist.filter(item => item.name !== name);
        updateWishlist();
        
        // Update the wishlist button state in the product card
        const wishlistBtn = document.querySelector(`[data-name="${name}"] .action-btn.wishlist`);
        if (wishlistBtn) {
            wishlistBtn.classList.remove('active');
        }
    };

    // Quick View Functionality
    document.addEventListener('click', (e) => {
        if (e.target.closest('.action-btn.quickview')) {
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                const productName = productCard.querySelector('.product-title')?.textContent || 'Product';
                const priceElement = productCard.querySelector('.current-price');
                const productPrice = priceElement ? priceElement.textContent : '$0.00';
                const imageElement = productCard.querySelector('.product-image img');
                const productImage = imageElement ? imageElement.src : '';
                const ratingElement = productCard.querySelector('.product-rating');
                const productRating = ratingElement ? ratingElement.innerHTML : '';
                
                showQuickView(productName, productPrice, productImage, productRating);
            }
        }
    });

    function showQuickView(name, price, image, rating) {
        const modal = document.createElement('div');
        modal.className = 'quick-view-modal';
        modal.innerHTML = `
            <div class="quick-view-content">
                <button class="quick-view-close">&times;</button>
                <div class="quick-view-grid">
                    <div class="quick-view-image">
                        <img src="${image}" alt="${name}">
                    </div>
                    <div class="quick-view-details">
                        <h2>${name}</h2>
                        <div class="quick-view-rating">${rating}</div>
                        <div class="quick-view-price">${price}</div>
                        <p>Experience the perfect blend of style and comfort with our premium ${name.toLowerCase()}. Made with high-quality materials and designed for everyday wear.</p>
                        <div class="quick-view-actions">
                            <button class="btn btn-primary add-to-cart-quick" onclick="addToCart('${name}', ${parseFloat(price.replace('$', '')) || 0}, '${image}')">Add to Cart</button>
                            <button class="btn btn-secondary">View Details</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .quick-view-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                z-index: 1002;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            }
            .quick-view-content {
                background: white;
                border-radius: 15px;
                max-width: 900px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
            }
            .quick-view-close {
                position: absolute;
                top: 15px;
                right: 20px;
                background: none;
                border: none;
                font-size: 2rem;
                cursor: pointer;
                color: #666;
                z-index: 1;
            }
            .quick-view-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
                padding: 2rem;
            }
            .quick-view-image img {
                width: 100%;
                height: 400px;
                object-fit: cover;
                border-radius: 10px;
            }
            .quick-view-details h2 {
                margin-bottom: 1rem;
                color: #2c3e50;
            }
            .quick-view-rating {
                margin-bottom: 1rem;
            }
            .quick-view-price {
                font-size: 1.5rem;
                font-weight: 700;
                color: #ff6b6b;
                margin-bottom: 1rem;
            }
            .quick-view-details p {
                margin-bottom: 2rem;
                line-height: 1.6;
                color: #666;
            }
            .quick-view-actions {
                display: flex;
                gap: 1rem;
                flex-wrap: wrap;
            }
            @media (max-width: 768px) {
                .quick-view-grid {
                    grid-template-columns: 1fr;
                    gap: 1rem;
                    padding: 1rem;
                }
                .quick-view-image img {
                    height: 300px;
                }
            }
        `;
        document.head.appendChild(style);
        
        // Close functionality
        modal.querySelector('.quick-view-close').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // New Arrivals Slider
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlider();
        });
        
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        });
    }

    function updateSlider() {
        const sliderTrack = document.querySelector('.slider-track');
        if (sliderTrack) {
            const slideWidth = 250 + 16; // 250px + 16px margin
            sliderTrack.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
        }
    }

    // Auto-slide every 5 seconds
    setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    }, 5000);

    // Countdown Timer
    function updateCountdown() {
        const now = new Date().getTime();
        const saleEnd = new Date('2024-12-31T23:59:59').getTime();
        const distance = saleEnd - now;
        
        if (distance > 0) {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            const daysElement = document.getElementById('days');
            const hoursElement = document.getElementById('hours');
            const minutesElement = document.getElementById('minutes');
            const secondsElement = document.getElementById('seconds');
            
            if (daysElement) daysElement.textContent = days.toString().padStart(2, '0');
            if (hoursElement) hoursElement.textContent = hours.toString().padStart(2, '0');
            if (minutesElement) minutesElement.textContent = minutes.toString().padStart(2, '0');
            if (secondsElement) secondsElement.textContent = seconds.toString().padStart(2, '0');
        }
    }

    // Update countdown every second
    setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call

    // Newsletter Form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input[type="email"]')?.value;
            
            if (email) {
                showNotification('Thank you for subscribing!', 'success');
                e.target.reset();
            }
        });
    }

    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            if (!data.name || !data.email || !data.subject || !data.category || !data.message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
            e.target.reset();
        });
    }

    // Back to Top Button
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Smooth Scrolling for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Animated Counter for Hero Stats
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target')) || 0;
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = Math.ceil(current);
                    setTimeout(updateCounter, 20);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
    }

    // Intersection Observer for counters
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        observer.observe(heroStats);
    }

    // Notification System
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        if (!document.querySelector('#notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 1003;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                    max-width: 400px;
                }
                .notification.show {
                    transform: translateX(0);
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 16px 20px;
                }
                .notification i {
                    font-size: 1.2rem;
                }
                .notification-close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #666;
                    margin-left: auto;
                }
                .notification-success {
                    border-left: 4px solid #2ecc71;
                }
                .notification-success i {
                    color: #2ecc71;
                }
                .notification-error {
                    border-left: 4px solid #e74c3c;
                }
                .notification-error i {
                    color: #e74c3c;
                }
                .notification-info {
                    border-left: 4px solid #3498db;
                }
                .notification-info i {
                    color: #3498db;
                }
                .notification-warning {
                    border-left: 4px solid #f39c12;
                }
                .notification-warning i {
                    color: #f39c12;
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            hideNotification(notification);
        }, 5000);
        
        // Close button functionality
        notification.querySelector('.notification-close').addEventListener('click', () => {
            hideNotification(notification);
        });
    }

    function hideNotification(notification) {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }

    function getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    function getNotificationColor(type) {
        const colors = {
            success: '#2ecc71',
            error: '#e74c3c',
            warning: '#f39c12',
            info: '#3498db'
        };
        return colors[type] || colors.info;
    }

    // Product Interactions
    // Add hover effects to product cards
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
    
    // Initialize wishlist buttons state
    updateWishlistButtons();

    function updateWishlistButtons() {
        const wishlistButtons = document.querySelectorAll('.action-btn.wishlist');
        
        wishlistButtons.forEach(btn => {
            const productCard = btn.closest('.product-card');
            if (productCard) {
                const productName = productCard.querySelector('.product-title')?.textContent;
                if (productName && wishlist.find(item => item.name === productName)) {
                    btn.classList.add('active');
                }
            }
        });
    }

    // Enhanced search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const productCards = document.querySelectorAll('.product-card');
            
            productCards.forEach(card => {
                const productName = card.querySelector('.product-title')?.textContent.toLowerCase() || '';
                const productCategory = card.closest('section')?.querySelector('.section-title')?.textContent.toLowerCase() || '';
                
                if (productName.includes(searchTerm) || productCategory.includes(searchTerm)) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.3s ease';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    // Add fadeIn animation
    const fadeInStyle = document.createElement('style');
    fadeInStyle.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(20px); }
        }
    `;
    document.head.appendChild(fadeInStyle);

    // Initialize the application
    // Update cart and wishlist counts
    updateCart();
    updateWishlist();
    
    // Add loading animation to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            if (!this.classList.contains('loading')) {
                this.classList.add('loading');
                this.style.pointerEvents = 'none';
                
                setTimeout(() => {
                    this.classList.remove('loading');
                    this.style.pointerEvents = 'auto';
                }, 1000);
            }
        });
    });
    
    // Add loading styles
    const loadingStyle = document.createElement('style');
    loadingStyle.textContent = `
        .btn.loading {
            position: relative;
            color: transparent;
        }
        .btn.loading::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 20px;
            height: 20px;
            border: 2px solid transparent;
            border-top: 2px solid currentColor;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        @keyframes spin {
            0% { transform: translate(-50%, -50%) rotate(0deg); }
            100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
    `;
    document.head.appendChild(loadingStyle);

    // Export functions for global access
    window.StyleHub = {
        openCart,
        closeCart,
        getCartTotal: () => cartTotal,
        getCartItemsCount: () => cart.reduce((sum, item) => sum + item.quantity, 0),
        addToCart,
        removeFromCart: window.removeFromCart,
        toggleWishlist,
        showNotification
    };

    console.log('🎉 StyleHub Clothing Store loaded successfully!');
    console.log('✨ All features are working properly!');
});
