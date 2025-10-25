import Animation from '../classes/Animation';
import GSAP from 'gsap';

export default class Fade extends Animation {
  constructor({ element }) {
    super({ element });
    this.element = element

    GSAP.set(this.element, {
      autoAlpha: 0,
    })
  }

  animateIn() {

    console.log(this.element);

    GSAP.to(this.element, {

      autoAlpha: 1, // The "to" state
      duration: 0.4,
      ease: 'power3.inOut',
      delay: 0.4
    })

  }

  animateOut() {
    console.log(this.element);
    // GSAP.set(this.element, {
    //   autoAlpha: 0,
    // })
  }

  destroy() {
    // Also good practice to have a guard clause here

  }
}