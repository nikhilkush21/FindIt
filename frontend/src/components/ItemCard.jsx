import { Link } from 'react-router-dom';
import { FiMapPin, FiCalendar, FiSmartphone, FiCreditCard, FiShoppingBag, FiKey, FiBox } from 'react-icons/fi';
import { MdOutlineCheckroom, MdOutlineDiamond } from 'react-icons/md';

const CATEGORY_ICONS = {
  Electronics: FiSmartphone,
  'Wallet/Purse': FiCreditCard,
  'ID/Cards': FiCreditCard,
  Bag: FiShoppingBag,
  Keys: FiKey,
  Clothing: MdOutlineCheckroom,
  Jewelry: MdOutlineDiamond,
  Other: FiBox,
};

export default function ItemCard({ item }) {
  const date = new Date(item.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  const Icon = CATEGORY_ICONS[item.category] || FiBox;

  return (
    <Link
      to={`/items/${item._id}`}
      className="group bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-150 overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative h-40 bg-gray-100 flex-shrink-0 overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <Icon className="text-gray-300 text-4xl" />
          </div>
        )}
        <div className="absolute top-2.5 left-2.5 flex gap-1.5">
          <span className={item.type === 'lost' ? 'badge-lost' : 'badge-found'}>
            {item.type === 'lost' ? 'Lost' : 'Found'}
          </span>
          {item.status === 'resolved' && <span className="badge-resolved">Resolved</span>}
        </div>
      </div>

      {/* Content */}
      <div className="p-3.5 flex flex-col flex-1">
        <div className="flex items-start gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-1 flex-1 group-hover:text-gray-700">
            {item.title}
          </h3>
        </div>
        <p className="text-xs text-gray-500 line-clamp-2 mb-3 flex-1 leading-relaxed">{item.description}</p>
        <div className="flex items-center justify-between text-xs text-gray-400 pt-2.5 border-t border-gray-100">
          <span className="flex items-center gap-1 truncate min-w-0">
            <FiMapPin className="flex-shrink-0 text-gray-300" />{item.location}
          </span>
          <span className="flex items-center gap-1 flex-shrink-0 ml-2">
            <FiCalendar className="flex-shrink-0 text-gray-300" />{date}
          </span>
        </div>
      </div>
    </Link>
  );
}
