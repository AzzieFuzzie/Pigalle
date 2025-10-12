import GSAP from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

GSAP.registerPlugin(MorphSVGPlugin);

export default class Navigation {
  constructor({ element }) {
    this.element = element;
    if (!this.element) return; // guard

    // Core elements (matches your Pug/HTML)
    this.background = this.element.querySelector('.navigation__background');
    this.desktopLinks = this.element.querySelectorAll(".navigation__links--desktop a");
    this.toggleContainer = this.element.querySelector(".navigation__icon--toggle");
    this.togglePath = this.element.querySelector(".navigation__icon--toggle svg path");
    this.mobileLinks = this.element.querySelector(".navigation__links--mobile");

    // Page-specific color setup (keeps previous behavior)
    const BLACK_TEXT_PAGES = ['contact', 'book', 'menu'];
    this.isBlackTextPage = BLACK_TEXT_PAGES.some(cls =>
      document.documentElement.classList.contains(cls)
    );
    this.initialTextColor = this.isBlackTextPage ? "#000" : "#fff";

    // State
    this.isOpen = false;
    this.isAnimating = false;
    this.lastScrollY = 0;
    this.ticking = false;

    // GSAP helpers
    this.quickToY = GSAP.quickTo(this.element, "yPercent", { duration: 0.6, ease: "power2.out" });
    this.hamburgerPath = "M3 6H21M3 12H21M3 18H21";
    this.closePath = "M4 4L20 20M20 4L4 20";

    this.desktopMM = GSAP.matchMedia();

    // Bind handlers so we can add/remove listeners reliably
    this._toggleHandler = this.toggleMenu.bind(this);
    this._scrollHandler = this._onScroll.bind(this);
    this._pageshowHandler = this._setInitialState.bind(this);

    // Setup
    this._setInitialState();
    this._setupMobileQuery();
    this._events();
    this._initScroll();

    // Reset state when page is shown (back/forward navigation)
    window.addEventListener("pageshow", this._pageshowHandler, { passive: true });
  }

  // -------------------------
  // INITIAL STATE
  // -------------------------
  _setInitialState() {
    this.isOpen = false;
    this.isAnimating = false;

    if (this.togglePath) {
      GSAP.set(this.togglePath, { attr: { d: this.hamburgerPath }, stroke: this.initialTextColor });
    }

    // ensure mobile panel is off-screen and invisible to start
    if (this.mobileLinks) {
      // set xPercent and keep visible so we avoid white flash on first close
      GSAP.set(this.mobileLinks, { xPercent: 100, visibility: "hidden", opacity: 1 });
    }

    // header color based on scroll
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

  // -------------------------
  // matchMedia setup for mobile anchors
  // -------------------------
  _setupMobileQuery() {
    this.desktopMM.add({ isMobile: "(max-width: 768px)" }, (context) => {
      if (context.conditions.isMobile) {
        // don't permanently store anchors here — we'll always refresh right before animation
        // but keep a quick reference for event wiring when needed
        this._mobileAnchors = this.mobileLinks ? this.mobileLinks.querySelectorAll(".mobile-links__wrapper a") : [];
      }
    });
  }

  // -------------------------
  // ANIMATE IN / OUT
  // -------------------------
  animateIn() {
    if (!this.mobileLinks || this.isAnimating) return;
    this.isAnimating = true;
    this.isOpen = true;

    // Always refresh anchors to current DOM nodes (fixes disappearing links)
    this._mobileAnchors = this.mobileLinks.querySelectorAll(".mobile-links__wrapper a");

    // Make sure mobileLinks visible immediately to avoid seeing page flash
    GSAP.set(this.mobileLinks, { visibility: "visible", opacity: 1 });

    // timeline: slide panel in and animate anchors
    const tl = GSAP.timeline({
      defaults: { ease: "power3.out", duration: 0.6 },
      onComplete: () => { this.isAnimating = false; }
    });

    // push header to scroll-up state and set icon color for contrast
    this.element.classList.add('scroll-up');
    if (this.togglePath) GSAP.set(this.togglePath, { stroke: "#000" });

    tl.to(this.mobileLinks, { xPercent: 0 })
      .fromTo(this._mobileAnchors, { yPercent: 100 }, { yPercent: 0, stagger: 0.05 }, "<");

    this._disableScroll();
  }

  animateOut() {
    if (!this.mobileLinks || this.isAnimating) return;
    this.isAnimating = true;
    this.isOpen = false;

    // timeline: animate anchors out, slide panel out, then hide it and restore state
    const tl = GSAP.timeline({
      defaults: { ease: "power4.out", duration: 0.6 },
      onComplete: () => {
        // ensure visibility hidden only after panel moved off-screen and opacity restored
        GSAP.set(this.mobileLinks, { visibility: "hidden", opacity: 1 });
        this._enableScroll();
        this._restoreHeaderState();
        this.isAnimating = false;
        // reset icon path to hamburger as safety
        if (this.togglePath) GSAP.set(this.togglePath, { attr: { d: this.hamburgerPath } });
      }
    });

    // fade anchors out slightly and move, then slide the panel and keep its background during collapse so no white flash
    tl.to(this._mobileAnchors, { yPercent: 100, stagger: 0.05, duration: 0.35 }, 0)
      .to(this.mobileLinks, { xPercent: 100, duration: 0.55 }, "<0.05");
  }

  toggleMenu() {
    if (this.isAnimating) return;

    // Toggle and run appropriate animation + morph icon
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.animateIn();
      if (this.togglePath) GSAP.to(this.togglePath, { duration: 0.4, morphSVG: this.closePath, ease: "power2.inOut" });
    } else {
      this.animateOut();
      if (this.togglePath) GSAP.to(this.togglePath, { duration: 0.4, morphSVG: this.hamburgerPath, ease: "power2.inOut" });
    }
  }

  // -------------------------
  // SCROLL / HEADER STATE
  // -------------------------
  _restoreHeaderState() {
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

  // -------------------------
  // EVENTS
  // -------------------------
  _events() {
    // Ensure we don't attach duplicate listeners: remove first if present
    if (this.toggleContainer) {
      try { this.toggleContainer.removeEventListener("click", this._toggleHandler); } catch (e) { }
      this.toggleContainer.addEventListener("click", this._toggleHandler);
    }

    // Wire mobile anchors via matchMedia so we reattach on breakpoint change,
    // but avoid cloning nodes — instead remove old listeners if set.
    this.desktopMM.add({ isMobile: "(max-width: 768px)" }, (context) => {
      if (context.conditions.isMobile && this.mobileLinks) {
        // Refresh nodes
        const anchors = this.mobileLinks.querySelectorAll(".mobile-links__wrapper a");

        // Remove previous link handler if it existed
        if (this._linkHandler && this._mobileAnchors) {
          this._mobileAnchors.forEach(link => {
            try { link.removeEventListener("click", this._linkHandler); } catch (e) { }
          });
        }

        // create a stable handler and add listeners
        this._linkHandler = (e) => {
          // if link is clicked, close menu (if open)
          if (this.isOpen && !this.isAnimating) {
            // small delay to allow navigation to start before animating out (optional)
            this.toggleMenu();
          }
        };

        anchors.forEach(link => link.addEventListener("click", this._linkHandler));

        // store current anchors for potential cleanup
        this._mobileAnchors = anchors;
      }
    });
  }

  // -------------------------
  // Scroll listener wrapper for RAF throttling
  // -------------------------
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
    // remove first to avoid duplicates, then add
    try { window.removeEventListener("scroll", this._scrollHandler); } catch (e) { }
    window.addEventListener("scroll", this._scrollHandler, { passive: true });
  }

  // -------------------------
  // scroll lock helpers
  // -------------------------
  _disableScroll() {
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
  }

  _enableScroll() {
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
  }

  // -------------------------
  // cleanup for SPA
  // -------------------------
  destroy() {
    // remove DOM listeners
    if (this.toggleContainer) {
      try { this.toggleContainer.removeEventListener("click", this._toggleHandler); } catch (e) { }
    }
    try { window.removeEventListener("scroll", this._scrollHandler); } catch (e) { }
    try { window.removeEventListener("pageshow", this._pageshowHandler); } catch (e) { }

    // remove mobile anchors handlers
    if (this._mobileAnchors && this._linkHandler) {
      this._mobileAnchors.forEach(link => {
        try { link.removeEventListener("click", this._linkHandler); } catch (e) { }
      });
    }

    // kill GSAP tweens to avoid leaks
    try { GSAP.killTweensOf(this.mobileLinks); } catch (e) { }
  }
}
