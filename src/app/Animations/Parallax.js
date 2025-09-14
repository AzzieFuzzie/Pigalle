import Component from '../classes/Component';
import GSAP from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

GSAP.registerPlugin(ScrollTrigger);

export default class Parallax extends Component {
  constructor({ element, elements }) {
    super({ element, elements });
    this.element = element;

    this.animateIn();
  }

  animateIn() {
    const yRange = GSAP.utils.random(30, 50);

    // set initial position explicitly
    GSAP.set(this.element, { yPercent: 0 });

    // Scroll-based tween
    this.tween = GSAP.to(this.element, {
      yPercent: yRange,
      ease: "none",
      scrollTrigger: {
        trigger: this.element,
        start: "-100px 100px",
        end: "+=100%",
        scrub: 0.5,
        // markers: true
      },
    });
  }



  destroy() {
    if (this.tween) {
      this.tween.scrollTrigger?.kill();
      this.tween.kill();
      this.tween = null;
    }
  }
}
