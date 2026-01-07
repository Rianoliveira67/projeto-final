document.addEventListener('DOMContentLoaded', () => {
  // Menu toggle
  const menuToggle = document.getElementById('menuToggle');
  const mainMenu = document.getElementById('main-menu');
  if (menuToggle && mainMenu) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      mainMenu.classList.toggle('active');
    });
  }

  document.addEventListener('click', (e) => {
    if (mainMenu && menuToggle && !mainMenu.contains(e.target) && !menuToggle.contains(e.target)) {
      menuToggle.setAttribute('aria-expanded','false');
      mainMenu.classList.remove('active');
    }
  });

  // Carousel implementation
  const slides = [
    { src: 'imagens/01-fortnite.png', alt: 'Fortnite - destaque', cta: 'Instalar Fortnite' },
    { src: 'imagens/02-cs2.webp', alt: 'CS2 - Counter Strike', cta: 'Instalar CS2' },
    { src: 'imagens/03-warframe.png', alt: 'Warframe - destaque', cta: 'Instalar Warframe' },
    { src: 'imagens/04-lol.webp', alt: 'League of Legends', cta: 'Instalar League' },
    { src: 'imagens/05-valorant.jpg', alt: 'Valorant - destaque', cta: 'Instalar Valorant' }
  ];

  const hero = document.querySelector('.hero');
  const heroImg = document.querySelector('.hero img');
  const ctaBtn = document.querySelector('.hero .jogosPrincipaisInstalar button');
  const indicators = Array.from(document.querySelectorAll('.carousel-indicators .indicator'));
  const announcer = document.getElementById('hero-announcer');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');

  if (!hero || !heroImg || !ctaBtn || indicators.length === 0) return;

  let current = 0;
  let autoplayId = null;

  function updateIndicators() {
    indicators.forEach((btn, i) => {
      btn.classList.toggle('active', i === current);
      btn.setAttribute('aria-current', i === current ? 'true' : 'false');
    });
  }

  function showSlide(index) {
    index = (index + slides.length) % slides.length;
    if (index === current) return;
    const slide = slides[index];
    heroImg.classList.add('is-fading');

    const onTransitionEnd = (e) => {
      // ensure we react to opacity transition end
      if (getComputedStyle(heroImg).opacity !== '0') return;
      heroImg.removeEventListener('transitionend', onTransitionEnd);
      heroImg.src = slide.src;
      heroImg.alt = slide.alt;
      ctaBtn.textContent = slide.cta;
      if (announcer) announcer.textContent = slide.alt;
      heroImg.onload = () => {
        // allow image to load before fading in
        requestAnimationFrame(() => {
          heroImg.classList.remove('is-fading');
        });
      };
      current = index;
      updateIndicators();
    };

    heroImg.addEventListener('transitionend', onTransitionEnd);
  }

  indicators.forEach((btn, i) => {
    btn.addEventListener('click', () => showSlide(i));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        showSlide(i);
      }
    });
  });

  if (nextBtn) nextBtn.addEventListener('click', () => showSlide(current + 1));
  if (prevBtn) prevBtn.addEventListener('click', () => showSlide(current - 1));

  // keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') showSlide(current + 1);
    if (e.key === 'ArrowLeft') showSlide(current - 1);
  });

  // autoplay
  function startAutoplay() {
    if (autoplayId) return;
    autoplayId = setInterval(() => showSlide(current + 1), 5000);
  }
  function stopAutoplay() {
    if (!autoplayId) return;
    clearInterval(autoplayId);
    autoplayId = null;
  }
  hero.addEventListener('mouseenter', stopAutoplay);
  hero.addEventListener('mouseleave', startAutoplay);

  // init
  updateIndicators();
  if (announcer) announcer.textContent = slides[current].alt;
  startAutoplay();
});