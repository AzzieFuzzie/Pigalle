import Animation from '../classes/Animation';
import GSAP from 'gsap';

export default class Scale extends Animation {
  constructor({ element, elements }) {
    super({ element, elements });
    this.pulseTween = null;
  }

  animateIn() {
    console.log('scale');


    this.pulseTween = GSAP.fromTo(
      this.element,
      { scale: 0.8, transformOrigin: 'center center' },
      { scale: 1, duration: 0.6, ease: 'linear', delay: 0.3 }
    );
  }

  animateOut() {


    GSAP.set(this.element, { scale: 1, });
  }

  destroy() {
    // Kill any running tween to free memory
    this.pulseTween?.kill();
    this.pulseTween = null;

    // Reset element to default state
    GSAP.set(this.element, { scale: 1, });
  }
}
