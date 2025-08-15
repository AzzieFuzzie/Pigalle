import Page from '@classes/Page';

export default class Home extends Page {
  constructor() {

    super({
      element: '.home',
      elements: {
        wrapper: '.home__wrapper',
      },
    });
  }

  /**
   * Animations.
   */
  // async show(url) {
  //   // console.log(this.classes.active);
  //   // console.log('Showing Home Page', this.element);
  //   this.element.classList.add(this.classes.active);

  //   return super.show(url);
  // }

  // async hide(url) {
  //   // console.log('Hiding Home Page', this.element);
  //   this.element.classList.remove(this.classes.active);

  //   return super.hide(url);
  // }
}