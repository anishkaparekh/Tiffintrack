import { ClipboardList, CheckCircle, Clock, RotateCcw } from 'lucide-react';

export default function OrderTable({ orders, isLoading, onReset }) {
  // Loading skeleton rows
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/50 rounded-3xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-snow text-[10px] font-bold text-secondary-text uppercase tracking-wider">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Meal Type</th>
                <th className="px-6 py-4">Vendor</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[1, 2, 3].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-3.5 bg-slate-200 rounded w-20"></div></td>
                  <td className="px-6 py-4"><div className="h-3.5 bg-slate-200 rounded w-28"></div></td>
                  <td className="px-6 py-4"><div className="h-3.5 bg-slate-200 rounded w-24"></div></td>
                  <td className="px-6 py-4"><div className="h-6 bg-slate-200 rounded-full w-20"></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // Empty State
  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white border border-slate-200/50 rounded-3xl p-10 shadow-card text-center flex flex-col items-center justify-center min-h-[300px]">
        <div className="p-4 bg-slate-100 rounded-full text-slate-400 mb-4">
          <ClipboardList size={36} />
        </div>
        <h3 className="text-base font-bold text-primary-text mb-1">No Orders Found</h3>
        <p className="text-xs text-secondary-text max-w-sm mb-6 leading-relaxed">
          You haven't ordered any tiffin meals yet. Choose a subscription plan to get delicious home-cooked meals delivered daily.
        </p>
        {onReset && (
          <button
            onClick={onReset}
            className="px-4 py-2 bg-mint hover:bg-mint-hover text-white text-xs font-bold rounded-xl transition-colors duration-200 flex items-center space-x-2 cursor-pointer shadow-sm"
          >
            <RotateCcw size={14} />
            <span>Load Mock Orders</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/50 rounded-3xl shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 bg-snow text-[10px] font-bold text-secondary-text uppercase tracking-wider">
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Meal Type</th>
              <th className="px-6 py-4">Vendor</th>
              <th className="px-6 py-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs md:text-sm text-primary-text">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 font-normal text-secondary-text">{order.date}</td>
                <td className="px-6 py-4 font-semibold">{order.mealType}</td>
                <td className="px-6 py-4">{order.vendor}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    order.status === 'Delivered' 
                      ? 'bg-mint-light text-mint' 
                      : order.status === 'In Progress' 
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {order.status === 'Delivered' ? (
                      <CheckCircle size={10} />
                    ) : (
                      <Clock size={10} />
                    )}
                    <span>{order.status}</span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
