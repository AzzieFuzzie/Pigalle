import GSAP from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

GSAP.registerPlugin(MorphSVGPlugin);

export default class Navigation {
  constructor({ element }) {
    this.element = element;
    if (!this.element) return; // guard

    this.background = this.element.querySelector('.navigation__background');
    this.desktopLinks = this.element.querySelectorAll(".navigation__links--desktop a");
    this.toggleContainer = this.element.querySelector(".navigation__icon--toggle");
    this.togglePath = this.element.querySelector(".navigation__icon--toggle svg path");
    this.mobileLinks = this.element.querySelector(".navigation__links--mobile");

    const BLACK_TEXT_PAGES = ['contact', 'book', 'menu'];
    this.isBlackTextPage = BLACK_TEXT_PAGES.some(cls =>
      document.documentElement.classList.contains(cls)
    );
    this.initialTextColor = this.isBlackTextPage ? "#000" : "#fff";

    this.isOpen = false;
    this.isAnimating = false;
    this.lastScrollY = 0;
    this.ticking = false;

    this.quickToY = GSAP.quickTo(this.element, "yPercent", { duration: 0.6, ease: "power2.out" });
    this.hamburgerPath = "M3 6H21M3 12H21M3 18H21";
    this.closePath = "M4 4L20 20M20 4L4 20";

    this.desktopMM = GSAP.matchMedia();

    this._toggleHandler = this.toggleMenu.bind(this);
    this._scrollHandler = this._onScroll.bind(this);
    this._pageshowHandler = this._setInitialState.bind(this);

    this._setInitialState();
    this._setupMobileQuery();
    this._events();
    this._initScroll();

    window.addEventListener("pageshow", this._pageshowHandler, { passive: true });
  }

  _setInitialState() {
    this.isOpen = false;
    this.isAnimating = false;

    if (this.togglePath) {
      GSAP.set(this.togglePath, { attr: { d: this.hamburgerPath }, stroke: this.initialTextColor });
    }

    if (this.mobileLinks) {
      GSAP.set(this.mobileLinks, { xPercent: 100, visibility: "hidden", opacity: 1 });
    }

    if (window.scrollY <= 20) {
      this.element.classList.remove('scroll-up');
    } else {
      this.element.classList.add('scroll-up');
    }

    const isScrolled = this.element.classList.contains('scroll-up');
    const targetTextColor = isScrolled ? '#000' : this.initialTextColor;

    GSAP.set(this.element, { color: targetTextColor });
    if (this.desktopLinks.length) GSAP.set(this.desktopLinks, { color: targetTextColor });
    if (this.togglePath) GSAP.set(this.togglePath, { stroke: targetTextColor });
  }

  _setupMobileQuery() {
    this.desktopMM.add({ isMobile: "(max-width: 768px)" }, (context) => {
      if (context.conditions.isMobile) {
        this._mobileAnchors = this.mobileLinks ? this.mobileLinks.querySelectorAll(".mobile-links__wrapper a") : [];
      }
    });
  }

  animateIn() {
    if (!this.mobileLinks || this.isAnimating) return;
    this.isAnimating = true;
    this.isOpen = true;

    this._mobileAnchors = this.mobileLinks.querySelectorAll(".mobile-links__wrapper a");
    GSAP.set(this.mobileLinks, { visibility: "visible", opacity: 1 });

    const tl = GSAP.timeline({
      defaults: { ease: "power3.out", duration: 0.6 },
      onComplete: () => { this.isAnimating = false; }
    });

    this.element.classList.add('scroll-up');
    if (this.togglePath) GSAP.set(this.togglePath, { stroke: "#000" });

    tl.to(this.mobileLinks, { xPercent: 0 })
      .fromTo(this._mobileAnchors, { yPercent: 100 }, { yPercent: 0, stagger: 0.05 }, "<0.4");

    this._disableScroll();
  }

  animateOut() {
    if (!this.mobileLinks || this.isAnimating) return;
    this.isAnimating = true;
    this.isOpen = false;

    const tl = GSAP.timeline({
      defaults: { ease: "power4.out", duration: 0.6 },
      onComplete: () => {
        GSAP.set(this.mobileLinks, { visibility: "hidden", opacity: 1 });
        this._enableScroll();

        // ✅ FIX: no white flash — only restore scroll-up state after GSAP has reset
        // Wait a tick for scroll position to settle before restoring header background
        requestAnimationFrame(() => {
          this._restoreHeaderState();
        });

        this.isAnimating = false;
        if (this.togglePath) GSAP.set(this.togglePath, { attr: { d: this.hamburgerPath } });
      }
    });

    tl.to(this._mobileAnchors, { yPercent: 100, stagger: 0.05, duration: 0.35 }, 0)
      .to(this.mobileLinks, { xPercent: 100, duration: 0.55 }, "<0.05");
  }

  toggleMenu() {
    if (this.isAnimating) return;

    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.animateIn();
      if (this.togglePath)
        GSAP.to(this.togglePath, { duration: 0.4, morphSVG: this.closePath, ease: "power2.inOut" });
    } else {
      this.animateOut();
      if (this.togglePath)
        GSAP.to(this.togglePath, { duration: 0.4, morphSVG: this.hamburgerPath, ease: "power2.inOut" });
    }
  }

  _restoreHeaderState() {
    // ✅ FIX: Prevent white flash — only add bg if user has scrolled up, not on close
    const currentScroll = window.scrollY;
    const isScrolledUp = currentScroll < this.lastScrollY;
    if (isScrolledUp && currentScroll > 20) {
      this.element.classList.add('scroll-up');
    } else if (currentScroll <= 20) {
      this.element.classList.remove('scroll-up');
    }

    this._handleScroll(true);
  }

  _handleScroll(forceUpdate = false) {
    const currentScroll = window.scrollY;
    const scrollThreshold = 20;

    if (this.isOpen && !forceUpdate) return;

    if (currentScroll > this.lastScrollY && currentScroll > 50) {
      this.quickToY(-100);
    } else if (currentScroll < this.lastScrollY) {
      this.quickToY(0);
    }

    if (currentScroll > scrollThreshold) {
      this.element.classList.add('scroll-up');
    } else {
      this.element.classList.remove('scroll-up');
    }

    this.lastScrollY = currentScroll;
    this._updateStrokeColor();
  }

  _updateStrokeColor() {
    if (!this.togglePath) return;
    if (this.isOpen) {
      GSAP.set(this.togglePath, { stroke: "#000" });
      return;
    }
    const isScrolled = this.element.classList.contains('scroll-up');
    const targetColor = isScrolled ? '#000' : this.initialTextColor;
    GSAP.set(this.togglePath, { stroke: targetColor });
  }

  _events() {
    if (this.toggleContainer) {
      try { this.toggleContainer.removeEventListener("click", this._toggleHandler); } catch (e) { }
      this.toggleContainer.addEventListener("click", this._toggleHandler);
    }

    this.desktopMM.add({ isMobile: "(max-width: 768px)" }, (context) => {
      if (context.conditions.isMobile && this.mobileLinks) {
        const anchors = this.mobileLinks.querySelectorAll(".mobile-links__wrapper a");

        if (this._linkHandler && this._mobileAnchors) {
          this._mobileAnchors.forEach(link => {
            try { link.removeEventListener("click", this._linkHandler); } catch (e) { }
          });
        }

        this._linkHandler = (e) => {
          if (this.isOpen && !this.isAnimating) {
            this.toggleMenu();
          }
        };

        anchors.forEach(link => link.addEventListener("click", this._linkHandler));
        this._mobileAnchors = anchors;
      }
    });
  }

  _onScroll() {
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        this._handleScroll();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  _initScroll() {
    try { window.removeEventListener("scroll", this._scrollHandler); } catch (e) { }
    window.addEventListener("scroll", this._scrollHandler, { passive: true });
  }

  _disableScroll() {
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
  }

  _enableScroll() {
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
  }

  destroy() {
    if (this.toggleContainer) {
      try { this.toggleContainer.removeEventListener("click", this._toggleHandler); } catch (e) { }
    }
    try { window.removeEventListener("scroll", this._scrollHandler); } catch (e) { }
    try { window.removeEventListener("pageshow", this._pageshowHandler); } catch (e) { }

    if (this._mobileAnchors && this._linkHandler) {
      this._mobileAnchors.forEach(link => {
        try { link.removeEventListener("click", this._linkHandler); } catch (e) { }
      });
    }

    try { GSAP.killTweensOf(this.mobileLinks); } catch (e) { }
  }
}
