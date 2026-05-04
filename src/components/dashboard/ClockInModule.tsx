import React, { useState } from 'react';
import { Button } from '../ui/Button';

export const ClockInModule = ({ clientLocation }: { clientLocation: { lat: number, lng: number } }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClockIn = () => {
    setLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const { latitude, longitude } = pos.coords;
            // Simplified 50m check (approx)
            const dist = Math.sqrt(Math.pow(latitude - clientLocation.lat, 2) + Math.pow(longitude - clientLocation.lng, 2)) * 111000;
            if (dist > 50) {
                setError('Geo-fence Violation: You are too far.');
            } else {
                alert('Clocked in!');
            }
            setLoading(false);
        },
        () => { setError('GPS Required.'); setLoading(false); }
    );
  };

  return (
    <div className="p-6 border rounded-2xl">
        <Button onClick={handleClockIn} disabled={loading}>Clock In</Button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};
