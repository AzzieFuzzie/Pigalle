import Page from '@classes/Page';

export default class Book extends Page {
  constructor() {
    super({
      element: '.book',
      elements: {
        wrapper: '.book__wrapper',
      },
    });
  }
}