import Animation from '../classes/Animation';
import GSAP from 'gsap';
import each from 'lodash/each';

export default class HeightImage extends Animation {
  constructor({ element, elements }) {
    super({ element, elements });
    this.init();
  }

  init() {
    // Ensure wrapper clips children
    this.element.style.overflow = 'hidden';

    each(this.element.children, (child) => {
      GSAP.set(child, {
        clipPath: 'inset(100% 0 0 0)',
        display: 'block',
      });
    });
  }

  animateIn() {
    each(this.element.children, (child, i) => {
      GSAP.to(child, {
        clipPath: 'inset(0% 0 0 0)',
        duration: 1.2,
        ease: 'cubic-bezier(0.77, 0, 0.175, 1)',
        delay: i * 0.15,
      });
    });
  }

  animateOut() {
    each(this.element.children, (child, i) => {
      GSAP.to(child, {
        clipPath: 'inset(100% 0 0 0)',
        duration: 0.8,
        ease: 'cubic-bezier(0.77, 0, 0.175, 1)',
        delay: i * 0.08,
      });
    });
  }

}
