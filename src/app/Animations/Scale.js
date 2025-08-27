import Animation from '../classes/Animation';
import GSAP from 'gsap';

export default class Scale extends Animation {

  constructor({ element, elements }) {
    super({ element, elements })


  }
  animateIn() {
    // Kill any existing tween first
    if (this.pulseTween) this.pulseTween.kill();

    this.pulseTween = GSAP.fromTo(
      this.element,
      { scale: 0.9, transformOrigin: 'center center', willChange: 'transform' },
      {
        scale: 1,
        duration: 1,
        ease: 'expo',
        delay: 0.2
      }
    );
  }

  animateOut() {
    // Stop the pulsing when out of view
    if (this.pulseTween) {
      this.pulseTween.kill();
      this.pulseTween = null;
    }

    // Reset scale
    GSAP.set(this.element, { scale: 0.9 });
  }


} 