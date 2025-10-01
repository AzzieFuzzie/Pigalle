import Animation from '../classes/Animation';
import GSAP from 'gsap';

export default class Scale extends Animation {
  constructor({ element, elements }) {
    super({ element, elements });
    this.pulseTween = null;
  }

  animateIn() {
    // Kill previous tween if it exists
    if (this.pulseTween) this.pulseTween.kill();

    this.pulseTween = GSAP.fromTo(
      this.element,
      { scale: 0.8, y: 10, transformOrigin: 'center center' },
      { scale: 1, y: 0, duration: 0.4, ease: 'linear.out', delay: 0.3 }
    );
  }

  animateOut() {
    if (this.pulseTween) {
      this.pulseTween.kill();
      this.pulseTween = null;
    }

    GSAP.set(this.element, { scale: 1, y: 0 });
  }

  destroy() {
    // Kill any running tween to free memory
    this.pulseTween?.kill();
    this.pulseTween = null;

    // Reset element to default state
    GSAP.set(this.element, { scale: 1, y: 0 });
  }
}
