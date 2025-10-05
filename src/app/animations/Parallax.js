import Component from '../classes/Component';
import GSAP from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

GSAP.registerPlugin(ScrollTrigger);

export default class Parallax extends Component {
  constructor({ element, elements }) {
    super({ element, elements });
    this.element = element;
    this.scaleTrigger = null; // Keep a reference to the scale trigger
    this.animateIn();
  }

  animateIn() {
    const yRange = GSAP.utils.random(20, 40);
    const rotationRange = GSAP.utils.random(-1, 1);
    const scaleMin = 0.2;
    const scaleMax = 1;

    GSAP.set(this.element, { yPercent: 0, scale: scaleMin, rotation: 0, transformOrigin: "center center" });

    // Store the scale trigger so we can kill it later
    this.scaleTrigger = ScrollTrigger.create({
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

    // --- START: FIX FOR JUMP ---
    // Capture the current transform values from the active tween
    if (this.tween) {
      GSAP.set(this.element, {
        yPercent: GSAP.getProperty(this.element, 'yPercent'),
        rotation: GSAP.getProperty(this.element, 'rotation'),
      });
    }
    // --- END: FIX FOR JUMP ---

    // Clean up both the scrub animation and the scale animation
    this.tween?.scrollTrigger?.kill();
    this.tween?.kill();
    this.scaleTrigger?.kill(); // Kill the separate scale trigger

    this.tween = null;
    this.scaleTrigger = null;
  }
}