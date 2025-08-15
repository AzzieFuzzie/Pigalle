import Page from '@classes/Page';

export default class Contact extends Page {
  constructor() {
    super({
      element: '.contact',
      elements: {
        wrapper: '.contact__wrapper',
      },
    });
  }
}