# Internshala Internship Search Portal Clone

A high-fidelity, pixel-perfect frontend replication of the official Internshala Internship Search Page (https://internshala.com/internships/). 

This project was built from scratch as a frontend engineering assessment utilizing React, Vite, and Tailwind CSS. It is fully optimized for speed, responsive across all screen sizes, and replicates the standard "Flight" design system used by Internshala.

---

## Key Features

### 1. Live Data Fetching & Sync
* Integrates directly with the official public Internshala search endpoint: https://internshala.com/hiring/search.
* Implements a robust state hydration pipeline that fetches the list of internships instantly upon page mount.
* Includes a built-in persistent fallback data handler to guarantee seamless rendering and UI stability even in offline mode or during API downtime.

### 2. High-Performance Client-Side Filtering
* **Instant Filtering (Zero-Latency)**: All filter queries are evaluated strictly in the client-side frontend. Once hydrated, filtering performs without making subsequent, unnecessary API requests, ensuring instant UI state transitions.
* **Unified State Controller**: Centrally manages multi-attribute filter criteria including:
  * **Profile / Domain** (Dynamic case-insensitive substring search).
  * **Location** (Substring search + specific checkboxes for Work from Home and Part-time).
  * **Desired Minimum Stipend** (Interactive range slider yielding live updates for stipend bands).
  * **Max Duration** (Select dropdown constraint for 1, 3, or 6 months).
  * **Job Offer / PPO** (Pre-Placement Offer tags toggle).
* **Reset Handler**: Includes a global "Clear all" filter trigger to instantly restore the full active collection of internships.

### 3. Pixel-Perfect Visual Fidelity & Polish
* **High-Impact Branding**: Integrated the official transparent SVG Internshala logo in the top navbar and dark theme footer. 
* **Refined Typography**: Employs elegant Google Fonts (Inter/sans-serif) mapped to strict font hierarchies. 
  * Metadata labels (START DATE, DURATION, etc.) are styled in a muted gray (11px weight:500).
  * Actual metadata values are styled in a solid slate gray (14px weight:500).
* **Interactive Accents**:
  * Clean lucide-react vector icons (Calendar, Clock, Wallet) are embedded in metadata parameters.
  * Internship cards feature a clean 1px border-slate-200/70 with a subtle shadow-sm that dynamically lights up with a subtle brand blue border (hover:border-[#00A5EC]/30 hover:shadow-md) upon cursor hover.
* **Compact Sidebar Controls**: Designed filter sections with a sharp, professional portal look utilizing precise 1px border-[#e0e0e0].

---

## Tech Stack & Dependencies

* **Core Framework**: React (v18+) - Component-driven UI rendering.
* **Build System**: Vite - Ultra-fast development and build bundling.
* **Styling**: Tailwind CSS - High-efficiency utility classes.
* **Icon Sets**: lucide-react - Crisp SVG vector icons.

---

## 📂 Modular Architecture & Best Practices

The codebase is organized into cleanly decoupled, highly reusable, and modular React components following industry best practices:

```text
src/
├── components/
│   ├── FilterSidebar.jsx   # Compact filters, bound states, range controllers
│   └── InternshipCard.jsx  # Card metadata grids, action buttons, vector icons
├── App.jsx                 # Global state controller, API fetch, client filtering
├── main.jsx                # DOM bootstrapping and React mounting context
├── index.css               # Core design system tokens and Tailwind bindings
└── App.css                 # Custom scrollbar rules & responsive container utilities