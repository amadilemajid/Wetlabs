import { Link } from 'react-router-dom';
import { Map, BarChart2, CheckCircle, ArrowRight } from 'lucide-react';

export function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-emerald-400">WETLABS</h1>
          <div className="flex gap-2">
            <Link to="/map" className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
              <Map className="w-4 h-4" /> Map
            </Link>
            <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800">
              <BarChart2 className="w-4 h-4" /> Dashboard
            </Link>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-emerald-400" />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white">✓ Report Submitted!</h2>
            <p className="text-gray-400">Your report has been transmitted to WETLABS</p>
          </div>

          <div className="bg-gray-700 rounded-xl p-6 space-y-3">
            <h3 className="font-semibold text-white uppercase text-sm tracking-wider">Report Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Report ID:</span>
                <span className="font-mono font-bold text-emerald-400">WL-1776373963953</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Wetland:</span>
                <span className="font-semibold text-white">Victoria Basin</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Issue Type:</span>
                <span className="font-semibold text-white">Encroachment</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Severity:</span>
                <span className="font-semibold text-amber-400">Medium</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">GPS Coordinates:</span>
                <span className="font-mono font-semibold text-white">-0.50, 33.90</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Timestamp:</span>
                <span className="font-mono font-semibold text-white">00:12</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-900 bg-opacity-30 border border-blue-700 rounded-xl p-4 space-y-3">
            <h3 className="font-semibold text-blue-300 text-sm">What Happens Next:</h3>
            <ul className="space-y-2 text-sm text-blue-200">
              <li className="flex gap-2">
                <span className="text-lg">📍</span>
                <span><strong>Visible on Map:</strong> Your report appears as a colored marker at the wetland location</span>
              </li>
              <li className="flex gap-2">
                <span className="text-lg">📊</span>
                <span><strong>Dashboard Review:</strong> Analysts validate your report against satellite data</span>
              </li>
              <li className="flex gap-2">
                <span className="text-lg">🔔</span>
                <span><strong>Officer Alert:</strong> High severity reports trigger instant notifications</span>
              </li>
              <li className="flex gap-2">
                <span className="text-lg">✅</span>
                <span><strong>Stored Permanently:</strong> Your report is archived with full metadata</span>
              </li>
            </ul>
          </div>

          <div className="pt-4">
            <Link to="/map" className="w-full py-4 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-all text-center flex items-center justify-center gap-2">
              View on Map <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          <p>Report ID <span className="font-mono font-bold">WL-1776373963953</span> is now live in the system</p>
        </div>
      </div>
    </div>
  );
}
