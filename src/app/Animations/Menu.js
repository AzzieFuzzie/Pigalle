import GSAP from 'gsap';

export default class MenuAnimator {
  constructor() {
    this.buttons = Array.from(document.querySelectorAll(".menu__category"));
    this.contents = Array.from(document.querySelectorAll(".menu__category-content"));

    // store tween references
    this.activeTween = null;
  }

  showCategory(category) {
    this.contents.forEach((el) => {
      if (el.dataset.category === category) {
        el.classList.add("active");

        // kill previous tween first
        if (this.activeTween) this.activeTween.kill();

        // fade-in tween
        this.activeTween = GSAP.fromTo(el,
          { opacity: 0 },
          { opacity: 1, duration: 0.5 });


      } else {
        el.classList.remove("active");
      }
    });

    this.buttons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.category === category);
    });
  }

  destroy() {
    // Kill active tween
    this.activeTween?.kill();
    this.activeTween = null;

    // Optionally: clear references
    this.buttons = [];
    this.contents = [];
  }
}
