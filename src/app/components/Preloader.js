import GSAP from 'gsap';
import Component from '../classes/Component';
import each from 'lodash/each';

export default class Preloader extends Component {
  constructor() {
    super({
      element: '.preloader',
      elements: {
        number: '.preloader__number',
        images: document.querySelectorAll('img[data-src]'),
        videos: document.querySelectorAll('video'),
      },
    });

    // total assets = images + videos
    this.total = this.elements.images.length + this.elements.videos.length;
    this.loaded = 0;

    this.createLoader();
  }

  createLoader() {
    if (this.total === 0) {
      this.onLoaded();
      return;
    }

    // Load images
    each(this.elements.images, image => {
      const src = image.getAttribute('data-src');
      if (!src) return this.onAssetLoaded(image);

      image.loading = 'eager';
      image.src = src;

      if (image.complete) {
        this.onAssetLoaded(image);
      } else {
        image.onload = () => this.onAssetLoaded(image);
        image.onerror = () => this.onAssetLoaded(image);
      }
    });

    // Load videos
    each(this.elements.videos, video => {
      video.preload = 'auto';

      const onLoaded = () => this.onAssetLoaded(video);

      if (video.readyState >= 3) { // HAVE_FUTURE_DATA
        onLoaded();
      } else {
        video.oncanplaythrough = onLoaded;
        video.onerror = onLoaded;
      }
    });

    // Fallback: force complete after 3 seconds
    setTimeout(() => {
      if (this.loaded < this.total) {
        each([...this.elements.images, ...this.elements.videos], asset => {
          if (!asset.complete && asset.readyState < 3) this.onAssetLoaded(asset);
        });
      }
    }, 3000);
  }

  onAssetLoaded(asset) {
    this.loaded++;
    const percent = this.loaded / this.total;
    this.elements.number.innerHTML = `${Math.round(percent * 100)}%`;

    if (percent >= 1) this.onLoaded();
  }

  onLoaded() {
    return new Promise(resolve => {
      this.emit('completed');
      console.log('loaded');

      const video = document.querySelector('.hero__video');
      if (video) {
        video.play().catch(() => {
          console.log('Mobile requires user interaction to play video');
        });
      }

      this.animateOut = GSAP.timeline({ delay: 0.5 });

      this.animateOut.to(
        this.elements.number,
        { duration: 1.5, ease: 'expo.out', y: '100%' },
        '-=1.4'
      );

      this.animateOut.to(this.element, {
        y: '-100%',
        duration: 1,
        ease: 'power3.Out',
      });

      this.animateOut.call(() => {
        this.destroy();
        resolve();
      });
    });
  }

  destroy() {
    if (this.element?.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}
