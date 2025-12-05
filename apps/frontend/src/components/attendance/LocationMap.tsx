'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

interface LocationMapProps {
  latitude: number;
  longitude: number;
  address?: string | null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LeafletComponent = React.ComponentType<any>;

function LocationMapComponent({ latitude, longitude, address }: LocationMapProps) {
  const [MapContainer, setMapContainer] = useState<LeafletComponent | null>(null);
  const [TileLayer, setTileLayer] = useState<LeafletComponent | null>(null);
  const [Marker, setMarker] = useState<LeafletComponent | null>(null);
  const [Popup, setPopup] = useState<LeafletComponent | null>(null);

  useEffect(() => {
    import('react-leaflet').then((module) => {
      setMapContainer(() => module.MapContainer);
      setTileLayer(() => module.TileLayer);
      setMarker(() => module.Marker);
      setPopup(() => module.Popup);
    });

    import('leaflet').then((L) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
    });
  }, []);

  if (!MapContainer || !TileLayer || !Marker || !Popup) {
    return (
      <div className="h-[200px] bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="h-[200px] rounded-lg overflow-hidden border border-gray-200">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.css"
      />
      <MapContainer
        center={[latitude, longitude]}
        zoom={16}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={[latitude, longitude]}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold">Lokasi Anda</p>
              {address && <p className="text-gray-600 text-xs mt-1">{address}</p>}
              <p className="text-gray-500 text-xs mt-1">
                {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default dynamic(() => Promise.resolve(LocationMapComponent), {
  ssr: false,
  loading: () => (
    <div className="h-[200px] bg-gray-100 rounded-lg flex items-center justify-center">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
});
