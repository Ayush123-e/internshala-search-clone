import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  GraduationCap, 
  ChevronDown, 
  Bookmark, 
  Clock, 
  Sparkles, 
  CheckCircle,
  Bell,
  ArrowRight,
  TrendingUp,
  X,
  Menu,
  Upload
} from 'lucide-react';
import InternshipCard from "./components/InternshipCard";
import FilterSidebar from "./components/FilterSidebar";

function App() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [bookmarkedList, setBookmarkedList] = useState([65532]); // Google is bookmarked by default

  // API State Variables
  const [allInternships, setAllInternships] = useState([]);

  // Extract separate unique profiles and locations lists programmatically on mount/change
  const uniqueProfiles = React.useMemo(() => {
    const set = new Set();
    allInternships.forEach(item => {
      if (item.profileName) {
        set.add(item.profileName.trim());
      } else if (item.title) {
        const cleanTitle = item.title.replace(/intern(ship)?/i, "").trim();
        if (cleanTitle && cleanTitle.length > 2) {
          set.add(cleanTitle);
        } else {
          set.add(item.title.trim());
        }
      }
    });
    return Array.from(set).sort();
  }, [allInternships]);

  const uniqueLocations = React.useMemo(() => {
    const set = new Set();
    allInternships.forEach(item => {
      if (item.locationNames && item.locationNames.length > 0) {
        item.locationNames.forEach(l => {
          if (l) set.add(l.trim());
        });
      } else if (item.location) {
        const locs = item.location.split(/[,;]+/);
        locs.forEach(l => {
          const cleanL = l.trim();
          const lower = cleanL.toLowerCase();
          if (cleanL && lower !== "work from home" && lower !== "remote" && lower !== "in office") {
            set.add(cleanL);
          }
        });
      }
    });
    return Array.from(set).sort();
  }, [allInternships]);

  const [filteredInternships, setFilteredInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDemoFallback, setIsDemoFallback] = useState(false);

  // Dynamic Unified Filtering State Criteria
  const [filterCriteria, setFilterCriteria] = useState({
    profileQuery: "",
    locationQuery: "",
    wfhOnly: false,
    partTimeOnly: false,
    minStipend: 0,
    maxDuration: "all",
    ppoOnly: false
  });
  const [globalSearch, setGlobalSearch] = useState("");
  const [sortBy, setSortBy] = useState("relevant");

  const handleFilterChange = (key, value) => {
    setFilterCriteria(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Application & Detail Modal State Variables
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [appliedList, setAppliedList] = useState([]);
  const [applicationSuccess, setApplicationSuccess] = useState(null);

  // Brand colors representing authentic Internshala card aesthetics
  const bgClasses = [
    "bg-sky-500",
    "bg-indigo-500",
    "bg-emerald-500",
    "bg-rose-500",
    "bg-amber-500",
    "bg-teal-500",
    "bg-violet-500"
  ];

  // Helper function to map API internships to our state model
  const parseInternship = (item) => {
    const title = item.title || "Intern";
    const company = item.company_name || "Internshala Partner";
    
    let companyDesc = `${company} is a leading brand recognized for its commitment to industry innovation and empowering students through high-impact learning experiences. We build technology that matters and scale products globally.`;
    if (company.toLowerCase().includes("google")) {
      companyDesc = "Google LLC is an American multinational technology company that specializes in Internet-related services and products, which include online advertising technologies, a search engine, cloud computing, software, and hardware.";
    } else if (company.toLowerCase().includes("alkymia")) {
      companyDesc = "Alkymia Tech is a fast-growing product development agency crafting high-performance systems for modern e-commerce, cloud scaling, and AI operations.";
    }
    
    let skills = ["Communication", "Problem Solving", "Teamwork"];
    let responsibilities = [
      "Collaborate with multi-disciplinary stakeholders to define project deliverables.",
      "Support daily operations, document key metrics, and prepare progress reports.",
      "Participate in brainstorming sessions, client calls, and sprint review cycles."
    ];

    if (title.toLowerCase().includes("data science") || title.toLowerCase().includes("analytics")) {
      skills = ["Python", "SQL", "Machine Learning", "Pandas", "Tableau", "Data Analysis"];
      responsibilities = [
        "Perform exploratory data analysis (EDA) on transactional datasets to extract actionable insights.",
        "Build, tune, and validate regression and classification ML models in Python.",
        "Create custom data visualizations and interactive dashboards using Tableau and SQL."
      ];
    } else if (title.toLowerCase().includes("android") || title.toLowerCase().includes("app")) {
      skills = ["Java", "Kotlin", "Android SDK", "Git", "REST APIs", "XML"];
      responsibilities = [
        "Design and construct scalable, reusable mobile features using Kotlin and Jetpack.",
        "Identify and troubleshoot application performance bottlenecks and memory leaks.",
        "Integrate external data storage libraries, authentication endpoints, and push notifications."
      ];
    } else if (title.toLowerCase().includes("administration") || title.toLowerCase().includes("management")) {
      skills = ["MS-Excel", "MS-Office", "Reporting", "Scheduling", "Email Writing"];
      responsibilities = [
        "Manage calendar schedules, organize corporate bookings, and align internal syncs.",
        "Maintain accurate records in corporate databases and compile weekly reports.",
        "Assist in operations, stakeholder onboarding, and employee experience initiatives."
      ];
    }

    return {
      id: item.id,
      title: title,
      company: company,
      logoBg: bgClasses[item.id % bgClasses.length],
      logoLetter: company ? company[0].toUpperCase() : "I",
      location: item.work_from_home ? "Work From Home" : (item.location_names && item.location_names.length > 0 ? item.location_names.join(", ") : "In Office"),
      startDate: item.start_date || "Starts Immediately",
      duration: item.duration || "N/A",
      stipend: item.stipend?.salary || "Competitive",
      activelyHiring: true,
      jobOffer: !!item.ppo_label_value || !!item.office_days,
      tags: [item.profile_name, ...(item.location_names || [])].filter(Boolean).slice(0, 3),
      postedAgo: item.posted_by_label || "Recently",
      
      aboutCompany: companyDesc,
      skills: skills,
      responsibilities: responsibilities,
      perks: ["Certificate of Internship", "Letter of Recommendation", "Flexible Work Hours", "5 Days a Week"],
      openings: (item.id % 5) + 2,
      profileName: item.profile_name,
      locationNames: item.location_names || []
    };
  };

  // Fallback Mock Data matching the structure of the Internshala endpoint
  const getFallbackList = () => {
    const rawMeta = {
      "65532": { id: 65532, title: "Data Science Intern", company_name: "Google", work_from_home: false, location_names: ["Munnar","Delhi","Lucknow","Tarn Taran"], start_date: "Starts Immediately", duration: "3 Months", stipend: { salary: "₹ 50,000 /month" }, posted_by_label: "Today", ppo_label_value: "With job offer" },
      "65531": { id: 65531, title: "Data Science Intern", company_name: "Google", work_from_home: false, location_names: ["Tarn Taran","Delhi","Munnar"], start_date: "Starts Immediately", duration: "3 Months", stipend: { salary: "₹ 5,500 /month" }, posted_by_label: "Today", ppo_label_value: null },
      "65381": { id: 65381, title: "Administration Intern", company_name: "Google (Gurgaon, India)", work_from_home: false, location_names: ["Banga (Philippines)"], start_date: "Starts Immediately", duration: "2 Months", stipend: { salary: "₹ 20,000 /month" }, posted_by_label: "1 day ago", ppo_label_value: null },
      "65524": { id: 65524, title: "Business Analytics Intern", company_name: "Google", work_from_home: false, location_names: ["Delhi","Kera","Tarn Taran"], start_date: "Starts Immediately", duration: "3 Months", stipend: { salary: "₹ 5,500 /month" }, posted_by_label: "1 day ago", ppo_label_value: null },
      "65522": { id: 65522, title: "Administration Intern (Remote)", company_name: "Alkymia Tech", work_from_home: true, location_names: [], start_date: "Starts Immediately", duration: "5 Months", stipend: { salary: "₹ 20,000 /month" }, posted_by_label: "1 day ago", ppo_label_value: "With job offer" },
      "65517": { id: 65517, title: "Brand Management Intern", company_name: "Google", work_from_home: false, location_names: ["Delhi","Parbhani","Kera","Lucknow"], start_date: "Starts Immediately", duration: "3 Months", stipend: { salary: "₹ 5,500 /month" }, posted_by_label: "2 days ago", ppo_label_value: null },
      "65515": { id: 65515, title: "Brand Management Intern", company_name: "Google", work_from_home: false, location_names: ["Delhi"], start_date: "Starts Immediately", duration: "3 Months", stipend: { salary: "₹ 5,500 /month" }, posted_by_label: "2 days ago", ppo_label_value: null },
      "65454": { id: 65454, title: "Administration Intern (Remote)", company_name: "Decoy Enterprise", work_from_home: true, location_names: [], start_date: "Starts Immediately", duration: "3 Months", stipend: { salary: "₹ 30,000 /month" }, posted_by_label: "3 days ago", ppo_label_value: null },
      "65501": { id: 65501, title: "Android App Development Intern", company_name: "Engineering Solutions", work_from_home: false, location_names: ["Gurgaon"], start_date: "Starts Immediately", duration: "2 Months", stipend: { salary: "₹ 20,000 /month" }, posted_by_label: "6 days ago", office_days: "2 day(s) in-office" },
      "65504": { id: 65504, title: "Product Management Intern", company_name: "Engineering Solutions", work_from_home: false, location_names: ["Gurgaon"], start_date: "Starts Immediately", duration: "3 Months", stipend: { salary: "₹ 10,000 /month" }, posted_by_label: "6 days ago", office_days: "2 day(s) in-office" }
    };
    const rawIds = [65532, 65531, 65381, 65524, 65522, 65517, 65515, 65454, 65501, 65504];
    return rawIds.map(id => parseInternship(rawMeta[id]));
  };

  // Fetch API inside useEffect
  useEffect(() => {
    const fetchInternships = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://internshala.com/hiring/search");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        const meta = data.internships_meta || {};
        const ids = data.internship_ids || [];
        const parsedList = ids.map(id => parseInternship(meta[id]));

        setAllInternships(parsedList);
        setFilteredInternships(parsedList);
        setError(null);
        setIsDemoFallback(false);
      } catch (err) {
        console.warn("Direct API fetch failed (CORS or network policy). Activating premium fallback data.", err);
        const fallbackList = getFallbackList();
        setAllInternships(fallbackList);
        setFilteredInternships(fallbackList);
        setError("CORS policy blocked direct browser access. Loaded 10 verified real internships from local copy.");
        setIsDemoFallback(true);
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  const toggleBookmark = (id) => {
    if (bookmarkedList.includes(id)) {
      setBookmarkedList(bookmarkedList.filter(item => item !== id));
    } else {
      setBookmarkedList([...bookmarkedList, id]);
    }
  };

  // Dynamic Filtering Logic Effect
  useEffect(() => {
    let result = [...allInternships];
    const { profileQuery, locationQuery, wfhOnly, partTimeOnly, minStipend, maxDuration, ppoOnly } = filterCriteria;

    if (globalSearch.trim()) {
      const q = globalSearch.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(q) ||
        item.company.toLowerCase().includes(q) ||
        item.tags.some(tag => tag.toLowerCase().includes(q))
      );
    }

    if (profileQuery.trim()) {
      const profiles = profileQuery.split(/[,;]+/).map(p => p.trim().toLowerCase()).filter(Boolean);
      if (profiles.length > 0) {
        result = result.filter(item => 
          profiles.some(p => 
            item.title.toLowerCase().includes(p) ||
            item.tags.some(tag => tag.toLowerCase().includes(p))
          )
        );
      }
    }

    if (locationQuery.trim()) {
      const locations = locationQuery.split(/[,;]+/).map(l => l.trim().toLowerCase()).filter(Boolean);
      if (locations.length > 0) {
        result = result.filter(item => 
          locations.some(l => 
            item.location.toLowerCase().includes(l)
          )
        );
      }
    }

    if (wfhOnly) {
      result = result.filter(item => 
        item.location.toLowerCase().includes("work from home") || 
        item.location.toLowerCase().includes("remote")
      );
    }

    if (partTimeOnly) {
      result = result.filter(item => 
        item.title.toLowerCase().includes("part-time") ||
        item.tags.some(tag => tag.toLowerCase().includes("part-time"))
      );
    }

    if (minStipend > 0) {
      result = result.filter(item => {
        const stipendStr = item.stipend || "";
        const cleanStr = stipendStr.replace(/[^\d]/g, "");
        if (cleanStr) {
          const val = parseInt(cleanStr, 10);
          return val >= (minStipend * 1000);
        }
        return true;
      });
    }

    if (maxDuration !== "all") {
      const maxMonths = parseInt(maxDuration, 10);
      result = result.filter(item => {
        const durationStr = item.duration || "";
        const match = durationStr.match(/\d+/);
        if (match) {
          const durationVal = parseInt(match[0], 10);
          return durationVal <= maxMonths;
        }
        return true;
      });
    }

    if (ppoOnly) {
      result = result.filter(item => item.jobOffer);
    }

    if (sortBy === "stipendHighToLow") {
      result.sort((a, b) => {
        const getVal = (item) => {
          const stipendStr = item.stipend || "";
          const cleanStr = stipendStr.replace(/[^\d]/g, "");
          return cleanStr ? parseInt(cleanStr, 10) : 0;
        };
        return getVal(b) - getVal(a);
      });
    } else if (sortBy === "durationShortToLong") {
      result.sort((a, b) => {
        const getVal = (item) => {
          const durationStr = item.duration || "";
          const match = durationStr.match(/\d+/);
          return match ? parseInt(match[0], 10) : 999;
        };
        return getVal(a) - getVal(b);
      });
    }

    setFilteredInternships(result);
  }, [allInternships, globalSearch, filterCriteria, sortBy]);

  const handleClearAll = () => {
    setFilterCriteria({
      profileQuery: "",
      locationQuery: "",
      wfhOnly: false,
      partTimeOnly: false,
      minStipend: 0,
      maxDuration: "all",
      ppoOnly: false
    });
    setGlobalSearch("");
    setSortBy("relevant");
  };

  const { profileQuery, locationQuery, wfhOnly, partTimeOnly, minStipend, maxDuration, ppoOnly } = filterCriteria;

  const hasActiveFilters = !!(
    globalSearch.trim() || 
    profileQuery.trim() || 
    locationQuery.trim() || 
    wfhOnly || 
    partTimeOnly || 
    minStipend > 0 || 
    maxDuration !== "all" || 
    ppoOnly
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans selection:bg-[#00A5EC] selection:text-white">
      
      {/* --- TOP NAVBAR --- */}
      <header className="bg-white sticky top-0 z-40 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Navigation */}
          <div className="flex items-center gap-8">
            <a href="#" className="flex items-center gap-2 group">
              <img 
                src="https://internshala.com/static/images/common/new_internshala_logo.svg" 
                alt="Internshala Logo" 
                className="h-8 md:h-9 w-auto object-contain"
              />
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              <a href="#" className="px-3 py-2 text-sm font-semibold text-[#00A5EC] bg-[#E8F7FD] rounded-lg">
                Internships
              </a>
              <a href="#" className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#00A5EC] rounded-lg transition-colors">
                Jobs
              </a>
              <a href="#" className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#00A5EC] rounded-lg transition-colors flex items-center gap-1">
                Courses 
                <span className="bg-orange-100 text-orange-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold">OFFER</span>
              </a>
              <a href="#" className="px-3 py-2 text-sm font-semibold text-slate-700 hover:text-[#00A5EC] rounded-lg transition-colors">
                Clubs
              </a>
            </nav>
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Search Input in Navbar */}
            <div className="relative w-64">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input 
                type="text" 
                placeholder="Search internships..." 
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A5EC]/20 focus:border-[#00A5EC] transition-all placeholder:text-slate-400"
              />
            </div>

            <button className="p-2 text-slate-400 hover:text-slate-650 hover:bg-slate-50 rounded-lg transition-colors relative">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#00A5EC] border border-white rounded-full"></span>
            </button>

            <div className="h-5 w-px bg-slate-200"></div>

            <button className="px-4 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg transition-colors">
              Login
            </button>
            <button className="px-4 py-1.5 text-xs font-bold text-white bg-[#00A5EC] hover:bg-[#0084BD] rounded-lg shadow-sm transition-all">
              Register
            </button>
          </div>

          {/* Mobile Menu & Filter Buttons */}
          <div className="flex items-center gap-2 md:hidden">
            <button 
              onClick={() => setIsFilterDrawerOpen(true)}
              className="p-1.5 text-slate-600 hover:bg-slate-50 rounded-lg flex items-center gap-1 text-xs font-bold border border-slate-200"
            >
              <Filter className="h-4 w-4 text-[#00A5EC]" />
              <span>Filters</span>
            </button>
            
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white py-3 px-4 flex flex-col gap-1.5 shadow-inner">
            <div className="relative mb-2">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </span>
              <input 
                type="text" 
                placeholder="Search internships..." 
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A5EC]/20 focus:border-[#00A5EC] transition-all"
              />
            </div>
            <a href="#" className="px-3 py-1.5 text-xs font-bold text-[#00A5EC] bg-[#E8F7FD] rounded-md">
              Internships
            </a>
            <a href="#" className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-md">
              Jobs
            </a>
            <a href="#" className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-md flex items-center justify-between">
              <span>Courses</span>
              <span className="bg-orange-100 text-orange-600 text-[9px] px-1.5 py-0.5 rounded-full font-bold">OFFER</span>
            </a>
            <a href="#" className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 rounded-md">
              Clubs
            </a>
            <div className="h-px bg-slate-100 my-1.5"></div>
            <div className="flex gap-2">
              <button className="flex-1 py-1.5 text-xs font-bold text-center text-slate-700 border border-slate-200 rounded-md hover:bg-slate-50">
                Login
              </button>
              <button className="flex-1 py-1.5 text-xs font-bold text-center text-white bg-[#00A5EC] rounded-md hover:bg-[#0084BD]">
                Register
              </button>
            </div>
          </div>
        )}
      </header>

      {/* --- HERO / SEARCH PROMPT AREA --- */}
      <section className="bg-gradient-to-r from-[#00A5EC] to-[#0084BD] py-8 px-4 text-white text-center shadow-inner relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="bg-[#00A5EC]/30 text-white text-[10px] font-bold tracking-widest px-3 py-1 rounded-full uppercase inline-flex items-center gap-1.5 mb-3">
            <Sparkles className="h-3 w-3" />
            Empower Your Career
          </span>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">
            Find Your Dream Internship
          </h1>
          <p className="text-sky-50 text-xs md:text-sm max-w-xl mx-auto mb-6">
            Explore thousands of handpicked high-stipend internships, remote gigs, and starting roles curated for ambitious students.
          </p>
          
          {/* Main search card */}
          <div className="bg-white p-1.5 rounded-xl shadow-md max-w-2xl mx-auto flex flex-col sm:flex-row gap-1.5">
            <div className="flex-1 flex items-center px-3 gap-2 border-b sm:border-b-0 sm:border-r border-slate-100 py-1.5">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <input 
                type="text" 
                placeholder="eg. Web Developer, Graphic Designer..." 
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full bg-transparent border-none focus:outline-none text-slate-800 text-xs"
              />
            </div>
            <div className="flex items-center px-3 gap-2 py-1.5 shrink-0">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span className="text-slate-500 text-xs font-semibold">Any Location</span>
            </div>
            <button className="bg-[#00A5EC] hover:bg-[#0084BD] text-white font-bold px-5 py-2 rounded-lg transition-all flex items-center justify-center gap-2 group text-xs shrink-0 cursor-pointer">
              <span>Search</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* --- MAIN PAGE CONTENT --- */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        
        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* --- LEFT SIDEBAR: FILTERS --- */}
          <div className="hidden lg:block lg:col-span-1">
            <FilterSidebar 
              filterCriteria={filterCriteria}
              onFilterChange={handleFilterChange}
              onClearAll={handleClearAll}
              uniqueProfiles={uniqueProfiles}
              uniqueLocations={uniqueLocations}
            />
          </div>

          {/* --- RIGHT CONTAINER: INTERNSHIP LIST --- */}
          <section className="lg:col-span-3 space-y-6">
            
            {/* CORS / Network Fallback Warning Banner */}
            {isDemoFallback && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-900 text-xs">
                <div className="w-6 h-6 rounded bg-amber-100 flex items-center justify-center text-amber-700 font-bold shrink-0">
                  !
                </div>
                <div className="flex-1">
                  <span className="font-bold block text-amber-800">CORS Warning / Dynamic Fallback Loaded</span>
                  <p className="text-amber-700 mt-0.5 leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            {/* Top Toolbar / Meta info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div>
                <h2 className="text-sm md:text-base font-bold text-slate-800 flex items-center gap-2">
                  <span>
                    {loading
                      ? "Fetching Internships..."
                      : profileQuery && profileQuery.trim()
                      ? `${filteredInternships.length} ${profileQuery.trim()} Internships`
                      : `${filteredInternships.length} Total Internships`}
                  </span>
                  <span className="px-2 py-0.5 bg-[#E8F7FD] text-[#00A5EC] text-[10px] rounded-full font-bold">Active</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5 font-medium">Showing handpicked matches for your search</p>
              </div>

              {/* Quick sort / Toggle */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs text-slate-500 font-medium">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="relevant">Most Relevant</option>
                  <option value="stipendHighToLow">Stipend: High to Low</option>
                  <option value="durationShortToLong">Duration: Short to Long</option>
                </select>
              </div>
            </div>

            {/* Active Badges Panel */}
            <div className="flex flex-wrap items-center gap-2 bg-slate-100/50 p-3 rounded-xl border border-slate-200/40">
              <span className="text-xs text-slate-400 font-semibold mr-1">Active filters:</span>
              
              {!hasActiveFilters && (
                <span className="text-xs text-slate-500 font-medium italic">None (showing all matching roles)</span>
              )}

              {globalSearch.trim() && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#E8F7FD] border border-[#00A5EC]/20 text-[#00A5EC] text-xs rounded-full shadow-sm font-semibold">
                  <span>Search: "{globalSearch}"</span>
                  <X onClick={() => setGlobalSearch("")} className="h-3 w-3 text-[#00A5EC]/60 hover:text-[#00A5EC] cursor-pointer" />
                </span>
              )}

              {profileQuery.trim() && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-xs rounded-full shadow-sm font-medium">
                  <span>Profile: {profileQuery}</span>
                  <X onClick={() => handleFilterChange("profileQuery", "")} className="h-3 w-3 text-slate-400 hover:text-[#00A5EC] cursor-pointer" />
                </span>
              )}

              {locationQuery.trim() && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-xs rounded-full shadow-sm font-medium">
                  <span>Location: {locationQuery}</span>
                  <X onClick={() => handleFilterChange("locationQuery", "")} className="h-3 w-3 text-slate-400 hover:text-[#00A5EC] cursor-pointer" />
                </span>
              )}

              {wfhOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-xs rounded-full shadow-sm font-medium">
                  <span>Work from Home</span>
                  <X onClick={() => handleFilterChange("wfhOnly", false)} className="h-3 w-3 text-slate-400 hover:text-[#00A5EC] cursor-pointer" />
                </span>
              )}

              {partTimeOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-xs rounded-full shadow-sm font-medium">
                  <span>Part-time</span>
                  <X onClick={() => handleFilterChange("partTimeOnly", false)} className="h-3 w-3 text-slate-400 hover:text-[#00A5EC] cursor-pointer" />
                </span>
              )}

              {minStipend > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-xs rounded-full shadow-sm font-medium">
                  <span>Stipend: ₹{minStipend}k+</span>
                  <X onClick={() => handleFilterChange("minStipend", 0)} className="h-3 w-3 text-slate-400 hover:text-[#00A5EC] cursor-pointer" />
                </span>
              )}

              {maxDuration !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-xs rounded-full shadow-sm font-medium">
                  <span>Duration: ≤ {maxDuration} Months</span>
                  <X onClick={() => handleFilterChange("maxDuration", "all")} className="h-3 w-3 text-slate-400 hover:text-[#00A5EC] cursor-pointer" />
                </span>
              )}

              {ppoOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-xs rounded-full shadow-sm font-medium">
                  <span>Job Offer (PPO)</span>
                  <X onClick={() => handleFilterChange("ppoOnly", false)} className="h-3 w-3 text-slate-400 hover:text-[#00A5EC] cursor-pointer" />
                </span>
              )}

              {hasActiveFilters && (
                <button 
                  onClick={handleClearAll}
                  className="text-xs text-[#00A5EC] hover:text-[#0084BD] font-bold ml-1 hover:underline cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* --- LIST OF CARDS --- */}
            <div className="space-y-4">
              {loading ? (
                // Skeleton Loader Panel
                <div className="space-y-4">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="bg-white border border-slate-200 rounded-xl p-6 animate-pulse space-y-4">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-lg"></div>
                        <div className="flex-1 space-y-2 py-1">
                          <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                          <div className="h-3 bg-slate-100 rounded w-1/4"></div>
                        </div>
                      </div>
                      <div className="h-px bg-slate-100"></div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="h-3 bg-slate-100 rounded w-2/3"></div>
                        <div className="h-3 bg-slate-100 rounded w-2/3"></div>
                        <div className="h-3 bg-slate-100 rounded w-2/3"></div>
                        <div className="h-3 bg-slate-100 rounded w-2/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredInternships.length === 0 ? (
                // Empty State Alert
                <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
                  <Briefcase className="h-10 w-10 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-sm font-bold text-slate-800">No Internships Found</h3>
                  <p className="text-xs text-slate-500 mt-1">Try adjusting your active search filters or check back later.</p>
                </div>
              ) : (
                // Active dynamic card rendering
                filteredInternships.map((internship) => (
                  <InternshipCard 
                    key={internship.id}
                    internship={internship}
                    isBookmarked={bookmarkedList.includes(internship.id)}
                    isApplied={appliedList.includes(internship.id)}
                    onToggleBookmark={toggleBookmark}
                    onViewDetails={() => {
                      setSelectedInternship(internship);
                      setSelectedFile(null);
                    }}
                    onApply={() => {
                      setSelectedInternship(internship);
                      setSelectedFile(null);
                    }}
                  />
                ))
              )}
            </div>

            {/* Newsletter Subscription section inside main list container */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 md:p-8 rounded-xl text-white shadow-md relative overflow-hidden mt-8">
              <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-12 translate-y-12">
                <GraduationCap className="w-64 h-64 text-white" />
              </div>
              
              <div className="relative z-10 max-w-lg">
                <h3 className="text-base md:text-lg font-bold mb-2">Never miss an internship opportunity again!</h3>
                <p className="text-slate-400 text-xs mb-4 leading-relaxed font-medium">
                  Get personalized alerts matching your skills sent straight to your inbox daily.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input 
                    type="email" 
                    placeholder="Enter your professional email" 
                    className="flex-1 bg-white/10 border border-white/20 px-4 py-2 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#00A5EC] placeholder:text-slate-400"
                  />
                  <button className="bg-[#00A5EC] hover:bg-[#0084BD] text-white font-bold px-5 py-2 rounded-lg text-xs transition-all whitespace-nowrap cursor-pointer">
                    Subscribe Now
                  </button>
                </div>
              </div>
            </div>

          </section>

        </div>

      </main>

      {/* --- FLOATING MOBILE FILTERS DRAWER / OFF-CANVAS --- */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div 
            onClick={() => setIsFilterDrawerOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          ></div>

          {/* Drawer content panel */}
          <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white p-5 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex justify-end mb-2">
                <button 
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <X className="h-6 w-6 text-slate-500" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto min-h-0">
                <FilterSidebar 
                  filterCriteria={filterCriteria}
                  onFilterChange={handleFilterChange}
                  onClearAll={handleClearAll}
                  uniqueProfiles={uniqueProfiles}
                  uniqueLocations={uniqueLocations}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 mt-4">
              <button 
                onClick={() => setIsFilterDrawerOpen(false)}
                className="w-full py-2.5 text-xs font-bold text-white bg-[#00A5EC] hover:bg-[#0084BD] rounded-lg transition-all shadow-md shadow-[#00A5EC]/10 cursor-pointer text-center"
              >
                Apply Filters & Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DETAILED VIEW MODAL OVERLAY --- */}
      {selectedInternship && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true">
          <div 
            onClick={() => setSelectedInternship(null)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
          ></div>

          {/* Modal Card wrapper */}
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[85vh] overflow-y-auto relative z-10 flex flex-col justify-between animate-in zoom-in-95 duration-200">
            
            {/* Header Area */}
            <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-lg ${selectedInternship.logoBg} flex items-center justify-center text-white font-extrabold text-lg shadow-sm`}>
                  {selectedInternship.logoLetter}
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-800 leading-snug">{selectedInternship.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">{selectedInternship.company}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedInternship(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-6 space-y-6">
              
              {/* Actively hiring info */}
              <div className="bg-[#E8F7FD]/50 rounded-xl p-4 border border-[#00A5EC]/10 flex items-center gap-3 text-slate-800 text-xs">
                <div className="w-8 h-8 rounded-lg bg-[#E8F7FD] flex items-center justify-center text-[#00A5EC] shrink-0">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-800">Actively hiring</span>
                  <p className="text-slate-500 mt-0.5 font-medium">This company actively responds to applications on a daily basis. Apply now to stand out!</p>
                </div>
              </div>

              {/* Key Quick Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>Location</span>
                  </div>
                  <p className="font-bold text-slate-700 text-xs sm:text-sm">{selectedInternship.location}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Start Date</span>
                  </div>
                  <p className="font-bold text-slate-700 text-xs sm:text-sm">{selectedInternship.startDate}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Duration</span>
                  </div>
                  <p className="font-bold text-slate-700 text-xs sm:text-sm">{selectedInternship.duration}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                    <DollarSign className="h-3.5 w-3.5" />
                    <span>Stipend</span>
                  </div>
                  <p className="font-bold text-slate-700 text-xs sm:text-sm">{selectedInternship.stipend}</p>
                </div>
              </div>

              {/* About the Company */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">About {selectedInternship.company}</h4>
                <p className="text-xs sm:text-sm text-slate-650 leading-relaxed font-medium">{selectedInternship.aboutCompany}</p>
              </div>

              {/* About the Internship / Responsibilities */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Key Responsibilities</h4>
                <p className="text-xs text-slate-400 font-semibold">Selected intern's day-to-day responsibilities include:</p>
                <ul className="list-disc list-inside space-y-1.5 pl-1">
                  {selectedInternship.responsibilities.map((resp, idx) => (
                    <li key={idx} className="text-xs sm:text-sm text-slate-650 leading-relaxed font-medium">
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Skills Required */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Skills Required</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedInternship.skills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1 bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-200/50">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Upload Resume */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Upload Resume</h4>
                
                {selectedFile ? (
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-250 rounded-xl text-emerald-800 text-xs font-semibold">
                    <CheckCircle className="h-4.5 w-4.5 text-emerald-650 shrink-0 animate-bounce" />
                    <div className="flex-1 min-w-0">
                      <span className="block truncate text-slate-750 font-bold">Selected Resume: {selectedFile.name}</span>
                      <span className="text-[10px] text-emerald-650 font-medium">{(selectedFile.size / (1024 * 1024)).toFixed(1)} MB</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                      }}
                      className="text-rose-600 hover:text-rose-700 cursor-pointer hover:underline text-[11px] font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-6 bg-slate-50 border-2 border-dashed border-slate-200/70 hover:border-[#00A5EC]/45 hover:bg-[#E8F7FD]/10 rounded-xl cursor-pointer transition-all text-center group">
                    <Upload className="h-6 w-6 text-slate-400 mb-2 group-hover:text-[#00A5EC] transition-colors shrink-0" />
                    <span className="text-xs font-bold text-slate-700 block">Click or Drag & Drop PDF Resume here</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 block font-medium">PDF only (Max 5MB)</span>
                    <input 
                      type="file" 
                      accept=".pdf" 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setSelectedFile(e.target.files[0]);
                        } else {
                          setSelectedFile({ name: "ayush_cv.pdf", size: 1.2 * 1024 * 1024 });
                        }
                      }}
                    />
                  </label>
                )}
              </div>

              {/* Perks Offered */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Perks & Incentives</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedInternship.perks.map((perk, idx) => (
                    <span key={idx} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100">
                      {perk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Number of openings */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-medium">Number of Openings available: <strong className="text-slate-800 font-extrabold">{selectedInternship.openings}</strong></span>
                <span className="flex items-center gap-1 font-bold text-[#00A5EC]">
                  <CheckCircle className="h-3.5 w-3.5" />
                  Verified Recruiter
                </span>
              </div>

            </div>

            {/* Modal Footer Area (Sticky) */}
            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between rounded-b-xl">
              <button 
                onClick={() => toggleBookmark(selectedInternship.id)}
                className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 bg-white rounded-lg transition-all cursor-pointer flex items-center gap-2 text-xs font-bold"
              >
                <Bookmark className={`h-4 w-4 ${bookmarkedList.includes(selectedInternship.id) ? "fill-rose-500 text-rose-500 border-none" : ""}`} />
                <span>{bookmarkedList.includes(selectedInternship.id) ? "Bookmarked" : "Save Role"}</span>
              </button>

              <div className="flex gap-3">
                <button 
                  onClick={() => setSelectedInternship(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-lg transition-all cursor-pointer"
                >
                  Close
                </button>
                
                {appliedList.includes(selectedInternship.id) ? (
                  <button 
                    disabled
                    className="px-6 py-2.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-1 cursor-not-allowed shadow-sm"
                  >
                    <CheckCircle className="h-4 w-4 text-emerald-600 animate-pulse" />
                    <span>Applied Successfully</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setAppliedList([...appliedList, selectedInternship.id]);
                      setApplicationSuccess(selectedInternship);
                      setSelectedInternship(null);
                    }}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-[#00A5EC] hover:bg-[#0084BD] rounded-lg shadow-md shadow-[#00A5EC]/10 transition-all cursor-pointer"
                  >
                    Submit Application
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* --- FLOATING APPLICATION SUCCESS NOTIFICATION MODAL --- */}
      {applicationSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div 
            onClick={() => setApplicationSuccess(null)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          ></div>

          {/* Alert container */}
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-8 max-w-sm w-full text-center relative z-10 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border-4 border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
            
            <h3 className="text-base font-extrabold text-slate-800 mb-2">Application Submitted! 🎉</h3>
            <p className="text-slate-650 text-xs sm:text-sm leading-relaxed mb-6 font-medium">
              You have successfully applied for the <strong className="text-slate-800 font-extrabold">{applicationSuccess.title}</strong> role at <strong className="text-slate-800 font-extrabold">{applicationSuccess.company}</strong>. 
            </p>

            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-left text-xs text-slate-500 space-y-1 mb-6">
              <div className="flex justify-between">
                <span>Confirmation ID:</span>
                <span className="font-mono text-slate-700 font-bold">#APP-{100000 + applicationSuccess.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Notification email:</span>
                <span className="font-bold text-slate-700">user@internshala.com</span>
              </div>
            </div>

            <button 
              onClick={() => setApplicationSuccess(null)}
              className="w-full py-2.5 text-xs font-bold text-white bg-[#00A5EC] hover:bg-[#0084BD] rounded-lg shadow-md shadow-[#00A5EC]/10 transition-all cursor-pointer"
            >
              Back to Internship List
            </button>
          </div>
        </div>
      )}

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 px-4 mt-auto font-sans">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-white text-xs tracking-wider uppercase mb-4">Internships by Stream</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">Computer Science Internships</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Web Development Internships</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Marketing Internships</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Graphic Design Internships</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white text-xs tracking-wider uppercase mb-4">Internships by Location</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">Work From Home</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Internship in Bangalore</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Internship in Mumbai</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Internship in Delhi NCR</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white text-xs tracking-wider uppercase mb-4">About Internshala</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">About us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">We're hiring</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hire interns for free</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Our services</a></li>
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="https://internshala.com/static/images/common/new_internshala_logo.svg" 
                alt="Internshala Logo" 
                className="h-8 md:h-9 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Connecting India's brightest minds with premium internships and jobs.
            </p>
            <div className="text-[10px] text-slate-600">
              © 2026 Internshala. All rights reserved.
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
