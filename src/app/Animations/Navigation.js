import GSAP from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

GSAP.registerPlugin(MorphSVGPlugin);

export default class Navigation {
  constructor({ element }) {
    this.element = element;
    this.isOpen = false;
    this.lastScrollY = 0;
    this.ticking = false;
    this.lastHiddenScroll = 0;

    // Define classes that require black text for the default state (Scroll Y = 0)
    const BLACK_TEXT_PAGES = ['contact', 'book', 'menu'];

    let initialColor = "#fff"; // Default to white (for 'home', 'about', etc.)

    // Check if the header element has any of the black-text classes
    if (BLACK_TEXT_PAGES.some(cls => this.element.classList.contains(cls))) {
      initialColor = "#000";
    }

    // Store the reliable color value
    this.initialTextColor = initialColor;
    this.desktopLinks = this.element.querySelectorAll(".navigation__links--desktop a");

    // CRITICAL FIX: Clear any problematic inline color style.
    this.element.style.color = '';

    // 1. Set the initial background state. We rely on CSS for the initial text color.
    GSAP.set(this.element, { backgroundColor: "transparent" });

    // NOTE: Removed explicit GSAP color sets here. The initial color 
    // is now managed by the high-specificity CSS rule to prevent the flicker.

    this.togglePath = this.element.querySelector(".navigation__icon--toggle svg path");
    this.hamburgerPath = "M3 6H21M3 12H21M3 18H21";
    this.closePath = "M4 4L20 20M20 4L4 20";

    this.desktopMM = GSAP.matchMedia();
    this._events();
    this._initScroll();
    this._setupMobileAnimations();
  }

  _setupMobileAnimations() {
    this.desktopMM.add(
      {
        isMobile: "(max-width: 768px)",
      },
      (context) => {
        if (context.conditions.isMobile) {
          this.mobileLinks = this.element.querySelector(".navigation__links--mobile");
          // hide mobile nav by default
          GSAP.set(this.mobileLinks, { xPercent: 100, visibility: "hidden", backgroundColor: "#EFEDEA", });
        }
      }
    );
  }

  animateIn() {
    if (!this.mobileLinks) return;
    this._updateStrokeColor();

    // Ensure background color is consistent for the menu itself
    GSAP.set(this.element, { backgroundColor: "#EFEDEA", color: "#000" });
    if (this.desktopLinks.length > 0) {
      GSAP.set(this.desktopLinks, { color: "#000" }); // Ensure desktop links are black too
    }

    const tl = GSAP.timeline({ defaults: { ease: "expo.out", duration: 0.6 } });

    GSAP.set(this.mobileLinks, { visibility: "visible", xPercent: 100, opacity: 0 });

    tl.to(this.mobileLinks, { xPercent: 0, opacity: 1, backgroundColor: "#EFEDEA" })
      .fromTo(
        this.mobileLinks.querySelectorAll(".mobile-links__wrapper a"),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.05 },
        "-=0.4"
      );

    this._disableScroll();
  }

  animateOut() {
    if (!this.mobileLinks) return;

    // Before animating out, run _handleScroll to reset header colors based on current scroll position
    this._handleScroll();
    this._updateStrokeColor();

    const tl = GSAP.timeline({
      defaults: { ease: "expo.in", duration: 0.5 },
      onComplete: () => {
        GSAP.set(this.mobileLinks, { visibility: "hidden" });
        this._enableScroll();
      }
    });

    tl.to(
      this.mobileLinks.querySelectorAll(".mobile-links__wrapper a"),
      { y: 20, opacity: 0, stagger: 0.05 }
    ).to(
      this.mobileLinks,
      { xPercent: 100, opacity: 0 }, // <-- Removed the "delay: 1" that was slowing the close animation
      "-=0.4"
    );
  }

  toggleMenu() {
    if (this.isOpen) {
      this.animateOut();
      GSAP.to(this.togglePath, {
        duration: 0.4,
        morphSVG: this.hamburgerPath,
        ease: "power2.inOut",
      });
      this.isOpen = false;
    } else {
      this.animateIn();
      GSAP.to(this.togglePath, {
        duration: 0.4,
        morphSVG: this.closePath,
        ease: "power2.inOut",
      });
      this.isOpen = true;
    }
  }

  _events() {
    const toggleContainer = this.element.querySelector(".navigation__icon--toggle");
    const navLinks = this.element.querySelectorAll(".navigation__links--mobile a");

    if (toggleContainer) {
      toggleContainer.addEventListener("click", () => this.toggleMenu());
    }

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (this.isOpen) this.toggleMenu();
      });
    });
  }

  _disableScroll() {
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
  }

  _enableScroll() {
    document.body.style.overflow = "";
    document.body.style.touchAction = "";
  }

  _initScroll() {
    window.addEventListener("scroll", () => {
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
    const currentScroll = window.scrollY;
    const scrollThreshold = 50;

    if (this.isOpen) return;

    // --- Background / Text Color ---

    // 1. Scrolling at the very top (currentScroll === 0)
    if (currentScroll === 0) {
      if (this.element.classList.contains('scrolled-down')) {

        // Determine if we need to animate the color
        let colorTarget = this.initialTextColor;
        let duration = 0.3;

        if (this.initialTextColor === "#000") {
          // If initial color is black, force instant color set (duration 0)
          // to prevent the GSAP transition flicker when returning to top.
          duration = 0;
        }

        // Revert to initial state
        GSAP.to(this.element, {
          backgroundColor: "transparent",
          color: colorTarget,
          duration: duration,
          ease: "power1.out",
        });
        // Revert desktop link colors to initial page color
        if (this.desktopLinks.length > 0) {
          GSAP.to(this.desktopLinks, { color: colorTarget, duration: duration, ease: "power1.out" });
        }
        this.element.classList.remove('scrolled-down');
      }
    }
    // 2. Scrolling past the top (transition to white header)
    else if (!this.element.classList.contains('scrolled-down')) {
      // Apply white header with BLACK text
      GSAP.to(this.element, {
        backgroundColor: "#fff",
        color: "#000", // Header container color set to black
        duration: 0.3,
        ease: "power1.out",
      });
      // Apply black to desktop links explicitly
      if (this.desktopLinks.length > 0) {
        GSAP.to(this.desktopLinks, { color: "#000", duration: 0.3, ease: "power1.out" });
      }
      this.element.classList.add('scrolled-down');
    }

    // --- Hide / Show Nav (Y-position) ---

    // Going down -> hide (if scrolled past threshold)
    if (currentScroll > this.lastScrollY && currentScroll > scrollThreshold) {
      const currentYPercent = GSAP.getProperty(this.element, "yPercent");
      if (currentYPercent !== -100) {
        GSAP.to(this.element, { yPercent: -100, duration: 0.3, ease: "power2.out" });
      }
      this.lastHiddenScroll = currentScroll;
    }
    // Going up -> show
    else if (currentScroll < this.lastScrollY && currentScroll < this.lastHiddenScroll - scrollThreshold) {
      const currentYPercent = GSAP.getProperty(this.element, "yPercent");
      if (currentYPercent !== 0) {
        GSAP.to(this.element, { yPercent: 0, duration: 0.3, ease: "power2.out" });
      }
    }

    this.lastScrollY = currentScroll;

    this._updateStrokeColor();
  }


  _updateStrokeColor() {
    if (this.isOpen) {
      // Mobile menu is open: BG is light, so stroke is black.
      GSAP.set(this.togglePath, { stroke: "#000" });
      return;
    }

    // Check if the current header background is white (meaning scrolled down)
    const computedColor = window.getComputedStyle(this.element).backgroundColor;
    const isWhiteBg = computedColor.includes("255, 255, 255");

    let strokeColor;

    if (isWhiteBg) {
      // Scrolled down (white BG) -> Stroke is black
      strokeColor = "#000";
    } else {
      // Transparent BG (Scroll Y=0) -> Stroke matches the page's default text color
      strokeColor = this.initialTextColor;
    }

    if (this.togglePath) {
      GSAP.set(this.togglePath, { stroke: strokeColor });
    }
  }
};