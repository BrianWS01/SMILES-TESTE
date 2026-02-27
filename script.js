// Hero Carousel Auto-run
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const totalSlides = slides.length;
const pills = document.querySelectorAll('.hero-pill');

// Configurar imagens mobile/desktop
const mobileImages = [
    'IMG/hero/mobile/frame-61356.webp',
    'IMG/hero/mobile/frame-61358.webp',
    'IMG/hero/mobile/frame-61359.webp',
    'IMG/hero/mobile/frame-61360.webp',
    'IMG/hero/mobile/frame-61361.webp',
    'IMG/hero/mobile/frame-61362.webp',
    'IMG/hero/mobile/frame-61363.webp',
    'IMG/hero/mobile/frame-61364.webp'
];

const desktopImages = [
    'IMG/hero/frame-61348.webp',
    'IMG/hero/frame-61349.webp',
    'IMG/hero/frame-61350.webp',
    'IMG/hero/frame-61351.webp',
    'IMG/hero/frame-61352.webp',
    'IMG/hero/frame-61353.webp',
    'IMG/hero/frame-61354.webp',
    'IMG/hero/frame-61355.webp'
];

function updateImagesForScreenSize() {
    const isMobile = window.innerWidth <= 768;
    const images = document.querySelectorAll('.hero-slide img');

    images.forEach((img, index) => {
        if (isMobile && mobileImages[index]) {
            img.src = mobileImages[index];
        } else if (!isMobile && desktopImages[index]) {
            img.src = desktopImages[index];
        }
    });
}

// Atualizar imagens ao carregar e redimensionar
updateImagesForScreenSize();
window.addEventListener('resize', updateImagesForScreenSize);

function updatePills() {
    pills.forEach((pill, index) => {
        if (index === currentSlide) {
            pill.classList.add('active');
        } else {
            pill.classList.remove('active');
        }
    });
}

function goToSlide(index) {
    slides[currentSlide].classList.remove('active');
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    updatePills();
}

function nextSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % totalSlides;
    slides[currentSlide].classList.add('active');
    updatePills();
}

// Adicionar event listeners aos pills
pills.forEach((pill, index) => {
    pill.addEventListener('click', () => {
        goToSlide(index);
    });
});

// Iniciar o carrossel automático (troca a cada 5 segundos)
if (slides.length > 0) {
    updatePills(); // Inicializar pills
    setInterval(nextSlide, 5000);

    // Touch support for Hero Slider
    let heroTouchStartX = 0;
    const heroCarousel = document.querySelector('.hero-carousel');
    if (heroCarousel) {
        heroCarousel.addEventListener('touchstart', e => {
            heroTouchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        heroCarousel.addEventListener('touchend', e => {
            const touchEndX = e.changedTouches[0].screenX;
            const diff = heroTouchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide();
                else {
                    slides[currentSlide].classList.remove('active');
                    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
                    slides[currentSlide].classList.add('active');
                    updatePills();
                }
            }
        }, { passive: true });
    }
}

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Nav Link Active State
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function setActiveNavLink() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', setActiveNavLink);

// CTA Button Click
const ctaButtonNav = document.querySelector('.cta-button-nav');
if (ctaButtonNav) {
    ctaButtonNav.addEventListener('click', () => {
        const contactSection = document.querySelector('#contato');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Close menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scroll for navigation links - efeito mais leve
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);

        if (target) {
            const headerOffset = 150; // Offset para o header fixo
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            // Scroll suave com easing personalizado
            smoothScrollTo(offsetPosition, 1200);
        }
    });
});

// Função de scroll suave com easing
function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    // Função de easing - easeOutQuart para movimento mais suave
    function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
    }

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const easeProgress = easeOutQuart(progress);

        window.scrollTo(0, startPosition + distance * easeProgress);

        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }

    requestAnimationFrame(animation);
}

// Form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        // Here you would normally send the data to a server
        console.log('Form submitted:', data);

        // Show success message
        alert('Mensagem enviada com sucesso!');

        // Reset form
        contactForm.reset();
    });
}

// Add scroll animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe cards and service cards
document.querySelectorAll('.card, .service-card, .gallery-item').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s, transform 0.6s';
    observer.observe(card);
});

// Stats Counter Animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const target = parseInt(entry.target.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    entry.target.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    entry.target.textContent = target;
                }
            };
            updateCounter();
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(stat => {
    statsObserver.observe(stat);
});

// Gallery Modal
const galleryItems = document.querySelectorAll('.gallery-item');
const modal = document.getElementById('galleryModal');
const modalImg = document.getElementById('modalImage');
const modalCaption = document.querySelector('.modal-caption');
let currentImageIndex = 0;

galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        currentImageIndex = index;
        openModal(index);
    });
});

function openModal(index) {
    modal.classList.add('active');
    const item = galleryItems[index];
    const imageNum = item.getAttribute('data-image');
    modalImg.src = `#`; // Placeholder - você pode adicionar imagens reais aqui
    modalCaption.textContent = `Imagem ${imageNum}`;
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

const modalClose = document.querySelector('.modal-close');
const prevModal = document.querySelector('.prev-modal');
const nextModal = document.querySelector('.next-modal');

if (modalClose) modalClose.addEventListener('click', closeModal);

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

if (prevModal) {
    prevModal.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
        openModal(currentImageIndex);
    });
}

if (nextModal) {
    nextModal.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
        openModal(currentImageIndex);
    });
}

// Keyboard navigation for modal
document.addEventListener('keydown', (e) => {
    if (modal.classList.contains('active')) {
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') {
            currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
            openModal(currentImageIndex);
        }
        if (e.key === 'ArrowRight') {
            currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
            openModal(currentImageIndex);
        }
    }
});

// Testimonials Slider
let currentTestimonial = 0;
const testimonialCards = document.querySelectorAll('.testimonial-card');
const testimonialDots = document.querySelectorAll('.dot');
const totalTestimonials = testimonialCards.length;

// Só executa se existirem testimonials
if (testimonialCards.length > 0 && testimonialDots.length > 0) {
    function showTestimonial(index) {
        testimonialCards.forEach(card => card.classList.remove('active'));
        testimonialDots.forEach(dot => dot.classList.remove('active'));

        if (testimonialCards[index]) testimonialCards[index].classList.add('active');
        if (testimonialDots[index]) testimonialDots[index].classList.add('active');
        currentTestimonial = index;
    }

    const testimonialNextBtn = document.querySelector('.testimonial-btn.next');
    const testimonialPrevBtn = document.querySelector('.testimonial-btn.prev');

    if (testimonialNextBtn) {
        testimonialNextBtn.addEventListener('click', () => {
            const next = (currentTestimonial + 1) % totalTestimonials;
            showTestimonial(next);
        });
    }

    if (testimonialPrevBtn) {
        testimonialPrevBtn.addEventListener('click', () => {
            const prev = (currentTestimonial - 1 + totalTestimonials) % totalTestimonials;
            showTestimonial(prev);
        });
    }

    testimonialDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTestimonial(index);
        });
    });

    // Auto-play testimonials
    let testimonialInterval = setInterval(() => {
        const next = (currentTestimonial + 1) % totalTestimonials;
        showTestimonial(next);
    }, 5000);

    // Pause auto-play on hover
    const testimonialsSection = document.querySelector('.testimonials');
    if (testimonialsSection) {
        testimonialsSection.addEventListener('mouseenter', () => {
            clearInterval(testimonialInterval);
        });

        testimonialsSection.addEventListener('mouseleave', () => {
            testimonialInterval = setInterval(() => {
                const next = (currentTestimonial + 1) % totalTestimonials;
                showTestimonial(next);
            }, 5000);
        });
    }
}

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Não adicionar sombra ao header, apenas na navbar se necessário
    header.style.boxShadow = 'none';

    lastScroll = currentScroll;
});

// Hero Form Submission
const heroForm = document.querySelector('.hero-form');
if (heroForm) {
    heroForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('hero-name').value;
        const phone = document.getElementById('hero-phone').value;

        // Formatar a mensagem para o WhatsApp
        let message = 'Gostaria de agendar uma avaliação!\n\n';
        message += '*Nome:* ' + name + '\n';
        message += '*Telefone/WhatsApp:* ' + phone;

        // Codificar a mensagem para URL
        const encodedMessage = encodeURIComponent(message);

        // Criar o link do WhatsApp
        const whatsappLink = 'https://wa.me/5521991355098?text=' + encodedMessage;

        // Abrir o WhatsApp em uma nova aba
        window.open(whatsappLink, '_blank');

        // Limpar formulário
        heroForm.reset();
    });
}

// Proposito Carousel
let currentPropositoSlide = 0;
const propositoSlides = document.querySelectorAll('.proposito-slide');
const totalPropositoSlides = propositoSlides.length;

function nextPropositoSlide() {
    propositoSlides[currentPropositoSlide].classList.remove('active');
    currentPropositoSlide = (currentPropositoSlide + 1) % totalPropositoSlides;
    propositoSlides[currentPropositoSlide].classList.add('active');
}

function prevPropositoSlide() {
    propositoSlides[currentPropositoSlide].classList.remove('active');
    currentPropositoSlide = (currentPropositoSlide - 1 + totalPropositoSlides) % totalPropositoSlides;
    propositoSlides[currentPropositoSlide].classList.add('active');
}

// Adicionar event listeners aos controles do carrossel
const propositoPrevBtn = document.querySelector('.proposito-carousel-btn.prev');
const propositoNextBtn = document.querySelector('.proposito-carousel-btn.next');

if (propositoPrevBtn) {
    propositoPrevBtn.addEventListener('click', prevPropositoSlide);
}

if (propositoNextBtn) {
    propositoNextBtn.addEventListener('click', nextPropositoSlide);
}

// Iniciar o carrossel automático
if (propositoSlides.length > 0) {
    setInterval(nextPropositoSlide, 5000);

    // Touch support for Purpose Slider
    let propositoTouchStartX = 0;
    const propositoCarousel = document.querySelector('.proposito-carousel');
    if (propositoCarousel) {
        propositoCarousel.addEventListener('touchstart', e => {
            propositoTouchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        propositoCarousel.addEventListener('touchend', e => {
            const touchEndX = e.changedTouches[0].screenX;
            const diff = propositoTouchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextPropositoSlide();
                else prevPropositoSlide();
            }
        }, { passive: true });
    }
}

// Prova Social Video Carousel - NOVO
document.addEventListener('DOMContentLoaded', function () {
    const wrapper = document.querySelector('.prova-social-carousel-wrapper');
    const container = document.querySelector('.prova-social-carousel-container');
    const allCards = document.querySelectorAll('.prova-social-video-card');
    const prevBtn = document.querySelector('.carousel-nav.prev-btn');
    const nextBtn = document.querySelector('.carousel-nav.next-btn');

    if (!container || allCards.length === 0) {
        console.log('Carrossel não encontrado');
        return;
    }

    console.log('Cards encontrados:', allCards.length);

    const cards = Array.from(allCards);
    let currentIndex = Math.floor(cards.length / 2);

    // Configurações
    const CARD_WIDTH = 280;
    const CARD_HEIGHT = 500;
    const SPACING = 180;

    function positionCards() {
        cards.forEach((card, index) => {
            const diff = index - currentIndex;
            const absDiff = Math.abs(diff);

            // Posição X
            const translateX = diff * SPACING;

            // Escala - central maior
            const scale = diff === 0 ? 1 : Math.max(0.75 - (absDiff - 1) * 0.1, 0.5);

            // Rotação 3D
            let rotateY = 0;
            if (diff > 0) rotateY = -30;
            if (diff < 0) rotateY = 30;

            // Z-index
            const zIndex = 50 - absDiff;

            // Opacidade
            const opacity = diff === 0 ? 1 : Math.max(0.7 - (absDiff - 1) * 0.2, 0.3);

            // Visibilidade
            const isVisible = absDiff <= 2;

            // Aplicar estilos
            card.style.position = 'absolute';
            card.style.left = '50%';
            card.style.top = '50%';
            card.style.width = CARD_WIDTH + 'px';
            card.style.height = CARD_HEIGHT + 'px';
            card.style.marginLeft = (-CARD_WIDTH / 2) + 'px';
            card.style.marginTop = (-CARD_HEIGHT / 2) + 'px';
            card.style.transform = `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`;
            card.style.zIndex = zIndex;
            card.style.opacity = isVisible ? opacity : 0;
            card.style.visibility = isVisible ? 'visible' : 'hidden';
            card.style.transition = 'all 0.4s ease-out';
            card.style.borderRadius = '20px';
            card.style.overflow = 'hidden';
            card.style.cursor = 'pointer';
            card.style.background = '#000';
            card.style.boxShadow = '0 10px 40px rgba(0,0,0,0.3)';

            // Borda verde no card ativo
            if (diff === 0) {
                card.style.border = '3px solid #bef264';
                card.classList.add('active');
            } else {
                card.style.border = '3px solid transparent';
                card.classList.remove('active');
            }
        });
    }

    function goToSlide(index) {
        // Limites
        if (index < 0) index = 0;
        if (index >= cards.length) index = cards.length - 1;

        // Parar vídeos
        stopAllVideos();

        currentIndex = index;
        positionCards();
    }

    function stopAllVideos() {
        cards.forEach(card => {
            const videoPlayer = card.querySelector('.video-player');
            if (videoPlayer) {
                videoPlayer.pause();
                videoPlayer.remove();
            }
            // Restaurar overlay e ícone
            const overlay = card.querySelector('.video-play-overlay');
            const icon = card.querySelector('.video-play-icon');
            if (overlay) overlay.style.display = 'block';
            if (icon) icon.style.display = 'block';
        });
    }

    function playVideo(card) {
        const videoSrc = card.dataset.video;
        if (!videoSrc) return;

        // Esconder overlay e ícone
        const overlay = card.querySelector('.video-play-overlay');
        const icon = card.querySelector('.video-play-icon');
        if (overlay) overlay.style.display = 'none';
        if (icon) icon.style.display = 'none';

        // Criar player
        const video = document.createElement('video');
        video.src = videoSrc;
        video.className = 'video-player';
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        video.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;border-radius:17px;z-index:100;background:#000;';
        card.appendChild(video);
        video.play().catch(e => console.log('Erro ao reproduzir:', e));
    }

    // Event listeners para navegação
    if (prevBtn) {
        prevBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            goToSlide(currentIndex - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            goToSlide(currentIndex + 1);
        });
    }

    // Event listeners para cards
    cards.forEach((card, index) => {
        card.addEventListener('click', function (e) {
            e.preventDefault();

            if (index !== currentIndex) {
                // Navegar para o card
                goToSlide(index);
            } else {
                // Reproduzir/pausar vídeo
                const hasPlayer = card.querySelector('.video-player');
                if (hasPlayer) {
                    stopAllVideos();
                } else {
                    playVideo(card);
                }
            }
        });
    });

    // Resize
    window.addEventListener('resize', positionCards);

    // Touch support for Video Carousel
    let videoTouchStartX = 0;
    container.addEventListener('touchstart', e => {
        videoTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener('touchend', e => {
        const touchEndX = e.changedTouches[0].screenX;
        const diff = videoTouchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) goToSlide(currentIndex + 1);
            else goToSlide(currentIndex - 1);
        }
    }, { passive: true });

    // Inicializar
    positionCards();
    console.log('Carrossel inicializado com', cards.length, 'cards');
});

// Carrossel da Equipe
(function () {
    'use strict';

    const carousel = document.querySelector('.equipe-carousel');
    const cards = document.querySelectorAll('.equipe-carousel .equipe-card');
    const prevBtn = document.querySelector('.equipe-prev');
    const nextBtn = document.querySelector('.equipe-next');

    if (!carousel || !cards.length || !prevBtn || !nextBtn) return;

    let currentIndex = 0;

    function isMobile() {
        return window.innerWidth <= 768;
    }

    function getCardWidth() {
        const firstCard = cards[0];
        if (firstCard) {
            const carouselStyle = window.getComputedStyle(carousel);
            const gap = parseInt(carouselStyle.gap) || 20;
            return firstCard.offsetWidth + gap;
        }
        return 280 + 20;
    }

    function getVisibleCards() {
        if (isMobile()) {
            return 1;
        }
        const cardWidth = getCardWidth();
        const wrapperWidth = carousel.parentElement.offsetWidth;
        return Math.max(1, Math.floor(wrapperWidth / cardWidth));
    }

    function getMaxIndex() {
        return Math.max(0, cards.length - getVisibleCards());
    }

    const pills = document.querySelectorAll('.equipe-pill');

    function updateCarousel() {
        const cardWidth = getCardWidth();
        const offset = currentIndex * cardWidth;
        carousel.style.transform = `translateX(-${offset}px)`;
        updatePills();
    }

    function updatePills() {
        pills.forEach((pill, index) => {
            if (index === currentIndex) {
                pill.classList.add('active');
            } else {
                pill.classList.remove('active');
            }
        });
    }

    // Inicializar na posição correta
    updateCarousel();

    prevBtn.addEventListener('click', () => {
        currentIndex = Math.max(0, currentIndex - 1);
        updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = Math.min(getMaxIndex(), currentIndex + 1);
        updateCarousel();
    });

    // Clique nas pills
    pills.forEach((pill, index) => {
        pill.addEventListener('click', () => {
            currentIndex = Math.min(index, getMaxIndex());
            updateCarousel();
        });
    });

    // Recalcular ao redimensionar
    window.addEventListener('resize', () => {
        currentIndex = Math.min(currentIndex, getMaxIndex());
        updateCarousel();
    });

    // Touch/Swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                // Swipe left - next
                currentIndex = Math.min(getMaxIndex(), currentIndex + 1);
            } else {
                // Swipe right - prev
                currentIndex = Math.max(0, currentIndex - 1);
            }
            updateCarousel();
        }
    }, { passive: true });
})();

// Animações de Entrada Elegantes
(function () {
    'use strict';

    // Configuração do Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Adiciona animação aos textos principais
    function initAnimations() {
        // Elementos de texto principais
        const selectors = [
            '.hero-title span',
            '.hero-description',
            '.hero-desc-medium',
            '.hero-desc-light',
            '.proposito-title span',
            '.proposito-description',
            '.proposito-desc-medium',
            '.proposito-desc-light',
            '.prova-social-title span',
            '.prova-social-description',
            '.sobre-title span',
            '.sobre-description',
            '.depoimento-text',
            '.depoimento-author h4',
            '.depoimento-author span'
        ];

        selectors.forEach((selector, selectorIndex) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach((element, elementIndex) => {
                element.classList.add('animate-on-scroll');
                // Delays muito mais curtos para animação rápida
                const delay = (selectorIndex * 0.02) + (elementIndex * 0.01);
                element.style.transitionDelay = `${delay}s`;
                observer.observe(element);
            });
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAnimations);
    } else {
        initAnimations();
    }
})();


