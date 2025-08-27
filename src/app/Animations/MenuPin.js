import GSAP from 'gsap';
import { ScrollTrigger } from "gsap/ScrollTrigger";
GSAP.registerPlugin(ScrollTrigger);

export default class MenuPin {
  constructor() {

    this.init();
  }

  init() {

    const imageWrapper = document.querySelector(".menu__image");
    const section = document.querySelector(".menu__section");

    ScrollTrigger.create({
      trigger: section,          // pin relative to the section
      start: "-=100px top",          // when section top hits top of viewport
      end: "bottom center",         // end when section bottom hits top
      pin: imageWrapper,         // pin the image wrapper
      pinSpacing: true,         // keeps spacing natural
      scrub: 1,               // smooth pin scrub
      markers: true,             // debug
    });
  }
}
