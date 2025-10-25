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



    GSAP.to(this.element, {

      autoAlpha: 1, // The "to" state
      duration: 0.4,
      ease: 'sine.out',
      delay: 0.4
    })

  }

  animateOut() {

    // GSAP.set(this.element, {
    //   autoAlpha: 0,
    // })
  }

  destroy() {
    // Also good practice to have a guard clause here

  }
}