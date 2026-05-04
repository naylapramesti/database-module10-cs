import { useEffect, useState } from "react";
import { Transaction } from "../types";
import { api } from "../api";
import { Loader2, ExternalLink, Calendar, CheckCircle2, Clock, XCircle } from "lucide-react";
import { motion } from "motion/react";

export default function TransactionsPage() {
  const [txs, setTxs] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTxs = async () => {
      try {
        const resp = await api.transactions.list();
        setTxs(resp.payload);
      } catch (err) {
        // Mock fallback if needed
        setTxs([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTxs();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800 leading-none">Order History</h1>
        <p className="text-slate-500 mt-2">List of transactions recorded in the system.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
        </div>
      ) : txs.length === 0 ? (
        <div className="bg-white border border-brand-line border-dashed rounded-xl py-24 text-center shadow-sm">
          <p className="text-slate-400 font-medium italic">No transactions recorded yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-brand-line rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-line bg-slate-50/50">
                <th className="p-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest">Time</th>
                <th className="p-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest">Order ID</th>
                <th className="p-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest">Description</th>
                <th className="p-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest">Total</th>
                <th className="p-4 text-[10px] uppercase font-bold text-slate-400 tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-line">
              {txs.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer text-slate-600">
                  <td className="p-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-brand-primary transition-colors">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700">{new Date(tx.created_at).toLocaleDateString()}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{new Date(tx.created_at).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-xs text-slate-400 font-medium">#{tx.id.toString().padStart(6, '0')}</td>
                  <td className="p-4">
                    <p className="text-sm font-medium text-slate-700">{tx.description}</p>
                    <p className="text-[10px] text-slate-400 uppercase tracking-tighter">ITEM_ID: {tx.item_id}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-bold text-brand-primary">Rp {tx.total.toLocaleString()}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-1.5 bg-indigo-50 text-indigo-600 border border-indigo-100 px-2 py-1 rounded-md w-fit ml-auto">
                      <CheckCircle2 className="w-3 h-3" />
                      <span className="text-[10px] font-bold uppercase tracking-tight">Completed</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
