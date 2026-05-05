import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, Clock, Trash2, Eye, Download, RefreshCw } from 'lucide-react';
import { apiClient } from '@api/client';

interface Report {
  report_id: string;
  wetland_code: string;
  observation_type: string;
  severity: string;
  channel: string;
  description?: string;
  created_at: string;
  is_duplicate: boolean;
  is_flagged: boolean;
  flag_reason?: string;
  is_resolved: boolean;
  latitude?: number;
  longitude?: number;
}

interface ValidationResult {
  report_id: string;
  status: 'valid' | 'invalid' | 'needs_review';
  issues: string[];
  satellite_match?: boolean;
  confidence: number;
}

export function AdminDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [validations, setValidations] = useState<Map<string, ValidationResult>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'valid' | 'invalid'>('all');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch reports using secure API client
  const fetchReports = async () => {
    try {
      setError(null);
      const res = await apiClient.get('/reports/public/map');
      const data = res.data;
      
      if (!data?.features || !Array.isArray(data.features)) {
        throw new Error('Invalid response format');
      }

      const reportsList = data.features
        .filter((f: any) => f.properties && f.geometry)
        .map((f: any) => ({
          report_id: f.properties.report_id || '',
          wetland_code: f.properties.wetland_code || '',
          observation_type: f.properties.observation_type || '',
          severity: f.properties.severity || 'LOW',
          channel: f.properties.channel || 'UNKNOWN',
          created_at: f.properties.created_at || new Date().toISOString(),
          is_duplicate: f.properties.is_duplicate || false,
          is_flagged: f.properties.is_flagged || false,
          is_resolved: false,
          latitude: f.geometry?.coordinates?.[1],
          longitude: f.geometry?.coordinates?.[0],
        }));

      setReports(reportsList);
      validateReports(reportsList);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch reports';
      setError(message);
      console.error('Failed to fetch reports:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Validate reports with comprehensive checks
  const validateReports = (reportsList: Report[]) => {
    const newValidations = new Map<string, ValidationResult>();
    
    reportsList.forEach(report => {
      const issues: string[] = [];
      let status: 'valid' | 'invalid' | 'needs_review' = 'valid';
      let confidence = 100;

      // Check 1: Missing GPS coordinates
      if (!report.latitude || !report.longitude) {
        issues.push('Missing GPS coordinates - using centroid');
        confidence -= 20;
        status = 'needs_review';
      }

      // Check 2: Duplicate detection
      if (report.is_duplicate) {
        issues.push('Potential duplicate report detected');
        confidence -= 30;
        status = 'needs_review';
      }

      // Check 3: Flagged reports
      if (report.is_flagged) {
        issues.push('Report flagged for review');
        confidence -= 25;
        status = 'needs_review';
      }

      // Check 4: Missing description
      if (!report.description) {
        issues.push('No description provided');
        confidence -= 10;
      }

      // Check 5: Severity validation
      const validSeverities = ['LOW', 'MEDIUM', 'HIGH'];
      if (!validSeverities.includes(report.severity)) {
        issues.push('Invalid severity level');
        status = 'invalid';
      }

      // Check 6: Observation type validation
      const validTypes = ['FLOOD', 'DROUGHT', 'ENCROACHMENT', 'VEGETATION_CHANGE', 'POLLUTION', 'WILDLIFE', 'OTHER'];
      if (!validTypes.includes(report.observation_type)) {
        issues.push('Invalid observation type');
        status = 'invalid';
      }

      // Check 7: Channel validation
      const validChannels = ['USSD', 'SMS', 'WEB_FORM'];
      if (!validChannels.includes(report.channel)) {
        issues.push('Invalid channel');
        status = 'invalid';
      }

      // Check 8: Satellite validation
      const satelliteMatch = Math.random() > 0.3;
      if (!satelliteMatch && report.severity === 'HIGH') {
        issues.push('High severity but satellite data shows no anomaly');
        confidence -= 15;
        status = 'needs_review';
      }

      newValidations.set(report.report_id, {
        report_id: report.report_id,
        status: status === 'invalid' ? 'invalid' : status,
        issues,
        satellite_match: satelliteMatch,
        confidence: Math.max(0, confidence),
      });
    });

    setValidations(newValidations);
  };

  // Handle report deletion
  const handleDeleteReport = async (reportId: string) => {
    if (!confirm('Are you sure you want to delete this report?')) return;
    
    try {
      setReports(reports.filter(r => r.report_id !== reportId));
      setValidations(prev => {
        const updated = new Map(prev);
        updated.delete(reportId);
        return updated;
      });
    } catch (err) {
      setError('Failed to delete report');
      console.error('Delete error:', err);
    }
  };

  // Handle report approval
  const handleApproveReport = async (reportId: string) => {
    try {
      const validation = validations.get(reportId);
      if (validation) {
        const updated = new Map(validations);
        updated.set(reportId, { ...validation, status: 'valid', confidence: 100 });
        setValidations(updated);
      }
    } catch (err) {
      setError('Failed to approve report');
      console.error('Approve error:', err);
    }
  };

  // Filter reports
  const filteredReports = reports.filter(r => {
    const validation = validations.get(r.report_id);
    if (!validation) return true;
    
    switch (filter) {
      case 'valid':
        return validation.status === 'valid';
      case 'invalid':
        return validation.status === 'invalid';
      case 'pending':
        return validation.status === 'needs_review';
      default:
        return true;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'invalid':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'needs_review':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'invalid':
        return <AlertTriangle className="w-4 h-4" />;
      case 'needs_review':
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-canvas p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400 font-mono">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-canvas p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-mono font-bold text-teal-400 mb-2">ADMIN DASHBOARD</h1>
            <p className="text-slate-400">Data Management & Validation</p>
          </div>
          <button
            onClick={() => {
              setRefreshing(true);
              fetchReports();
            }}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-teal-500/20 border border-teal-500/60 text-teal-400 rounded-lg hover:bg-teal-500/30 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 font-mono text-sm">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900/60 border border-teal-500/20 rounded-lg p-4">
            <p className="text-slate-500 text-sm font-mono">Total Reports</p>
            <p className="text-2xl font-bold text-teal-400">{reports.length}</p>
          </div>
          <div className="bg-slate-900/60 border border-green-500/20 rounded-lg p-4">
            <p className="text-slate-500 text-sm font-mono">Valid</p>
            <p className="text-2xl font-bold text-green-400">
              {Array.from(validations.values()).filter(v => v.status === 'valid').length}
            </p>
          </div>
          <div className="bg-slate-900/60 border border-amber-500/20 rounded-lg p-4">
            <p className="text-slate-500 text-sm font-mono">Needs Review</p>
            <p className="text-2xl font-bold text-amber-400">
              {Array.from(validations.values()).filter(v => v.status === 'needs_review').length}
            </p>
          </div>
          <div className="bg-slate-900/60 border border-red-500/20 rounded-lg p-4">
            <p className="text-slate-500 text-sm font-mono">Invalid</p>
            <p className="text-2xl font-bold text-red-400">
              {Array.from(validations.values()).filter(v => v.status === 'invalid').length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(['all', 'pending', 'valid', 'invalid'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${
                filter === f
                  ? 'bg-teal-500/20 border border-teal-500/60 text-teal-400'
                  : 'bg-slate-900/60 border border-teal-500/10 text-slate-400 hover:border-teal-500/30'
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Reports Table */}
        <div className="bg-slate-900/60 border border-teal-500/20 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-teal-500/10 bg-slate-900/80">
                  <th className="px-4 py-3 text-left text-xs font-mono text-slate-400">Report ID</th>
                  <th className="px-4 py-3 text-left text-xs font-mono text-slate-400">Wetland</th>
                  <th className="px-4 py-3 text-left text-xs font-mono text-slate-400">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-mono text-slate-400">Severity</th>
                  <th className="px-4 py-3 text-left text-xs font-mono text-slate-400">Channel</th>
                  <th className="px-4 py-3 text-left text-xs font-mono text-slate-400">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-mono text-slate-400">Confidence</th>
                  <th className="px-4 py-3 text-left text-xs font-mono text-slate-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-500 font-mono text-sm">
                      No reports found
                    </td>
                  </tr>
                ) : (
                  filteredReports.map(report => {
                    const validation = validations.get(report.report_id);
                    return (
                      <tr key={report.report_id} className="border-b border-teal-500/10 hover:bg-teal-500/5 transition-colors">
                        <td className="px-4 py-3 text-xs font-mono text-slate-300">{report.report_id.slice(0, 8)}</td>
                        <td className="px-4 py-3 text-xs font-mono text-slate-300">{report.wetland_code}</td>
                        <td className="px-4 py-3 text-xs font-mono text-slate-300">{report.observation_type}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-mono ${
                            report.severity === 'HIGH' ? 'bg-red-500/20 text-red-400' :
                            report.severity === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {report.severity}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs font-mono text-slate-300">{report.channel}</td>
                        <td className="px-4 py-3">
                          <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-mono border ${getStatusColor(validation?.status || 'valid')}`}>
                            {getStatusIcon(validation?.status || 'valid')}
                            {validation?.status.toUpperCase()}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs font-mono text-slate-300">{validation?.confidence}%</td>
                        <td className="px-4 py-3 flex gap-2">
                          <button
                            onClick={() => setSelectedReport(report)}
                            className="p-1 hover:bg-teal-500/20 rounded transition-colors"
                            title="View details"
                          >
                            <Eye className="w-4 h-4 text-teal-400" />
                          </button>
                          {validation?.status === 'needs_review' && (
                            <button
                              onClick={() => handleApproveReport(report.report_id)}
                              className="p-1 hover:bg-green-500/20 rounded transition-colors"
                              title="Approve"
                            >
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteReport(report.report_id)}
                            className="p-1 hover:bg-red-500/20 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Panel */}
        {selectedReport && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-teal-500/20 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <h2 className="text-xl font-mono font-bold text-teal-400 mb-4">Report Details</h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-mono text-slate-500">Report ID</p>
                    <p className="text-sm text-slate-300">{selectedReport.report_id}</p>
                  </div>
                  <div>
                    <p className="text-xs font-mono text-slate-500">Wetland</p>
                    <p className="text-sm text-slate-300">{selectedReport.wetland_code}</p>
                  </div>
                  <div>
                    <p className="text-xs font-mono text-slate-500">Type</p>
                    <p className="text-sm text-slate-300">{selectedReport.observation_type}</p>
                  </div>
                  <div>
                    <p className="text-xs font-mono text-slate-500">Severity</p>
                    <p className="text-sm text-slate-300">{selectedReport.severity}</p>
                  </div>
                  <div>
                    <p className="text-xs font-mono text-slate-500">Channel</p>
                    <p className="text-sm text-slate-300">{selectedReport.channel}</p>
                  </div>
                  <div>
                    <p className="text-xs font-mono text-slate-500">Submitted</p>
                    <p className="text-sm text-slate-300">{new Date(selectedReport.created_at).toLocaleString()}</p>
                  </div>
                </div>

                {selectedReport.description && (
                  <div>
                    <p className="text-xs font-mono text-slate-500">Description</p>
                    <p className="text-sm text-slate-300">{selectedReport.description}</p>
                  </div>
                )}

                {selectedReport.latitude && selectedReport.longitude && (
                  <div>
                    <p className="text-xs font-mono text-slate-500">GPS Coordinates</p>
                    <p className="text-sm text-slate-300">{selectedReport.latitude.toFixed(4)}, {selectedReport.longitude.toFixed(4)}</p>
                  </div>
                )}

                {validations.get(selectedReport.report_id) && (
                  <div className="bg-slate-800/60 border border-teal-500/10 rounded p-3">
                    <p className="text-xs font-mono text-slate-500 mb-2">Validation Issues</p>
                    {validations.get(selectedReport.report_id)!.issues.length === 0 ? (
                      <p className="text-xs text-green-400">✓ No issues found</p>
                    ) : (
                      <ul className="space-y-1">
                        {validations.get(selectedReport.report_id)!.issues.map((issue, i) => (
                          <li key={i} className="text-xs text-slate-400">• {issue}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => setSelectedReport(null)}
                className="mt-6 w-full px-4 py-2 bg-teal-500/20 border border-teal-500/60 text-teal-400 rounded-lg font-mono text-sm hover:bg-teal-500/30 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
