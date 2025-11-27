(function() {
  'use strict';

  // ===========================
  // HELPERS
  // ===========================
  function formatNumber(n) {
    if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`;
    return `${n}`;
  }

  // ===========================
  // AÑO EN FOOTER
  // ===========================
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ===========================
  // NAVEGACIÓN CON SCROLL
  // ===========================
  const nav = document.getElementById('main-nav');
  
  if (nav) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        nav.classList.add('nav-scrolled');
      } else {
        nav.classList.remove('nav-scrolled');
      }
    });
  }

  // ===========================
  // DOM READY
  // ===========================
  document.addEventListener('DOMContentLoaded', function() {

    // MENÚ MÓVIL - MEJORADO
    const menuButton = document.getElementById('menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuButton && mobileMenu) {
      // Toggle del menú
      menuButton.addEventListener('click', function(e) {
        e.stopPropagation();
        mobileMenu.classList.toggle('hidden');
        
        // Cambiar aria-expanded
        const isExpanded = !mobileMenu.classList.contains('hidden');
        menuButton.setAttribute('aria-expanded', isExpanded);
      });

      // Cerrar menú al hacer click en un link
      mobileMenu.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
          mobileMenu.classList.add('hidden');
          menuButton.setAttribute('aria-expanded', 'false');
        });
      });
      
      // Cerrar menú si se hace click fuera de él
      document.addEventListener('click', function(e) {
        if (!mobileMenu.contains(e.target) && !menuButton.contains(e.target)) {
          mobileMenu.classList.add('hidden');
          menuButton.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // CONTADORES ANIMADOS
    function animateCounter(element, duration) {
      const target = parseInt(element.getAttribute('data-target')) || 0;
      let start = null;

      function step(timestamp) {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const current = Math.floor(progress * target);
        element.textContent = formatNumber(current);
        
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          element.textContent = formatNumber(target);
        }
      }
      requestAnimationFrame(step);
    }

    const counters = document.querySelectorAll('.counter-animated');
    if ('IntersectionObserver' in window && counters.length) {
      const observer = new IntersectionObserver(function(entries, obs) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target, 1800);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      counters.forEach(function(c) {
        observer.observe(c);
      });
    }

  }); // Fin DOMContentLoaded

  // CARRUSEL DE LOGOS
  // ===========================
  window.addEventListener('load', function() {
    const carousel = document.getElementById('carousel');
    const template = document.getElementById('logos');
    if (!carousel || !template) return;

    const content = template.content;
    carousel.innerHTML = '';
    carousel.appendChild(content.cloneNode(true));
    carousel.appendChild(content.cloneNode(true));

    const childrenCountPerSet = carousel.children.length / 2 || 0;
    let index = 0;
    let intervalId = null;

    function getGapPx() {
      const style = getComputedStyle(carousel);
      const gap = parseFloat(style.gap || style.columnGap || 0);
      return Number.isFinite(gap) ? gap : 64;
    }

    function getItemWidth() {
      const first = carousel.children[0];
      if (!first) return Math.max(window.innerWidth, 100);
      const rect = first.getBoundingClientRect();
      return Math.round(rect.width + getGapPx());
    }

    function moveCarousel() {
      const itemWidth = getItemWidth();
      index++;
      carousel.style.transition = 'transform 0.5s linear';
      carousel.style.transform = 'translateX(-' + (index * itemWidth) + 'px)';

      if (index >= childrenCountPerSet) {
        setTimeout(function() {
          carousel.style.transition = 'none';
          carousel.style.transform = 'translateX(0)';
          index = 0;
        }, 520);
      }
    }

    function startCarousel() {
      stopCarousel();
      intervalId = setInterval(moveCarousel, 1800);
    }

    function stopCarousel() {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    startCarousel();

    let resizeTimeout = null;
    window.addEventListener('resize', function() {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(function() {
        index = 0;
        carousel.style.transition = 'none';
        carousel.style.transform = 'translateX(0)';
        startCarousel();
      }, 180);
    });

    window.addEventListener('beforeunload', stopCarousel);
  });

})();