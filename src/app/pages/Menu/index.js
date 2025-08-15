import Page from '@classes/Page';

export default class Menu extends Page {
  constructor() {
    super({
      element: '.menu',
      elements: {
        wrapper: '.menu__wrapper',
      },
    });
  }
}