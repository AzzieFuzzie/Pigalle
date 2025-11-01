import GSAP from 'gsap';
import Component from '../classes/Component';
import { COLOR_BLACK, COLOR_WHITE } from '../utils/colors';

export default class Navigation extends Component {
  constructor({ template, lenis }) {
    super({
      element: '.navigation',
      elements: {
        links: '.navigation__links--desktop a',
        mobile: '.navigation__links--mobile',
        mobileLinks: '.mobile-links__wrapper a',
        logo: '.navigation__logo__image',
      },
    });

    this.lenis = lenis;
    this.template = template;

    this.currentScroll = this.lenis.scroll;
    this.previousScroll = this.lenis.scroll;

    this.ticking = false;

    this.lenis.on('scroll', this.onScroll.bind(this));

    // --- FIX: Select the button here in the constructor ---
    this.btnOpen = document.querySelector('.navigation__icon');
    console.log(this.btnOpen);
    // Call this *after* this.btnOpen is defined
    this.mobileListeners();
  }

  onChange(template) {
    this.template = template;
    if (template === 'about' || template === 'home') {
      GSAP.to(this.element, {
        backgroundColor: 'transparent',
        duration: 0.5,
      });
      GSAP.to(this.elements.links, {
        color: COLOR_WHITE,
        autoAlpha: 1,
        duration: 0.75,
      });
    } else {
      GSAP.to(this.element, {
        backgroundColor: 'transparent',
        duration: 0.5,
      });
      GSAP.to(this.elements.links, {
        color: COLOR_BLACK,
        autoAlpha: 1,
        duration: 0.75,
      });
    }
  }

  onScroll(e) {
    this.previousScroll = this.currentScroll;
    this.currentScroll = e.scroll;

    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        this.checkScrollTop(this.template);
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  checkScrollTop(template) {
    const scrollY = this.currentScroll;
    const prevY = this.previousScroll;

    // --- AT TOP ---
    if (scrollY <= 5) {
      this.onChange(template);
      GSAP.to(this.element, { y: '0%', duration: 0.2 });
    }
    // --- SCROLLING DOWN ---
    else if (scrollY > prevY && scrollY > 50) {
      GSAP.to(this.element, {
        y: '-100%',
        duration: 0.4,
      });
      GSAP.to(this.elements.links, {
        autoAlpha: 0,
        duration: 0.2,
      });
    }
    // --- SCROLLING UP ---
    else if (scrollY < prevY && scrollY > 5) {
      GSAP.to(this.element, {
        y: '0%',
        backgroundColor: COLOR_WHITE,
        duration: 0.5,
      });

      GSAP.to(this.elements.links, {
        autoAlpha: 1,
        color: COLOR_BLACK,
        duration: 0.5,
        stagger: 0.05,
        ease: 'power2.out',
        delay: 0.1,
      });
    }
  }

  // --- REVISED MOBILE METHODS ---

  openMobile() {
    // this.btnOpen is now defined in the constructor

    this.elements.mobile.setAttribute('aria-expanded', true);
    console.log('opened');
    this.lenis.stop()
  }

  closeMobile() {

    this.elements.mobile.setAttribute('aria-expanded', false);
    console.log('closed');
    this.lenis.start()
  }

  // New toggle handler
  onMobileClick() {
    const isExpanded = this.elements.mobile.getAttribute('aria-expanded') === 'true';
    console.log('open');
    if (isExpanded) {
      this.closeMobile();

    } else {
      this.openMobile();

    }
  }

  mobileListeners() {
    // Check if the button exists before adding a listener
    if (this.btnOpen) {
      // Pass the function reference, not the result of calling it
      // Use .bind(this) to maintain the correct 'this' context
      this.btnOpen.addEventListener('click', this.onMobileClick.bind(this));
    } else {
      console.warn('Mobile navigation icon (.navigation__icon) not found.');
    }
    this.elements.mobileLinks.forEach(link => {

      // 1. Add the listener to the individual 'link'
      // 2. Pass the function reference 'this.closeMobile.bind(this)'
      link.addEventListener('click', this.closeMobile.bind(this));

    });

  }
}