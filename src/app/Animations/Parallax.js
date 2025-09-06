import Component from '../classes/Component';
import GSAP from 'gsap';

export default class Parallax extends Component {

  constructor({ element, elements }) {
    super({ element, elements })
    this.element = element

    this.animateIn()
  }
  animateIn() {
    // set initial random float offsets
    GSAP.set(this.element, {
      yPercent: GSAP.utils.random(-10, 10),
      xPercent: GSAP.utils.random(-3, 3),
      rotation: GSAP.utils.random(-2, 2)
    });

    GSAP.to(this.element, {
      yPercent: GSAP.utils.random(-40, 50),
      xPercent: GSAP.utils.random(-5, 5),
      rotation: GSAP.utils.random(-5, 5),
      ease: 'linear',
      scrollTrigger: {
        trigger: this.element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
        markers: true,
      }
    });
  }


} 