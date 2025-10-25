import Component from '../classes/Component';
import gsap from 'gsap';

export default class ImageRevealVertical extends Component {
  constructor({ element }) {
    super({ element });
    this.element = element;
    console.log(this.element);

    this._animateIn()
  }

  // We call this from the Page class
  _animateIn() {
    // Store the animation
    this.animation = gsap.fromTo(this.element, {
      clipPath: 'inset(100% 0% 0% 0%)',
      yPercent: '30%',
      opacity: 0,
    }, {
      clipPath: 'inset(0% 0% 0% 0%)',
      yPercent: '0%',
      duration: 1.5,
      ease: 'expo.inOut',
      opacity: 1,
      scrollTrigger: {
        trigger: this.element, // <-- Triggers on THIS element
        start: 'top 95%',
        toggleActions: 'play none none none',
        // markers: true,
      }
    });
  }

  destroy() {
    // Kills this specific animation and its ScrollTrigger
    if (this.animation) {
      this.animation.kill();
    }
  }
}