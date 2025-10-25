import Animation from '../classes/Animation';
import GSAP from 'gsap';

export default class Scale extends Animation {
  constructor({ element, elements }) {
    super({ element, elements });


    this.scaleTween = GSAP.set(this.element, {
      scale: 0.9,
      duration: 0.5,
      ease: 'power2.in',
    });

  }

  animateIn() {


    // Animate the element to be fully visible and at its normal size.
    this.scaleTween = GSAP.to(this.element, {

      scale: 1,          // Scale to 100%
      duration: 0.8,
      ease: 'power3.out', // A smooth and natural ease-out
      delay: 0.2,
    });
  }

  animateOut() {



  }

  destroy() {
    // Final cleanup when the page is destroyed.
    this.scaleTween?.kill();
  }
}