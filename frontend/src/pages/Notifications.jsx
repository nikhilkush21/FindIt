import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useNotifications } from '../context/NotificationContext';
import { Bell, CheckCheck, Box, Zap, ClipboardCheck, ClipboardX, Shield, CheckCircle } from 'lucide-react';

const TYPE_ICONS = {
  claim_received: ClipboardCheck,
  claim_approved: CheckCircle,
  claim_rejected: ClipboardX,
  match_found: Zap,
  item_moderated: Shield,
  item_resolved: CheckCircle,
  system: Bell,
};

const TYPE_COLORS = {
  claim_received: 'bg-blue-100 text-blue-600',
  claim_approved: 'bg-green-100 text-green-600',
  claim_rejected: 'bg-red-100 text-red-600',
  match_found: 'bg-amber-100 text-amber-600',
  item_moderated: 'bg-purple-100 text-purple-600',
  item_resolved: 'bg-emerald-100 text-emerald-600',
  system: 'bg-gray-100 text-gray-600',
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setUnreadCount, markAllRead } = useNotifications();

  useEffect(() => {
    api.get('/notifications')
      .then(({ data }) => {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      })
      .finally(() => setLoading(false));
  }, [setUnreadCount]);

  const handleMarkRead = async (id) => {
    await api.put(`/notifications/${id}/read`);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleMarkAllRead = async () => {
    await markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unread = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="page-container max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 mb-0.5">Notifications</h1>
          {unread > 0 && <p className="text-sm text-gray-400">{unread} unread</p>}
        </div>
        {unread > 0 && (
          <button onClick={handleMarkAllRead} className="btn-ghost text-xs py-1.5 gap-1.5">
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 h-20" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Bell className="text-gray-300 w-8 h-8 mx-auto mb-3" strokeWidth={1} />
          <p className="font-medium text-gray-700">No notifications</p>
          <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const Icon = TYPE_ICONS[n.type] || Bell;
            const color = TYPE_COLORS[n.type] || 'bg-gray-100 text-gray-600';
            return (
              <div
                key={n._id}
                className={`flex items-start gap-3 p-4 rounded-xl border transition-colors cursor-pointer ${
                  n.isRead ? 'bg-white border-gray-200' : 'bg-blue-50/40 border-blue-100'
                }`}
                onClick={() => !n.isRead && handleMarkRead(n._id)}
              >
                <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${n.isRead ? 'text-gray-700' : 'text-gray-900'}`}>{n.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[11px] text-gray-400">
                      {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {n.relatedItem && (
                      <Link to={`/items/${n.relatedItem._id || n.relatedItem}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-[11px] text-blue-500 hover:underline">
                        View item →
                      </Link>
                    )}
                  </div>
                </div>
                {!n.isRead && <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1.5" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
