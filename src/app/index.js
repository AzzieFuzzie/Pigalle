import '@styles/main.scss';
import AutoBind from 'auto-bind';
import Stats from 'stats.js';
import each from 'lodash/each';
import FontFaceObserver from 'fontfaceobserver';
import { Detection } from '@classes/Detection';

// import Transition from '@components/Transition';


import Home from '@pages/Home';
import Menu from '@pages/Menu';
import About from '@pages/About';
import Contact from '@pages/Contact';
import Book from '@pages/Book';


class App {
  constructor() {
    AutoBind(this);
    if (import.meta.env.DEV && window.location.search.indexOf('fps') > -1) {
      this.createStats();
    }

    Detection.check({
      onErrorWebGL: this.createUnsupportedScreen,
      onSuccess: this.init,
    });
  }

  init() {
    this.createContent();

    // this.createCanvas();
    // this.createPreloader();
    // this.createNavigation();
    this.createPages();

    this.addEventListeners();
    this.addLinkListeners();

    this.onResize();

  }

  createContent() {
    this.content = document.querySelector('.content')
    console.log(this.content);
    this.template = this.content.getAttribute('data-template')

    console.log(this.template);
  }


  createPages() {
    this.pages = {
      home: new Home(),
      menu: new Menu(),
      about: new About(),
      contact: new Contact(),
      book: new Book(),
    };
    this.page = this.pages[this.template];
    console.log(this.page);
    this.page.create();
  }

  /**
   * Events.
   */

  onContextMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }

  onPopState() {
    this.onChange({
      url: window.location.pathname,
      push: false,
    });
  }

  async onChange({ url, push = true }) {
    await this.page.hide();

    const res = await window.fetch(url);

    if (res.status === 200) {
      const html = await res.text();
      const div = document.createElement('div');

      if (push) {
        window.history.pushState({}, '', url);
      }

      div.innerHTML = html;

      const divContent = div.querySelector('.content');

      this.template = divContent.getAttribute('data-template');

      this.content.setAttribute('data-template', this.template);
      this.content.innerHTML = divContent.innerHTML;
      console.log(divContent);

      this.page = this.pages[this.template];
      this.page.create();

      this.onResize();

      this.page.show();

      this.addLinkListeners();
    } else {
      console.error(`response status: ${res.status}`);
    }


    // Handle regular static routes
    const page = this.pages[url];

    if (!page) {
      console.warn(`No page found for URL: ${url}, redirecting to home`);
      return this.onChange({ url: '/', push: true });
    }

    if (push) {
      window.history.pushState({}, '', url);
    }

    this.template = window.location.pathname;
    // console.log(this.template);
    this.page.hide();

    this.navigation.onChange(this.template);
    this.footer.onChange(this.template);

    this.page = page;

    // console.log(this.page);
    this.page.show();

    this.onResize();
  }



  /**
   * Stats.
   */
  createStats() {
    this.stats = new Stats();

    document.body.appendChild(this.stats.dom);
  }

  createAnalytics() {
    // Custom events for Plausible, Fathom, etc
  }

  /**
   * Events.
   */



  onResize() {
    if (this.page && this.page.onResize) {
      this.page.onResize();
    }

    window.requestAnimationFrame(() => {

    });
  }

  onKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
    }

    if (event.key === 'ArrowDown') {
      this.page.scroll.target += 100;
    } else if (event.key === 'ArrowUp') {
      this.page.scroll.target -= 100;
    }
  }

  onFocusIn(event) {
    event.preventDefault();
  }

  onTouchDown(event) {

    if (this.page && this.page.onTouchDown) {
      this.page.onTouchDown(event);
    }
  }

  onTouchMove(event) {

    if (this.page && this.page.onTouchDown) {
      this.page.onTouchMove(event);
    }
  }

  onTouchUp(event) {


    if (this.page && this.page.onTouchDown) {
      this.page.onTouchUp(event);
    }
  }



  /**
   * Loop.
   */
  update() {
    if (this.stats) {
      this.stats.begin();
    }

    if (this.page) {
      this.page.update();
    }


    if (this.stats) {
      this.stats.end();
    }

    this.frame = window.requestAnimationFrame(this.update);
  }

  /***
   * Listeners.
   */
  addEventListeners() {
    window.addEventListener('popstate', this.onPopState, { passive: true });
    window.addEventListener('resize', this.onResize, { passive: true });

    window.addEventListener('mousedown', this.onTouchDown, { passive: true });
    window.addEventListener('mousemove', this.onTouchMove, { passive: true });
    window.addEventListener('mouseup', this.onTouchUp, { passive: true });

    window.addEventListener('touchstart', this.onTouchDown, { passive: true });
    window.addEventListener('touchmove', this.onTouchMove, { passive: true });
    window.addEventListener('touchend', this.onTouchUp, { passive: true });

    window.addEventListener('wheel', this.onWheel, { passive: true });

    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('focusin', this.onFocusIn);

    window.oncontextmenu = this.onContextMenu;
  }

  addLinkListeners() {
    const links = document.querySelectorAll('a');

    each(links, link => {
      const isLocal = link.href.indexOf(window.location.origin) > -1;
      const isAnchor = link.href.indexOf('#') > -1;

      const isNotEmail = link.href.indexOf('mailto') === -1;
      const isNotPhone = link.href.indexOf('tel') === -1;

      if (isLocal) {
        link.onclick = event => {
          event.preventDefault();

          if (!isAnchor) {
            this.onChange({
              url: link.href,
            });
          }
        };
      } else if (isNotEmail && isNotPhone) {
        link.rel = 'noopener';
        link.target = '_blank';
      }
    });
  }
}

const roslindaleRegularitalic = new FontFaceObserver('Roslindale Dsp Cd Lt');
const roslindaleRegular = new FontFaceObserver('Roslindale Dsp Nar');
const lato = new FontFaceObserver('Lato');


Promise.all([
  roslindaleRegularitalic.load(),
  roslindaleRegular.load(),
  lato.load(),
])
  .then(() => {
    console.log('All fonts loaded');
    document.body.classList.add('fonts-loaded');
    window.APP = new App();
  })
  .catch(() => {
    console.warn('Fonts failed to load in time. Starting anyway.');
    document.body.classList.add('fonts-loaded');
    window.APP = new App();
  });

console.log(
  '%c Developed by Muaaz',
  'background: #000; color: #fff;',
);
