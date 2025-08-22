import Page from '@classes/Page';

// import Marquee from '../../animations/Marquee';

export default class Home extends Page {
  constructor() {
    super({
      element: '.home',
      elements: {
        wrapper: '.home__wrapper', // target by data-animation
        marquee: '.home[data-animation="marquee"]'  // double quotes inside single quotes

      },
    });
    console.log(this.elements.marquee);
  }

  // create() {
  //   super.create();

  //   this.marquee = new Marquee({
  //     element: this.elements.marquee,
  //   });
  // }
}
