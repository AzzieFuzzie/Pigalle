import Page from '@classes/Page';

// import Marquee from '../../animations/Marquee';

export default class Home extends Page {
  constructor() {
    super({
      element: '.home',
      elements: {
        wrapper: '.home__wrapper', // target by data-animation


      },
    });

  }


}
