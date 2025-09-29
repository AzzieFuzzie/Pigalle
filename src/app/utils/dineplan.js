export default function initDineplanSPA() {
  const wrapper = document.querySelector('.book__wrapper');
  if (!wrapper) return;

  const widget = wrapper.querySelector('.dineplan-widget');
  if (!widget) return;





  // Check if Dineplan is ready
  if (window.Dineplan) {
    window.dispatchEvent(new Event('load'));
    // console.log('[SPA] Dineplan inline widget initialized');
  }
}
