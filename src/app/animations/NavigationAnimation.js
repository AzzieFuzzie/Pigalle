import GSAP from 'gsap';

export default class NavigationAnimation {
  constructor() {
    this.navigationAnimation();
  }

  navigationAnimation() {
    const navWrapper = document.querySelector('.navigation__menu__wrapper'); // fullscreen nav wrapper
    const openBtn = document.querySelector('.navigation__icon__open');
    const closeBtn = document.querySelector('.navigation__icon__close');
    const navLinks = navWrapper.querySelectorAll('a');

    // Initial icon states on mobile
    if (window.innerWidth <= 768) {
      this.setMobileInitialState(navWrapper, openBtn, closeBtn);
    } else {
      // On desktop, hide both icons or just openBtn depending on your UI
      openBtn.style.display = 'none';
      closeBtn.style.display = 'none';
    }

    // Open Navigation
    openBtn?.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        // Reset and show container with initial scale and opacity
        GSAP.set(navWrapper, { display: 'flex', scale: 0.8, opacity: 0 });

        // Animate scale and fade in
        GSAP.to(navWrapper, {
          scale: 1,
          opacity: 1,
          duration: 0.6,
          ease: 'power3.out',
          onStart: () => {
            navWrapper.classList.add('open');

            // Toggle icons
            openBtn.style.display = 'none';
            closeBtn.style.display = 'block';
          }
        });
      }
    });

    // Close Navigation
    const closeNav = () => {
      // Toggle icons immediately on close start
      openBtn.style.display = 'block';
      closeBtn.style.display = 'none';

      // Animate scale down and fade out
      GSAP.to(navWrapper, {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.in',
        onComplete: () => {
          navWrapper.classList.remove('open');
          GSAP.set(navWrapper, { display: 'none' });
          document.body.style.overflow = ''; // restore scroll
        }
      });
    };

    closeBtn?.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        closeNav();
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          closeNav();
        }
      });
    });

    // Handle window resize to toggle icon states & menu visibility
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
        this.setMobileInitialState(navWrapper, openBtn, closeBtn);
      } else {
        // Reset on desktop
        GSAP.set(navWrapper, { clearProps: 'all' });
        navWrapper.classList.remove('open');
        document.body.style.overflow = '';

        openBtn.style.display = 'none';
        closeBtn.style.display = 'none';
      }
    });
  }

  // Set initial hidden state on mobile with correct icon visibility
  setMobileInitialState(navWrapper, openBtn, closeBtn) {
    GSAP.set(navWrapper, {
      display: 'none',
      opacity: 0,
      scale: 0.8
    });
    navWrapper.classList.remove('open');

    openBtn.style.display = 'block';
    closeBtn.style.display = 'none';
  }
}
