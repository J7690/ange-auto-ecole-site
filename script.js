// Enregistrement du Service Worker (mode application / PWA)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {
            // échec silencieux : le site continue de fonctionner normalement sans mode hors-ligne
        });
    });
}

// Mobile Navigation Toggle
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');

burger.addEventListener('click', () => {
    nav.classList.toggle('active');
    
    // Burger animation
    burger.classList.toggle('toggle');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            nav.classList.remove('active');
        }
    });
});

// Formulaire de pre-inscription : retour visuel pendant l'envoi.
// L'envoi lui-meme est traite par Netlify Forms (attribut data-netlify),
// puis le visiteur est redirige vers merci.html.
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function () {
        const bouton = this.querySelector('button[type="submit"]');
        if (bouton) {
            bouton.disabled = true;
            bouton.textContent = 'Envoi en cours...';
        }
    });
}

// Add scroll effect to navbar
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    } else {
        navbar.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    }
});

// Add animation on scroll for service cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Observe category cards
document.querySelectorAll('.category-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Carousel Functionality
let currentSlideIndex = 0;
let totalSlides = 3;
let autoSlideInterval;

function showSlide(index) {
    const slide = document.getElementById('carouselSlide');
    const dots = document.querySelectorAll('.dot');
    
    if (!slide) return;
    
    // Get actual number of slides
    const slides = slide.children;
    totalSlides = slides.length;
    
    if (totalSlides === 0) return;
    
    // Handle wrap-around
    if (index >= totalSlides) {
        currentSlideIndex = 0;
    } else if (index < 0) {
        currentSlideIndex = totalSlides - 1;
    } else {
        currentSlideIndex = index;
    }
    
    // Move the slide
    slide.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    
    // Update dots if they exist
    if (dots.length > 0) {
        dots.forEach((dot, i) => {
            dot.classList.remove('active');
            if (i === currentSlideIndex) {
                dot.classList.add('active');
            }
        });
    }
}

function moveSlide(direction) {
    showSlide(currentSlideIndex + direction);
    resetAutoSlide();
}

function currentSlide(index) {
    showSlide(index - 1);
    resetAutoSlide();
}

function autoSlide() {
    showSlide(currentSlideIndex + 1);
}

function startAutoSlide() {
    autoSlideInterval = setInterval(autoSlide, 5000); // Change slide every 5 seconds
}

function resetAutoSlide() {
    clearInterval(autoSlideInterval);
    startAutoSlide();
}

// Initialize carousel
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize carousel if elements exist
    const carouselSlide = document.getElementById('carouselSlide');
    const carouselContainer = document.querySelector('.carousel-container');
    
    if (carouselSlide && carouselContainer) {
        // Try to load images from assets/images/
        loadCarouselImages();
        
        // Pause auto-slide on hover
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(autoSlideInterval);
        });
        
        carouselContainer.addEventListener('mouseleave', () => {
            startAutoSlide();
        });
    }
    
    // Load logo
    loadLogo();
});

function loadLogo() {
    const logoImg = document.querySelector('.logo-img');
    const footerLogo = document.querySelector('.footer-logo');
    
    if (logoImg) {
        logoImg.onerror = function() {
            this.style.display = 'none';
        };
    }
    
    if (footerLogo) {
        footerLogo.onerror = function() {
            this.style.display = 'none';
        };
    }
}

function showPlaceholder() {
    const carouselSlide = document.getElementById('carouselSlide');
    if (!carouselSlide) return;
    
    carouselSlide.innerHTML = `
        <div class="carousel-image-placeholder">
            <span>🚗 Image 1 - Formation conduite</span>
        </div>
        <div class="carousel-image-placeholder">
            <span>👨‍🏫 Image 2 - Instructeurs qualifiés</span>
        </div>
        <div class="carousel-image-placeholder">
            <span>🚘 Image 3 - Véhicules modernes</span>
        </div>
    `;
    updateDots(3);
}

function loadCarouselImages() {
    const carouselSlide = document.getElementById('carouselSlide');
    
    if (!carouselSlide) return;
    
    // Start with placeholders
    showPlaceholder();
    
    // Initialize carousel with placeholders
    showSlide(0);
    startAutoSlide();
    
    // Try to load images with different naming patterns
    const imagePatterns = [
        'assets/images/Image1_ANGE.jpeg',
        'assets/images/Image2_ANGE.jpeg',
        'assets/images/Image3_ANGE.jpeg',
        'assets/images/Image4_ANGE.jpeg',
        'assets/images/Image5_ANGE.jpeg',
        'assets/images/Image6_ANGE.jpeg',
        'assets/images/Image7_ANGE.jpeg',
        'assets/images/Image8_ANGE.jpeg',
        'assets/images/image1.jpg',
        'assets/images/image2.jpg',
        'assets/images/image3.jpg',
        'assets/images/image4.jpg',
        'assets/images/image5.jpg'
    ];
    
    const foundImages = [];
    let loadedCount = 0;
    
    function tryLoadImage() {
        if (loadedCount >= imagePatterns.length) {
            // All images checked
            if (foundImages.length > 0) {
                // Stop auto-slide temporarily
                clearInterval(autoSlideInterval);
                
                // Replace placeholders with real images
                replacePlaceholders(foundImages);
                updateDots(foundImages.length);
                
                // Restart carousel with new slides
                currentSlideIndex = 0;
                showSlide(0);
                startAutoSlide();
            }
            return;
        }
        
        const url = imagePatterns[loadedCount];
        const img = new Image();
        
        img.onload = function() {
            foundImages.push(url);
            loadedCount++;
            tryLoadImage();
        };
        
        img.onerror = function() {
            loadedCount++;
            tryLoadImage();
        };
        
        img.src = url;
    }
    
    tryLoadImage();
}

function updateDots(count) {
    const carouselDots = document.getElementById('carouselDots');
    if (!carouselDots) return;
    
    carouselDots.innerHTML = '';
    
    for (let i = 1; i <= count; i++) {
        const dot = document.createElement('span');
        dot.className = 'dot';
        dot.onclick = function() { currentSlide(i); };
        carouselDots.appendChild(dot);
    }
}

function replacePlaceholders(imageUrls) {
    const carouselSlide = document.getElementById('carouselSlide');
    
    if (!carouselSlide) return;
    
    // Clear existing content
    carouselSlide.innerHTML = '';
    
    // Add real images
    imageUrls.forEach((url, index) => {
        const img = document.createElement('img');
        img.src = url;
        img.alt = `Ange Auto-École - Image ${index + 1}`;
        img.className = 'carousel-image';
        carouselSlide.appendChild(img);
    });
}