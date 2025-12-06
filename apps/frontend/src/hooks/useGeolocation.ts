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
      setState((prev) => ({ ...prev, error: 'Geolocation tidak didukung di browser ini' }));
      return null;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    return new Promise<{ latitude: number; longitude: number; address: string | null }>((resolve, reject) => {
      // Try with high accuracy first
      const tryGetLocation = (enableHighAccuracy: boolean, timeout: number) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            
            let address = null;
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
                { headers: { 'User-Agent': 'InternLogSystem/1.0' } }
              );
              const data = await response.json();
              address = data.display_name || null;
            } catch (e) {
              console.error('Reverse geocoding error:', e);
              // Continue without address
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
            // If high accuracy fails and we haven't tried low accuracy yet, try again
            if (enableHighAccuracy) {
              console.log('High accuracy failed, trying with lower accuracy...');
              tryGetLocation(false, 15000);
              return;
            }

            // Both attempts failed
            let errorMessage = 'Gagal mendapatkan lokasi';
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = 'Izin lokasi ditolak. Silakan aktifkan izin lokasi di browser Anda.';
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = 'Informasi lokasi tidak tersedia. Pastikan GPS aktif.';
                break;
              case error.TIMEOUT:
                errorMessage = 'Waktu permintaan lokasi habis. Coba lagi atau periksa koneksi GPS Anda.';
                break;
            }
            setState((prev) => ({ ...prev, error: errorMessage, loading: false }));
            reject(new Error(errorMessage));
          },
          {
            enableHighAccuracy,
            timeout,
            maximumAge: 0,
          }
        );
      };

      // Start with high accuracy, 30 second timeout
      tryGetLocation(true, 30000);
    });
  }, []);

  return { ...state, getLocation };
}
