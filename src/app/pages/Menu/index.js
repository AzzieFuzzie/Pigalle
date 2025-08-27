import Page from '@classes/Page';
import MenuPin from '@animations/MenuPin';

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
    });

    // Toggle active class on buttons
    this.elements.button.forEach(btn => {
      btn.classList.toggle('--active', btn.dataset.category === category);
    });
  }
}
