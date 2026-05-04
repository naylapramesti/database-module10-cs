import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { api } from "../api";
import { User as UserIcon, Mail, Phone, Wallet, Save, Loader2, ShieldCheck, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

export default function ProfilePage() {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isInvalidating, setIsInvalidating] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      await api.user.updateProfile(formData);
      // Re-fetch profile to check Redis cache invalidation effect
      const updated = await api.user.getProfile(user!.email);
      login(localStorage.getItem("auth_token")!, updated.payload);
      setMessage("Profile updated successfully. Cache invalidated in Redis.");
    } catch (err) {
      setMessage("Update failed. Check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const forceRefresh = async () => {
    setIsInvalidating(true);
    try {
      const updated = await api.user.getProfile(user!.email);
      login(localStorage.getItem("auth_token")!, updated.payload);
      setMessage("Cache refreshed from PostgreSQL.");
    } finally {
      setIsInvalidating(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-end justify-between gap-6 overflow-hidden relative p-8 bg-white border border-brand-line rounded-xl shadow-sm">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-primary flex items-center justify-center shadow-lg shadow-brand-primary/10">
              <UserIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">{user.name}</h1>
              <p className="font-semibold text-brand-primary">@{user.username}</p>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="bg-slate-50 border border-brand-line px-4 py-2 rounded-lg flex items-center gap-3">
               <Wallet className="w-4 h-4 text-brand-primary" />
               <div>
                 <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Balance</p>
                 <p className="text-sm font-bold text-slate-700">Rp {user.balance.toLocaleString()}</p>
               </div>
             </div>
             <div className="bg-slate-50 border border-brand-line px-4 py-2 rounded-lg flex items-center gap-3">
               <ShieldCheck className="w-4 h-4 text-green-500" />
               <div>
                 <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Status</p>
                 <p className="text-sm font-bold text-slate-700 uppercase">Verified</p>
               </div>
             </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <UserIcon className="w-48 h-48 text-slate-900" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-brand-line p-8 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              Profile Settings
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 block">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-brand-line rounded-lg py-2 px-4 focus:border-brand-primary outline-none transition-colors text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 block">Username (Immutable)</label>
                  <input 
                    type="text" 
                    value={user.username}
                    disabled
                    className="w-full bg-slate-100 border border-brand-line rounded-lg py-2 px-4 text-slate-400 outline-none text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="email" 
                    value={user.email}
                    disabled
                    className="w-full bg-slate-100 border border-brand-line rounded-lg py-2.5 pl-10 pr-4 text-slate-400 outline-none text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2 block">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    type="tel" 
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-brand-line rounded-lg py-2.5 pl-10 pr-4 focus:border-brand-primary outline-none transition-colors text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                {message && (
                  <p className="text-xs font-bold text-brand-primary uppercase tracking-widest">{message}</p>
                )}
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="bg-brand-primary text-white px-6 py-3 rounded-xl font-bold text-xs hover:bg-brand-primary-hover transition-all disabled:opacity-50 flex items-center justify-center gap-2 ml-auto shadow-lg shadow-brand-primary/20"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save</>}
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-brand-line p-6 rounded-xl text-center shadow-sm">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-line">
               <RefreshCw className={isInvalidating ? "w-6 h-6 text-brand-primary animate-spin" : "w-6 h-6 text-slate-400"} />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-2 text-slate-800">Cache Status</h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Updating your profile triggers automatic <b>DEL user:email</b> in Redis.
            </p>
            <button 
              onClick={forceRefresh}
              disabled={isInvalidating}
              className="w-full py-2 bg-slate-50 text-slate-600 text-xs font-bold uppercase tracking-widest hover:bg-slate-100 transition-colors border border-brand-line rounded-lg flex items-center justify-center gap-2"
            >
              Refresh Redis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
