import GSAP from 'gsap';
import Component from '../classes/Component';
import { COLOR_BLACK, COLOR_WHITE } from '../utils/colors';

export default class Navigation extends Component {
  constructor({ template, lenis }) {
    super({
      element: '.navigation',
      elements: {
        links: '.navigation__links--desktop a',
        logo: '.navigation__logo__image'
      },
    });

    this.lenis = lenis;
    this.template = template;

    this.currentScroll = this.lenis.scroll;
    this.previousScroll = this.lenis.scroll;

    // --- Add this flag ---
    this.ticking = false;

    this.lenis.on('scroll', this.onScroll.bind(this));
  }

  onChange(template) {

    this.template = template;
    if (template === 'about' || template === 'home') {
      GSAP.to(this.element, {
        backgroundColor: 'transparent',
        duration: 0.5,

      });
      GSAP.to(this.elements.links, {
        color: COLOR_WHITE,
        autoAlpha: 1,
        duration: 0.75,

      });
    } else {
      GSAP.to(this.element, {
        backgroundColor: 'transparent',
        duration: 0.5,

      });
      GSAP.to(this.elements.links, {
        color: COLOR_BLACK,
        autoAlpha: 1,
        duration: 0.75,

      });
    }
  }

  // --- Modify this function ---
  onScroll(e) {
    this.previousScroll = this.currentScroll;
    this.currentScroll = e.scroll;

    // Throttle the execution using requestAnimationFrame
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        // Run your existing logic inside the animation frame
        this.checkScrollTop(this.template);
        this.ticking = false; // Reset the flag after execution
      });
      this.ticking = true; // Set the flag to prevent scheduling again until done
    }
  }
  // --- End modification ---

  checkScrollTop(template) {
    const scrollY = this.currentScroll;
    const prevY = this.previousScroll;

    // --- AT TOP ---
    if (scrollY <= 5) { // Use a small threshold instead of === 0 for reliability
      this.onChange(template);
      // Ensure nav stays visible when at top
      GSAP.to(this.element, { y: '0%', duration: 0.2 });
    }
    // --- SCROLLING DOWN ---
    else if (scrollY > prevY && scrollY > 50) { // Add a threshold (e.g., 50px)
      GSAP.to(this.element, {
        y: '-100%',
        duration: 0.4, // Slightly smoother hide

      });
      // Optionally fade out links faster when hiding
      GSAP.to(this.elements.links, {
        autoAlpha: 0,
        duration: 0.2,

      });
    }
    // --- SCROLLING UP ---
    else if (scrollY < prevY && scrollY > 5) { // Check against the threshold
      GSAP.to(this.element, {
        y: '0%',
        backgroundColor: COLOR_WHITE,
        duration: 0.5,

      });

      GSAP.to(this.elements.links, {
        autoAlpha: 1,
        color: COLOR_BLACK,
        duration: 0.5, // Match background duration
        stagger: 0.05, // Keep subtle stagger
        ease: 'power2.out',
        delay: 0.1, // Shorten delay

      });
    }
  }
}