import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Search, MapPin, DollarSign, Home, Filter, Check, Users } from 'lucide-react';
import { mockFlats } from '../data/mockFlats';
import api from '../services/api';

const Explore = () => {
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [bhk, setBhk] = useState('Any');
  const [furnished, setFurnished] = useState('Any');
  
  const [sortBy, setSortBy] = useState('Newest');
  const [flats, setFlats] = useState([]);
  const [filteredFlats, setFilteredFlats] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  const locations = [...new Set(mockFlats.map(f => f.location))];

  useEffect(() => {
    // Fetch flats from API, fallback to mock data if it fails
    const fetchFlats = async () => {
      try {
        const { data } = await api.get('/flats');
        setFlats(data.length > 0 ? data : mockFlats);
      } catch (error) {
        console.error("Error fetching flats, using mock data", error);
        setFlats(mockFlats);
      } finally {
        setLoading(false);
      }
    };
    fetchFlats();
  }, []);

  useEffect(() => {
    if (flats.length > 0) {
      handleApplyFilters();
    }
  }, [flats, sortBy]);

  const handleApplyFilters = () => {
    let results = flats;

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      results = results.filter(f => 
        f.title.toLowerCase().includes(lowerSearch) ||
        f.location.toLowerCase().includes(lowerSearch) ||
        f.city.toLowerCase().includes(lowerSearch)
      );
    }

    if (location) {
      const lowerLoc = location.toLowerCase();
      results = results.filter(f => 
        f.location.toLowerCase().includes(lowerLoc) || 
        f.city.toLowerCase().includes(lowerLoc)
      );
    }
    if (bhk !== 'Any') results = results.filter(f => f.bhk.toString() === bhk);
    if (furnished !== 'Any') results = results.filter(f => f.furnished === furnished);

    const minB = budgetMin ? parseInt(budgetMin) : 0;
    const maxB = budgetMax ? parseInt(budgetMax) : 999999;
    if (budgetMin || budgetMax) {
      results = results.filter(f => f.monthlyRent >= minB && f.monthlyRent <= maxB);
    }

    if (sortBy === 'Lowest Rent') {
      results.sort((a, b) => a.monthlyRent - b.monthlyRent);
    } else if (sortBy === 'Highest Rent') {
      results.sort((a, b) => b.monthlyRent - a.monthlyRent);
    } else if (sortBy === 'Newest') {
      results.sort((a, b) => new Date(b.createdAt || '2026-01-01').getTime() - new Date(a.createdAt || '2026-01-01').getTime());
    }

    setFilteredFlats(results);
    setShowMobileFilters(false);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setLocation('');
    setBudgetMin('');
    setBudgetMax('');
    setBhk('Any');
    setFurnished('Any');
    setSortBy('Newest');
    setFilteredFlats(flats);
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20 relative overflow-hidden pt-8">
      <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        
        <div className="mb-10 text-center md:text-left">
          <p className="text-pink-500 font-semibold tracking-wider text-sm mb-2 uppercase">Explore Flats</p>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-400 mb-4">
            Find Your Next Flat
          </h1>
          <p className="text-white/60 text-lg max-w-2xl">
            Explore flats and find students who are looking for a compatible roommate.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          <div className="lg:hidden">
            <button 
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full flex items-center justify-center gap-2 bg-white/10 border border-white/20 py-3 rounded-xl font-medium"
            >
              <Filter size={18} /> {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          <div className={`lg:w-[320px] shrink-0 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sticky top-28">
              
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Filter size={18} className="text-pink-400" /> Filters
                </h3>
                <button onClick={handleClearFilters} className="text-sm text-pink-400 hover:text-pink-300">
                  Clear All
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-xs text-white/50 mb-1 block uppercase tracking-wider">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                    <input 
                      type="text" 
                      placeholder="Title, location..." 
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:border-pink-500 transition-colors"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/50 mb-1 block uppercase tracking-wider">Location</label>
                  <input 
                    type="text"
                    placeholder="Enter location"
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-pink-500"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs text-white/50 mb-1 block uppercase tracking-wider">Rent (₹ / mo)</label>
                  <div className="flex gap-2">
                    <input 
                      type="number" 
                      placeholder="Min" 
                      className="w-1/2 bg-black/50 border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-pink-500"
                      value={budgetMin}
                      onChange={(e) => setBudgetMin(e.target.value)}
                    />
                    <input 
                      type="number" 
                      placeholder="Max" 
                      className="w-1/2 bg-black/50 border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-pink-500"
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-white/50 mb-1 block uppercase tracking-wider">BHK</label>
                  <select 
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-pink-500 appearance-none"
                    value={bhk}
                    onChange={(e) => setBhk(e.target.value)}
                  >
                    <option value="Any">Any</option>
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4+ BHK</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-white/50 mb-1 block uppercase tracking-wider">Furnished</label>
                  <select 
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-pink-500 appearance-none"
                    value={furnished}
                    onChange={(e) => setFurnished(e.target.value)}
                  >
                    <option value="Any">Any</option>
                    <option value="Fully Furnished">Fully Furnished</option>
                    <option value="Semi Furnished">Semi Furnished</option>
                    <option value="Unfurnished">Unfurnished</option>
                  </select>
                </div>

                <button 
                  onClick={handleApplyFilters}
                  className="w-full mt-6 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white px-4 py-3 rounded-xl font-medium shadow-lg shadow-pink-500/25 transition-all"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-bold">Flats Available</h2>
                <p className="text-white/50 text-sm mt-1">Browse flats and express your interest.</p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span className="text-white/50 text-sm">Sort by:</span>
                <select 
                  className="bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:border-pink-500 text-white appearance-none pr-8"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="Newest">Newest</option>
                  <option value="Lowest Rent">Lowest Rent</option>
                  <option value="Highest Rent">Highest Rent</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20"><p className="text-white/50">Loading flats...</p></div>
            ) : filteredFlats.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                {filteredFlats.map((flat, idx) => (
                  <motion.div 
                    key={flat._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-colors flex flex-col h-full"
                  >
                    <div className="w-full h-48 mb-4 rounded-xl overflow-hidden relative">
                      <img src={flat.images?.[0] || 'https://via.placeholder.com/800x600'} alt={flat.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20">
                         <span className="text-xs font-semibold text-white">{flat.furnished}</span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <h3 className="text-lg font-bold truncate">{flat.title}</h3>
                      <p className="text-pink-400 text-sm flex items-center gap-1 mt-1">
                        <MapPin size={14} /> {flat.location}, {flat.city}
                      </p>
                    </div>

                    <div className="bg-black/40 rounded-xl p-3 mb-4 space-y-2 flex-1">
                       <div className="flex justify-between items-center text-sm">
                          <span className="text-white/50 flex items-center gap-1.5"><DollarSign size={14}/> Rent</span>
                          <span className="font-semibold text-white/90 text-base">₹{flat.monthlyRent}<span className="text-xs font-normal text-white/50">/mo</span></span>
                       </div>
                       <div className="flex justify-between items-center text-sm">
                          <span className="text-white/50 flex items-center gap-1.5"><Home size={14}/> Details</span>
                          <span className="font-medium text-white/90">{flat.bhk} BHK • {flat.bathrooms} Bath</span>
                       </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {flat.amenities.slice(0, 3).map((amenity, i) => (
                         <span key={i} className="bg-white/5 border border-white/10 text-white/70 text-xs px-2.5 py-1 rounded-md flex items-center gap-1">
                           <Check size={12} className="text-green-400" /> {amenity}
                         </span>
                      ))}
                      {flat.amenities.length > 3 && (
                        <span className="bg-white/5 border border-white/10 text-white/70 text-xs px-2.5 py-1 rounded-md">+{flat.amenities.length - 3}</span>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-sm mb-4 bg-pink-500/10 border border-pink-500/20 px-3 py-2 rounded-lg text-pink-300">
                       <span className="flex items-center gap-1.5"><Users size={14} /> Roommates Needed:</span>
                       <span className="font-bold">{flat.roommatesNeeded}</span>
                    </div>

                    <div className="flex items-center gap-3 mt-auto">
                       <Link 
                         to={`/flats/${flat._id}`}
                         className="flex-1 bg-white/10 hover:bg-white/20 border border-white/10 text-center py-2.5 rounded-lg text-sm font-medium transition-colors"
                       >
                         View Details
                       </Link>
                       <Link 
                         to={`/flats/${flat._id}`}
                         className="flex-1 bg-pink-600 hover:bg-pink-700 text-center py-2.5 rounded-lg text-sm font-medium transition-colors"
                       >
                         I'm Interested
                       </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center">
                <Search size={48} className="text-white/20 mb-4" />
                <h3 className="text-xl font-bold mb-2">No flats found</h3>
                <p className="text-white/50 max-w-md mx-auto mb-6">Try changing your filters or searching for something else to discover more flats.</p>
                <button 
                  onClick={handleClearFilters}
                  className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
