// import { gsap } from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import SplitText from "gsap/SplitText.js"; // Vite-compatible

// gsap.registerPlugin(ScrollTrigger, SplitText);

// export default class TextHighlight {
//   constructor({ tagline }) {
//     this.el = tagline; // can be a DOM element

//     this._splitLinesAndWords();
//     this._setupStyles();
//     this._animate();
//   }

//   _splitLinesAndWords() {
//     this.split = new SplitText(this.el, { type: "lines" });
//     this.lineSpans = [];

//     this.split.lines.forEach((line) => {
//       const words = line.textContent.split(" ");
//       line.textContent = "";
//       words.forEach((word, i) => {
//         const wordSpan = document.createElement("span");
//         wordSpan.style.whiteSpace = "nowrap";
//         word.split("").forEach((char) => {
//           const charSpan = document.createElement("span");
//           charSpan.textContent = char;
//           wordSpan.appendChild(charSpan);
//         });
//         line.appendChild(wordSpan);
//         if (i < words.length - 1) line.appendChild(document.createTextNode(" "));
//       });
//       this.lineSpans.push(line);
//     });
//   }

//   _setupStyles() {
//     this.lineSpans.forEach((line) => {
//       Array.from(line.querySelectorAll("span span")).forEach((char) => {
//         char.style.display = "inline-block";
//         char.style.color = "transparent";
//         char.style.webkitTextStroke = "1px black";
//       });
//     });
//   }

//   _animate() {
//     this.lineSpans.forEach((line) => {
//       const letters = Array.from(line.querySelectorAll("span span"));
//       gsap.to(letters, {  // <-- lowercase 'gsap'
//         color: "#000",
//         webkitTextStroke: "0px",
//         stagger: 0.03,
//         ease: "none",
//         scrollTrigger: {
//           trigger: line,
//           start: "top 80%",
//           end: "top 30%",
//           scrub: true,
//           markers: true,
//         },
//       });
//     });
//   }
// }
