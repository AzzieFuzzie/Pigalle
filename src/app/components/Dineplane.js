export default class Dineplane {
  constructor() {
    this._init();
  }

  _init() {
    const wrapper = document.querySelector('.dineplan-widget');
    if (!wrapper) return;

    // Remove old script
    const oldScript = document.querySelector('script[src="https://public-prod.dineplan.com/widget/dineplan.widget.min.js"]');
    if (oldScript) oldScript.remove();

    // Delete old Dineplan object so it can reinitialize
    if (window.Dineplan) delete window.Dineplan;

    // Set key for the widget
    window.Dineplan = {
      key: wrapper.dataset.key,
      bgcolour: "#2c3e50",
      fontcolour: "",

      disable: false,
      logging: true
    };

    // Load the script
    const script = document.createElement('script');
    script.src = "https://public-prod.dineplan.com/widget/dineplan.widget.min.js";
    script.async = false;
    script.onload = () => {
      console.log('[Book] Dineplan loaded');

      // Wait a short moment and then force the widget to scan your div
      setTimeout(() => {
        const newWidget = document.querySelector('.dineplan-widget');
        if (newWidget && typeof window.Dineplan._init === 'function') {
          window.Dineplan._init();
          console.log('[Book] Dineplan iframe should now appear');
        }
      }, 100);
    };

    document.body.appendChild(script);
  }

}
