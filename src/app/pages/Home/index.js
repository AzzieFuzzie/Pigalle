import Page from '@classes/Page';

export default class Home extends Page {
  constructor() {
    super({
      element: '.home',
      elements: {
        wrapper: '.home__wrapper',
        // Add the video selector
        video: '.home__hero__video'
      },
    });
  }

  create() {
    super.create();
    // Set the video source to begin loading, but do not play
    if (this.elements.video) {
      const videoElement = Array.isArray(this.elements.video) ? this.elements.video[0] : this.elements.video;
      if (videoElement) {
        videoElement.src = videoElement.dataset.src;
      }
    }
  }

  async show() {
    // Run the default page show animation (fade in, etc.)
    await super.show();

    // After the page is visible, attempt to play the video
    if (this.elements.video) {
      const videoElement = Array.isArray(this.elements.video) ? this.elements.video[0] : this.elements.video;
      if (videoElement) {
        videoElement.muted = true; // Muting is essential for autoplay
        try {
          await videoElement.play();
        } catch (error) {
          console.error("Video autoplay was prevented by the browser.", error);
        }
      }
    }
  }
}