import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { api } from "../api";
import { Lock, Mail, Loader2, ArrowRight, User, Phone } from "lucide-react";
import { motion } from "motion/react";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      const resp = await api.auth.register(formData);
      login(resp.payload.token, resp.payload.user);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-[450px] rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden border border-brand-line"
      >
        <div className="p-8 pb-4">
          <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Create Account</h2>
          <p className="text-slate-500 text-sm">Join the community for the best shopping experience.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 pt-0 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Full Name</label>
              <input 
                type="text" 
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-primary transition-colors"
                placeholder="Alice"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Username</label>
              <input 
                type="text" 
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-primary transition-colors"
                placeholder="alice123"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="email" 
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-primary transition-colors"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="tel" 
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-primary transition-colors"
                placeholder="+62 812..."
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="password" 
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-primary transition-colors"
                placeholder="At least 6 characters"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-xs font-medium text-center bg-red-50 py-2 rounded-lg border border-red-100">
              {error}
            </p>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 bg-brand-primary text-white rounded-xl font-bold shadow-lg shadow-brand-primary/20 hover:bg-brand-primary-hover transition-all active:scale-95 disabled:opacity-50 mt-4 flex items-center justify-center gap-2 group"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Register Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <p className="text-center text-sm text-slate-500 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-primary font-bold hover:underline">
              Sign in here
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
