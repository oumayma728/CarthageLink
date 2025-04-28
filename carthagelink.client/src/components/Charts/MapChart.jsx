import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

// Dummy device positions (lat/lng of Tunisia cities)
const devices = [
  { id: 1, name: 'Device A - Tunis', position: [36.8065, 10.1815] },
  { id: 2, name: 'Device B - Sfax', position: [34.7406, 10.7603] },
  { id: 3, name: 'Device C - Sousse', position: [35.8256, 10.6084] },
];

const MapComponent = () => {
  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden shadow-xl">
      <MapContainer 
        center={[34.8, 10.1]} 
        zoom={6.5} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {devices.map(device => (
          <Marker key={device.id} position={device.position}>
            <Popup>{device.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;