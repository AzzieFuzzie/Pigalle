// src/app/animations/ImagePin.js

import Animation from '../classes/Animation';
import GSAP from 'gsap';

export default class ImagePin extends Animation {
  constructor({ element, elements }) {
    super({ element, elements });

    this.pulseTween = GSAP.fromTo(
      this.element,
      { scale: 0.8, y: 10, transformOrigin: 'center center', autoAlpha: 0.8 },
      { scale: 1, y: 0, autoAlpha: 1, duration: 1, ease: 'expo.out', paused: true } // Create paused
    );
  }

  animateIn() {
    this.pulseTween.play(0); // Play from the beginning
  }

  destroy() {
    this.pulseTween?.kill();
  }
}