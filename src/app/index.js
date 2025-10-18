import '../styles/main.scss';
import AutoBind from 'auto-bind';
import Stats from 'stats.js';
import each from 'lodash/each';
import FontFaceObserver from 'fontfaceobserver';
import Lenis from 'lenis';
import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Preloader from './components/Preloader';
import Transition from './components/Transition';
import initDineplanSPA from './utils/dineplan';
import Navigation from './components/Navigation'

import Home from '@pages/Home';
import Menu from '@pages/Menu';
import About from '@pages/About';
import Contact from '@pages/Contact';
import Book from '@pages/Book';

GSAP.registerPlugin(ScrollTrigger);

class App {
  constructor() {
    AutoBind(this);
    this.createLenis();
    this.createContent();

    this.createPreloader();
    this.createNavigation();
    this.isTransitioning = false;

    if (import.meta.env.DEV && window.location.search.includes('fps')) {
      this.createStats();
    }

    this.createTransition();
    this.createPages();

    this.addEventListeners();
    this.addLinkListeners();

    this.update();
    this.update = this.update.bind(this);
  }


  createLenis() {
    this.lenis = new Lenis({

      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });

    this.lenis.on('scroll', ScrollTrigger.update);

    GSAP.ticker.add((time) => {
      this.lenis.raf(time * 1000);
    });

    GSAP.ticker.lagSmoothing(0);


  }


  createPreloader() {
    if (this.lenis) this.lenis.stop();
    this.preloader = new Preloader();


    this.preloader.once('completed', () => {

      if (this.lenis) this.lenis.start();
      this.onPreloaded();

    });

    document.body.style.visibility = "visible";

  }

  createNavigation() {
    this.navigation = new Navigation({
      template: this.template,
      lenis: this.lenis
    })
  }


  createTransition() {
    this.transition = new Transition({ lenis: this.lenis });
  }

  // in src/app/index.js

  onPreloaded() {


    // Create the page elements for the first time
    this.page.create();
    // Show the page (which now also creates its animations)
    this.page.show();

    // setTimeout(() => {
    //   ScrollTrigger.refresh();
    // }, 100); // 100ms is imperceptible but ensures stability.
  }
  createContent() {
    this.content = document.querySelector('.content');
    this.template = this.content.getAttribute('data-template');
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
  }

  async onChange({ url, push = true }) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    // 1. Hide the current page and destroy its animations
    await this.page.hide();

    // 2. Play the 'enter' part of the main page transition
    if (this.transition) await this.transition.onEnter();

    try {
      const res = await fetch(url);
      if (res.status !== 200) throw new Error(`Status ${res.status}`);

      const html = await res.text();
      const div = document.createElement('div');
      div.innerHTML = html;

      const divContent = div.querySelector('.content');
      if (!divContent) throw new Error('No .content found in fetched page');

      if (push) window.history.pushState({}, '', url);

      // 3. Update the DOM with the new page content
      this.template = divContent.getAttribute('data-template');
      this.content.setAttribute('data-template', this.template);
      this.content.innerHTML = divContent.innerHTML;

      this.navigation.onChange(this.template)

      this.page = this.pages[this.template];
      if (!this.page) {
        console.warn(`No page found for template: ${this.template}, redirecting home`);
        this.isTransitioning = false;
        return this.onChange({ url: '/', push: true });
      }


      this.page.create();

      if (this.template === 'book') {
        initDineplanSPA();
      }


      if (this.lenis) {
        document.documentElement.scrollTop = 0; // For modern browsers
        document.body.scrollTop = 0; // For older browsers (e.g., Safari)
        this.lenis.scrollTo(0, { immediate: true }); // For the Lenis instance
      }


      if (this.transition) await this.transition.onLeave();


      ScrollTrigger.refresh();
      await this.page.show();


      this.addLinkListeners();


    } catch (err) {
      console.error(`Failed to load page ${url}:`, err);
    } finally {
      this.isTransitioning = false;
    }
  }

  createStats() {
    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);
  }



  onKeyDown(event) {
    if (event.key === 'Tab') event.preventDefault();
  }

  onFocusIn(event) {
    event.preventDefault();
  }

  onTouchDown(event) { this.page?.onTouchDown?.(event); }
  onTouchMove(event) { this.page?.onTouchMove?.(event); }
  onTouchUp(event) { this.page?.onTouchUp?.(event); }

  update() {
    this.stats?.begin();
    this.page?.update?.();
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

      if (isLocal && !isAnchor) {
        link.onclick = event => {
          event.preventDefault();
          this.onChange({ url: link.href });
        };
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const roslindaleItalic = new FontFaceObserver('Roslindale Dsp Cd Lt');
  const roslindale = new FontFaceObserver('Roslindale Dsp Nar');
  const lato = new FontFaceObserver('Lato');

  Promise.all([
    roslindaleItalic.load(),
    roslindale.load(),
    lato.load()
  ])
    .then(() => {
      document.body.classList.add('fonts-loaded');
      requestAnimationFrame(() => { window.app = new App(); });
    })
    .catch(() => {
      console.warn('Fonts failed to load in time. Starting anyway.');
      document.body.classList.add('fonts-loaded');
      requestAnimationFrame(() => { window.app = new App(); });
    });
});

console.log('%cDesigned by Calvin, Developed by Muaaz', 'background: #f47120ff; color: #fff;');