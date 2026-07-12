// ===== Mobile Menu Toggle =====
function initMobileMenu() {
    const toggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (toggle && mobileMenu) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

// ===== Quick Link Navigation =====
function initQuickLinks() {
    const quickLinks = document.querySelectorAll('.quick-link');

    quickLinks.forEach(link => {
        link.addEventListener('click', () => {
            const target = link.dataset.link;
            if (target) {
                window.location.href = `${target}.html`;
            }
        });
    });
}

// ===== Interactive Cards (About Page) =====
function initInteractiveCards() {
    // Support for old interactive-card style
    const oldCards = document.querySelectorAll('.interactive-card');
    oldCards.forEach(card => {
        card.addEventListener('click', () => {
            oldCards.forEach(c => {
                if (c !== card) {
                    c.classList.remove('active');
                }
            });
            card.classList.toggle('active');
        });
    });

    // New accordion style
    const accordionItems = document.querySelectorAll('.accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        if (header) {
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all items
                accordionItems.forEach(otherItem => {
                    otherItem.classList.remove('active');
                });

                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
}

// ===== Cube Grid Animation with Enhanced Wave Propagation =====
function initCubeGrid() {
    const grid = document.querySelector('[data-cube-grid]');
    if (!grid) return;

    const rows = 5;
    const cols = 5;
    const cubes = [];

    // Create cube grid
    for (let i = 0; i < rows; i++) {
        const row = document.createElement('div');
        row.className = 'cube-row';

        for (let j = 0; j < cols; j++) {
            const cube = document.createElement('div');
            cube.className = 'cube';
            cube.dataset.row = i;
            cube.dataset.col = j;

            const inner = document.createElement('div');
            inner.className = 'cube-inner';

            // Create 6 faces for each cube
            const faces = ['front', 'back', 'left', 'right', 'top', 'bottom'];
            faces.forEach(face => {
                const faceEl = document.createElement('div');
                faceEl.className = `cube-face ${face}`;
                inner.appendChild(faceEl);
            });

            cube.appendChild(inner);
            cubes.push(cube);
            row.appendChild(cube);
        }

        grid.appendChild(row);
    }

    // Smooth mouse wave effect with ripple propagation
    let lastWaveTime = 0;
    const waveThrottle = 50; // ms between waves

    grid.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastWaveTime < waveThrottle) return;
        lastWaveTime = now;

        const rect = grid.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        cubes.forEach(cube => {
            const cubeX = parseInt(cube.dataset.col) * 48 + 24;
            const cubeY = parseInt(cube.dataset.row) * 48 + 24;

            const dist = Math.sqrt(
                Math.pow(mouseX - cubeX, 2) +
                Math.pow(mouseY - cubeY, 2)
            );

            const maxDist = 180;
            if (dist < maxDist) {
                const delay = (dist / maxDist) * 300; // 0-300ms delay based on distance

                setTimeout(() => {
                    cube.classList.add('wave');
                    setTimeout(() => {
                        cube.classList.remove('wave');
                    }, 350);
                }, delay);
            }
        });
    });

    // Add click effect - explosion ripple
    grid.addEventListener('click', (e) => {
        const rect = grid.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        cubes.forEach(cube => {
            const cubeX = parseInt(cube.dataset.col) * 48 + 24;
            const cubeY = parseInt(cube.dataset.row) * 48 + 24;

            const dist = Math.sqrt(
                Math.pow(clickX - cubeX, 2) +
                Math.pow(clickY - cubeY, 2)
            );

            const maxDist = 250;
            if (dist < maxDist) {
                const delay = (dist / maxDist) * 400;

                setTimeout(() => {
                    cube.classList.add('explode');
                    setTimeout(() => {
                        cube.classList.remove('explode');
                    }, 600);
                }, delay);
            }
        });
    });

    // Subtle random sparkle effect
    function randomSparkle() {
        const randomCube = cubes[Math.floor(Math.random() * cubes.length)];
        randomCube.classList.add('sparkle');
        setTimeout(() => {
            randomCube.classList.remove('sparkle');
        }, 800);
    }

    // Less frequent sparkle for subtlety
    setInterval(randomSparkle, 800);
}

// ===== Photo Lightbox =====
function initPhotoLightbox() {
    const photoGrid = document.getElementById('photoGrid');
    const photoLightbox = document.getElementById('photoLightbox');
    const lightboxPhoto = document.getElementById('lightboxPhoto');
    const lightboxClose = document.getElementById('lightboxClose');

    if (!photoGrid || !photoLightbox) return;

    // Photo array - easy to replace with new images
    const photos = [
        { src: '我的素材/摄影/微信图片_20260711105139_980_45.jpg', alt: 'Photography 1' },
        { src: '我的素材/摄影/微信图片_20260711105155_981_45.jpg', alt: 'Photography 2' },
        { src: '我的素材/摄影/微信图片_20260711105238_982_45.jpg', alt: 'Photography 3' },
        { src: '我的素材/摄影/微信图片_20260711105256_983_45.jpg', alt: 'Photography 4' },
        { src: '我的素材/摄影/微信图片_20260711105417_984_45.jpg', alt: 'Photography 5' },
        { src: '我的素材/摄影/微信图片_20260711105800_985_45.jpg', alt: 'Photography 6' }
    ];

    // Dynamically create photo cards
    photos.forEach(photo => {
        const photoCard = document.createElement('div');
        photoCard.className = 'photo-card';

        const img = document.createElement('img');
        img.src = photo.src;
        img.alt = photo.alt;

        photoCard.appendChild(img);
        photoGrid.appendChild(photoCard);

        // Add click event for lightbox
        photoCard.addEventListener('click', () => {
            lightboxPhoto.src = photo.src;
            lightboxPhoto.alt = photo.alt;
            photoLightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close lightbox
    lightboxClose.addEventListener('click', closePhotoLightbox);

    // Click overlay to close
    photoLightbox.addEventListener('click', (e) => {
        if (e.target === photoLightbox) {
            closePhotoLightbox();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && photoLightbox.classList.contains('active')) {
            closePhotoLightbox();
        }
    });

    function closePhotoLightbox() {
        photoLightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            lightboxPhoto.src = '';
        }, 300);
    }
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const elements = document.querySelectorAll(
        '.about-card, .skill-item, .project-card, .timeline-item, .quick-link'
    );

    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ===== Skill Bar Animation =====
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-fill');

    skillBars.forEach(bar => {
        const width = bar.style.getPropertyValue('--fill');
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 200);
    });
}

// ===== Navbar Scroll Effect =====
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');

    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(255, 250, 240, 0.95)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.05)';
            } else {
                navbar.style.background = 'rgba(255, 250, 240, 0.85)';
                navbar.style.boxShadow = 'none';
            }
        });
    }
}

// ===== Active Nav Link =====
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// ===== Typing Effect for Hero (optional enhancement) =====
function initTypingEffect() {
    const roles = document.querySelectorAll('.role-pill');
    roles.forEach((role, index) => {
        role.style.animationDelay = `${index * 0.15}s`;
    });
}

// ===== Projects Accordion with Horizontal Scroll Snap =====
function initProjectsAccordion() {
    const projectItems = document.querySelectorAll('.project-item');

    projectItems.forEach(item => {
        const header = item.querySelector('.project-header');
        const icon = item.querySelector('.accordion-icon');

        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all items
            projectItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherIcon = otherItem.querySelector('.accordion-icon');
                if (otherIcon) otherIcon.textContent = '+';
            });

            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                if (icon) icon.textContent = '−';

                // Initialize scroll for this project
                initProjectScroll(item);
            }
        });
    });
}

// Initialize horizontal scroll navigation for a project
function initProjectScroll(projectItem) {
    const scrollContainer = projectItem.querySelector('.project-scroll-container');
    const dots = projectItem.querySelectorAll('.scroll-dot');
    const prevBtn = projectItem.querySelector('.scroll-nav-prev');
    const nextBtn = projectItem.querySelector('.scroll-nav-next');
    const slides = projectItem.querySelectorAll('.project-slide');

    if (!scrollContainer || !dots.length) return;

    // Update dots on scroll
    scrollContainer.addEventListener('scroll', () => {
        const scrollLeft = scrollContainer.scrollLeft;
        const slideWidth = scrollContainer.offsetWidth;
        const currentIndex = Math.round(scrollLeft / slideWidth);

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });

        // Update arrow buttons
        if (prevBtn && nextBtn) {
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === slides.length - 1;
        }
    });

    // Dot click navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            const slideWidth = scrollContainer.offsetWidth;
            scrollContainer.scrollTo({
                left: index * slideWidth,
                behavior: 'smooth'
            });
        });
    });

    // Arrow navigation
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            const scrollLeft = scrollContainer.scrollLeft;
            const slideWidth = scrollContainer.offsetWidth;
            const currentIndex = Math.round(scrollLeft / slideWidth);

            if (currentIndex > 0) {
                scrollContainer.scrollTo({
                    left: (currentIndex - 1) * slideWidth,
                    behavior: 'smooth'
                });
            }
        });

        nextBtn.addEventListener('click', () => {
            const scrollLeft = scrollContainer.scrollLeft;
            const slideWidth = scrollContainer.offsetWidth;
            const currentIndex = Math.round(scrollLeft / slideWidth);

            if (currentIndex < slides.length - 1) {
                scrollContainer.scrollTo({
                    left: (currentIndex + 1) * slideWidth,
                    behavior: 'smooth'
                });
            }
        });
    }
}

// ===== Photo Wheel Component Interaction =====
function initPhotoCollage() {
    const satelliteButtons = document.querySelectorAll('.satellite-btn');
    const mainPhoto = document.getElementById('mainPhoto');
    const photoWheelComponent = document.getElementById('photoWheelComponent');
    const rippleContainer = document.getElementById('rippleContainer');

    if (!satelliteButtons.length || !mainPhoto) return;

    let currentIndex = 0;

    // Satellite button click handler
    satelliteButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const newIndex = parseInt(button.closest('.satellite').dataset.index);
            if (newIndex === currentIndex) return;

            currentIndex = newIndex;

            // Update active state
            satelliteButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Switch main photo with fade and scale effect (0.58s)
            const newPhotoSrc = button.dataset.photo;

            // Step 1: Start fade-out
            mainPhoto.classList.add('fade-out');

            // Step 2: After fade-out, change photo and start fade-in
            setTimeout(() => {
                mainPhoto.src = newPhotoSrc;

                // Set initial state (opacity 0, scale 1.05)
                mainPhoto.classList.remove('fade-out');
                mainPhoto.classList.add('fade-in-start');

                // Force reflow
                void mainPhoto.offsetWidth;

                // Step 3: Transition to end state (opacity 1, scale 1.0)
                mainPhoto.classList.remove('fade-in-start');
                mainPhoto.classList.add('fade-in');
            }, 200);

            // Clean up fade-in class after 0.58s
            setTimeout(() => {
                mainPhoto.classList.remove('fade-in');
            }, 580);
        });
    });

    // Set first button as active by default
    if (satelliteButtons[0]) {
        satelliteButtons[0].classList.add('active');
    }

    // Mouse ripple effect on component area
    if (photoWheelComponent && rippleContainer) {
        photoWheelComponent.addEventListener('mousemove', (e) => {
            const rect = photoWheelComponent.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Throttle ripple creation - create occasionally (about 15% of moves)
            if (Math.random() > 0.85) {
                createRipple(x, y, rippleContainer);
            }
        });
    }
}

// ===== Create Ripple Effect =====
function createRipple(x, y, container) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    ripple.style.left = `${x - 20}px`;
    ripple.style.top = `${y - 20}px`;
    container.appendChild(ripple);

    // Remove ripple after animation
    setTimeout(() => {
        ripple.remove();
    }, 1350);
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initQuickLinks();
    initInteractiveCards();
    initPhotoLightbox();
    initScrollAnimations();
    animateSkillBars();
    initNavbarScroll();
    setActiveNavLink();
    initTypingEffect();
    initProjectsAccordion();
    initPhotoCollage();
    // Only init cube grid if element exists
    if (document.querySelector('[data-cube-grid]')) {
        initCubeGrid();
    }
});

// ===== Animate-in style =====
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);
