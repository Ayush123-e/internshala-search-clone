import React from "react";
import { 
  TrendingUp, 
  Bookmark, 
  MapPin, 
  Clock, 
  CheckCircle,
  Calendar,
  Wallet
} from "lucide-react";

/**
 * InternshipCard component for displaying a single internship card in the Internshala UI clone.
 * Matches the official design with logo on top right, clean details, and brand blue.
 * 
 * @param {Object} props
 * @param {Object} props.internship The internship details object
 * @param {boolean} props.isBookmarked Whether this internship is bookmarked
 * @param {boolean} props.isApplied Whether the user has applied to this role
 * @param {Function} props.onToggleBookmark Callback when bookmark button is clicked
 * @param {Function} props.onViewDetails Callback when View details button is clicked
 * @param {Function} props.onApply Callback when Apply now button is clicked
 */
export default function InternshipCard({
  internship,
  isBookmarked = false,
  isApplied = false,
  onToggleBookmark,
  onViewDetails,
  onApply
}) {
  if (!internship) return null;

  const {
    id,
    title = "Internship Position",
    company = "Company Name",
    logoBg = "bg-blue-600",
    logoLetter = "I",
    location = "In Office",
    startDate = "Starts Immediately",
    duration = "N/A",
    stipend = "Competitive Stipend",
    activelyHiring = false,
    jobOffer = false,
    tags = [],
    postedAgo = "Recently"
  } = internship;

  return (
    <article 
      className="bg-white border border-slate-250/70 hover:border-[#00A5EC]/30 rounded-xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden"
    >
      {/* Top Row: Title, Company & Logo/Bookmark */}
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-0.5">
          {/* Actively hiring badge */}
          {activelyHiring && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-[#00A5EC] text-[9.5px] font-bold border border-blue-100 uppercase tracking-wider mb-1.5">
              <TrendingUp className="h-2.8 w-2.8" />
              Actively hiring
            </span>
          )}
          <h3 
            onClick={() => onViewDetails && onViewDetails()}
            className="font-bold text-slate-800 text-base md:text-[17px] hover:text-[#00A5EC] transition-colors leading-snug cursor-pointer"
          >
            {title}
          </h3>
          <p className="text-xs font-medium text-slate-500">{company}</p>
        </div>

        {/* Company Logo and Bookmark container on the top-right */}
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => onToggleBookmark && onToggleBookmark(id)}
            className={`p-1.5 rounded-lg border ${isBookmarked ? 'bg-blue-50 border-blue-200 text-[#00A5EC]' : 'bg-slate-50 border-slate-100 text-slate-400 hover:text-slate-655'} transition-all cursor-pointer`}
            title="Bookmark"
          >
            <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-[#00A5EC]' : ''}`} />
          </button>
          <div className={`w-10 h-10 rounded-lg ${logoBg} flex items-center justify-center text-white font-bold text-sm shadow-sm border border-slate-100`}>
            {logoLetter}
          </div>
        </div>
      </div>

      {/* Location (with MapPin icon) */}
      <div className="mt-2.5 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
        <span>{location}</span>
      </div>

      {/* Metadata Flex Row - Tight vertical margins & perfect typography balance */}
      <div className="flex flex-wrap gap-y-3 gap-x-8 mt-4 py-2.5 border-t border-slate-100 text-xs text-slate-500">
        
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span className="text-[11px] font-medium uppercase tracking-wider block">START DATE</span>
          </div>
          <span className="text-[13.5px] md:text-[14px] font-medium text-slate-700 block pl-5">{startDate}</span>
        </div>
        
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Clock className="h-3.5 w-3.5 shrink-0" />
            <span className="text-[11px] font-medium uppercase tracking-wider block">DURATION</span>
          </div>
          <span className="text-[13.5px] md:text-[14px] font-medium text-slate-700 block pl-5">{duration}</span>
        </div>

        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Wallet className="h-3.5 w-3.5 shrink-0" />
            <span className="text-[11px] font-medium uppercase tracking-wider block">STIPEND</span>
          </div>
          <span className="text-[13.5px] md:text-[14px] font-medium text-slate-700 block pl-5">{stipend}</span>
        </div>
        
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            <span className="text-[11px] font-medium uppercase tracking-wider block">APPLY BY</span>
          </div>
          <span className="text-[13.5px] md:text-[14px] font-medium text-slate-700 block pl-5">Immediately</span>
        </div>
      </div>

      {/* Tags row */}
      <div className="flex flex-wrap gap-1.5 mt-3">
        {tags.map((tag, idx) => (
          <span key={idx} className="bg-slate-50 border border-slate-100 text-slate-500 text-[11px] px-2.5 py-0.5 rounded font-medium">
            {tag}
          </span>
        ))}
        {jobOffer && (
          <span className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[11px] px-2.5 py-0.5 rounded font-semibold">
            With Job Offer
          </span>
        )}
      </div>

      {/* Bottom Action Row */}
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
        {/* Date posted info on left */}
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <Clock className="h-3.5 w-3.5 text-slate-300" />
          <span>{postedAgo}</span>
        </div>

        {/* View Details text link & solid Apply button on right */}
        <div className="flex items-center gap-5">
          <button 
            onClick={() => onViewDetails && onViewDetails()}
            className="text-xs font-bold text-[#00A5EC] hover:text-[#0084BD] transition-colors cursor-pointer hover:underline"
          >
            View details
          </button>
          
          {isApplied ? (
            <button 
              disabled
              className="px-5 py-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg shadow-sm cursor-not-allowed flex items-center gap-1"
            >
              <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>Applied</span>
            </button>
          ) : (
            <button 
              onClick={() => onApply && onApply()}
              className="px-5 py-2 text-xs font-bold text-white bg-[#00A5EC] hover:bg-[#0084BD] rounded-lg shadow-sm hover:shadow transition-all cursor-pointer font-sans"
            >
              Apply now
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
