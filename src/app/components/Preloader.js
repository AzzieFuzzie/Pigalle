import GSAP from 'gsap';
import Component from '../classes/Component';
import each from 'lodash/each';
import { delay } from 'lodash';

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

    this.total = this.elements.images.length + this.elements.videos.length;
    this.loaded = 0;

    // 1. Add a 'progress' object to animate its value
    this.progress = { value: 0 };

    this.createLoader();

    GSAP.to(this.element, {
      autoAlpha: 1,
      duration: 0.2,
      ease: 'power3.inOut'
    });
  }

  createLoader() {
    if (this.total === 0) {
      this.onLoaded();
      return;
    }

    // ... (rest of the createLoader function is unchanged)

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

    // Fallback timer
    setTimeout(() => {
      if (this.loaded < this.total) {
        each([...this.elements.images, ...this.elements.videos], asset => {
          if (!asset.complete && asset.readyState < 3) this.onAssetLoaded(asset);
        });
      }
    }, 5000);
  }

  onAssetLoaded(asset) {
    this.loaded++;
    const percent = this.loaded / this.total;

    // 2. Animate the progress value instead of setting it directly
    GSAP.to(this.progress, {
      value: percent,
      duration: 0.3, // Controls the smoothness of the count
      ease: 'power3.out',
      onUpdate: () => {
        this.elements.number.innerHTML = `${Math.round(this.progress.value * 100)}%`;
      },
      onComplete: () => {
        // 3. Call onLoaded only when the final animation is complete
        if (this.progress.value >= 1) {
          this.onLoaded();
        }
      }
    });
  }

  onLoaded() {
    return new Promise(resolve => {
      this.emit('completed');

      this.animateOut = GSAP.timeline();
      this.animateOut.to(this.element, {
        autoAlpha: 0,
        duration: 1,
        delay: 0.5,
        ease: 'power3.out'
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