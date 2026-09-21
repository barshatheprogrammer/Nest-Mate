import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Search, MapPin, DollarSign, Book, Filter, Home, User, Coffee, Check, Clock } from 'lucide-react';
import { mockRoommates } from '../data/mockRoommates';

const Explore = () => {
  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [city, setCity] = useState('');
  const [college, setCollege] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [roomType, setRoomType] = useState('Any');
  const [food, setFood] = useState('Any');
  const [smoking, setSmoking] = useState('Any');
  const [pets, setPets] = useState('Any');
  const [study, setStudy] = useState('Any');
  const [sleep, setSleep] = useState('Any');
  
  const [sortBy, setSortBy] = useState('Best Match');
  const [filteredRoommates, setFilteredRoommates] = useState(mockRoommates);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Extract unique values for dropdowns
  const cities = [...new Set(mockRoommates.map(r => r.city))];
  const colleges = [...new Set(mockRoommates.map(r => r.college))];

  const handleApplyFilters = () => {
    let results = mockRoommates;

    // Search (Name, College, City, Location)
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      results = results.filter(r => 
        r.name.toLowerCase().includes(lowerSearch) ||
        r.college.toLowerCase().includes(lowerSearch) ||
        r.city.toLowerCase().includes(lowerSearch) ||
        r.location.toLowerCase().includes(lowerSearch)
      );
    }

    // Exact match filters
    if (city) results = results.filter(r => r.city === city);
    if (college) results = results.filter(r => r.college === college);
    if (roomType !== 'Any') results = results.filter(r => r.roomType === roomType);
    if (food !== 'Any') results = results.filter(r => r.foodPreference === food || r.foodPreference === 'Any');
    if (smoking !== 'Any') results = results.filter(r => r.smoking === smoking);
    if (pets !== 'Any') results = results.filter(r => r.pets === pets || r.pets === 'Any');
    if (study !== 'Any') results = results.filter(r => r.studySchedule === study || r.studySchedule === 'Flexible');
    if (sleep !== 'Any') results = results.filter(r => r.sleepSchedule === sleep || r.sleepSchedule === 'Flexible');

    // Budget Logic (overlap logic)
    const minB = budgetMin ? parseInt(budgetMin) : 0;
    const maxB = budgetMax ? parseInt(budgetMax) : 999999;
    if (budgetMin || budgetMax) {
      results = results.filter(r => (r.budgetMin <= maxB && r.budgetMax >= minB));
    }

    // Sort Logic
    if (sortBy === 'Highest Compatibility') {
      results.sort((a, b) => b.compatibility - a.compatibility);
    } else if (sortBy === 'Lowest Budget') {
      results.sort((a, b) => a.budgetMin - b.budgetMin);
    } else if (sortBy === 'Highest Budget') {
      results.sort((a, b) => b.budgetMax - a.budgetMax);
    } // Best Match keeps default order which is usually sorted by compatibility or algorithm

    setFilteredRoommates(results);
    setShowMobileFilters(false); // Close mobile filters on apply
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setCity('');
    setCollege('');
    setBudgetMin('');
    setBudgetMax('');
    setRoomType('Any');
    setFood('Any');
    setSmoking('Any');
    setPets('Any');
    setStudy('Any');
    setSleep('Any');
    setSortBy('Best Match');
    setFilteredRoommates(mockRoommates);
  };

  // Run initial filter to apply default sorting
  useEffect(() => {
    handleApplyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]); 

  return (
    <div className="min-h-screen bg-black text-white pb-20 relative overflow-hidden pt-8">
      {/* Background gradients */}
      <div className="absolute top-[10%] left-[-10%] w-[40%] h-[40%] bg-pink-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[30%] h-[30%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="mb-10 text-center md:text-left">
          <p className="text-pink-500 font-semibold tracking-wider text-sm mb-2 uppercase">Explore</p>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-400 mb-4">
            Find a Roommate Who Fits Your Lifestyle
          </h1>
          <p className="text-white/60 text-lg max-w-2xl">
            Discover students based on location, budget, college, and lifestyle preferences.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <button 
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full flex items-center justify-center gap-2 bg-white/10 border border-white/20 py-3 rounded-xl font-medium"
            >
              <Filter size={18} /> {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Filters Sidebar */}
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
                {/* Search */}
                <div>
                  <label className="text-xs text-white/50 mb-1 block uppercase tracking-wider">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={16} />
                    <input 
                      type="text" 
                      placeholder="Name, college, location..." 
                      className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-sm focus:outline-none focus:border-pink-500 transition-colors"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="text-xs text-white/50 mb-1 block uppercase tracking-wider">City</label>
                  <select 
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-pink-500 appearance-none"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  >
                    <option value="">Select city</option>
                    {cities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* College */}
                <div>
                  <label className="text-xs text-white/50 mb-1 block uppercase tracking-wider">College</label>
                  <select 
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-pink-500 appearance-none"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                  >
                    <option value="">Select college</option>
                    {colleges.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Budget */}
                <div>
                  <label className="text-xs text-white/50 mb-1 block uppercase tracking-wider">Budget (₹ / mo)</label>
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

                {/* Room Type */}
                <div>
                  <label className="text-xs text-white/50 mb-1 block uppercase tracking-wider">Room Type</label>
                  <select 
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-pink-500 appearance-none"
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                  >
                    <option value="Any">Any</option>
                    <option value="Single">Single</option>
                    <option value="Shared">Shared</option>
                  </select>
                </div>

                {/* Food Preference */}
                <div>
                  <label className="text-xs text-white/50 mb-1 block uppercase tracking-wider">Food Preference</label>
                  <select 
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-pink-500 appearance-none"
                    value={food}
                    onChange={(e) => setFood(e.target.value)}
                  >
                    <option value="Any">Any</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                  </select>
                </div>
                
                {/* Smoking */}
                <div>
                  <label className="text-xs text-white/50 mb-1 block uppercase tracking-wider">Smoking</label>
                  <select 
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-pink-500 appearance-none"
                    value={smoking}
                    onChange={(e) => setSmoking(e.target.value)}
                  >
                    <option value="Any">Any</option>
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>

                {/* Sleep Schedule */}
                <div>
                  <label className="text-xs text-white/50 mb-1 block uppercase tracking-wider">Sleep Schedule</label>
                  <select 
                    className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:border-pink-500 appearance-none"
                    value={sleep}
                    onChange={(e) => setSleep(e.target.value)}
                  >
                    <option value="Any">Any</option>
                    <option value="Early Sleeper">Early Sleeper</option>
                    <option value="Night Owl">Night Owl</option>
                    <option value="Flexible">Flexible</option>
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

          {/* Main Content (Results) */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <p className="text-pink-500 font-semibold tracking-wider text-xs uppercase mb-1">Recommended For You</p>
                <h2 className="text-2xl font-bold">Potential Roommates</h2>
                <p className="text-white/50 text-sm mt-1">Based on your preferences, here are students who may be compatible with you.</p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span className="text-white/50 text-sm">Sort by:</span>
                <select 
                  className="bg-white/5 border border-white/10 rounded-lg py-1.5 px-3 text-sm focus:outline-none focus:border-pink-500 text-white appearance-none pr-8"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="Best Match">Best Match</option>
                  <option value="Highest Compatibility">Highest Compatibility</option>
                  <option value="Lowest Budget">Lowest Budget</option>
                  <option value="Highest Budget">Highest Budget</option>
                </select>
              </div>
            </div>

            {/* Results Grid */}
            {filteredRoommates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                {filteredRoommates.map((rm, idx) => (
                  <motion.div 
                    key={rm.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors flex flex-col h-full"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative shrink-0">
                        <img src={rm.image} alt={rm.name} className="w-16 h-16 rounded-full object-cover border-2 border-pink-500" />
                        <div className="absolute -bottom-2 -right-2 bg-black border border-white/10 rounded-lg px-1.5 py-0.5 flex items-center gap-1 shadow-xl">
                           <span className="text-[10px] font-bold text-green-400">{rm.compatibility}%</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold truncate">{rm.name}, {rm.age}</h3>
                        <p className="text-pink-400 text-sm truncate">{rm.college}</p>
                        <p className="text-white/50 text-xs truncate">{rm.course} • {rm.location}, {rm.city}</p>
                      </div>
                    </div>

                    <div className="bg-black/40 rounded-xl p-3 mb-4 space-y-2 flex-1">
                       <div className="flex justify-between items-center text-sm">
                          <span className="text-white/50 flex items-center gap-1.5"><DollarSign size={14}/> Budget</span>
                          <span className="font-medium text-white/90">₹{rm.budgetMin} - ₹{rm.budgetMax}</span>
                       </div>
                       <div className="flex justify-between items-center text-sm">
                          <span className="text-white/50 flex items-center gap-1.5"><Home size={14}/> Room</span>
                          <span className="font-medium text-white/90">{rm.roomType}</span>
                       </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="bg-white/5 border border-white/10 text-white/70 text-xs px-2.5 py-1 rounded-md">{rm.foodPreference}</span>
                      <span className="bg-white/5 border border-white/10 text-white/70 text-xs px-2.5 py-1 rounded-md">{rm.smoking === 'No' ? 'Non-Smoker' : 'Smoker'}</span>
                      <span className="bg-white/5 border border-white/10 text-white/70 text-xs px-2.5 py-1 rounded-md">{rm.sleepSchedule}</span>
                    </div>

                    <div className="flex items-center gap-3 mt-auto">
                       <Link 
                         to={`/roommates/${rm.id}`}
                         className="flex-1 bg-white/10 hover:bg-white/20 border border-white/10 text-center py-2.5 rounded-lg text-sm font-medium transition-colors"
                       >
                         View Profile
                       </Link>
                       <Link 
                         to={`/roommates/${rm.id}`}
                         className="flex-1 bg-pink-600 hover:bg-pink-700 text-center py-2.5 rounded-lg text-sm font-medium transition-colors"
                       >
                         Connect
                       </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center">
                <Search size={48} className="text-white/20 mb-4" />
                <h3 className="text-xl font-bold mb-2">No roommates found</h3>
                <p className="text-white/50 max-w-md mx-auto mb-6">Try changing your filters or searching for something else to discover more potential roommates.</p>
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
