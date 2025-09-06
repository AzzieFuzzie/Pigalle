
// import Animation from '../classes/Animation';
import GSAP from 'gsap';

export default class Navigation {
  constructor({ element, elements }) {
    this.element = element;
    this.elements = elements;
    this.lastScrollY = 0; // ✅ initialize scroll state
    this.ticking = false;

    this._events();
    this._initScroll();
  }

  animateIn = () => {
    this.element.classList.add('active');
  };

  animateOut = () => {
    this.element.classList.remove('active');
  };

  _events() {
    const openBTN = document.querySelector('.navigation__icon--open');
    const closeBTN = document.querySelector('.navigation__icon--close');

    if (openBTN) openBTN.addEventListener('click', this.animateIn);
    if (closeBTN) closeBTN.addEventListener('click', this.animateOut);
  }

  _initScroll() {
    if (window.innerWidth <= 768) return; // ✅ desktop only
    window.addEventListener('scroll', () => {
      if (!this.ticking) {
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

    // Case 1: special pages (home/about) → sticky for 100dvh
    if (isSpecialPage && currentScroll < viewportHeight) {
      // Force nav visible + fixed
      GSAP.to(this.element, {
        yPercent: 0,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto"
      });

      this.element.classList.add("fixed");
      this.element.classList.remove("has-background"); // ✅ transparent until after 100dvh

      this.lastScrollY = currentScroll;
      return;
    }

    // Case 2: normal scroll behavior
    if (currentScroll <= 0) {
      // At top of page → reset nav
      GSAP.to(this.element, {
        yPercent: 0,
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto"
      });

      this.element.classList.remove("fixed", "has-background");
      this.lastScrollY = currentScroll;
      return;
    }

    // Add fixed & background after scrolling past threshold
    if (currentScroll > 50) {
      this.element.classList.add("fixed", "has-background");
    } else {
      this.element.classList.remove("fixed", "has-background");
    }

    // Scroll direction → hide/show nav
    if (currentScroll > this.lastScrollY && currentScroll > 50) {
      // scrolling down → hide nav
      GSAP.to(this.element, {
        yPercent: -100,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto"
      });
    } else if (currentScroll < this.lastScrollY) {
      // scrolling up → show nav
      GSAP.to(this.element, {
        yPercent: 0,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto"
      });
    }

    this.lastScrollY = currentScroll;
  }



}
