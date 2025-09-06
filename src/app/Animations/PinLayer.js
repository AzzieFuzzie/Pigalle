import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

GSAP.registerPlugin(ScrollTrigger);

export default class PinLayer {
  constructor({ element }) {
    this.heroSection = element;
    this._animate();
  }

  _animate() {

    ScrollTrigger.create({
      trigger: this.heroSection,  // pin the hero
      start: "top top",            // pin starts when top of hero hits top
      end: "bottom top",           // pin ends when bottom of hero hits top of viewport
      pin: true,
      pinSpacing: false,           // remove extra space if needed
      // markers: true,
      ease: 'elastic'
    });
  }
}
