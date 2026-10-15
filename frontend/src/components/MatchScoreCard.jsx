import { Link } from 'react-router-dom';
import { MapPin, Calendar, Zap, X } from 'lucide-react';

function ScoreBar({ label, value, color = 'bg-blue-500' }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{label}</span>
        <span className="font-medium">{Math.round(value * 100)}%</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${value * 100}%` }} />
      </div>
    </div>
  );
}

export default function MatchScoreCard({ match, currentItemType, onDismiss }) {
  const otherItem = currentItemType === 'lost' ? match.foundItem : match.lostItem;
  if (!otherItem) return null;

  const score = match.overallScore;
  const pct = Math.round(score * 100);

  const scoreColor =
    pct >= 70 ? 'text-green-600 bg-green-50 border-green-100' :
    pct >= 40 ? 'text-amber-600 bg-amber-50 border-amber-100' :
    'text-gray-600 bg-gray-50 border-gray-100';

  const barColor =
    pct >= 70 ? 'bg-green-500' :
    pct >= 40 ? 'bg-amber-500' : 'bg-gray-400';

  const imageUrl = otherItem.images?.[0] || '';

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors">
      <div className="flex gap-3 p-4">
        {/* Image */}
        <Link to={`/items/${otherItem._id}`} className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
          {imageUrl
            ? <img src={imageUrl} alt={otherItem.title} className="w-full h-full object-cover" loading="lazy" />
            : <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl">?</div>
          }
        </Link>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <Link to={`/items/${otherItem._id}`}
              className="font-semibold text-gray-900 text-sm hover:text-gray-700 truncate">
              {otherItem.title}
            </Link>
            <div className={`flex-shrink-0 flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${scoreColor}`}>
              <Zap className="w-3 h-3" />
              {pct}%
            </div>
          </div>
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-gray-300" />{otherItem.location}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-gray-300" />
              {new Date(otherItem.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </span>
          </div>
        </div>

        {onDismiss && (
          <button onClick={() => onDismiss(match._id)} title="Dismiss match"
            className="flex-shrink-0 p-1.5 text-gray-300 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Component scores */}
      <div className="border-t border-gray-50 px-4 py-3 grid grid-cols-2 gap-x-4 gap-y-2">
        <ScoreBar label="Text similarity" value={match.componentScores?.text || 0} color={barColor} />
        {match.componentScores?.image > 0 && (
          <ScoreBar label="Image similarity" value={match.componentScores.image} color={barColor} />
        )}
        <ScoreBar label="Location" value={match.componentScores?.location || 0} color={barColor} />
        <ScoreBar label="Date proximity" value={match.componentScores?.date || 0} color={barColor} />
      </div>

      <div className="px-4 pb-3">
        <p className="text-[10px] text-gray-400">
          {match.aiStatus === 'fallback' ? '⚠ Keyword-based match (AI service unavailable)' : '✓ AI semantic match'}
          {' · '}Similarity score does not prove ownership.
        </p>
      </div>
    </div>
  );
}
