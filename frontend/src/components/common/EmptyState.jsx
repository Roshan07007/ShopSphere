import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Search, PackageOpen, ArrowRight } from 'lucide-react';

const icons = {
  cart: ShoppingBag,
  wishlist: Heart,
  search: Search,
  orders: PackageOpen,
  default: PackageOpen
};

const EmptyState = ({
  type = 'default',
  title = 'No items found',
  description = 'Looks like there is nothing here yet.',
  actionText = 'Start Shopping',
  actionLink = '/shop',
  onAction = null
}) => {
  const IconComponent = icons[type] || icons.default;

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 max-w-md mx-auto animate-fade-in">
      <div className="w-20 h-20 rounded-3xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 shadow-inner">
        <IconComponent className="w-10 h-10 stroke-[1.5]" />
      </div>

      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        {title}
      </h3>

      <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
        {description}
      </p>

      {onAction ? (
        <button
          onClick={onAction}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition active:scale-95"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      ) : actionLink ? (
        <Link
          to={actionLink}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/30 transition active:scale-95"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      ) : null}
    </div>
  );
};

export default EmptyState;
