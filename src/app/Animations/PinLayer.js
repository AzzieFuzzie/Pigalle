import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

GSAP.registerPlugin(ScrollTrigger);

export default class PinLayer {
  constructor({ heroSection, taglineSection }) {
    this.heroSection = heroSection;
    this.taglineSection = taglineSection;
    console.log(this.taglineSection);
    this._animate();
  }

  _animate() {
    ScrollTrigger.create({
      trigger: this.heroSection,
      start: "top top",
      endTrigger: this.taglineSection,
      end: "top top", // the tagline reaches top → hero unpins
      pin: true,
      pinSpacing: false,
      scrub: true,
      // markers: true,
    });


  }
}
