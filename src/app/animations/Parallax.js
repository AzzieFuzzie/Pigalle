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
    const yRange = GSAP.utils.random(20, 40);        // vertical movement
    const rotationRange = GSAP.utils.random(-1, 1);  // subtle rotation
    const scaleMin = 0.2;                             // initial scale
    const scaleMax = 1;  // final scale

    // initial state
    GSAP.set(this.element, { yPercent: 0, scale: scaleMin, rotation: 0, transformOrigin: "center center" });

    // scale animation on enter
    ScrollTrigger.create({
      trigger: this.element,
      start: "top bottom",
      onEnter: () => {
        GSAP.to(this.element, {
          scale: scaleMax,
          duration: 0.6,
          ease: "expo.Inout"
        });
      }
    });

    // vertical + rotation scrubbed with scroll
    this.tween = GSAP.to(this.element, {
      yPercent: yRange,
      rotation: rotationRange,
      ease: "none",
      scrollTrigger: {
        trigger: this.element,
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
        markers: false,
        invalidateOnRefresh: true
      }
    });
  }

  destroy() {
    console.log('killed');
    this.tween?.scrollTrigger?.kill();
    this.tween?.kill();
    this.tween = null;
  }
}
