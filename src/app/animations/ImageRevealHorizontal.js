import Component from '../classes/Component';
import gsap from 'gsap';

export default class ImageRevealHorizontal extends Component {
  constructor({ element }) {
    super({ element });
    this.element = element;

    this._animateIn()
  }

  _animateIn() {
    this.animation = gsap.fromTo(this.element, { // <-- Animates THIS element only
      clipPath: 'inset(0% 100% 0% 0%)', // <-- Fixed your clipPath
      xPercent: '30%',
      autoAlpha: 0,
    }, {
      clipPath: 'inset(0% 0% 0% 0%)',
      xPercent: '0%',
      duration: 1.5,
      ease: 'expo.inOut',
      autoAlpha: 1,
      scrollTrigger: {
        trigger: this.element, // <-- Triggers on THIS element
        start: 'top 90%',
        toggleActions: 'play none none none',
        markers: true,
      }
    });
  }

  destroy() {
    if (this.animation) {
      this.animation.kill();
    }
  }
}