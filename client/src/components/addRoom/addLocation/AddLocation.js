import { Box } from '@mui/material';
import { useEffect, useRef } from 'react';
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import { useValue } from '../../../context/ContextProvider';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';
//import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';


const AddLocation = () => {
  const {
    state: {
      location: { lng, lat },
    },
    dispatch,
  } = useValue();
  const mapRef = useRef();

  useEffect(() => {
    if (!lng && !lat) {
      fetch('https://ipapi.co/json')
        .then((response) => response.json())
        .then((data) => {
          mapRef.current.setView([data.latitude, data.longitude], 8);
          dispatch({
            type: 'UPDATE_LOCATION',
            payload: { lng: data.longitude, lat: data.latitude },
          });
        });
    }
  }, []);


  /*const GeocoderControl = () => {
    const map = useMap();
  

    useEffect(() => {
      const provider = new OpenStreetMapProvider();

      // Pass the provider option to the GeoSearchControl
      const searchControl = new GeoSearchControl({
        provider: provider.search.bind(provider), // Use the search method of the provider
        showMarker: false,
        showPopup: false,
        popupFormat: ({ query, result }) => result.label,
        marker: {
          icon: new L.Icon.Default(),
          draggable: false,
        },
        resultFormat: ({ result }) => result.label,
      });

      map.addControl(searchControl);

      searchControl.on('results', (data) => {
        const [result] = data.results;
        const { x: lng, y: lat } = result;
        dispatch({
          type: 'UPDATE_LOCATION',
          payload: { lng, lat },
        });
      });

      return () => {
        map.removeControl(searchControl);
      };
    }, [map, dispatch]);

    return null;
  };*/
  

  return (
    <Box
      sx={{
        height: 400,
        position: 'relative',
      }}
    >
      <MapContainer
        ref={mapRef}
        center={[lat, lng]}
        zoom={8}
        style={{ height: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker
          position={[lat, lng]}
          draggable={true}
          eventHandlers={{
            dragend: (e) => {
              const marker = e.target;
              const position = marker.getLatLng();
              const { lat, lng } = position;
              dispatch({
                type: 'UPDATE_LOCATION',
                payload: { lng, lat },
              });
            },
          }}
        />
       {/* <GeoSearchControl />
        <GeocoderControl />*/}
      </MapContainer>
    </Box>
  );
};

export default AddLocation;




