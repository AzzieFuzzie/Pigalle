import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

GSAP.registerPlugin(ScrollTrigger, SplitText);

export default class TextHighlightHybrid {
  constructor({ tagline }) {
    this.el = document.querySelector(tagline);
    if (!this.el) return;

    this._splitLinesAndWords();
    this._setupStyles();
    this._animate();
  }

  _splitLinesAndWords() {
    // First split into lines
    this.split = new SplitText(this.el, { type: "lines" });
    this.lineSpans = [];

    this.split.lines.forEach((line) => {
      // Wrap each word in a span
      const words = line.textContent.split(" ");
      line.textContent = ""; // clear line
      words.forEach((word, i) => {
        const wordSpan = document.createElement("span");
        wordSpan.style.whiteSpace = "nowrap"; // keep word together
        word.split("").forEach((char) => {
          const charSpan = document.createElement("span");
          charSpan.textContent = char;
          wordSpan.appendChild(charSpan);
        });
        line.appendChild(wordSpan);
        if (i < words.length - 1) line.appendChild(document.createTextNode(" "));
      });
      this.lineSpans.push(line);
    });
  }

  _setupStyles() {
    // Style each letter with transparent fill and stroke
    this.lineSpans.forEach((line) => {
      Array.from(line.querySelectorAll("span span")).forEach((char) => {
        char.style.display = "inline-block";
        char.style.color = "transparent";
        char.style.webkitTextStroke = "1px black";
      });
    });
  }

  _animate() {
    this.lineSpans.forEach((line) => {
      const letters = Array.from(line.querySelectorAll("span span"));
      GSAP.to(letters, {
        color: "#000",
        webkitTextStroke: "0px",
        stagger: 0.03,
        ease: "none",
        scrollTrigger: {
          trigger: line,
          start: "top 80%",
          end: "top 30%",
          scrub: true,
          markers: true
        }
      });
    });
  }
}
