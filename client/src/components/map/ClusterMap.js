import React, { useEffect, useState, useRef } from 'react';
import { useValue } from '../../context/ContextProvider';
import { getRooms } from '../../actions/room';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import Supercluster from 'supercluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './cluster.css';
import { Avatar, Paper, Tooltip } from '@mui/material';
import GeocoderInput from '../sidebar/GeocoderInput';
import PopupRoom from './PopupRoom';
import './Map.css';

const supercluster = new Supercluster({
  radius: 75,
  maxZoom: 20,
});

const ClusterMap = () => {
  const {
    state: { filteredRooms },
    dispatch,
  } = useValue();
  const [points, setPoints] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [bounds, setBounds] = useState([-180, -85, 180, 85]);
  const [zoom, setZoom] = useState(0);
  const [popupInfo, setPopupInfo] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    getRooms(dispatch);
  }, []);
  

  useEffect(() => {
    const points = filteredRooms.map((room) => ({
      type: 'Feature',
      properties: {
        cluster: false,
        roomId: room._id,
        price: room.price,
        title: room.title,
        description: room.description,
        lng: room.lng,
        lat: room.lat,
        images: room.images,
        uPhoto: room.uPhoto,
        uName: room.uName,
      },
      geometry: {
        type: 'Point',
        coordinates: [parseFloat(room.lng), parseFloat(room.lat)],
      },
    }));
    setPoints(points);
  }, [filteredRooms]);

  useEffect(() => {
    supercluster.load(points);
    setClusters(supercluster.getClusters(bounds, zoom));
  }, [points, zoom, bounds]);

  useEffect(() => {
    if (mapRef.current) {
      setBounds(mapRef.current.getBounds());
    }
  }, [mapRef?.current]);

  const clusterIcon = L.divIcon({
    className: 'cluster-marker',
    html: '<div></div>',
    iconSize: [10, 10],
  });

  return (
    <MapContainer
      center={[51.5072, 0.1276]}
      zoom={5}
      whenCreated={(map) => (mapRef.current = map)}
      onZoomend={() => setZoom(mapRef.current.getZoom())}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {clusters.map((cluster) => {
        const { cluster: isCluster, point_count } = cluster.properties;
        const [longitude, latitude] = cluster.geometry.coordinates;
        

        if (isCluster) {
          return (
            <Marker
              key={`cluster-${cluster.id}`}
              position={[latitude, longitude]}
              icon={clusterIcon}
              eventHandlers={{
                click: () => {
                  const zoom = Math.min(
                    supercluster.getClusterExpansionZoom(cluster.id),
                    20
                  );
                  mapRef.current.flyTo([latitude, longitude], zoom, {
                    duration: 1,
                  });
                  
                },
              }}
            >
              <Tooltip><>{point_count}</></Tooltip>
            </Marker>
          );
        }

        return (
          <Marker
            key={`room-${cluster.properties.roomId}`}
            position={[latitude, longitude]}
            eventHandlers={{
              click: () => setPopupInfo(cluster.properties),
            }}
          >
            
            <Tooltip title={cluster.properties.uName}>
              <Avatar
                src={cluster.properties.uPhoto}
                component={Paper}
                elevation={2}
              />
            </Tooltip>
          </Marker>
        );
      })}
     <GeocoderInput /> 
      {popupInfo && (
        <Popup
          position={[popupInfo.lat, popupInfo.lng]}
          maxWidth="auto"
          closeButton={false}
          autoClose={false}
          closeOnEscapeKey={false}
        >
          <PopupRoom {...{ popupInfo }} />
        </Popup>
      )}
    </MapContainer>
  );
};

export default ClusterMap;
