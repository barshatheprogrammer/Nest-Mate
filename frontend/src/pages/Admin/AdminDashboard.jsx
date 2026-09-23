import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, UserCircle, Home, Clock, Heart, 
  Link2, AlertTriangle, Activity, ChevronRight 
} from 'lucide-react';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalOwners: 0,
    totalFlats: 0,
    pendingFlats: 0,
    totalMatches: 0,
    activeConnections: 0,
    pendingReports: 0
  });
  
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, activityRes] = await Promise.all([
          api.get('/admin/dashboard/stats'),
          api.get('/admin/activity')
        ]);
        
        setStats(statsRes.data);
        setActivities(activityRes.data);
      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-center gap-4 hover:bg-white/10 transition-colors">
      <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
      <div>
        <p className="text-white/50 text-sm">{title}</p>
        <p className="text-2xl font-bold">{loading ? '...' : value}</p>
      </div>
    </div>
  );

  const QuickAction = ({ title, to, icon }) => (
    <Link to={to} className="bg-gradient-to-r from-white/5 to-white/10 border border-white/10 hover:border-pink-500/50 rounded-xl p-4 flex items-center justify-between group transition-all">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-black/30 rounded-lg text-pink-400">
          {icon}
        </div>
        <span className="font-medium text-sm">{title}</span>
      </div>
      <ChevronRight size={16} className="text-white/30 group-hover:text-pink-400 group-hover:translate-x-1 transition-all" />
    </Link>
  );

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Platform Overview</h1>
        </div>
        
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Students" value={stats.totalStudents} icon={<Users />} color="bg-blue-500/20 text-blue-400" />
          <StatCard title="Total Owners" value={stats.totalOwners} icon={<UserCircle />} color="bg-indigo-500/20 text-indigo-400" />
          <StatCard title="Total Flats" value={stats.totalFlats} icon={<Home />} color="bg-pink-500/20 text-pink-400" />
          <StatCard title="Pending Flats" value={stats.pendingFlats} icon={<Clock />} color="bg-yellow-500/20 text-yellow-400" />
          <StatCard title="Total Matches" value={stats.totalMatches} icon={<Heart />} color="bg-red-500/20 text-red-400" />
          <StatCard title="Active Connections" value={stats.activeConnections} icon={<Link2 />} color="bg-green-500/20 text-green-400" />
          <StatCard title="Pending Reports" value={stats.pendingReports} icon={<AlertTriangle />} color="bg-orange-500/20 text-orange-400" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              Quick Actions
            </h2>
            <QuickAction title="Review Pending Flats" to="/admin/flats/pending" icon={<Clock size={20} />} />
            <QuickAction title="Manage Students" to="/admin/students" icon={<Users size={20} />} />
            <QuickAction title="Manage Owners" to="/admin/owners" icon={<UserCircle size={20} />} />
            <QuickAction title="View Reports" to="/admin/reports" icon={<ShieldAlert size={20} />} />
            <QuickAction title="View Analytics" to="/admin/analytics" icon={<BarChart3 size={20} />} />
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Activity className="text-pink-400" size={20} /> Recent Activity
            </h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-[400px] overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="flex justify-center items-center h-full"><div className="animate-spin w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full"></div></div>
              ) : activities.length > 0 ? (
                <div className="space-y-6">
                  {activities.map((act) => (
                    <div key={act._id} className="relative pl-6 border-l border-white/10 last:border-transparent pb-6 last:pb-0">
                      <div className="absolute w-3 h-3 bg-pink-500 rounded-full -left-[1.5px] top-1 shadow-[0_0_10px_rgba(236,72,153,0.5)]"></div>
                      <p className="text-sm text-white/80">{act.description}</p>
                      <p className="text-xs text-white/40 mt-1">{new Date(act.timestamp).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-white/40">
                  <Activity size={32} className="mb-2 opacity-50" />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dummy imports fix for the QuickAction array elements
import { ShieldAlert, BarChart3 } from 'lucide-react';

export default AdminDashboard;
