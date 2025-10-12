import Animation from '../classes/Animation';
import GSAP from 'gsap';

export default class Scale extends Animation {
  constructor({ element, elements }) {
    super({ element, elements });
    this.scaleTween = null;

    // Set the initial state of the element to be invisible and slightly scaled down.
    GSAP.set(this.element, { autoAlpha: 0, scale: 0.9 });
  }

  animateIn() {
    // Kill any previously running animation on this element.
    this.scaleTween?.kill();

    // Animate the element to be fully visible and at its normal size.
    this.scaleTween = GSAP.to(this.element, {

      scale: 1,          // Scale to 100%
      duration: 0.8,
      ease: 'power3.out', // A smooth and natural ease-out
      delay: 0.2,
    });
  }

  animateOut() {
    // Kill any previously running animation on this element.
    this.scaleTween?.kill();

    // Animate the element back to its initial invisible state.
    this.scaleTween = GSAP.to(this.element, {
      scale: 0.9,
      duration: 0.5,
      ease: 'power2.in',
    });
  }

  destroy() {
    // Final cleanup when the page is destroyed.
    this.scaleTween?.kill();
  }
}