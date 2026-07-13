import { useState } from 'react';
import { MapPin, Navigation as NavIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import api from '../services/api';

export default function Navigation() {
  const [destination, setDestination] = useState('');
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleNavigate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post('/navigation/route', {
        message: `Navigate to ${destination}`,
        context: {
          location: { section: '204', floor: 2 }
        }
      });

      setRoute(data.route);
    } catch (error) {
      toast.error('Failed to calculate route');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Navigation</h1>
        <p className="text-gray-600 mt-2">Find your way around the stadium</p>
      </div>

      {/* Search Form */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <form onSubmit={handleNavigate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Where do you want to go?
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g., restroom, food court, my seat..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <NavIcon size={20} />
            {loading ? 'Calculating...' : 'Get Directions'}
          </button>
        </form>
      </div>

      {/* Route Display */}
      {route && (
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="flex items-start gap-4 mb-4">
            <MapPin className="text-blue-600 mt-1" size={24} />
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Route to {destination}
              </h3>
              <div className="flex gap-4 text-sm text-gray-600">
                <span>📏 {route.distance}m</span>
                <span>⏱️ {Math.floor(route.duration / 60)}min</span>
                <span>👥 Crowd: {route.crowdLevel}</span>
              </div>
            </div>
          </div>

          {route.accessibilityFriendly && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <p className="text-green-800 text-sm">♿ Wheelchair accessible route</p>
            </div>
          )}

          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Directions:</h4>
            {route.steps.map((step, idx) => (
              <div key={idx} className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  {idx + 1}
                </div>
                <p className="text-gray-700 pt-0.5">{step}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Destinations */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="font-semibold text-gray-900 mb-4">Quick Destinations</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Restroom', 'Food', 'Medical', 'Exit'].map((dest) => (
            <button
              key={dest}
              onClick={() => setDestination(dest)}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition"
            >
              {dest}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
