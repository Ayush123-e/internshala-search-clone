import React from "react";
import { Filter, Sparkles } from "lucide-react";

/**
 * FilterSidebar component that hosts standard search criteria for internships.
 * Uses fully bound state and setter handles passed from the parent container.
 * Fully optimized to mimic the Internshala "Flight" neat design system.
 * 
 * @param {Object} props
 * @param {Object} props.filterCriteria Object holding all active filter selections
 * @param {string} props.filterCriteria.profileQuery Profile query string
 * @param {string} props.filterCriteria.locationQuery Location query string
 * @param {boolean} props.filterCriteria.wfhOnly Work From Home configuration
 * @param {boolean} props.filterCriteria.partTimeOnly Part Time configuration
 * @param {number} props.filterCriteria.minStipend Minimum stipend range selection
 * @param {string} props.filterCriteria.maxDuration Maximum duration selection
 * @param {boolean} props.filterCriteria.ppoOnly Pre-Placement Offer checkbox
 * @param {Array} props.uniqueProfiles Extracted list of unique profiles passed from App.jsx
 * @param {Array} props.uniqueLocations Extracted list of unique locations passed from App.jsx
 * @param {Function} props.onFilterChange Callback function triggered on filter changes: (key, value) => void
 * @param {Function} props.onClearAll Callback to reset filters
 */
export default function FilterSidebar({
  filterCriteria,
  onFilterChange,
  onClearAll,
  uniqueProfiles = [],
  uniqueLocations = []
}) {
  const {
    profileQuery = "",
    locationQuery = "",
    wfhOnly = false,
    partTimeOnly = false,
    minStipend = 0,
    maxDuration = "all",
    ppoOnly = false
  } = filterCriteria || {};

  // Dropdown visibility states
  const [profileFocused, setProfileFocused] = React.useState(false);
  const [locationFocused, setLocationFocused] = React.useState(false);

  // Helper: Get active query segment after the last comma
  const getCurrentInputSegment = (queryStr) => {
    if (!queryStr) return "";
    const segments = queryStr.split(",");
    return segments[segments.length - 1].trim();
  };

  // Helper: Update input state with selection (retains previous comma-separated elements)
  const handleSelectOption = (key, currentVal, optionSelected) => {
    const segments = currentVal.split(",");
    if (segments.length > 1) {
      segments[segments.length - 1] = " " + optionSelected;
      onFilterChange && onFilterChange(key, segments.join(", "));
    } else {
      onFilterChange && onFilterChange(key, optionSelected);
    }
  };

  // Dynamic suggestion lists based on active segment input
  const filteredProfiles = React.useMemo(() => {
    const segment = getCurrentInputSegment(profileQuery).toLowerCase();
    if (!segment) return uniqueProfiles.slice(0, 10);
    return uniqueProfiles
      .filter(p => p.toLowerCase().includes(segment))
      .slice(0, 10);
  }, [uniqueProfiles, profileQuery]);

  const filteredLocations = React.useMemo(() => {
    const segment = getCurrentInputSegment(locationQuery).toLowerCase();
    if (!segment) return uniqueLocations.slice(0, 10);
    return uniqueLocations
      .filter(l => l.toLowerCase().includes(segment))
      .slice(0, 10);
  }, [uniqueLocations, locationQuery]);

  const handleTextChange = (key, e) => {
    onFilterChange && onFilterChange(key, e.target.value);
  };

  const handleCheckboxChange = (key, e) => {
    onFilterChange && onFilterChange(key, e.target.checked);
  };

  const handleSelectChange = (key, e) => {
    onFilterChange && onFilterChange(key, e.target.value);
  };

  const handleRangeChange = (key, e) => {
    onFilterChange && onFilterChange(key, parseInt(e.target.value, 10));
  };

  return (
    <aside className="bg-white border border-[#e0e0e0] rounded-xl p-5 shadow-sm sticky top-24 max-h-[85vh] overflow-y-auto font-sans">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter className="h-4.5 w-4.5 text-[#00A5EC]" />
          <h3 className="font-bold text-slate-800 text-xs md:text-sm uppercase tracking-wider">Filters</h3>
        </div>
        <button 
          onClick={onClearAll}
          className="text-xs text-[#00A5EC] font-bold hover:text-[#0084BD] hover:underline cursor-pointer"
        >
          Clear all
        </button>
      </div>

      {/* Inputs List */}
      <div className="space-y-4">
        
        {/* Profile Filter Group */}
        <div>
          <label className="block text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider mb-1">PROFILE / DOMAIN</label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="e.g. React Developer" 
              value={profileQuery}
              onChange={(e) => handleTextChange("profileQuery", e)}
              onFocus={() => setProfileFocused(true)}
              onBlur={() => setTimeout(() => setProfileFocused(false), 200)}
              className="w-full px-2.5 py-1.5 text-xs border border-[#e0e0e0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A5EC]/20 focus:border-[#00A5EC] transition-all text-slate-805 bg-white font-medium placeholder:text-slate-400"
            />
            {profileQuery && (
              <button 
                onClick={() => onFilterChange && onFilterChange("profileQuery", "")}
                className="absolute right-2 top-2 text-xs text-slate-400 hover:text-slate-650 cursor-pointer"
              >
                ✕
              </button>
            )}

            {/* Profile suggestions pop-up */}
            {profileFocused && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto divide-y divide-slate-100">
                {filteredProfiles.map((p, idx) => (
                  <div 
                    key={idx}
                    onMouseDown={() => handleSelectOption("profileQuery", profileQuery, p)}
                    className="px-3 py-2 text-xs text-slate-700 hover:bg-sky-50 hover:text-[#00A5EC] font-semibold cursor-pointer transition-colors"
                  >
                    {p}
                  </div>
                ))}
                {filteredProfiles.length === 0 && (
                  <div className="px-3 py-2.5 text-xs text-slate-400 italic">No matching profiles found</div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Location Filter Group */}
        <div>
          <label className="block text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider mb-1">LOCATION</label>
          <div className="relative mb-2.5">
            <input 
              type="text" 
              placeholder="e.g. Bangalore" 
              value={locationQuery}
              onChange={(e) => handleTextChange("locationQuery", e)}
              onFocus={() => setLocationFocused(true)}
              onBlur={() => setTimeout(() => setLocationFocused(false), 200)}
              className="w-full px-2.5 py-1.5 text-xs border border-[#e0e0e0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A5EC]/20 focus:border-[#00A5EC] transition-all text-slate-805 bg-white font-medium placeholder:text-slate-400"
            />
            {locationQuery && (
              <button 
                onClick={() => onFilterChange && onFilterChange("locationQuery", "")}
                className="absolute right-2 top-2 text-xs text-slate-400 hover:text-slate-650 cursor-pointer"
              >
                ✕
              </button>
            )}

            {/* Location suggestions pop-up */}
            {locationFocused && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto divide-y divide-slate-100">
                {filteredLocations.map((l, idx) => (
                  <div 
                    key={idx}
                    onMouseDown={() => handleSelectOption("locationQuery", locationQuery, l)}
                    className="px-3 py-2 text-xs text-slate-700 hover:bg-sky-50 hover:text-[#00A5EC] font-semibold cursor-pointer transition-colors"
                  >
                    {l}
                  </div>
                ))}
                {filteredLocations.length === 0 && (
                  <div className="px-3 py-2.5 text-xs text-slate-400 italic">No matching locations found</div>
                )}
              </div>
            )}
          </div>
          
          <div className="space-y-1.5 mt-2">
            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
              <input 
                type="checkbox" 
                className="rounded border-[#e0e0e0] text-[#00A5EC] focus:ring-[#00A5EC] cursor-pointer" 
                checked={wfhOnly}
                onChange={(e) => handleCheckboxChange("wfhOnly", e)}
              />
              <span className="font-medium text-slate-600">Work from home</span>
            </label>
            <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
              <input 
                type="checkbox" 
                className="rounded border-[#e0e0e0] text-[#00A5EC] focus:ring-[#00A5EC] cursor-pointer" 
                checked={partTimeOnly}
                onChange={(e) => handleCheckboxChange("partTimeOnly", e)}
              />
              <span className="font-medium text-slate-600">Part-time</span>
            </label>
          </div>
        </div>

        {/* Stipend Filter Group */}
        <div>
          <label className="block text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider mb-1">DESIRED MINIMUM STIPEND (₹)</label>
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>₹0</span>
              <span className="font-bold text-[#00A5EC]">₹{minStipend}k+</span>
              <span>₹50k</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="50" 
              value={minStipend}
              onChange={(e) => handleRangeChange("minStipend", e)}
              className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#00A5EC]"
            />
          </div>
        </div>

        {/* Duration Filter Group */}
        <div>
          <label className="block text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider mb-1">MAX DURATION (MONTHS)</label>
          <div className="relative">
            <select 
              value={maxDuration}
              onChange={(e) => handleSelectChange("maxDuration", e)}
              className="w-full px-2.5 py-1.5 text-xs border border-[#e0e0e0] rounded-md focus:outline-none focus:ring-2 focus:ring-[#00A5EC]/20 focus:border-[#00A5EC] bg-white cursor-pointer text-slate-700 font-semibold"
            >
              <option value="all">Choose duration</option>
              <option value="1">1 Month</option>
              <option value="3">3 Months</option>
              <option value="6">6 Months</option>
            </select>
          </div>
        </div>

        {/* Additional Options */}
        <div className="pt-3 border-t border-slate-100 space-y-1.5">
          <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
            <input 
              type="checkbox" 
              className="rounded border-[#e0e0e0] text-[#00A5EC] focus:ring-[#00A5EC] cursor-pointer" 
              checked={ppoOnly}
              onChange={(e) => handleCheckboxChange("ppoOnly", e)}
            />
            <span className="font-medium text-slate-600">Internships with job offer</span>
          </label>
        </div>

      </div>

      {/* Smart Filter callout */}
      <div className="mt-4 p-3.5 rounded-lg bg-blue-50/50 border border-blue-100/50 text-slate-700 text-xs">
        <div className="flex items-center gap-1.5 text-[#00A5EC] font-bold mb-0.5">
          <Sparkles className="h-3.5 w-3.5 shrink-0" />
          <span>Smart Filter</span>
        </div>
        <p className="text-slate-500 leading-relaxed font-medium text-[11px]">
          Connect your account to sync filters with your skill preferences automatically!
        </p>
      </div>
    </aside>
  );
}
