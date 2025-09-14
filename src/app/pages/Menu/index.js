import Page from '@classes/Page';
import MenuPin from '@animations/MenuPin';
import GSAP from 'gsap';

export default class Menu extends Page {
  constructor() {
    super({
      element: '.menu',

      elements: {
        wrapper: '.menu__wrapper',
        section: '.menu__section',
        button: '.menu__category__label',
        // selector for single image wrapper
      },
    });
  }

  create() {
    super.create();

    new MenuPin();
  }

  showCategory(category) {
    // Toggle active class on sections
    this.elements.section.forEach(section => {
      section.classList.toggle('--active', section.dataset.category === category);
      this.activeTween = GSAP.fromTo(section,
        { autoAlpha: 0, },
        { autoAlpha: 1, y: -20, duration: 0.5, ease: "expo.out" });
    });

    // Buttons
    this.elements.button.forEach(btn => {
      let isActive = btn.dataset.category === category;

      if (isActive) {
        btn.classList.toggle('--active');
        GSAP.fromTo(btn, { autoAlpha: 0 }, { autoAlpha: 1, color: "#000", duration: 0.5, ease: "expo.out" });
      } else {
        btn.classList.remove('--active');
      }
    });
  }
}
