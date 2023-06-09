import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.js';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

const Geocoder = () => {
  const map = useMap();

  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: false,
      geocoder: provider,
    }).addTo(map);

    geocoder.on('markgeocode', (e) => {
      const { center } = e.geocode;
      const { lat, lng } = center;
      
      // Dispatch the updated location coordinates
      dispatch({
        type: 'UPDATE_LOCATION',
        payload: { lng, lat },
      });
    });

    return () => {
      geocoder.removeFrom(map);
    };
  }, [map]);

  return null;
};

export default Geocoder;
