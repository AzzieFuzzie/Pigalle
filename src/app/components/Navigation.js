import GSAP from 'gsap';

import Component from '@classes/Component';

import { mapEach } from '@utils/dom';

export default class Navigation extends Component {
  constructor({ template }) {
    super({
      element: '.navigation',
      elements: {
        items: '.navigation__menu__item',
        links: '.navigation__link',
      },
    });


    this.onChange(template);
  }

  onChange(template) {
    // console.log('Navigation items:', this.elements);

    // GSAP.set(this.elements.items[0], { autoAlpha: 0 });
    // GSAP.set(this.elements.items[1], { autoAlpha: 1 });

  }
}