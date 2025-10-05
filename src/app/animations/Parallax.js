import Component from '../classes/Component';
import GSAP from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

GSAP.registerPlugin(ScrollTrigger);

export default class Parallax extends Component {
  constructor({ element, elements }) {
    super({ element, elements });
    this.element = element;
    this.mm = GSAP.matchMedia(); // Create a matchMedia instance
    this.animateIn();
  }

  animateIn() {
    const yRange = GSAP.utils.random(20, 40);
    const rotationRange = GSAP.utils.random(-1, 1);
    const scaleMin = 0.2;
    const scaleMax = 1;

    GSAP.set(this.element, { yPercent: 0, scale: scaleMin, rotation: 0, transformOrigin: "center center" });

    // --- START: MOBILE OPTIMIZATION ---

    // Desktop Animation (large screens)
    this.mm.add("(min-width: 1024px)", () => {
      // Store the scale trigger so we can kill it later
      const scaleTrigger = ScrollTrigger.create({
        trigger: this.element,
        start: "top bottom",
        onEnter: () => {
          GSAP.to(this.element, {
            scale: scaleMax,
            duration: 0.6,
            ease: "expo.Inout"
          });
        }
      });

      const tween = GSAP.to(this.element, {
        yPercent: yRange,
        rotation: rotationRange,
        ease: "none",
        scrollTrigger: {
          trigger: this.element,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
          invalidateOnRefresh: true
        }
      });

      // Return a cleanup function to be called when the media query no longer matches
      return () => {
        scaleTrigger?.kill();
        tween?.scrollTrigger?.kill();
        tween?.kill();
      };
    });

    // Mobile Animation (smaller screens)
    this.mm.add("(max-width: 1023px)", () => {
      // A single, simple animation that plays once when the element enters the screen.
      // This is much more performant than a scrub animation.
      const tween = GSAP.to(this.element, {
        scale: scaleMax,
        yPercent: yRange / 2, // A smaller, one-time parallax effect
        rotation: rotationRange,
        duration: 1.0,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: this.element,
          start: 'top 85%', // Trigger when it's 85% from the top of the viewport
          toggleActions: 'play none none none' // Play once and don't repeat
        }
      });

      return () => {
        tween?.scrollTrigger?.kill();
        tween?.kill();
      };
    });

    // --- END: MOBILE OPTIMIZATION ---
  }

  destroy() {
    console.log('killed');
    // Revert the matchMedia instance, which automatically cleans up
    // all the animations and ScrollTriggers created within it.
    this.mm.revert();
  }
}