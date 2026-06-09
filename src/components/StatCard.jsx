
export default function StatCard({ title, value, subtext, icon: Icon, isLoading, accent }) {
  if (isLoading) {
    return (
      <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-card animate-pulse">
        <div className="flex justify-between items-start mb-3">
          <div className="h-4 bg-slate-200 rounded w-24"></div>
          <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
        </div>
        <div className="h-7 bg-slate-200 rounded w-36 mb-2"></div>
        <div className="h-3.5 bg-slate-200 rounded w-28"></div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200/50 p-6 rounded-3xl shadow-card hover:shadow-card-hover transition-all duration-200 relative overflow-hidden">
      {accent && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-mint"></div>
      )}
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-bold text-secondary-text uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className="p-2 bg-mint-light rounded-xl text-mint">
            <Icon size={18} />
          </div>
        )}
      </div>
      <div className="text-xl font-extrabold text-primary-text mb-1">{value}</div>
      {subtext && <div className="text-xs text-secondary-text font-normal">{subtext}</div>}
    </div>
  );
}
