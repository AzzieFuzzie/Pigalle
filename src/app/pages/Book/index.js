import Page from '@classes/Page';

export default class Book extends Page {
  constructor() {
    super({
      element: '.book',
      elements: { wrapper: '.book__wrapper' },
    });
  }


  create() {
    super.create();

    const widget = document.querySelector('.dineplan-widget');
    if (!widget) return;

    // Remove old iframe if exists
    const oldIframe = widget.querySelector('iframe');
    if (oldIframe) oldIframe.remove();

    // The widget script automatically renders divs on page load
    // For SPA, we trick it by re-adding the script dynamically
    const script = document.createElement('script');
    script.src = "https://public-prod.dineplan.com/widget/dineplan.widget.min.js";
    script.async = true;
    document.body.appendChild(script);
  }

}
