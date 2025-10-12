import GSAP from "gsap";

export default class Transition {
  constructor({ lenis }) {
    this.cols = document.querySelectorAll(".transition__col");
    this.lenis = lenis;
    this.mm = GSAP.matchMedia();

    // We need a reference to the main content area for the mobile fade.
    this.content = document.querySelector('.content');

    this.setupAnimations();
  }

  _disableScroll() {
    if (this.lenis) this.lenis.stop();
  }

  _enableScroll() {
    if (this.lenis) this.lenis.start();
  }

  setupAnimations() {
    // ===== DESKTOP SETUP (No changes here) =====
    this.mm.add("(min-width: 769px)", () => {
      GSAP.set(this.cols, {
        scaleY: 0,
        transformOrigin: "bottom center",
        display: 'block',
      });

      this.enterAnimation = () => {
        this._disableScroll();
        return GSAP.to(this.cols, {
          scaleY: 1,
          ease: "power2.inOut",
          duration: 0.6,
          stagger: 0.2,
        });
      };

      this.leaveAnimation = () => GSAP.to(this.cols, {
        scaleY: 0,
        ease: "power2.inOut",
        duration: 0.6,
        stagger: 0.15,
        onComplete: () => this._enableScroll(),
      });

      return () => {
        GSAP.set(this.cols, { clearProps: "all" });
      };
    });
    // ===== MOBILE SETUP (Final version with ScrollTrigger fix) =====
    this.mm.add("(max-width: 768px)", () => {
      GSAP.set(this.cols, { display: 'none' });

      // On mobile, fade and slide the old content up and out.
      this.enterAnimation = () => GSAP.to(this.content, {
        autoAlpha: 0,
        y: 20,
        duration: 0.5,
        ease: 'power3.inOut',
      });

      // Slide the new content in and then CLEAN UP the transform property.
      this.leaveAnimation = () => GSAP.to(this.content, {

        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        ease: 'power3.inOut',
        clearProps: 'transform',
      });
    });
  }

  async onEnter() {
    // This will call the correct function (desktop columns or mobile fade-out).
    return this.enterAnimation();
  }

  async onLeave() {
    // This will call the correct function (desktop columns or mobile fade-in).
    return this.leaveAnimation();
  }
}