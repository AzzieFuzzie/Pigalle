// _data/googleMaps.js

export const location = { lat: -33.9249, lng: 18.4241 }; // Replace with your restaurant
export const styles = [
  { "elementType": "geometry", "stylers": [{ "color": "#1c1c1c" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#f5f1e6" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#1c1c1c" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#2b2b2b" }] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#d4af37" }] },
  { "featureType": "poi", "stylers": [{ "visibility": "off" }] },
  { "featureType": "water", "elementType": "geometry.fill", "stylers": [{ "color": "#202020" }] }
];
export const marker = {
  url: "/assets/icons/gold-marker.svg", // path to your marker SVG
  size: [40, 40]
};
