import GSAP from 'gsap';

export default class Navigation {
  constructor({ element, elements }) {
    this.element = element;
    this.elements = elements;
    this.lastScrollY = 0;
    this.ticking = false;
    this.isOpen = false;

    this._events();
    this._initScroll();
  }

  animateIn = () => {
    this.element.classList.add('active');
    this.isOpen = true;
    this._disableScroll();
  };

  animateOut = () => {
    this.element.classList.remove('active');
    this.isOpen = false;
    this._enableScroll();
  };

  _events() {
    const openBTN = document.querySelector('.navigation__icon--open');
    const closeBTN = document.querySelector('.navigation__icon--close');
    const navLinks = this.element.querySelectorAll('a');

    if (openBTN) openBTN.addEventListener('click', this.animateIn);
    if (closeBTN) closeBTN.addEventListener('click', this.animateOut);

    // Close nav on link click
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (this.isOpen) this.animateOut();
      });
    });
  }

  _disableScroll() {
    // Fix the body position to prevent scrolling
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
  }

  _enableScroll() {
    document.body.style.overflow = '';
    document.body.style.touchAction = '';
  }

  _initScroll() {
    if (window.innerWidth <= 768) return; // desktop only
    window.addEventListener('scroll', () => {
      if (!this.ticking && !this.isOpen) {
        window.requestAnimationFrame(() => {
          this._handleScroll();
          this.ticking = false;
        });
        this.ticking = true;
      }
    });
  }

  _handleScroll() {
    const header = document.querySelector("header");
    const currentScroll = window.scrollY;
    const viewportHeight = window.innerHeight;
    const isSpecialPage = header && (
      header.classList.contains("home") ||
      header.classList.contains("about")
    );

    // Special pages → sticky for first viewport height
    if (isSpecialPage && currentScroll < viewportHeight) {
      GSAP.to(this.element, { yPercent: 0, duration: 0.3, ease: "power2.out", overwrite: "auto" });
      this.element.classList.add("fixed");
      this.element.classList.remove("has-background");
      this.lastScrollY = currentScroll;
      return;
    }

    if (currentScroll <= 0) {
      GSAP.to(this.element, { yPercent: 0, duration: 0.3, ease: "power2.out", overwrite: "auto" });
      this.element.classList.remove("fixed", "has-background");
      this.lastScrollY = currentScroll;
      return;
    }

    // Normal scroll behavior
    if (currentScroll > 50) {
      this.element.classList.add("fixed", "has-background");
    } else {
      this.element.classList.remove("fixed", "has-background");
    }

    // Scroll direction → hide/show nav
    if (currentScroll > this.lastScrollY && currentScroll > 50) {
      GSAP.to(this.element, { yPercent: -100, duration: 0.5, ease: "power2.out", overwrite: "auto" });
    } else if (currentScroll < this.lastScrollY) {
      GSAP.to(this.element, { yPercent: 0, duration: 0.5, ease: "power2.out", overwrite: "auto" });
    }

    this.lastScrollY = currentScroll;
  }
}
