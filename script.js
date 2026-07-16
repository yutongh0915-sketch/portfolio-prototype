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
// 单页改造后，原生 hash 锚点 + html scroll-behavior:smooth 已处理滚动
// 这里只负责点击后关闭移动菜单
function initQuickLinks() {
    const quickLinks = document.querySelectorAll('.quick-link');
    const toggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    const closeMobileMenu = () => {
        if (toggle && mobileMenu && mobileMenu.classList.contains('active')) {
            toggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    quickLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // nav-link 和 mobile-link 也需要关闭移动菜单
    document.querySelectorAll('.nav-link, .mobile-link, .nav-brand').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}

// ===== ScrollSpy: 高亮当前 section 对应的导航 =====
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!sections.length || !navLinks.length) return;

    const linkMap = new Map();
    navLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        if (href.startsWith('#')) {
            linkMap.set(href.slice(1), link);
        }
    });

    const observer = new IntersectionObserver((entries) => {
        // 收集当前在视口中的所有 section，选最靠上的（rootMargin 中间区域）
        const intersecting = entries.filter(e => e.isIntersecting);
        if (intersecting.length === 0) return;

        // 取最上方那个作为当前 section
        const topmost = intersecting.reduce((acc, cur) =>
            cur.boundingClientRect.top < acc.boundingClientRect.top ? cur : acc
        );

        const id = topmost.target.id;
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = linkMap.get(id);
        if (activeLink) activeLink.classList.add('active');
    }, {
        rootMargin: '-40% 0px -50% 0px',
        threshold: 0
    });

    sections.forEach(section => observer.observe(section));
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

// ===== Section Fade-in (板块级滚动淡入) =====
function initSectionFadeIn() {
    // 尊重 prefers-reduced-motion：跳过隐藏，所有 section 保持可见
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const sections = document.querySelectorAll('section:not(.hero)');
    const viewportH = window.innerHeight;

    // 仅给视口下方的 section 加初始隐藏类，避免首屏内容闪烁
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top > viewportH * 0.5) {
            section.classList.add('section-fade');
        }
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -10% 0px'
    });

    document.querySelectorAll('.section-fade').forEach(section => observer.observe(section));
}

// ===== Language Toggle (中英双语切换) =====
// 注意：初始语言由 <head> 内联 script 提前应用，避免页面加载时闪烁。
// 此函数负责：1) 绑定按钮点击切换类；2) 同步 aria-label / title / alt 属性。
function applyLangAttributes(lang) {
    const attrMap = [
        { attr: 'aria-label', en: 'data-aria-en', zh: 'data-aria-zh' },
        { attr: 'title',      en: 'data-title-en', zh: 'data-title-zh' },
        { attr: 'alt',        en: 'data-alt-en',   zh: 'data-alt-zh' }
    ];
    attrMap.forEach(({ attr, en, zh }) => {
        const dataAttr = lang === 'zh' ? zh : en;
        document.querySelectorAll(`[${dataAttr}]`).forEach(el => {
            el.setAttribute(attr, el.getAttribute(dataAttr));
        });
    });
}

function initLanguageToggle() {
    const toggle = document.querySelector('.lang-toggle');
    const html = document.documentElement;

    // 初始化属性（首屏），匹配 head 内联 script 已经应用的语言类
    applyLangAttributes(html.classList.contains('lang-zh') ? 'zh' : 'en');

    if (!toggle) return;

    toggle.addEventListener('click', () => {
        const isZh = html.classList.contains('lang-zh');
        const newLang = isZh ? 'en' : 'zh';
        html.classList.remove('lang-en', 'lang-zh');
        html.classList.add(newLang === 'zh' ? 'lang-zh' : 'lang-en');
        html.lang = newLang === 'zh' ? 'zh-CN' : 'en';
        localStorage.setItem('lang', newLang);
        applyLangAttributes(newLang);
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

// ===== Navbar Collapse/Restore =====
function initNavbarCollapse() {
    const navbar = document.querySelector('.navbar');
    const collapseBtn = document.querySelector('.nav-collapse-btn');
    const restoreBtn = document.querySelector('.nav-restore-btn');
    if (!navbar || !collapseBtn || !restoreBtn) return;

    const collapse = () => {
        navbar.classList.add('collapsed');
        // 等 navbar 滑出后再显示恢复按钮，避免视觉重叠
        setTimeout(() => restoreBtn.classList.add('show'), 250);
    };

    const restore = () => {
        restoreBtn.classList.remove('show');
        navbar.classList.remove('collapsed');
    };

    collapseBtn.addEventListener('click', collapse);
    restoreBtn.addEventListener('click', restore);
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

// ===== Internship Expandable Cards =====
function initInternshipAccordion() {
    const toggles = document.querySelectorAll('.timeline-toggle');

    toggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const card = toggle.closest('.timeline-card');
            if (!card) return;

            const isExpanded = card.classList.toggle('expanded');
            toggle.setAttribute('aria-expanded', isExpanded);

            const textEl = toggle.querySelector('.toggle-text');
            if (textEl) {
                textEl.textContent = isExpanded ? 'Hide Details' : 'View Details';
            }
        });
    });
}

// 拆分容器内文本为字符 span (char-wrap > char-default + char-active)
function splitCharsToSpans(container) {
    const text = container.textContent;
    container.textContent = '';
    const chars = text.split('');
    chars.forEach((char, i) => {
        const wrap = document.createElement('span');
        wrap.className = 'char-wrap';
        wrap.style.setProperty('--char-delay', `${i * 0.025}s`);

        const charDefault = document.createElement('span');
        charDefault.className = 'char char-default';
        charDefault.textContent = char === ' ' ? ' ' : char;

        const charActive = document.createElement('span');
        charActive.className = 'char char-active';
        charActive.textContent = char === ' ' ? ' ' : char;

        wrap.appendChild(charDefault);
        wrap.appendChild(charActive);
        container.appendChild(wrap);
    });
}

// ===== About HoverSlider =====
function initHoverSlider() {
    const sliders = document.querySelectorAll('[data-hover-slider]');

    sliders.forEach(slider => {
        const triggers = slider.querySelectorAll('.hover-trigger');
        const contents = slider.querySelectorAll('.hover-slider-content');

        // 拆分每个 trigger 的文字为字符 span，支持双语 (en-text / zh-text 各自拆)
        triggers.forEach(trigger => {
            const textEl = trigger.querySelector('.trigger-text');
            if (!textEl || textEl.dataset.split === 'true') return;
            textEl.dataset.split = 'true';

            const langSpans = textEl.querySelectorAll(':scope > .en-text, :scope > .zh-text');
            if (langSpans.length > 0) {
                langSpans.forEach(splitCharsToSpans);
            } else {
                splitCharsToSpans(textEl);
            }
        });

        let activeIndex = 0;
        let switchTimer = null;
        const changeSlide = (index) => {
            if (index === activeIndex) return;
            const oldContent = contents[activeIndex];
            const newContent = contents[index];
            triggers.forEach((t, i) => t.classList.toggle('active', i === index));
            // 旧 content 快速收起,避免与新 content 展开重叠
            oldContent.style.transition = 'clip-path 0.12s ease-out';
            oldContent.classList.remove('active');
            clearTimeout(switchTimer);
            switchTimer = setTimeout(() => {
                oldContent.style.transition = '';
                newContent.classList.add('active');
                switchTimer = null;
            }, 120);
            activeIndex = index;
        };

        const isDesktop = () => window.matchMedia('(min-width: 769px)').matches;

        triggers.forEach((trigger, index) => {
            // 桌面端 hover 切换
            trigger.addEventListener('mouseenter', () => {
                if (isDesktop()) changeSlide(index);
            });
            // 移动端/键盘 click 切换
            trigger.addEventListener('click', () => changeSlide(index));
        });
    });
}

// ===== Timeline Scroll Progress + 节点同步点亮 =====
function initTimelineScroll() {
    const timeline = document.querySelector('[data-timeline]');
    if (!timeline) return;
    const body = timeline.querySelector('[data-timeline-body]');
    const progress = timeline.querySelector('[data-timeline-progress]');
    if (!body || !progress) return;

    const entries = body.querySelectorAll('.timeline-entry');

    // 尊重 prefers-reduced-motion：直接全部激活并填满进度条
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        entries.forEach(entry => entry.classList.add('in-view'));
        progress.style.height = '100%';
        progress.style.opacity = '1';
        return;
    }

    // 同步锚点：视口中央线。进度条前端 Y 永远等于该线相对 body 顶部的偏移，
    // 这样滚动到哪里，进度条前端就跟到哪里，流动与滚动一一同步。
    const ANCHOR_RATIO = 0.5;
    let ticking = false;
    const update = () => {
        const rect = body.getBoundingClientRect();
        const viewportH = window.innerHeight;
        const bodyHeight = body.offsetHeight;

        // 视口锚点线相对 body 顶部的偏移量（已滚动经过的部分）
        const anchorY = viewportH * ANCHOR_RATIO - rect.top;
        let p = anchorY / bodyHeight;
        p = Math.max(0, Math.min(1, p));

        const progressHeight = p * bodyHeight;
        progress.style.height = progressHeight + 'px';
        progress.style.opacity = p < 0.05 ? (p / 0.05) : 1;

        // 节点同步:进度条前端流过 marker 中心时点亮该 entry,形成"液体流过即点亮"
        const bodyTop = rect.top;
        entries.forEach(entry => {
            const marker = entry.querySelector('.timeline-marker');
            if (!marker) return;
            const markerRect = marker.getBoundingClientRect();
            const markerCenterY = markerRect.top + markerRect.height / 2 - bodyTop;
            if (markerCenterY <= progressHeight) {
                entry.classList.add('in-view');
            } else {
                entry.classList.remove('in-view');
            }
        });

        ticking = false;
    };
    const onScroll = () => {
        if (!ticking) {
            requestAnimationFrame(update);
            ticking = true;
        }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();
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
    initSectionFadeIn();
    initLanguageToggle();
    animateSkillBars();
    initNavbarScroll();
    initNavbarCollapse();
    setActiveNavLink();
    initTypingEffect();
    initProjectsAccordion();
    initInternshipAccordion();
    initHoverSlider();
    initPhotoCollage();
    initTimelineScroll();
    initScrollSpy();
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
