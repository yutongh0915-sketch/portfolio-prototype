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
    const cards = document.querySelectorAll('.interactive-card');

    cards.forEach(card => {
        card.addEventListener('click', () => {
            // Close other cards
            cards.forEach(c => {
                if (c !== card) {
                    c.classList.remove('active');
                }
            });

            // Toggle current card
            card.classList.toggle('active');
        });
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

// ===== Lightbox for Photography =====
function initLightbox() {
    const photoCards = document.querySelectorAll('[data-lightbox]');

    // Create lightbox element
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <button class="lightbox-close"></button>
        <div class="lightbox-wrapper">
            <img class="lightbox-content" src="" alt="">
        </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('.lightbox-content');
    const lightboxClose = lightbox.querySelector('.lightbox-close');

    photoCards.forEach(card => {
        card.addEventListener('click', () => {
            const img = card.querySelector('img');
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            lightboxImg.src = '';
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

// ===== Projects Accordion =====
function initProjectsAccordion() {
    const accordionItems = document.querySelectorAll('.project-accordion-item');

    accordionItems.forEach(item => {
        const header = item.querySelector('.project-accordion-header');
        const icon = item.querySelector('.accordion-icon');

        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all items
            accordionItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherIcon = otherItem.querySelector('.accordion-icon');
                if (otherIcon) otherIcon.textContent = '+';
            });

            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                if (icon) icon.textContent = '−';
            }
        });
    });
}

// ===== Photo Wheel Interaction =====
function initPhotoWheel() {
    const photoButtons = document.querySelectorAll('.photo-btn');
    const mainPhoto = document.getElementById('mainPhoto');
    const wheelRing = document.getElementById('wheelRing');
    const photoCollage = document.getElementById('photoCollage');
    const rippleContainer = document.getElementById('rippleContainer');

    if (!photoButtons.length || !mainPhoto || !wheelRing) return;

    let currentRotation = 0;
    let currentIndex = 0;

    // Photo button click handler
    photoButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            const newIndex = parseInt(button.dataset.index);
            if (newIndex === currentIndex) return;

            // Calculate rotation (each step is -120 degrees)
            const rotationDiff = (newIndex - currentIndex) * -120;
            currentRotation += rotationDiff;
            currentIndex = newIndex;

            // Rotate the wheel ring
            wheelRing.style.transform = `rotate(${currentRotation}deg)`;

            // Counter-rotate each photo to keep it upright
            photoButtons.forEach(btn => {
                const btnIndex = parseInt(btn.dataset.index);
                const btnRotation = -(currentRotation);
                btn.style.transform = `rotate(${btnRotation}deg)`;
            });

            // Update active state
            photoButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Switch main photo with fade and scale effect
            const newPhotoSrc = button.dataset.photo;

            // Step 1: Fade out current photo
            mainPhoto.classList.add('fade-out');

            // Step 2: After fade out, change photo source and set initial state
            setTimeout(() => {
                mainPhoto.src = newPhotoSrc;

                // Remove fade-out and add fade-in-start (scale 1.14, opacity 0)
                mainPhoto.classList.remove('fade-out');
                mainPhoto.classList.add('fade-in-start');

                // Force browser to reflow to ensure the start state is applied
                void mainPhoto.offsetWidth;

                // Step 3: Transition to end state (scale 1.0, opacity 1)
                mainPhoto.classList.remove('fade-in-start');
                mainPhoto.classList.add('fade-in');
            }, 290); // Half of 0.58s transition

            // Clean up fade-in class after animation completes
            setTimeout(() => {
                mainPhoto.classList.remove('fade-in');
            }, 580); // Full 0.58s transition
        });
    });

    // Set first button as active by default
    if (photoButtons[0]) {
        photoButtons[0].classList.add('active');
    }

    // Mouse ripple effect
    if (photoCollage && rippleContainer) {
        photoCollage.addEventListener('mousemove', (e) => {
            const rect = photoCollage.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Throttle ripple creation
            if (Math.random() > 0.85) { // Create ripples occasionally
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
    initLightbox();
    initScrollAnimations();
    animateSkillBars();
    initNavbarScroll();
    setActiveNavLink();
    initTypingEffect();
    initProjectsAccordion();
    initPhotoWheel();
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
