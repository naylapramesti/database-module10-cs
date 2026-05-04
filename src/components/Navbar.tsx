import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { LogOut, ShoppingBag, User as UserIcon, History } from "lucide-react";
import { motion } from "motion/react";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="border-b border-brand-line bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-brand-primary">Nayeay's Fun Shop</span>
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-500">
            <Link to="/" className="hover:text-slate-900 transition-colors">Marketplace</Link>
            <Link to="/transactions" className="hover:text-slate-900 transition-colors">Orders</Link>
          </div>
        </div>

        <div className="flex items-center gap-4 text-slate-600">
          {user ? (
            <>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-slate-900 leading-none">{user.username}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">Rp {user.balance.toLocaleString()}</p>
                </div>
                <Link to="/profile" className="w-9 h-9 rounded-full bg-slate-50 border border-brand-line flex items-center justify-center hover:bg-slate-100 transition-all text-slate-600">
                  <UserIcon className="w-4 h-4" />
                </Link>
                <button 
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-500 transition-colors p-2"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Login</Link>
              <Link to="/register" className="bg-brand-primary text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-sm hover:bg-brand-primary-hover transition-all">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
