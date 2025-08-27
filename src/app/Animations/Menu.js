import GSAP from 'gsap';

export default class MenuAnimator {
  constructor() {
    this.buttons = document.querySelectorAll(".menu__category");
    this.contents = document.querySelectorAll(".menu__category-content");
  }



  showCategory(category) {
    this.contents.forEach((el) => {
      if (el.dataset.category === category) {
        el.classList.add("active");
        // Optional: fade-in with GSAP
        GSAP.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.5 });
      } else {
        el.classList.remove("active");
      }
    });

    this.buttons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.category === category);
    });
  }
}
