import Animation from '../classes/Animation';
import GSAP from 'gsap';
import { SplitText } from "gsap/SplitText";

GSAP.registerPlugin(SplitText);

export default class ImageReveal extends Animation {
  constructor({ element, elements }) {

    super({ element, elements })

    this.element = element
  }

  animateIn() {
    const tl = GSAP.timeline();



    // tl.fromTo(this.element, {
    //   clipPath: 'inset(0 0 100% 0)' // (top, right, bottom, left) - 100% bottom = 0 height
    // }, {
    //   clipPath: 'inset(0 0 0% 0)',   // 0% bottom = full height
    //   duration: 1.2, // Make this duration slightly longer
    //   ease: 'power3.out'
    // }, 0);

    tl.fromTo(this.element, {
      scale: 1.3, // Your original "inner" scale

      xPercent: () => GSAP.utils.random(-10, 10), // Your original "outer" xPercent
      yPercent: () => GSAP.utils.random(-10, 10)  // Your original "outer" yPercent
    }, {
      scale: 1,
      xPercent: 0,
      yPercent: 0,
      duration: .75, // Add your desired duration/ease
      ease: 'power3.out',

    });

  }

  animateOut() {
  }

  destroy() {

  }
}