import React from 'react';
import { CheckCircle, MapPin, AlertCircle } from 'lucide-react';

export function EnhancedSMSConfirmation() {
  const reportData = {
    id: 'WL-1776373963953',
    wetland: 'Victoria Basin',
    issue: 'Encroachment',
    severity: 'Medium',
    coordinates: { lat: -0.50, lon: 33.90 },
    timestamp: '00:12',
    status: 'DELIVERED'
  };

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'High': return 'bg-red-100 text-red-700 border-red-300';
      case 'Medium': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'Low': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getMarkerColor = (severity: string) => {
    switch(severity) {
      case 'High': return '🔴 Red';
      case 'Medium': return '🟠 Orange';
      case 'Low': return '🟢 Green';
      default: return '⚪ Gray';
    }
  };

  return (
    <div className="bg-[#f5f5f0] p-4 space-y-4 overflow-y-auto" style={{maxHeight: '460px'}}>
      
      {/* SECTION 1: MESSAGE SENT CONFIRMATION */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border-2 border-emerald-300 shadow-sm">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-emerald-900 text-sm">✓ MESSAGE SENT SUCCESSFULLY</h3>
            <p className="text-emerald-700 text-xs mt-1">Your report has been transmitted to WETLABS</p>
            <div className="mt-2 space-y-1 text-xs text-emerald-800">
              <div className="flex justify-between">
                <span className="font-semibold">Confirmation ID:</span>
                <span className="font-mono">{reportData.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Status:</span>
                <span className="font-bold text-emerald-600">{reportData.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Time:</span>
                <span className="font-mono">{reportData.timestamp}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: REPORT DETAILS */}
      <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
        <p className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mb-2">Report Details</p>
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-600">Wetland:</span>
            <span className="font-semibold text-gray-900">{reportData.wetland}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Issue:</span>
            <span className="font-semibold text-gray-900">{reportData.issue}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Severity:</span>
            <span className={`font-semibold px-2 py-0.5 rounded text-xs ${getSeverityColor(reportData.severity)}`}>
              {reportData.severity}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">GPS:</span>
            <span className="font-mono text-gray-900">{reportData.coordinates.lat}, {reportData.coordinates.lon}</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: MAP REFLECTION */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-300 shadow-sm">
        <div className="flex items-start gap-3">
          <MapPin className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-bold text-blue-900 text-sm">📍 NOW VISIBLE ON MAP</h3>
            <p className="text-blue-700 text-xs mt-1">Your report is displayed on the map</p>
            <div className="mt-2 space-y-1.5 text-xs text-blue-800 bg-white bg-opacity-60 p-2 rounded">
              <div className="flex justify-between">
                <span className="font-semibold">Marker Type:</span>
                <span className="font-bold">{getMarkerColor(reportData.severity)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Location:</span>
                <span className="font-semibold">{reportData.wetland}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Coordinates:</span>
                <span className="font-mono">{reportData.coordinates.lat}, {reportData.coordinates.lon}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Visibility:</span>
                <span className="text-green-700 font-bold">✓ Public</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: DATA FLOW */}
      <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
        <p className="font-mono text-[10px] text-gray-500 uppercase tracking-wider mb-2">Where Your Report Goes</p>
        <div className="space-y-2 text-xs">
          <div className="flex items-start gap-2">
            <span className="text-lg flex-shrink-0">🗄️</span>
            <div>
              <span className="font-bold text-gray-800">Stored</span>
              <p className="text-gray-600">in WETLABS database with ID, timestamp and GPS</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-lg flex-shrink-0">🗺️</span>
            <div>
              <span className="font-bold text-gray-800">Visible</span>
              <p className="text-gray-600">as {getMarkerColor(reportData.severity)} marker at {reportData.wetland}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-lg flex-shrink-0">📊</span>
            <div>
              <span className="font-bold text-gray-800">Reviewed</span>
              <p className="text-gray-600">by analysts on dashboard with satellite validation</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-lg flex-shrink-0">🔔</span>
            <div>
              <span className="font-bold text-gray-800">Alert</span>
              <p className="text-gray-600">{reportData.severity === 'High' ? 'Instant notification sent to officer' : 'Queued for officer review'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 5: ACTION BUTTONS */}
      <div className="flex gap-2 pt-2">
        <button className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-all">
          📍 View on Map
        </button>
        <button className="flex-1 py-2.5 border-2 border-emerald-600 text-emerald-600 rounded-lg text-xs font-semibold hover:bg-emerald-50 transition-all">
          ➕ New Report
        </button>
      </div>
    </div>
  );
}
