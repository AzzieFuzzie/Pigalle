import Animation from '../classes/Animation';
import GSAP from 'gsap';
import { SplitText } from "gsap/SplitText";

GSAP.registerPlugin(SplitText);

export default class Paragraph extends Animation {
  constructor({ element, elements }) {

    super({ element, elements });
    this.element = element
    this.split = SplitText.create(this.element, {
      type: "words, lines",
      mask: "lines",
      linesClass: "lines++"
    });

    this.paragraphs = this.split.lines;
    GSAP.set(this.paragraphs, { y: "100%" });
  }

  animateIn() {

    GSAP.to(this.paragraphs, {
      y: "0%",
      duration: .75,
      ease: 'expo.out',
      stagger: 0.1,
      delay: 0.2,
    });
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