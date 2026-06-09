import React from 'react';
import { Transaction } from '../../../types/revenue';

interface RevenueTableProps {
  transactions: Transaction[];
}

export default function RevenueTable({ transactions }: RevenueTableProps) {
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider inline-flex items-center space-x-1 shrink-0">
            <span className="w-1 h-1 bg-[#16A34A] rounded-full" />
            <span>Completed</span>
          </span>
        );
      case 'Pending':
        return (
          <span className="bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider inline-flex items-center space-x-1 shrink-0">
            <span className="w-1 h-1 bg-[#F59E0B] rounded-full" />
            <span>Pending</span>
          </span>
        );
      case 'Failed':
      default:
        return (
          <span className="bg-[#DC2626]/10 text-[#DC2626] border border-[#DC2626]/20 px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider inline-flex items-center space-x-1 shrink-0">
            <span className="w-1 h-1 bg-[#DC2626] rounded-full animate-pulse" />
            <span>Failed</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-[#E5E7EB]">
        <h3 className="font-extrabold text-sm text-[#1F2937] uppercase tracking-wider">Recent Transactions</h3>
        <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Fulfillment billing history ledger</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/75 border-b border-[#E5E7EB] text-slate-400 font-black uppercase tracking-wider">
              <th className="py-3.5 px-5 font-black">Date</th>
              <th className="py-3.5 px-5 font-black">Earnings Channel / Source</th>
              <th className="py-3.5 px-5 font-black">Customer</th>
              <th className="py-3.5 px-5 font-black">Amount</th>
              <th className="py-3.5 px-5 font-black">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB] font-bold text-[#1F2937]">
            {transactions.map((txn) => (
              <tr key={txn.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-3.5 px-5 text-slate-400 font-semibold">{txn.date}</td>
                <td className="py-3.5 px-5 text-slate-700 font-black">{txn.source}</td>
                <td className="py-3.5 px-5">{txn.customerName}</td>
                <td className="py-3.5 px-5 font-black text-slate-800">₹{txn.amount.toLocaleString()}</td>
                <td className="py-3.5 px-5">{getStatusBadge(txn.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
