import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

GSAP.registerPlugin(ScrollTrigger);

export default class PinLayer {
  constructor({ element }) {
    this.heroSection = element;
    this.scrollTrigger = null;
    this._animate();
  }

  _animate() {
    this.scrollTrigger = ScrollTrigger.create({
      trigger: this.heroSection,
      start: "top top",
      end: "bottom top",
      pin: true,
      pinSpacing: false,
      scrub: 1,
      // markers: true,
    });
  }

  destroy() {
    this.scrollTrigger?.kill();
    this.scrollTrigger = null;
  }
}
