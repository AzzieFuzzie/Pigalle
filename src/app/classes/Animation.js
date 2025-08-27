import AutoBind from 'auto-bind';
import Prefix from 'prefix';
import Component from '../classes/Component';

export default class Animation extends Component {
  constructor({ element, elements }) {
    super({ element, elements })
    AutoBind(this);

    const { animationDelay, animationTarget } = element.dataset;

    this.delay = animationDelay;

    this.element = element;
    this.elements = elements;

    this.target = animationTarget ? element.closest(animationTarget) : element;
    this.transformPrefix = Prefix('transform');

    this.isVisible = false;

    if ('IntersectionObserver' in window) {
      this.createObserver();

      this.animateOut();
    } else {
      this.animateIn();

    }
  }

  createObserver() {
    if (!this.target) return;
    this.observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateIn();
          } else if (!entry.isIntersecting) {
            this.animateOut();
          }
        });
      },
      { threshold: 0 } // trigger as soon as any pixel is visible
    );

    this.observer.observe(this.target);
  }


  animateIn() {
    this.isVisible = true;
  }

  animateOut() {
    this.isVisible = false;
  }
}
