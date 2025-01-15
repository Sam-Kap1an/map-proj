import './style.css';
import {Map, View} from './ol';
import TileLayer from './ol/layer/Tile';
import OSM from './ol/source/OSM';
import VectorLayer from './ol/layer/Vector';
import VectorSource from './ol/source/Vector';
import Feature from './ol/Feature';
import Point from './ol/geom/Point';
import Style from './ol/style/Style';
import CircleStyle from './ol/style/Circle';
import Fill from './ol/style/Fill';
import Stroke from './ol/style/Stroke';
import { fromLonLat } from './ol/proj';

const cities = [
  { coordinates: [-119.731994, 38.937779], count: 1 }, // Nevada
  { coordinates: [-118.411733, 33.999099], count: 2 }, // LA
  { coordinates: [-118.121733, 33.80001], count: 3 }, // LA
  { coordinates: [-122.450768, 37.760526], count: 6 },//SF1
  { coordinates: [-121.147826, 38.674677], count: 1 }, //folsom
  { coordinates: [-119.794692, 36.785633], count: 1 }, //Fresno
  { coordinates: [-121.815942, 37.296350], count: 2 }, //Sj
  { coordinates: [-122.136342, 37.383373], count: 1 }, //palo alto
];

const features = cities.map((city) => {
  const feature = new Feature({
    geometry: new Point(fromLonLat(city.coordinates)), // Convert EPSG:4326 to EPSG:3857
  });

  feature.setStyle(
    new Style({
      image: new CircleStyle({
        radius: Math.sqrt(city.count) * 15, // size based on count
        fill: new Fill({ 
          color: generateRedIntensityColor(city.count) 
        }), 
        stroke: new Stroke({ color: 'black', width: 1 }), 
      }),
    })
  );

  return feature;
});

const vectorSource = new VectorSource({
  features: features,
});

const vectorLayer = new VectorLayer({
  source: vectorSource,
});

// funct to gen red intensity based on count
function generateRedIntensityColor(count) {
  const maxRed = 255; // Max red 
  const minAlpha = 0.3; // Min transparency 
  const maxAlpha = 1; // Max opacity

  const red = Math.min(maxRed, count * 100); 
  const alpha = Math.min(maxAlpha, minAlpha + (count/8)); 

  return `rgba(${red}, 0, 0, ${alpha})`; 
}



const sloFeature = new Feature({
  geometry: new Point(fromLonLat([-120.670375, 35.272506])), // SLO coords for a way point
});

sloFeature.setStyle([
  new Style({
    image: new CircleStyle({
      radius: 20, 
      fill: new Fill({ color: 'yellow' }), 
      stroke: new Stroke({ color: 'green', width: 5 }), 
    }),
  }),
  
  new Style({
    image: new CircleStyle({
      radius: 10, 
      fill: new Fill({ color: 'yellow' }), 
      stroke: new Stroke({ color: 'green', width: 5 }),
    }),
  }),

]);

// Add this feature to the vector source
vectorSource.addFeature(sloFeature);

const vectorLayerSLO = new VectorLayer({
  source: vectorSource,
});

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  view: new View({
    center: fromLonLat([-120.670375, 35.272506]),
    zoom: 9, 
  }),
});

map.addLayer(vectorLayer);
map.addLayer(vectorLayerSLO);