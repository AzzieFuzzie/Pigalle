import GSAP from "gsap";

export default class FAQAccordion {
  constructor({ selector, allowMultiple = false }) {
    this.container = typeof selector === "string"
      ? document.querySelector(selector)
      : selector;

    if (!this.container) return; // exit if not found

    this.allowMultiple = allowMultiple;
    this.questions = this.container.querySelectorAll(".faq__question");

    this._init();
  }

  _init() {
    this.questions.forEach((question) => {
      const answer = question.nextElementSibling;

      if (answer) {
        GSAP.set(answer, { height: 0, y: -10, overflow: "hidden" });
      }

      question.addEventListener("click", () => this._toggle(question, answer));
    });
  }

  _toggle(question, answer) {
    if (!answer) return;

    const isOpen = answer.dataset.open === "true"; // track state

    if (!this.allowMultiple && !isOpen) {
      // close all others
      this.questions.forEach((q) => {
        const a = q.nextElementSibling;
        if (a && a !== answer) {
          GSAP.to(a, {
            height: 0,
            paddingTop: 0,
            paddingBottom: 0,
            marginTop: 0,
            marginBottom: 0,
            duration: 0.4,
            ease: "power2.inOut",
          });
          const icon = q.querySelector(".faq__icon");
          if (icon) GSAP.to(icon, { rotate: 0, duration: 0.3, ease: "power2.inOut" });
          a.dataset.open = "false";
        }
      });
    }

    if (isOpen) {
      GSAP.to(answer, {
        height: 0,
        paddingTop: 0,
        paddingBottom: 0,
        marginTop: 0,
        marginBottom: 0,
        duration: 0.4,
        ease: "power2.inOut",
      });
      answer.dataset.open = "false";
    } else {
      // animate from 0 to full height smoothly
      const fullHeight = answer.scrollHeight;

      GSAP.fromTo(
        answer,
        { height: 0, paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0 },
        {
          height: fullHeight,
          paddingTop: "",
          paddingBottom: "",
          marginTop: "",
          marginBottom: "",
          duration: 0.5,
          ease: "power2.out",
        }
      );

      answer.dataset.open = "true";
    }

    // rotate icon
    const icon = question.querySelector(".faq__icon");
    if (icon) {
      GSAP.to(icon, {
        rotate: isOpen ? 0 : 45,
        duration: 0.3,
        ease: "power2.inOut",
      });
    }
  }

}
