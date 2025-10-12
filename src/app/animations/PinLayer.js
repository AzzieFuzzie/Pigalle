import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

GSAP.registerPlugin(ScrollTrigger);

export default class PinLayer {
  constructor({ element }) {
    this.element = element;

    this.scrollTrigger = null;
    this._animate();
  }

  _animate() {
    // Create a GSAP tween that moves the element up while scrolling
    this.tween = GSAP.to(this.element, {
      // The animation you want to add
      // yPercent: -50, // Moves the element up by 50% of its own height. Adjust as you like.
      // ease: "linear",  // A linear ease works best with scrub

      // Your ScrollTrigger settings are now attached to the tween
      scrollTrigger: {
        trigger: this.element,
        start: "top top",
        end: "bottom top",
        pin: true,
        pinSpacing: false,
        // scrub: true,
        markers: false,
      },
    });
  }
  destroy() {
    this.tween?.kill();
    this.tween = null;

  }
}
