import Animation from '../classes/Animation';
import GSAP from 'gsap';

export default class Chat extends Animation {
  constructor({ element }) {
    super({ element });

    this.element = element;
    this.wrapper = this.element.querySelector('.whatsapp__wrapper');
    this.icon = this.wrapper.querySelector('.whatsapp__icon');
    this.text = this.wrapper.querySelector('.whatsaap__text');

    // Bind hover handlers so we can remove them later
    this._handleMouseEnter = this._animateIn.bind(this);
    this._handleMouseLeave = this._animateOut.bind(this);

    this.init();
  }

  init() {
    // Set initial state after DOM layout
    const iconWidth = this.icon.getBoundingClientRect().width;
    const textWidth = this.text.scrollWidth; // more reliable than getBoundingClientRect().width
    this.collapsedWidth = iconWidth;
    this.expandedWidth = textWidth;

    GSAP.set(this.text, { width: 0, borderRadius: 20, gap: 0 });
    GSAP.set(this.wrapper, { gap: 0 });

    // Only add hover events on desktop
    if (window.innerWidth > 768) {
      this.element.addEventListener('mouseenter', this._handleMouseEnter);
      this.element.addEventListener('mouseleave', this._handleMouseLeave);
    }
  }

  _animateIn() {
    GSAP.killTweensOf([this.text, this.wrapper]);
    GSAP.to(this.text, {
      width: this.expandedWidth,
      gap: 20,
      duration: 0.8,
      ease: 'circ.Out'
    });
    GSAP.to(this.wrapper, { gap: 8, duration: 0.8, ease: 'circ.Out' });
  }

  _animateOut() {
    GSAP.killTweensOf([this.text, this.wrapper]);
    GSAP.to(this.text, {
      width: 0,
      gap: 0,
      duration: 0.4,
      ease: 'circ.Out'
    });
    GSAP.to(this.wrapper, { gap: 0, duration: 0.4, ease: 'circ.Out' });
  }

  destroy() {
    // Kill GSAP tweens
    GSAP.killTweensOf([this.text, this.wrapper]);

    // Remove event listeners
    this.element.removeEventListener('mouseenter', this._handleMouseEnter);
    this.element.removeEventListener('mouseleave', this._handleMouseLeave);

    // Clear references
    this.element = null;
    this.wrapper = null;
    this.icon = null;
    this.text = null;
    this._handleMouseEnter = null;
    this._handleMouseLeave = null;
  }
}
