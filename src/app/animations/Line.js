import Animation from '../classes/Animation';
import GSAP from 'gsap';
import { SplitText } from "gsap/SplitText";

GSAP.registerPlugin(SplitText);

export default class Line extends Animation {
  constructor({ element, elements }) {

    super({ element, elements });
    this.element = element

  }

  animateIn() {

    this.element.classList.add('animate-line-scale')
  }

  animateOut() {


  }

  // destroy() {
  //   // Also good practice to have a guard clause here
  //   if (this.split) {
  //     this.split.revert();
  //   }
  // }
}