import GSAP from "gsap";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

GSAP.registerPlugin(MorphSVGPlugin);

export default class Navigation {
  constructor({ element }) {
    this.element = element;
    this.isOpen = false;
    this.lastScrollY = 0;
    this.ticking = false;
    GSAP.set(this.element, { backgroundColor: "transparent", color: "#fff" });
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
    this._updateStrokeColor()
    // Timeline
    const tl = GSAP.timeline({ defaults: { ease: "expo.out", duration: 0.6, backgroundColor: "#EFEDEA" } });

    // Set initial state for menu
    GSAP.set(this.mobileLinks, { visibility: "visible", xPercent: 100, opacity: 0, backgroundColor: "#EFEDEA" });

    // Animate menu in
    tl.to(this.mobileLinks, { xPercent: 0, opacity: 1, backgroundColor: "#EFEDEA" })
      .fromTo(
        this.mobileLinks.querySelectorAll("a, .mobile-socials"),
        { y: 20, opacity: 0, backgroundColor: "#EFEDEA" },
        { y: 0, opacity: 1, stagger: 0.05, backgroundColor: "#EFEDEA" },
        "-=0.4"
      );

    this._disableScroll();
  }

  animateOut() {
    this._updateStrokeColor()
    if (!this.mobileLinks) return;

    const tl = GSAP.timeline({
      defaults: { ease: "expo.in", duration: 0.5, backgroundColor: "#EFEDEA" },
      onComplete: () => GSAP.set(this.mobileLinks, { visibility: "hidden", backgroundColor: "#EFEDEA" })
    });

    tl.to(
      this.mobileLinks.querySelectorAll("a, .mobile-socials"),
      { y: 20, opacity: 0, stagger: 0.05, backgroundColor: "#EFEDEA" }
    ).to(
      this.mobileLinks,
      { xPercent: 100, opacity: 0, backgroundColor: "#EFEDEA" },
      "-=0.4"
    );

    this._enableScroll();
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
    // remove this check
    // if (window.innerWidth <= 768) return;

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
    const defaultColor = window.getComputedStyle(this.element).color;
    // --- Background / text color ---
    if (currentScroll === 0) {
      // Get the default CSS color for this header


      GSAP.to(this.element, {
        backgroundColor: "transparent",
        color: defaultColor, // use whatever is in CSS
        duration: 0.3,
        ease: "power1.out",
      });
    }

    else if (currentScroll > this.lastScrollY + 30) {
      // Scrolling down → white
      GSAP.to(this.element, {
        backgroundColor: "#fff",
        color: defaultColor,
        duration: 0.1,
        ease: "power1.out",
      });
    }
    else if (currentScroll < this.lastScrollY) {
      // Scrolling up → white
      GSAP.to(this.element, {
        backgroundColor: "#fff",
        color: "#000",
        duration: 0.3,
        ease: "power1.out",
      });
    }

    // --- Hide / show nav ---
    if (currentScroll > this.lastScrollY) {
      // going down → hide
      GSAP.to(this.element, {
        yPercent: -100,
        duration: 1.2,
        ease: "power2.out",
      });
      this.lastHiddenScroll = currentScroll;
    } else if (
      this.lastHiddenScroll !== undefined &&
      this.lastHiddenScroll - currentScroll > scrollThreshold
    ) {
      // going up enough → show
      GSAP.to(this.element, {
        yPercent: 0,
        duration: 1.2,
        ease: "power2.out",
      });
      this.lastHiddenScroll = undefined;
    }

    // only update once per cycle (not twice!)
    this.lastScrollY = currentScroll;

    this._updateStrokeColor();
  }


  _updateStrokeColor() {
    if (this.isOpen) {
      GSAP.set(this.togglePath, { stroke: "#000" });
      return;
    }

    // Determine stroke color based on current background brightness
    const bgColor = window.getComputedStyle(this.element).backgroundColor;
    const isLight = bgColor === "rgb(255, 255, 255)" || bgColor.includes("rgba(255, 255, 255"); // simple check
    const strokeColor = isLight ? "#000" : "#fff";
    if (this.togglePath) {
      GSAP.set(this.togglePath, { stroke: strokeColor });

    }
  }


};
