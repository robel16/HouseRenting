import L from 'leaflet';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';
import 'leaflet-control-geocoder/dist/Control.Geocoder.js';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useValue } from '../../context/ContextProvider';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

const GeocoderInput = () => {
  const { mapRef, containerRef, dispatch } = useValue();
  const map = useMap();

  useEffect(() => {

    const provider = new OpenStreetMapProvider();

    const geocoderContainer = L.DomUtil.create('div');
    containerRef.current.appendChild(geocoderContainer);

    const geocoder = L.Control.geocoder({
      defaultMarkGeocode: false,
      geocoder: provider,
    })
      .on('markgeocode', (e) => {
        const { center } = e.geocode;
        const { lat, lng } = center;
        dispatch({
          type: 'FILTER_ADDRESS',
          payload: { lng, lat },
        });
      })
      .on('clear', () => {
        dispatch({ type: 'CLEAR_ADDRESS' });
      });

    geocoderContainer.appendChild(geocoder.onAdd(map));

    return () => {
      geocoder.remove(map);
    };
  }, [map, containerRef, dispatch]);

  return <div />;
};

export default GeocoderInput;
