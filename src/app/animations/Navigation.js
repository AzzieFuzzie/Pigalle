import GSAP from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

GSAP.registerPlugin(MorphSVGPlugin);

export default class Navigation {
  constructor({ element }) {
    this.element = element;
    this.isOpen = false;
    this.isAnimating = false; // Guard to prevent erratic behavior during animation
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

    // --- QUICKTO SETUP (PERFORMANCE CRITICAL) ---
    // Create quick access functions once in the constructor. They are ultra-fast
    // replacements for GSAP.to() that avoid creating new tween objects constantly.

    // 1. Hide/Show Y-position (duration 0.6s carried over from previous code)
    this.quickToY = GSAP.quickTo(this.element, "yPercent", { duration: 0.6, ease: "power2.out" });

    // 2. Background and Color transitions (duration 0.3s)
    this.quickToBgColor = GSAP.quickTo(this.element, "backgroundColor", { duration: 0.3, ease: "power1.out" });
    this.quickToColor = GSAP.quickTo(this.element, "color", { duration: 0.3, ease: "power1.out" });

    if (this.desktopLinks.length > 0) {
      this.quickToDesktopColor = GSAP.quickTo(this.desktopLinks, "color", { duration: 0.3, ease: "power1.out" });
    } else {
      // Fallback for safety if no desktop links exist
      this.quickToDesktopColor = () => { };
    }
    // --- END QUICKTO SETUP ---


    // CRITICAL FIX: Clear any problematic inline color style from CSS conflicts.
    this.element.style.color = '';

    // 1. Set the initial background state to transparent.
    GSAP.set(this.element, { backgroundColor: "transparent" });

    // --- Apply initial text color immediately to prevent any flicker ---
    GSAP.set(this.element, { color: this.initialTextColor });
    if (this.desktopLinks.length > 0) {
      GSAP.set(this.desktopLinks, { color: this.initialTextColor });
    }
    // -----------------------------------------------------------------------

    this.togglePath = this.element.querySelector(".navigation__icon--toggle svg path");
    this.hamburgerPath = "M3 6H21M3 12H21M3 18H21";
    this.closePath = "M4 4L20 20M20 4L4 20";

    this.desktopMM = GSAP.matchMedia();

    // Cache the toggle container (used by _events)
    this.toggleContainer = this.element.querySelector(".navigation__icon--toggle");

    // Keep original call order to avoid changing behavior
    this._events();
    this._initScroll();
    this._setupMobileAnimations();

    // Set the initial icon stroke color immediately
    if (this.togglePath) {
      GSAP.set(this.togglePath, { stroke: this.initialTextColor });
    }
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
          if (this.mobileLinks) {
            GSAP.set(this.mobileLinks, { xPercent: 100, visibility: "hidden", backgroundColor: "#EFEDEA" });
            // Cache the mobile link anchors for event binding & animation usage
            this._mobileAnchors = this.mobileLinks.querySelectorAll(".mobile-links__wrapper a");
          } else {
            this._mobileAnchors = [];
          }
        }
      }
    );
  }

  animateIn() {
    if (!this.mobileLinks) return;

    // Set the stroke color immediately when opening (should be black for light menu BG)
    this._updateStrokeColor(true);

    // Ensure header background color is light/grey when menu is open
    GSAP.set(this.element, { backgroundColor: "#EFEDEA", color: "#000" });
    if (this.desktopLinks.length > 0) {
      GSAP.set(this.desktopLinks, { color: "#000" });
    }

    const tl = GSAP.timeline({
      defaults: { ease: "power3.out", duration: 0.6 },
      onStart: () => { this.isAnimating = true; } // Start animating flag
    });

    GSAP.set(this.mobileLinks, { visibility: "visible" });

    // Keep the exact same animation sequence + timings as original
    tl.to(this.mobileLinks, { xPercent: 0, backgroundColor: "#EFEDEA" })
      .fromTo(
        this.mobileLinks.querySelectorAll(".mobile-links__wrapper a"),
        { yPercent: 100 },
        { yPercent: 0, stagger: 0.05, onComplete: () => { this.isAnimating = false; } } // End animating flag
      );

    this._disableScroll();
  }

  animateOut() {
    if (!this.mobileLinks) return;

    const tl = GSAP.timeline({
      defaults: { ease: "power4.out", duration: 0.8 },
      onStart: () => { this.isAnimating = true; }, // Start animating flag
      onComplete: () => {
        GSAP.set(this.mobileLinks, { visibility: "hidden" });
        this._enableScroll();
        this._restoreHeaderState(); // CRITICAL: Restore header state after animation finishes
        this.isAnimating = false; // End animating flag
      }
    });

    // Keep exact same sequence + timings as original
    tl.to(
      this.mobileLinks.querySelectorAll(".mobile-links__wrapper a"),
      { yPercent: 100, duration: .8, stagger: 0.05 }
    ).to(
      this.mobileLinks,
      { xPercent: 100 },
      "<0.1" // Start menu slide slightly before link slide finishes
    );
  }

  toggleMenu() {
    // PREVENT CONFLICT: Exit early if an animation is active
    if (this.isAnimating) return;

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

  _restoreHeaderState() {
    // This is called when the menu closes. It must be instant.

    // Check if we are at the very top of the page.
    if (window.scrollY === 0) {
      let colorTarget = this.initialTextColor;

      // 1. Instant Transparent Background and Text Color Reset
      // Use quickTo functions with duration 0 to achieve an immediate GSAP.set() effect.
      this.quickToY(0, 0); // Ensure header is shown instantly if it was hidden
      // this.quickToBgColor("transparent", 0);
      this.quickToColor(colorTarget, 0);
      this.quickToDesktopColor(colorTarget, 0);

      this.element.classList.remove('scroll-up');

      // 2. Instant Icon Stroke Color Reset
      this._updateStrokeColor();

    } else {
      // If the user closed the menu while scrolled down, trigger the scroll logic
      // to transition back to the 'scrolled down' white header (animated).
      this._handleScroll();
      this._updateStrokeColor();
    }
  }



  _handleScroll() {
    const currentScroll = window.scrollY;
    // Define the threshold here. 20px is a good starting point.
    const scrollThreshold = 20;

    // Do not run scroll effects if the menu is open
    if (this.isOpen) return;

    // --- Directional Logic ---

    // 1. Scrolling DOWN: Hide the navigation
    if (currentScroll > this.lastScrollY && currentScroll > 50) { // Keep original 50px threshold for hiding
      this.quickToY(-100);
      this.lastHiddenScroll = currentScroll;
    }
    // 2. Scrolling UP: Show the navigation with the background
    else if (currentScroll < this.lastScrollY) {
      this.quickToY(0); // Show the nav

      // Only add the background if we are below the top threshold
      if (currentScroll > scrollThreshold) {
        this.quickToBgColor("#fff");
        this.quickToColor("#000");
        this.quickToDesktopColor("#000");
        this.element.classList.add('scroll-up');
      }
    }

    // --- Reset Logic (The Improved Part) ---
    // If we are within the threshold at the top of the page, reset to transparent.
    if (currentScroll <= scrollThreshold) {
      // Check if the nav has a background before animating it away
      if (this.element.classList.contains('scroll-up')) {
        let colorTarget = this.initialTextColor;

        this.quickToBgColor("transparent");
        this.quickToColor(colorTarget);
        this.quickToDesktopColor(colorTarget);

        this.element.classList.remove('scroll-up');
      }
    }

    // Finally, update the scroll position and icon color for the next event
    this.lastScrollY = currentScroll;
    this._updateStrokeColor();
  }
  _updateStrokeColor(isOpening = false) {
    if (!this.togglePath) return;

    if (this.isOpen || isOpening) {
      // Mobile menu is open: BG is light, so stroke is black.
      GSAP.set(this.togglePath, { stroke: "#000" });
      return;
    }

    // Rely on the class added by _handleScroll to know if the background is currently white.
    const isScrolledDown = this.element.classList.contains('scroll-up');

    let strokeColor;

    if (isScrolledDown) {
      // Scrolled down (white BG) -> Stroke is black
      strokeColor = "#000";
    } else {
      // Transparent BG (Scroll Y=0) -> Stroke matches the page's default text color
      strokeColor = this.initialTextColor;
    }

    GSAP.set(this.togglePath, { stroke: strokeColor });
  }


  _events() {
    const toggleContainer = this.toggleContainer;
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
    // Set the listener to passive for performance
    window.addEventListener("scroll", () => {
      // Only process scroll if the menu is closed
      if (!this.ticking && !this.isOpen) {
        window.requestAnimationFrame(() => {
          this._handleScroll();
          this.ticking = false;
        });
        this.ticking = true;
      }
    }, { passive: true });
  }
}