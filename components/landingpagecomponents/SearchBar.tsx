const SearchBar = () => {
  return (
    <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="text-white text-xs uppercase mb-2 block">Region</label>
          <select className="w-full bg-transparent text-white border-b border-gray-600 py-2 focus:outline-none focus:border-emerald-500">
            <option className="bg-gray-800">All Regions</option>
          </select>
        </div>
        <div>
          <label className="text-white text-xs uppercase mb-2 block">Dates</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Date" 
              className="flex-1 bg-transparent text-white border-b border-gray-600 py-2 focus:outline-none focus:border-emerald-500"
            />
            <span className="text-white py-2">→</span>
            <input 
              type="text" 
              placeholder="Date" 
              className="flex-1 bg-transparent text-white border-b border-gray-600 py-2 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
        <div>
          <label className="text-white text-xs uppercase mb-2 block">Category</label>
          <select className="w-full bg-transparent text-white border-b border-gray-600 py-2 focus:outline-none focus:border-emerald-500">
            <option className="bg-gray-800">All</option>
          </select>
        </div>
      </div>
      <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-12 py-3 rounded-full font-medium float-right">
        Search
      </button>
    </div>
  );
};

export default SearchBar;