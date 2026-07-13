import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Navigation, MapPin, Users } from 'lucide-react';

export default function Dashboard() {
  const [stats] = useState({
    messages: 0,
    locations: 0,
    users: 100000
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome to FIFA World Cup 2026</h1>
        <p className="text-gray-600 mt-2">Your intelligent stadium assistant</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <MessageCircle className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Chat Messages</p>
              <p className="text-2xl font-bold text-gray-900">{stats.messages}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <MapPin className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Locations Visited</p>
              <p className="text-2xl font-bold text-gray-900">{stats.locations}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.users.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/chat"
          className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 rounded-xl shadow-lg hover:shadow-xl transition text-white"
        >
          <MessageCircle size={48} className="mb-4" />
          <h3 className="text-2xl font-bold mb-2">Start Chat</h3>
          <p className="text-blue-100">Get instant help in 20+ languages</p>
        </Link>

        <Link
          to="/navigation"
          className="bg-gradient-to-br from-green-500 to-green-600 p-8 rounded-xl shadow-lg hover:shadow-xl transition text-white"
        >
          <Navigation size={48} className="mb-4" />
          <h3 className="text-2xl font-bold mb-2">Navigation</h3>
          <p className="text-green-100">Find your way around the stadium</p>
        </Link>
      </div>

      {/* Features */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Key Features</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <li className="flex items-start gap-3">
            <span className="text-green-600">✓</span>
            <span className="text-gray-700">Multilingual support (20+ languages)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600">✓</span>
            <span className="text-gray-700">AI-powered navigation</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600">✓</span>
            <span className="text-gray-700">Accessibility features</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600">✓</span>
            <span className="text-gray-700">Real-time crowd analytics</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600">✓</span>
            <span className="text-gray-700">Emergency assistance</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-green-600">✓</span>
            <span className="text-gray-700">Personalized recommendations</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
