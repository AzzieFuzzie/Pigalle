import '../styles/main.scss';
import AutoBind from 'auto-bind';
import Stats from 'stats.js';
import each from 'lodash/each';
import FontFaceObserver from 'fontfaceobserver';
// import { Detection } from '@classes/Detection';
import Lenis from 'lenis';
import GSAP from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Preloader from './components/Preloader';
import Transition from './components/Transition';
import initDineplanSPA from './utils/dineplan';

import Home from '@pages/Home';
import Menu from '@pages/Menu';
import About from '@pages/About';
import Contact from '@pages/Contact';
import Book from '@pages/Book';


class App {
  constructor() {
    AutoBind(this);
    this.createLenis();
    this.createPreloader();
    this.isTransitioning = false;

    if (import.meta.env.DEV && window.location.search.includes('fps')) {
      this.createStats();
    }


    this.init()


    // Bind update loop
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
      smoothWheel: true,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))

    });

    // Sync Lenis scroll with GSAP ScrollTrigger
    this.lenis.on('scroll', ScrollTrigger.update);

    // Add Lenis to GSAP ticker
    GSAP.ticker.add((time) => {
      this.lenis.raf(time * 1000);
    });

    GSAP.ticker.lagSmoothing(0);

    // console.log('Lenis initialized', this.lenis);

  }

  createPreloader() {
    document.body.style.visibility = "visible";
    document.body.style.overflow = "auto";
    this.preloader = new Preloader();

    // Stop Lenis scrolling while preloader is active
    if (this.lenis) this.lenis.stop();

    this.preloader.once('completed', () => {
      if (this.lenis) this.lenis.start();
      this.onPreloaded();
    });
  }


  createTransition() {
    this.transition = new Transition({ lenis: this.lenis });
  }

  onPreloaded() {
    this.onResize();
    this.page.show();
  }

  createContent() {
    this.content = document.querySelector('.content');
    this.template = this.content.getAttribute('data-template');
    // console.log('Initial template:', this.template);
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
    this.page.create();




  }

  /**
   * SPA Page Change
   */
  async onChange({ url, push = true }) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    if (!this.page) {
      this.isTransitioning = false;
      return;
    }

    if (this.page.destroy) this.page.destroy();
    await this.page.hide();

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

      // Update template & content
      this.template = divContent.getAttribute('data-template');
      this.content.setAttribute('data-template', this.template);
      this.content.innerHTML = divContent.innerHTML;

      // if (this.template === 'book') {
      //   console.log('book');
      //   initDineplanSPA();
      // }
      // Update current page
      this.page = this.pages[this.template];
      if (!this.page) {
        console.warn(`No page found for template: ${this.template}, redirecting home`);
        this.isTransitioning = false;
        return this.onChange({ url: '/', push: true });
      }

      this.page.create();

      if (this.template === 'book') {
        // console.log('[SPA] Book template detected');
        initDineplanSPA();
      }


      // Force Lenis to resync with new content
      if (this.lenis) {

        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        this.lenis.raf(performance.now());


        this.lenis.scrollTo(0, { immediate: true });


        ScrollTrigger.refresh();
      }

      const header = document.querySelector('header');
      if (header) header.className = this.template;

      if (this.transition) await this.transition.onLeave();
      await this.page.show();


      this.isTransitioning = false;
      this.onResize();
      this.addLinkListeners();



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
    if (this.page?.onResize) this.page.onResize();
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
    this.page?.onTouchDown?.(event);
  }
  onTouchMove(event) {
    this.page?.onTouchMove?.(event);
  }
  onTouchUp(event) {
    this.page?.onTouchUp?.(event);
  }

  /**
   * Animation Loop
   */
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

    // === Menu categories click listener ===
    if (this.template === 'menu' && this.page?.elements?.button) {
      this.page.elements.button.forEach(btn => {
        btn.onclick = () => {
          const category = btn.dataset.category;
          this.page.showCategory(category);


          // Update SPA URL without fetching
          const url = `/menu/${category}`.toLowerCase();
          window.history.pushState({}, '', url);
        };
      });
    }
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
      console.log('All fonts loaded');
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
