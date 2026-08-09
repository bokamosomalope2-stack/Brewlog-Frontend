import React, { useState, useEffect } from 'react';
import { Coffee, Plus, Trash2, Edit2, Star, Droplet, Layers, FileText, X } from 'lucide-react';
import { API_BASE_URL } from './config';

export default function App() {
  const [brews, setBrews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // Track if we are editing or creating
  
  const [formData, setFormData] = useState({
    beans: '',
    method: '',
    coffeeGrams: '',
    waterGrams: '',
    rating: 5,
    testingNotes: ''
  });

  // GET: Fetch all brew records
  const fetchBrews = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE_URL);
      if (!res.ok) throw new Error('Could not pull logs from database.');
      const data = await res.json();
      setBrews(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrews();
  }, []);

  // Opens modal in Creation Mode
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({ beans: '', method: '', coffeeGrams: '', waterGrams: '', rating: 5, testingNotes: '' });
    setIsModalOpen(true);
  };

  // Opens modal in Editing Mode with pre-populated data
  const handleOpenEdit = (brew) => {
    setEditingId(brew.id);
    setFormData({
      beans: brew.beans,
      method: brew.method,
      coffeeGrams: brew.coffeeGrams,
      waterGrams: brew.waterGrams,
      rating: brew.rating,
      testingNotes: brew.testingNotes
    });
    setIsModalOpen(true);
  };

  // POST / PUT: Save or update a brew record
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Choose dynamic path and method based on editing state
    const url = editingId ? `${API_BASE_URL}/${editingId}` : API_BASE_URL;
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          coffeeGrams: parseInt(formData.coffeeGrams),
          waterGrams: parseInt(formData.waterGrams),
          rating: parseInt(formData.rating)
        })
      });

      if (!res.ok) throw new Error('Database rejection. Verify data properties.');
      
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ beans: '', method: '', coffeeGrams: '', waterGrams: '', rating: 5, testingNotes: '' });
      fetchBrews();
    } catch (err) {
      alert(err.message);
    }
  };

  // DELETE: Terminate an existing record
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this brew log?')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to complete delete request.');
      fetchBrews();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800">
      {/* Navbar Banner */}
      <nav className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-700 text-white rounded-xl">
              <Coffee size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-stone-900">Brewlog Dashboard</h1>
          </div>
          <button 
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white font-medium px-4 py-2 rounded-lg transition-all"
          >
            <Plus size={18} /> New Entry
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
       
        {loading ? (
          <div className="flex justify-center items-center h-64 text-stone-400 font-medium">Loading database parameters...</div>
        ) : brews.length === 0 ? (
          <div className="text-center py-16 bg-white border border-stone-200 rounded-2xl max-w-md mx-auto mt-12 shadow-xs">
            <Coffee size={48} className="mx-auto text-stone-300 mb-3" />
            <h3 className="font-semibold text-stone-700">No logs found</h3>
            <p className="text-stone-400 text-sm mt-1">Start tracking by pressing New Entry.</p>
          </div>
        ) : (
          /* Cards Grid layout */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brews.map((brew) => (
              <div key={brew.id} className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex justify-between items-start gap-4">
                    <h2 className="font-bold text-lg text-stone-900 capitalize tracking-tight">{brew.beans}</h2>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => handleOpenEdit(brew)} className="text-stone-400 hover:text-amber-700 transition-colors p-1 rounded-md" title="Edit entry">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(brew.id)} className="text-stone-400 hover:text-red-600 transition-colors p-1 rounded-md" title="Delete entry">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <span className="inline-block bg-stone-100 text-stone-600 text-xs font-semibold px-2.5 py-1 rounded-md mt-1 uppercase tracking-wider">{brew.method}</span>
                  
                  <div className="grid grid-cols-2 gap-3 my-4 bg-stone-50 p-3 rounded-xl border border-stone-100">
                    <div className="flex items-center gap-2 text-stone-600">
                      <Layers size={16} className="text-amber-700" />
                      <span className="text-sm font-medium">{brew.coffeeGrams}g Coffee</span>
                    </div>
                    <div className="flex items-center gap-2 text-stone-600">
                      <Droplet size={16} className="text-blue-500" />
                      <span className="text-sm font-medium">{brew.waterGrams}g Water</span>
                    </div>
                  </div>

                  <div className="text-stone-600 text-sm mt-2 flex gap-2">
                    <FileText size={16} className="shrink-0 text-stone-400 mt-0.5" />
                    <p className="italic">"{brew.testingNotes}"</p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-stone-400 font-semibold uppercase tracking-wider">Rating</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill={i < brew.rating ? "#b45309" : "none"} stroke={i < brew.rating ? "#b45309" : "#d6d3d1"} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-xl border border-stone-100 animate-in fade-in zoom-in-95 duration-150">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-600">
              <X size={20} />
            </button>
            <h2 className="text-lg font-bold text-stone-900 mb-4 flex items-center gap-2">
              <Coffee size={20} className="text-amber-700" /> 
              {editingId ? 'Edit Extraction Log' : 'Log Custom Extraction'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Coffee Variant / Beans</label>
                <input type="text" required placeholder="e.g. Ethiopian Yirgacheffe" className="w-full border border-stone-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-amber-700" value={formData.beans} onChange={e => setFormData({...formData, beans: e.target.value})} />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Brewing Method</label>
                <input type="text" required placeholder="e.g. V60, Pourover, Espresso" className="w-full border border-stone-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-amber-700" value={formData.method} onChange={e => setFormData({...formData, method: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Coffee (Grams)</label>
                  <input type="number" required placeholder="15" min="1" className="w-full border border-stone-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-amber-700" value={formData.coffeeGrams} onChange={e => setFormData({...formData, coffeeGrams: e.target.value})} />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Water (Grams)</label>
                  <input type="number" required placeholder="250" min="1" className="w-full border border-stone-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-amber-700" value={formData.waterGrams} onChange={e => setFormData({...formData, waterGrams: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Rating Evaluation</label>
                <select className="w-full border border-stone-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-amber-700 bg-white" value={formData.rating} onChange={e => setFormData({...formData, rating: e.target.value})}>
                  {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} Stars</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">Testing Notes</label>
                <textarea required rows="3" placeholder="Flavour profiles, aroma metrics..." className="w-full border border-stone-200 px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-amber-700 resize-none" value={formData.testingNotes} onChange={e => setFormData({...formData, testingNotes: e.target.value})}></textarea>
              </div>
              <button type="submit" className="w-full bg-amber-700 hover:bg-amber-800 text-white font-medium py-2 rounded-lg transition-all mt-2">
                {editingId ? 'Save Changes' : 'Commit Record'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
