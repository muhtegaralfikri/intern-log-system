'use client';

import { useState } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import CameraCapture from './CameraCapture';
import LocationMap from './LocationMap';
import { attendanceApi } from '@/lib/api';

interface AttendanceCheckInProps {
  type: 'check-in' | 'check-out';
  onSuccess: () => void;
}

export default function AttendanceCheckIn({ type, onSuccess }: AttendanceCheckInProps) {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { latitude, longitude, address, loading: locationLoading, error: locationError, getLocation } = useGeolocation();

  const handleGetLocation = async () => {
    try {
      await getLocation();
    } catch (e) {
      console.error('Location error:', e);
    }
  };

  const handleCapturePhoto = (imageSrc: string) => {
    setCapturedPhoto(imageSrc);
    setShowCamera(false);
  };

  const handleSubmit = async () => {
    if (!latitude || !longitude) {
      setError('Lokasi diperlukan. Silakan aktifkan GPS.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = {
        photo: capturedPhoto || undefined,
        latitude,
        longitude,
        address: address || undefined,
      };

      if (type === 'check-in') {
        await attendanceApi.checkIn(data);
      } else {
        await attendanceApi.checkOut(data);
      }

      onSuccess();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err.response?.data?.message || 'Gagal melakukan absensi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {type === 'check-in' ? 'Check In' : 'Check Out'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Photo Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
            Foto Selfie
          </label>
          {capturedPhoto ? (
            <div className="relative">
              <img
                src={capturedPhoto}
                alt="Selfie"
                className="w-full h-48 object-cover rounded-lg"
              />
              <button
                onClick={() => setCapturedPhoto(null)}
                className="absolute top-2 right-2 bg-white/80 dark:bg-slate-800/80 p-1 rounded-full hover:bg-white dark:hover:bg-slate-700 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-700 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowCamera(true)}
              className="w-full h-48 border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg flex flex-col items-center justify-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
            >
              <svg className="w-12 h-12 text-gray-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="mt-2 text-sm text-gray-500 dark:text-slate-400">Klik untuk ambil foto</span>
            </button>
          )}
        </div>

        {/* Location Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
            Lokasi
          </label>
          {latitude && longitude ? (
            <div className="space-y-2">
              <LocationMap latitude={latitude} longitude={longitude} address={address} />
              {address && (
                <p className="text-sm text-gray-600 dark:text-slate-400">{address}</p>
              )}
              <p className="text-xs text-gray-400 dark:text-slate-500">
                Koordinat: {latitude.toFixed(6)}, {longitude.toFixed(6)}
              </p>
            </div>
          ) : (
            <button
              onClick={handleGetLocation}
              disabled={locationLoading}
              className="w-full py-3 border border-gray-300 dark:border-slate-600 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 text-gray-700 dark:text-slate-300 transition-colors"
            >
              {locationLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-gray-500 dark:text-slate-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Mendapatkan lokasi...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 text-gray-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Dapatkan Lokasi</span>
                </>
              )}
            </button>
          )}
          {locationError && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">{locationError}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !latitude || !longitude}
          className="w-full py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Processing...' : type === 'check-in' ? 'Check In Sekarang' : 'Check Out Sekarang'}
        </button>
      </div>

      {showCamera && (
        <CameraCapture
          onCapture={handleCapturePhoto}
          onClose={() => setShowCamera(false)}
        />
      )}
    </div>
  );
}
