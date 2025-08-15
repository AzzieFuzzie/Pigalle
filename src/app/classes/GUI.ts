import GUI from 'lil-gui';

const urlParams = new URLSearchParams(window.location.search);

export const gui = urlParams.has('gui') ? new GUI() : null;

if (gui) {
  gui.close(); // optional: collapse on load
}
