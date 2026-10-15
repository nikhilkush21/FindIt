import { Link } from 'react-router-dom';
import { MapPin, Calendar, Smartphone, CreditCard, ShoppingBag, Key, Box, Gem, BookOpen, Shirt } from 'lucide-react';

const CATEGORY_ICONS = {
  Electronics: Smartphone,
  'Wallet/Purse': CreditCard,
  'ID/Cards': CreditCard,
  Keys: Key,
  Bag: ShoppingBag,
  Clothing: Shirt,
  Jewelry: Gem,
  'Books/Documents': BookOpen,
  Accessories: Box,
  Other: Box,
};

const STATUS_BADGE = {
  open: null,
  claimed: <span className="badge-claimed">Claimed</span>,
  resolved: <span className="badge-resolved">Resolved</span>,
  expired: <span className="badge-resolved">Expired</span>,
};

export default function ItemCard({ item }) {
  const date = new Date(item.date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
  const Icon = CATEGORY_ICONS[item.category] || Box;
  const imageUrl = item.images?.[0] || '';

  return (
    <Link
      to={`/items/${item._id}`}
      className="group bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-150 overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative h-44 bg-gray-100 flex-shrink-0 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <Icon className="text-gray-300 w-10 h-10" strokeWidth={1} />
          </div>
        )}
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          <span className={item.type === 'lost' ? 'badge-lost' : 'badge-found'}>
            {item.type === 'lost' ? 'Lost' : 'Found'}
          </span>
          {STATUS_BADGE[item.status]}
        </div>
        {item.images?.length > 1 && (
          <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[10px] px-1.5 py-0.5 rounded">
            +{item.images.length - 1}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-1 mb-1 group-hover:text-gray-700">
          {item.title}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-3 flex-1 leading-relaxed">{item.description}</p>
        <div className="flex items-center justify-between text-xs text-gray-400 pt-2.5 border-t border-gray-100">
          <span className="flex items-center gap-1 truncate min-w-0">
            <MapPin className="flex-shrink-0 text-gray-300 w-3 h-3" />
            <span className="truncate">{item.location}</span>
          </span>
          <span className="flex items-center gap-1 flex-shrink-0 ml-2">
            <Calendar className="flex-shrink-0 text-gray-300 w-3 h-3" />{date}
          </span>
        </div>
      </div>
    </Link>
  );
}
