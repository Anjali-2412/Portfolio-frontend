document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your actual EmailJS public key

    // Theme Toggle Functionality
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference, otherwise use dark mode as default
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        // Set dark mode as default
        htmlElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }

    // Theme toggle button click handler
    themeToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // Scroll reveal animation
    const revealElements = document.querySelectorAll('.project-item, .education-item, .experience-card');
    
    function revealOnScroll() {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('revealed');
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Initial check

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

                // Update active nav link
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });

    // Progress bar for scroll position
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = `${scrolled}%`;
    });

    // Add active class to navigation links based on scroll position
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Handle contact form submission
    const contactForm = document.getElementById('contact-form');
    console.log('Contact form found:', contactForm); // Debug log

    if (contactForm) {
        contactForm.addEventListener('submit', handleSubmit);
        console.log('Submit event listener added'); // Debug log
    }

    // Add hover effect to project cards
    const projectItems = document.querySelectorAll('.project-item');
    projectItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 2px 5px var(--shadow-color)';
        });
    });

    // Add particle background effect
    createParticleBackground();

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNavLinks = document.querySelector('.nav-links');
    const menuIcon = mobileMenuBtn.querySelector('i');
    let isMenuOpen = false;

    function toggleMenu(show) {
        isMenuOpen = show;
        mobileNavLinks.classList.toggle('active', show);
        mobileMenuBtn.setAttribute('aria-expanded', show);
        document.body.classList.toggle('menu-open', show);
        
        // Toggle menu icon
        menuIcon.classList.toggle('fa-bars', !show);
        menuIcon.classList.toggle('fa-times', show);

        // Animate menu items
        const menuItems = mobileNavLinks.querySelectorAll('li');
        menuItems.forEach((item, index) => {
            if (show) {
                item.style.transitionDelay = `${0.1 * (index + 1)}s`;
            } else {
                item.style.transitionDelay = '0s';
            }
        });
    }

    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu(!isMenuOpen);
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !mobileMenuBtn.contains(e.target) && !mobileNavLinks.contains(e.target)) {
            toggleMenu(false);
        }
    });

    // Close mobile menu when clicking on a link
    mobileNavLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu(false);
        });
    });

    // Close mobile menu on resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && isMenuOpen) {
            toggleMenu(false);
        }
    });

    // Handle scroll position for smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                // Add offset for fixed header
                const headerOffset = 70;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update active nav link
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });

    // Update active menu item on scroll
    window.addEventListener('scroll', () => {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
});

// Track form submission state
let isSubmitting = false;

// Contact Form Handler
function handleSubmit(event) {
    event.preventDefault();
    
    // Get form and message elements
    const form = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    // Show thank you message
    formStatus.innerHTML = `
        <div class="success-message">
            <i class="fas fa-check-circle"></i>
            <h3>Thank you for reaching out!</h3>
            <p>We will get back to you soon.</p>
        </div>
    `;
    formStatus.style.display = 'block';
    
    // Reset the form
    form.reset();
    
    // Hide message after 5 seconds
    setTimeout(() => {
        formStatus.style.display = 'none';
    }, 5000);
}

// Particle background effect
function createParticleBackground() {
    const canvas = document.createElement('canvas');
    canvas.className = 'particle-background';
    document.body.insertBefore(canvas, document.body.firstChild);

    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = 'rgba(52, 152, 219, 0.2)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const numberOfParticles = Math.floor((canvas.width * canvas.height) / 10000);
        for (let i = 0; i < numberOfParticles; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
} 