import Component from '../classes/Component';
import GSAP from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

GSAP.registerPlugin(ScrollTrigger);

export default class Marquee extends Component {
  constructor({ element, elements }) {
    super({ element, elements }); // Pass arguments to base class

    // Bind 'this' context for methods used as callbacks or event listeners
    this._onResize = this._onResize.bind(this);
    this.init = this.init.bind(this); // Bind init for use in timeouts

    this.element = element;
    this.wrapper = this.element.querySelector('.marquee__wrapper');
    this.direction = this.element.dataset.direction || "left"; // Default to "left"

    this.tween = null; // Initialize tween/ScrollTrigger properties
    this.scrollTrigger = null;
    this.resizeTimeout = null; // For debouncing resize

    // --- Performance Optimization: Add will-change via JS ---
    // More targeted than adding it globally via CSS
    GSAP.set(this.element, { willChange: 'transform' });

    // Initialize after a short delay to ensure DOM measurements are accurate
    // Consider using requestAnimationFrame for even better timing
    this.initTimeout = setTimeout(this.init, 100);

    window.addEventListener("resize", this._onResize, { passive: true }); // Use passive listener
  }

  init() {
    // Clear any previous animations and ScrollTriggers before recreating
    this.destroyAnimations();

    // Ensure wrapper exists before proceeding
    if (!this.wrapper) {
      console.error("Marquee wrapper not found for element:", this.element);
      return;
    }

    // --- Dynamic Duration Calculation ---
    this.wrapperWidth = this.wrapper.getBoundingClientRect().width;
    const move = this.direction === "left" ? -this.wrapperWidth : this.wrapperWidth;
    const pixelsPerSecond = 150; // Adjust this value to control speed (increased for example)
    // Prevent division by zero and handle cases where width might be 0 initially
    const dynamicDuration = this.wrapperWidth > 0 ? this.wrapperWidth / pixelsPerSecond : 10; // Default duration if width is 0

    // --- Create GSAP Tween ---
    this.tween = GSAP.to(this.element, {
      x: `${move}px`,
      duration: dynamicDuration,
      ease: "none",
      repeat: -1,
      paused: true, // Start paused, ScrollTrigger will control playback
      overwrite: true // Prevent overlapping tweens on fast re-init
    });

    // --- Create ScrollTrigger ---
    this.scrollTrigger = ScrollTrigger.create({
      trigger: this.element,
      start: "top bottom+=50", // Start slightly later when entering viewport
      end: "bottom top-=50",   // End slightly earlier when leaving viewport
      // Play/Pause callbacks
      onEnter: () => this.tween?.play(), // Use optional chaining
      onEnterBack: () => this.tween?.play(),
      onLeave: () => this.tween?.pause(),
      onLeaveBack: () => this.tween?.pause(),
      // --- FIX for stopping after resize ---
      // onRefreshInit ensures the correct play/pause state is set immediately
      // after ScrollTrigger recalculates positions (on init and resize).
      onRefreshInit: (self) => {
        if (self.isActive) {
          this.tween?.play();
        } else {
          this.tween?.pause();
        }
      },
      // invalidateOnRefresh: true // Usually good for scrub, less critical here but doesn't hurt
      markers: false, // Keep markers off for production
    });
  }

  _onResize() {
    // Debounce the resize handler to limit how often init() is called
    clearTimeout(this.resizeTimeout);
    // Re-initialize after a short delay once resizing stops
    this.resizeTimeout = setTimeout(this.init, 250); // Increased debounce delay slightly
  }

  destroyAnimations() {
    // Safely kill the tween and ScrollTrigger instance
    this.scrollTrigger?.kill();
    this.tween?.kill();
    this.scrollTrigger = null;
    this.tween = null;
  }

  destroy() {
    // Complete cleanup: clear timeouts, remove listeners, destroy animations
    clearTimeout(this.initTimeout);
    clearTimeout(this.resizeTimeout);
    window.removeEventListener("resize", this._onResize);
    this.destroyAnimations();

    GSAP.set(this.element, { willChange: 'auto' });

    // Nullify references (optional, helps garbage collection)
    this.element = null;
    this.wrapper = null;
    // Call super.destroy() if the base Component class has a destroy method
    // super.destroy(); 
  }
}