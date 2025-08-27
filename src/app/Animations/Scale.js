import Animation from '../classes/Animation';
import GSAP from 'gsap';

export default class Scale extends Animation {

  constructor({ element, elements }) {
    super({ element, elements })


  }
  animateIn() {
    GSAP.fromTo(
      this.element,
      { scale: 0.75, transformOrigin: 'center center', willChange: 'transform' },
      {
        scale: 1,
        duration: 2,
        ease: 'expo.out',
      }
    );
  }

  animateOut() {
    GSAP.set(this.element, {
      scale: 0.75,
      transformOrigin: 'center center',
      willChange: 'transform',
    });
  }

} 