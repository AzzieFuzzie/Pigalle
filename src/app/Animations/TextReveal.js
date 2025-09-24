// TextReveal.js
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

export default class TextReveal {
  constructor(element) {
    this.el = element;
    this.colorInitial = "#6A6A6A"; // Outline color
    this.colorFinal = "#000";       // Final color

    this.init();
  }

  init() {
    // Split text into words, then characters
    const split = new SplitText(this.el, {
      type: "words, chars",
      wordsClass: "word",
      charsClass: "char",
      onSplit: () => {
        // Called after SplitText has applied all DOM changes
        // Useful for mobile fixes, repositioning, or setting initial styles
        gsap.set(this.el.querySelectorAll(".char"), {
          display: "inline-block",
          color: this.colorInitial
        });
      }
    });

    this.allChars = split.chars;

    // Create ScrollTrigger animation
    this.st = gsap.to(this.allChars, {
      color: this.colorFinal,
      ease: "power1.out",
      stagger: 0.08,
      scrollTrigger: {
        trigger: this.el,
        start: "top 90%",
        end: "top 10%",
        scrub: 0.2,
      }
    });
  }

  destroy() {
    this.st?.kill();
  }
}
