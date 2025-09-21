import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

GSAP.registerPlugin(ScrollTrigger);

export default class PinLayer {
  constructor({ element }) {
    this.element = element;
    console.log(this.element);
    this.scrollTrigger = null;
    this._animate();
  }

  _animate() {
    // const taglineWrapper = document.querySelector('.tagline__card__wrapper')
    this.scrollTrigger = ScrollTrigger.create({
      trigger: this.element,
      start: "top top",
      end: "bottom top",
      pin: true,
      pinSpacing: false,
      pinSpacing: false,
      markers: false,
    });
  }

  // destroy() {
  //   this.scrollTrigger?.kill();
  //   this.scrollTrigger = null;
  // }
}
