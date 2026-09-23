import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle, XCircle } from 'lucide-react';
import api from '../../services/api';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const res = await api.get('/admin/reports');
      setReports(res.data.reports || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/reports/${id}/status`, { status });
      fetchReports();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Moderation Reports</h1>
      
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white/5 border-b border-white/10 text-white/50 text-xs uppercase tracking-wider">
              <th className="p-4 font-medium">Reporter</th>
              <th className="p-4 font-medium">Reason & Desc</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-sm">
            {loading ? (
              <tr><td colSpan="4" className="p-8 text-center"><div className="animate-spin w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full mx-auto"></div></td></tr>
            ) : reports.length > 0 ? (
              reports.map(report => (
                <tr key={report._id}>
                  <td className="p-4 text-white/80">{report.reportedBy?.name || 'Unknown'}</td>
                  <td className="p-4">
                    <p className="font-semibold text-pink-400">{report.reason}</p>
                    <p className="text-xs text-white/50 truncate max-w-xs">{report.description}</p>
                  </td>
                  <td className="p-4">{report.status}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => updateStatus(report._id, 'Resolved')} className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 mr-2"><CheckCircle size={16} /></button>
                    <button onClick={() => updateStatus(report._id, 'Dismissed')} className="p-2 bg-gray-500/10 text-gray-400 rounded-lg hover:bg-gray-500/20"><XCircle size={16} /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="4" className="p-12 text-center text-white/40">No reports found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminReports;
