import Animation from '../classes/Animation';
import GSAP from 'gsap';

export default class Chat extends Animation {
  constructor({ element }) {
    super({ element });

    this.element = element;
    this.wrapper = this.element.querySelector('.whatsapp__wrapper');
    this.icon = this.wrapper.querySelector('.whatsapp__icon');
    this.text = this.wrapper.querySelector('.whatsaap__text');

    GSAP.set(this.text, { width: 0, borderRadius: 20, gap: 0 });
    GSAP.set(this.wrapper, { gap: 0 });

    // Bind hover handlers
    this._handleMouseEnter = this._animateIn.bind(this);
    this._handleMouseLeave = this._animateOut.bind(this);

    this.mm = GSAP.matchMedia();
    this.init();
  }

  init() {
    // Set initial state
    const iconWidth = this.icon.getBoundingClientRect().width;
    const textWidth = this.text.scrollWidth;
    this.collapsedWidth = iconWidth;
    this.expandedWidth = textWidth;


    // Only add hover events on desktop using matchMedia
    this.mm.add("(min-width: 769px)", () => {
      this.element.addEventListener('mouseenter', this._handleMouseEnter);
      this.element.addEventListener('mouseleave', this._handleMouseLeave);

      // Cleanup function if media query no longer matches
      return () => {
        this.element.removeEventListener('mouseenter', this._handleMouseEnter);
        this.element.removeEventListener('mouseleave', this._handleMouseLeave);
      };
    });
  }

  _animateIn() {
    GSAP.killTweensOf([this.text, this.wrapper]);
    GSAP.to(this.text, {
      width: this.expandedWidth,

      duration: 0.6,
      ease: 'expo.Out'
    });
    GSAP.to(this.wrapper, { duration: 0.8, ease: 'expo.Out' });
  }

  _animateOut() {
    GSAP.killTweensOf([this.text, this.wrapper]);
    GSAP.to(this.text, {
      width: 0,
      gap: 0,
      duration: 0.4,
      ease: 'expo.Out'
    });
    GSAP.to(this.wrapper, { gap: 0, duration: 0.4, ease: 'expo.Out' });
  }

  destroy() {
    GSAP.killTweensOf([this.text, this.wrapper]);
    this.mm.revert(); // Revert all matchMedia listeners

    this.element = null;
    this.wrapper = null;
    this.icon = null;
    this.text = null;
    this._handleMouseEnter = null;
    this._handleMouseLeave = null;
    this.mm = null;
  }
}
