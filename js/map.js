import {unblockForm} from './form.js';
import {renderAd} from './ads.js';

const addressField = document.querySelector('#address');
const numberAdsShown = 10;

const map = L.map('map-canvas');
const markerGroup = L.layerGroup().addTo(map);
const tile = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const clearMarkerGroup = () => {
  markerGroup.clearLayers();
};

const StartCoordinates = {
  LAT: 35.68233,
  LNG: 139.75421
};

const START_ZOOM = 13;

const setMapDefaultCoordinates = () => {
  map.setView([StartCoordinates.LAT, StartCoordinates.LNG], START_ZOOM);
};

const mainPinIcon = L.icon({
  iconUrl: './img/main-pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 52],
});

const regularIcon = L.icon({
  iconUrl: './img/pin.svg',
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

const mainPinMarker = L.marker(
  {
    lat: 0,
    lng: 0,
  },
  {
    draggable: true,
    icon: mainPinIcon,
  },
);

const createAdMarker = (point) => {
  const {lat, lng} = point.location;
  const marker = L.marker(
    {
      lat,
      lng,
    },
    {
      icon: regularIcon,
    },
  );

  marker
    .addTo(markerGroup)
    .bindPopup(renderAd(point));
};

const setDefaultLocationMainPin = () => {
  mainPinMarker.setLatLng([StartCoordinates.LAT, StartCoordinates.LNG]);
};

const initMap = (cb) => {
  map.on('load', () => {
    unblockForm();
    cb();
  });
  setMapDefaultCoordinates();

  L.tileLayer(tile, attribution).addTo(map);

  setDefaultLocationMainPin();
  mainPinMarker.addTo(map);

  mainPinMarker.on('move', (evt) => {
    const {lat, lng} = evt.target.getLatLng();
    addressField.value = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  });
};

const createAdsMarkers = (adsList) => {
  adsList
    .slice(0, numberAdsShown)
    .forEach((ad) => {
      createAdMarker(ad);
    });
};

const closeAllPopup = () => {
  map.closePopup();
};

export {
  initMap,
  createAdsMarkers,
  setDefaultLocationMainPin,
  closeAllPopup,
  clearMarkerGroup,
  setMapDefaultCoordinates
};
