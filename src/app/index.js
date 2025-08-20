import '@styles/main.scss';
import AutoBind from 'auto-bind';
import Stats from 'stats.js';
import each from 'lodash/each';
import FontFaceObserver from 'fontfaceobserver';
import { Detection } from '@classes/Detection';

import Home from '@pages/Home';
import Menu from '@pages/Menu';
import About from '@pages/About';
import Contact from '@pages/Contact';
import Book from '@pages/Book';

class App {
  constructor() {
    AutoBind(this);

    if (import.meta.env.DEV && window.location.search.includes('fps')) {
      this.createStats();
    }

    Detection.check({
      onErrorWebGL: this.createUnsupportedScreen,
      onSuccess: this.init,
    });
  }

  init() {
    this.createContent();
    this.createPages();
    this.addEventListeners();
    this.addLinkListeners();
    this.onResize();
    this.update(); // start loop
  }

  createContent() {
    this.content = document.querySelector('.content');
    this.template = this.content.getAttribute('data-template');
    console.log('Initial template:', this.template);
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
    if (this.page) {
      this.page.create();
    } else {
      console.warn(`No page found for initial template: ${this.template}`);
    }
  }

  /**
   * SPA Page Change
   */
  async onChange({ url, push = true }) {
    if (!this.page) return;

    await this.page.hide();

    try {
      const res = await fetch(url);
      if (res.status !== 200) throw new Error(`Status ${res.status}`);

      const html = await res.text();
      const div = document.createElement('div');
      div.innerHTML = html;

      const divContent = div.querySelector('.content');
      if (!divContent) throw new Error('No .content found in fetched page');

      // Update template & content
      this.template = divContent.getAttribute('data-template');
      this.content.setAttribute('data-template', this.template);
      this.content.innerHTML = divContent.innerHTML;

      // Update current page
      this.page = this.pages[this.template];
      if (!this.page) {
        console.warn(`No page found for template: ${this.template}, redirecting home`);
        return this.onChange({ url: '/', push: true });
      }

      this.page.create();
      this.page.show();
      this.onResize();
      this.addLinkListeners();

      if (push) {
        window.history.pushState({}, '', url);
      }

    } catch (err) {
      console.error(`Failed to load page ${url}:`, err);
    }
  }

  /**
   * Stats
   */
  createStats() {
    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);
  }

  /**
   * Resize & Scroll
   */
  onResize() {
    if (this.page && this.page.onResize) this.page.onResize();
  }

  onKeyDown(event) {
    if (!this.page || !this.page.scroll) return;

    if (event.key === 'Tab') event.preventDefault();
    if (event.key === 'ArrowDown') this.page.scroll.target += 100;
    if (event.key === 'ArrowUp') this.page.scroll.target -= 100;
  }

  onFocusIn(event) {
    event.preventDefault();
  }

  onTouchDown(event) {
    if (this.page?.onTouchDown) this.page.onTouchDown(event);
  }
  onTouchMove(event) {
    if (this.page?.onTouchMove) this.page.onTouchMove(event);
  }
  onTouchUp(event) {
    if (this.page?.onTouchUp) this.page.onTouchUp(event);
  }

  /**
   * Animation Loop
   */
  update() {
    this.stats?.begin();
    // this.page?.update();
    this.stats?.end();

    this.frame = requestAnimationFrame(this.update);
  }

  /**
   * Event Listeners
   */
  addEventListeners() {
    window.addEventListener('popstate', () => this.onChange({ url: window.location.pathname, push: false }), { passive: true });
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
      const isLocal = link.href.includes(window.location.origin);
      const isAnchor = link.href.includes('#');
      const isExternal = !isLocal && !link.href.startsWith('mailto:') && !link.href.startsWith('tel:');

      if (isLocal) {
        link.onclick = event => {
          event.preventDefault();
          if (!isAnchor) this.onChange({ url: link.href });
        };
      } else if (isExternal) {
        link.rel = 'noopener';
        link.target = '_blank';
      }
    });
  }

  onContextMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
}

/**
 * Font Loading
 */
const roslindaleItalic = new FontFaceObserver('Roslindale Dsp Cd Lt');
const roslindale = new FontFaceObserver('Roslindale Dsp Nar');
const lato = new FontFaceObserver('Lato');

Promise.all([roslindaleItalic.load(), roslindale.load(), lato.load()])
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

console.log('%c Developed by Muaaz', 'background: #000; color: #fff;');
