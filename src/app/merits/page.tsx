"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, User, Image as ImageIcon, Tag, Plus, X, Heart, Star } from 'lucide-react';

interface Merit {
  id?: number;
  title: string;
  description: string;
  category: string;
  date: string;
  location: string;
  image_url: string;
  organizer: string;
}

export default function MeritsPage() {
  const [merits, setMerits] = useState<Merit[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Merit>({
    title: '',
    description: '',
    category: 'เธเธธเธเธเธฅ',
    date: '',
    location: '',
    image_url: '',
    organizer: ''
  });
  const [loading, setLoading] = useState(false);

  
  const handleDelete = async (id: number) => {
    if (!confirm("เธเธธเธ“เนเธเนเนเธเธซเธฃเธทเธญเนเธกเนเธ—เธตเนเธเธฐเธฅเธเธเนเธญเธกเธนเธฅเธเธตเน?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/merits/${id}`, { method: 'DELETE' });
      if (res.ok) fetchMerits();
    } catch (error) { console.error(error); }
  };

  const fetchMerits = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/merits/`);
      if (res.ok) {
        const data = await res.json();
        setMerits(data);
      }
    } catch (error) {
      console.error('Error fetching merits:', error);
    }
  };

  useEffect(() => {
    fetchMerits();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/merits/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ title: '', description: '', category: 'เธเธธเธเธเธฅ', date: '', location: '', image_url: '', organizer: '' });
        fetchMerits();
      }
    } catch (error) {
      console.error('Error adding merit:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlaceholderImage = () => {
    return "https://images.unsplash.com/photo-1596489382622-c32360215758?auto=format&fit=crop&q=80&w=600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-8 font-sans relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-amber-200/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-200/40 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 bg-white/60 p-8 rounded-[2.5rem] shadow-xl backdrop-blur-sm border border-amber-100">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500 mb-2 flex items-center gap-3">
              <Star className="w-8 h-8 text-amber-500" fill="currentColor" />
              08 เธ—เธเธ—เธงเธเธเธธเธ
            </h1>
            <p className="text-amber-800 text-lg font-medium">เธเธฑเธเธ—เธถเธเธเธฒเธเธเธธเธเนเธฅเธฐเธเธดเธเธเธฃเธฃเธกเธ—เธณเธเธงเธฒเธกเธ”เธต</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-4 md:mt-0 px-8 py-4 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-full font-bold shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <Plus size={24} />
            เน€เธเธดเนเธกเธฃเธฒเธขเธเธฒเธฃเธเธธเธ
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {merits.map((merit, index) => (
            <div key={merit.id || index} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-amber-50 flex flex-col">
              <div className="relative h-64 overflow-hidden shrink-0">
                <img 
                  src={merit.image_url || getPlaceholderImage()} 
                  alt={merit.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => { (e.target as HTMLImageElement).src = getPlaceholderImage(); }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                <div className="absolute top-4 right-4">
                  <span className={`px-4 py-1.5 rounded-full text-sm font-semibold shadow-md backdrop-blur-md ${
                    merit.category === 'เธชเนเธงเธเธเธฅเธฒเธ' 
                      ? 'bg-amber-400/90 text-amber-900 border border-amber-300' 
                      : 'bg-emerald-400/90 text-emerald-900 border border-emerald-300'
                  }`}>
                    {merit.category}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-xl font-bold mb-1 line-clamp-1">{merit.title}</h3>
                  <p className="text-amber-100 text-sm flex items-center gap-1">
                    <Calendar size={14} />
                    {merit.date || '-'}
                  </p>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <p className="text-gray-600 mb-4 line-clamp-2 flex-1">{merit.description}</p>
                <div className="space-y-2 text-sm text-gray-500 shrink-0">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-amber-500" />
                    <span className="truncate">{merit.location || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-orange-500" />
                    <span className="truncate">เธเธฑเธ”เนเธ”เธข: {merit.organizer || '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {merits.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white/50 rounded-[2.5rem] border border-dashed border-amber-300 shadow-sm backdrop-blur-sm">
              <Heart className="w-16 h-16 text-amber-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-amber-800 mb-2">เธขเธฑเธเนเธกเนเธกเธตเธฃเธฒเธขเธเธฒเธฃเธ—เธเธ—เธงเธเธเธธเธ</h3>
              <p className="text-amber-600">เธเธ”เธเธธเนเธก "เน€เธเธดเนเธกเธฃเธฒเธขเธเธฒเธฃเธเธธเธ" เน€เธเธทเนเธญเน€เธฃเธดเนเธกเธ•เนเธเธเธฑเธเธ—เธถเธเธเธงเธฒเธกเธ”เธตเธเธญเธเธเธธเธ“</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-6 flex justify-between items-center text-white">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Star className="w-6 h-6" fill="currentColor" />
                เธเธฑเธเธ—เธถเธเธเธฒเธเธเธธเธ
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-full">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">เธซเธฑเธงเธเนเธญ/เธเธทเนเธญเธเธฒเธเธเธธเธ</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-amber-100 focus:border-amber-400 focus:ring-0 outline-none transition-colors"
                    placeholder="เน€เธเนเธ เธ—เธณเธเธธเธเธ•เธฑเธเธเธฒเธ•เธฃ, เธเธฃเธดเธเธฒเธเนเธฅเธซเธดเธ•..."
                  />
                </div>
                
                <div className="col-span-full">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">เธฃเธฒเธขเธฅเธฐเน€เธญเธตเธขเธ”เธเธงเธฒเธกเธเธฃเธฐเธ—เธฑเธเนเธ</label>
                  <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-amber-100 focus:border-amber-400 focus:ring-0 outline-none transition-colors resize-none"
                    placeholder="เธเธฑเธเธ—เธถเธเธเธงเธฒเธกเธฃเธนเนเธชเธถเธเนเธฅเธฐเธฃเธฒเธขเธฅเธฐเน€เธญเธตเธขเธ”เธเธฒเธเธเธธเธ..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">เธซเธกเธงเธ”เธซเธกเธนเน</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-amber-100 focus:border-amber-400 focus:ring-0 outline-none transition-colors bg-white"
                  >
                    <option value="เธเธธเธเธเธฅ">เธเธธเธเธเธฅ</option>
                    <option value="เธชเนเธงเธเธเธฅเธฒเธ">เธชเนเธงเธเธเธฅเธฒเธ</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">เธงเธฑเธเธ—เธตเน</label>
                  <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-amber-100 focus:border-amber-400 focus:ring-0 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">เธชเธ–เธฒเธเธ—เธตเน</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-amber-100 focus:border-amber-400 focus:ring-0 outline-none transition-colors"
                    placeholder="เน€เธเนเธ เธงเธฑเธ”เธเนเธฒ, เนเธฃเธเธเธขเธฒเธเธฒเธฅ..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">เธเธนเนเธเธฑเธ”เธเธฒเธ/เธเธนเนเธเธณเธเธธเธ</label>
                  <input
                    type="text"
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-2xl border-2 border-amber-100 focus:border-amber-400 focus:ring-0 outline-none transition-colors"
                    placeholder="เธเธทเนเธญเธเธนเนเธเธฑเธ” เธซเธฃเธทเธญเธซเธเนเธงเธขเธเธฒเธ..."
                  />
                </div>

                <div className="col-span-full">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">เธฅเธดเธเธเนเธฃเธนเธเธ เธฒเธ (เธ–เนเธฒเธกเธต)</label>
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
                    <input
                      type="url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-amber-100 focus:border-amber-400 focus:ring-0 outline-none transition-colors"
                      placeholder="https://..."
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-3 rounded-full text-gray-600 font-semibold border-2 border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  เธขเธเน€เธฅเธดเธ
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold shadow-lg shadow-orange-200 hover:shadow-orange-300 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {loading ? 'เธเธณเธฅเธฑเธเธเธฑเธเธ—เธถเธ...' : 'เธเธฑเธเธ—เธถเธเธเธธเธ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
