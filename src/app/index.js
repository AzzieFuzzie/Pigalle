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
import Navigation from './animations/Navigation'

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
    this.createPreloader();
    this.isTransitioning = false;

    if (import.meta.env.DEV && window.location.search.includes('fps')) {
      this.createStats();
    }


    this.init();
    this.update = this.update.bind(this);
  }

  init() {
    this.createContent();
    this.createTransition();
    this.createPages();

    this.addEventListeners();
    this.addLinkListeners();

    this.onResize();
    this.update();
  }

  createLenis() {
    this.lenis = new Lenis({
      // smoothWheel: true,
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
    this.preloader = new Preloader();

    if (this.lenis) this.lenis.stop();


    this.preloader.once('completed', () => {
      GSAP.delayedCall(1.6, () => {
        if (this.lenis) this.lenis.start();
        this.onPreloaded();
      });
    });


    document.body.style.visibility = "visible";

  }

  createNavigation() {
    this.navigation = new Navigation()
  }


  createTransition() {
    this.transition = new Transition({ lenis: this.lenis });
  }

  // in src/app/index.js

  onPreloaded() {
    this.onResize();

    // Create the page elements for the first time
    this.page.create();
    // Show the page (which now also creates its animations)
    this.page.show();

    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100); // 100ms is imperceptible but ensures stability.
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

      this.page = this.pages[this.template];
      if (!this.page) {
        console.warn(`No page found for template: ${this.template}, redirecting home`);
        this.isTransitioning = false;
        return this.onChange({ url: '/', push: true });
      }

      // 4. Create the new page's elements (it's still invisible at this point)
      this.page.create();

      if (this.template === 'book') {
        initDineplanSPA();
      }

      // Logic to scroll to the top of the page is RESTORED here.
      if (this.lenis) {
        document.documentElement.scrollTop = 0; // For modern browsers
        document.body.scrollTop = 0; // For older browsers (e.g., Safari)
        this.lenis.scrollTo(0, { immediate: true }); // For the Lenis instance
      }

      const header = document.querySelector('header');
      if (header) header.className = this.template;

      // 5. Play the 'leave' part of the main page transition
      if (this.transition) await this.transition.onLeave();

      // 6. Show the new page (fading it in and creating its animations)
      await this.page.show();

      // 7. CRITICAL: Refresh ScrollTrigger AFTER everything is visible and stable.
      ScrollTrigger.refresh();

      this.addLinkListeners();
      this.onResize();

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

  onResize() {
    if (this.page?.onResize) this.page.onResize();
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