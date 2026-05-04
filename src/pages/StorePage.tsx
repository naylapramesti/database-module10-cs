import React, { useEffect, useState } from "react";
import { Item } from "../types";
import { api } from "../api";
import { Loader2, Search, ShoppingCart, Tag } from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../AuthContext";

const MOCK_ITEMS: Item[] = [
  { id: 1, name: "Cianjur Rice (5kg)", price: 75000, stock: 20, description: "Premium quality fluffy white rice from local Cianjur farmers.", image_url: "https://picsum.photos/seed/rice/400/300" },
  { id: 2, name: "Cooking Oil (2L)", price: 35000, stock: 15, description: "Pure palm cooking oil, premium quality for all your needs.", image_url: "https://picsum.photos/seed/oil/400/300" },
  { id: 3, name: "Granulated Sugar (1kg)", price: 16000, stock: 50, description: "Clean white granulated sugar for daily necessities.", image_url: "https://picsum.photos/seed/sugar/400/300" },
  { id: 4, name: "Chicken Eggs (1kg)", price: 28000, stock: 10, description: "Fresh farm eggs delivered daily from local cooperatives.", image_url: "https://picsum.photos/seed/egg/400/300" },
  { id: 5, name: "Village Coffee", price: 5000, stock: 100, description: "Traditional black coffee with a strong, rich aroma.", image_url: "https://picsum.photos/seed/coffee/400/300" },
  { id: 6, name: "Instant Noodles (Box)", price: 115000, stock: 5, description: "One box of instant noodles, various flavors included.", image_url: "https://picsum.photos/seed/noodle/400/300" },
];

export default function StorePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const resp = await api.items.list();
        setItems(resp.payload && resp.payload.length > 0 ? resp.payload : MOCK_ITEMS);
      } catch (err) {
        setItems(MOCK_ITEMS);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, []);

  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) || 
    i.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 leading-none">Marketplace</h1>
          <p className="text-slate-500 mt-2 text-sm">Discover the best daily essentials from our community.</p>
        </div>
        
        <div className="flex items-center gap-4 max-w-md w-full">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-100 border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-brand-primary outline-none transition-all"
            />
          </div>
          <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600 outline-none cursor-pointer hover:border-slate-300 transition-colors">
            <option>Recently Added</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-12 h-12 text-brand-primary animate-spin" />
          <p className="text-sm tracking-wide text-slate-500">Loading inventory list...</p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.05 } }
          }}
        >
          {filteredItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </motion.div>
      )}
    </div>
  );
}

interface ItemCardProps {
  item: Item;
  key?: React.Key;
}

function ItemCard({ item }: ItemCardProps) {
  const [isPurchasing, setIsPurchasing] = useState(false);

  const handlePurchase = async () => {
    if (!confirm(`Confirm purchase of ${item.name} for Rp ${item.price.toLocaleString()}?`)) return;
    setIsPurchasing(true);
    try {
      await api.transactions.create({
        item_id: item.id,
        quantity: 1,
        description: `Purchase ${item.name}`
      });
      alert("Purchase successful! Data saved to database and cache updated.");
    } catch (err) {
      alert("Purchase failed: Insufficient balance or out of stock.");
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
      }}
      className="group bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col gap-4 hover:shadow-xl hover:shadow-slate-200/40 transition-all duration-300"
    >
      <div className="w-full aspect-video bg-slate-50 rounded-xl overflow-hidden relative">
        <img 
          src={item.image_url || `https://picsum.photos/seed/${item.name}/400/300`} 
          alt={item.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
          {item.stock < 10 && item.stock > 0 && (
            <span className="bg-white/90 backdrop-blur-sm text-orange-600 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm border border-orange-50">
              Low Stock
            </span>
          )}
          {item.stock === 0 && (
            <span className="bg-white/90 backdrop-blur-sm text-red-600 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm border border-red-50">
              Out of Stock
            </span>
          )}
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-bold text-slate-800 leading-tight group-hover:text-brand-primary transition-colors">{item.name}</h3>
          <span className="text-brand-primary font-bold whitespace-nowrap">Rp {item.price.toLocaleString()}</span>
        </div>
        <p className="text-slate-500 text-xs line-clamp-2">{item.description}</p>
      </div>
      
      <div className="mt-auto flex flex-col gap-3">
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <span>Availability</span>
          <span className={item.stock > 0 ? "text-slate-600" : "text-red-500"}>{item.stock} Units</span>
        </div>
        
        <button 
          onClick={handlePurchase}
          disabled={isPurchasing || item.stock === 0}
          className="w-full py-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-brand-primary transition-all active:scale-[0.98] disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center gap-2"
        >
          {isPurchasing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Details & Buy"}
        </button>
      </div>
    </motion.div>
  );
}
