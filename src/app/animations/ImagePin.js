import Animation from '../classes/Animation';
import GSAP from 'gsap';

export default class ImagePin extends Animation {
  constructor({ element, elements }) {
    super({ element, elements });
  }

  animateIn() {
    // kill previous tween if exists
    if (this.pulseTween) this.pulseTween.kill();

    this.pulseTween = GSAP.fromTo(
      this.element,
      { scale: 0.8, y: 10, transformOrigin: 'center center', opacity: 0.8 },
      { scale: 1, y: 0, opacity: 1, duration: 1, ease: 'expo.out', delay: 0.3 }
    );
  }

  destroy() {
    // Kill the tween to free memory
    this.pulseTween?.kill();
  }
}
