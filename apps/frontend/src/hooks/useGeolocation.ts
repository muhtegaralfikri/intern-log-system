'use client';

import { useState, useCallback } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    address: null,
    error: null,
    loading: false,
  });

  const getLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setState((prev) => ({ ...prev, error: 'Geolocation is not supported' }));
      return null;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    return new Promise<{ latitude: number; longitude: number; address: string | null }>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          let address = null;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            address = data.display_name || null;
          } catch (e) {
            console.error('Reverse geocoding error:', e);
          }

          setState({
            latitude,
            longitude,
            address,
            error: null,
            loading: false,
          });

          resolve({ latitude, longitude, address });
        },
        (error) => {
          let errorMessage = 'Failed to get location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }, []);

  return { ...state, getLocation };
}
