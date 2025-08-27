// import GSAP from "gsap";
// import { createLogger } from "vite";

// export default class FAQAccordion {
//   constructor({ selector, allowMultiple = false }) {
//     this.container = selector
//     this.allowMultiple = allowMultiple;
//     this.questions = this.container.querySelectorAll('.faq__question');

//     this._init();
//   }

//   _init() {
//     this.questions.forEach((question) => {
//       const answer = question.nextElementSibling; // dd.faq__answer
//       const line = answer ? answer.nextElementSibling : null;

//       // hide answer initially
//       if (answer) {
//         GSAP.set(answer, { height: 0, opacity: 0, y: -10, overflow: 'hidden' });
//       }

//       question.addEventListener('click', () => this._toggle(question, answer));
//     });
//   }

//   _toggle(question, answer) {
//     if (!answer) return;

//     const isOpen = answer.offsetHeight > 0;

//     if (!this.allowMultiple && !isOpen) {
//       // Close others
//       this.questions.forEach((q) => {
//         const a = q.nextElementSibling;
//         if (a !== answer) {
//           GSAP.to(a, { height: 0, opacity: 0, y: -10, duration: 0.5, ease: "expo.out" });
//           const icon = q.querySelector('.faq__icon');
//           if (icon) GSAP.to(icon, { rotate: 0, duration: 0.5, ease: "expo.out" });
//         }
//       });
//     }

//     if (isOpen) {
//       // close
//       GSAP.to(answer, { height: 0, opacity: 0, y: -10, duration: 0.5, ease: "expo.out" });
//     } else {
//       // open elegantly
//       GSAP.set(answer, { height: 'auto' });
//       const fullHeight = answer.offsetHeight;
//       GSAP.set(answer, { height: 0, opacity: 0, y: -10 });
//       GSAP.to(answer, { height: fullHeight, opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
//     }

//     // Rotate icon gently
//     const icon = question.querySelector('.faq__icon');
//     if (icon) {
//       GSAP.to(icon, { rotate: isOpen ? 0 : 45, duration: 0.5, ease: "expo.out" });
//     }
//   }
// }
