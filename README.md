# ADmyBRAND Insights - Analytics Dashboard

A modern, fully-featured analytics dashboard for digital marketing agencies built with Next.js 15, TypeScript, and Tailwind CSS. Complete with advanced data visualization, filtering, sorting, and export capabilities.

## 🚀 Features

### 📊 Dashboard Features
- **Overview Page** with key metrics cards (Revenue, Users, Conversions, Growth %)
- **Interactive Charts** - Line charts, bar charts, and pie/donut charts with responsive design
- **Monthly Performance Bar Chart** - Visual representation of campaign performance over time
- **Advanced Data Table** with full CRUD-like functionality
- **Real-time Data Updates** with simulated API calls
- **Responsive Design** - Perfect on desktop, tablet, and mobile devices

### 🔍 Advanced Data Table Features
- **Multi-Column Sorting** with visual Lucide React icons (ascending/descending indicators)
- **Advanced Filtering System**:
  - Status filtering (Active, Paused, Completed)
  - Spend range filtering (Min/Max with proper validation)
  - Real-time search across campaigns and status
- **Data Export Capabilities**:
  - CSV export with properly formatted data
  - PDF export via browser print dialog with professional styling
  - Summary statistics included in PDF reports
- **Pagination** with full navigation controls
- **Loading States** with skeleton animations

### 🎨 UI/UX Features
- **Modern Design System** with consistent colors, typography, and spacing
- **Beautiful Visual Hierarchy** with clear information architecture
- **Smooth Animations** with micro-interactions and hover effects
- **Loading Skeletons** for better user experience during data fetching
- **Mobile-First Responsive Design** with touch-friendly interactions
- **Professional Icons** using Lucide React (no emojis)
- **Click-Outside Handlers** for dropdown menus and modals

### ⚡ Technical Features
- **Next.js 15** with App Router and TypeScript
- **Tailwind CSS** with custom responsive design system
- **Recharts** for interactive data visualization
- **Zustand** for lightweight state management
- **Lucide React** for consistent iconography
- **Fully TypeScript** with proper type safety
- **ESLint & Prettier** configured for code quality

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (100% type-safe)
- **Styling**: Tailwind CSS with custom responsive utilities
- **Charts**: Recharts for interactive data visualization
- **State Management**: Zustand for lightweight global state
- **Icons**: Lucide React for consistent iconography
- **UI Components**: Custom components with shadcn/ui patterns
- **Development**: ESLint, Prettier, and TypeScript strict mode

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd admybrand-insights
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

5. Build for production:
```bash
npm run build
npm start
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with theme provider
│   ├── page.tsx           # Main dashboard page
│   └── globals.css        # Global styles and design system
├── components/            # Reusable components
│   ├── ui/               # Base UI components (Button, Card, etc.)
│   ├── layout/           # Layout components (Header, Sidebar)
│   ├── dashboard/        # Dashboard-specific components
│   │   ├── data-table.tsx    # Advanced data table with sorting/filtering
│   │   ├── chart-widget.tsx  # Reusable chart component
│   │   ├── overview-stats.tsx # Metrics cards component
│   │   └── metric-card.tsx   # Individual metric card
│   └── common/           # Common components (Loading, Theme, etc.)
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and configurations
│   ├── utils.ts          # Helper functions (formatting, validation)
│   ├── types.ts          # TypeScript interfaces and types
│   ├── constants.ts      # Application constants
│   └── mock-data.ts      # Mock data for development
├── store/                # State management
│   ├── theme-store.ts    # Theme state management
│   └── analytics-store.ts # Analytics data management
└── styles/               # Additional styling
```

## 🎨 Design System

### Colors
- **Primary**: Indigo (#6366f1)
- **Secondary**: Violet (#8b5cf6)
- **Accent**: Cyan (#06b6d4)
- **Success**: Emerald (#10b981)
- **Warning**: Amber (#f59e0b)
- **Error**: Red (#ef4444)

### Typography
- **Font**: Geist Sans (Primary), Geist Mono (Code)
- **Scale**: xs, sm, base, lg, xl, 2xl, 3xl, 4xl

### Spacing
- **Grid System**: 8px base unit
- **Spacing Scale**: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

## 📊 Data Structure

### Metrics
```typescript
interface MetricCard {
  id: string;
  title: string;
  value: number;
  change: number;
  changeType: "positive" | "negative" | "neutral";
  format: "currency" | "number" | "percentage";
  icon: string;
}
```

### Table Data
```typescript
interface TableRow {
  id: string;
  campaign: string;
  clicks: number;
  impressions: number;
  ctr: number;
  cpc: number;
  spend: number;
  conversions: number;
  revenue: number;
  roas: number;
  status: "active" | "paused" | "completed";
  date: string;
}
```

### Charts
```typescript
interface TimeSeriesData {
  date: string;
  value: number;
}

interface CategoryData {
  name: string;
  value: number;
  color: string;
}
```

### Filtering & Pagination
```typescript
interface FilterState {
  status: string;
  dateRange: string;
  minSpend: string;
  maxSpend: string;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with optimizations
- `npm run start` - Start production server
- `npm run lint` - Run ESLint with Next.js configuration
- `npm run type-check` - Run TypeScript compiler check
- `npm run format` - Format code with Prettier

### Key Features Implemented

#### Advanced Data Table
- **Sorting**: Click column headers to sort data with visual indicators
- **Filtering**: 
  - Status dropdown (All, Active, Paused, Completed)
  - Spend range inputs (Min/Max with validation)
  - Real-time search across campaign names and status
- **Export**: 
  - CSV download with proper formatting
  - PDF export via print dialog with summary statistics
- **Pagination**: Navigate through data sets with page controls

#### Responsive Design
- **Mobile Navigation**: Hamburger menu with slide-out sidebar
- **Touch-Friendly**: Optimized button sizes and spacing for mobile
- **Breakpoint System**: Mobile (< 768px), Tablet (768-1024px), Desktop (> 1024px)

#### Charts & Visualization
- **Line Charts**: Revenue and user growth trends
- **Pie Charts**: Conversion sources and demographics
- **Bar Chart**: Monthly campaign performance
- **Responsive**: Charts adapt to screen size with proper scaling

### Adding New Features

#### Adding New Chart Types
1. Update `ChartWidget` component in `src/components/dashboard/chart-widget.tsx`
2. Add chart type to type definitions
3. Update mock data generator

#### Adding New Filters
1. Update `FilterState` interface in data table component
2. Add filter UI elements in the filter panel
3. Implement filter logic in `filteredData` useMemo hook

#### Adding New Export Formats
1. Create new export function (e.g., `exportToExcel`)
2. Add button to export dropdown menu
3. Handle format selection in `handleExport` function

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Deploy automatically on push to main branch

### Other Platforms
1. Build the project: `npm run build`
2. Start the production server: `npm run start`

## 📱 Responsive Design

The dashboard is fully responsive with a mobile-first approach:

### Breakpoints
- **Mobile**: < 768px (Stack layouts, hamburger menu, touch-optimized)
- **Tablet**: 768px - 1024px (Condensed layouts, sidebar collapse)
- **Desktop**: > 1024px (Full layouts, persistent sidebar)

### Mobile Optimizations
- **Navigation**: Hamburger menu with slide-out sidebar
- **Data Table**: Horizontal scroll with optimized column widths
- **Charts**: Responsive containers with adjusted dimensions
- **Touch Targets**: Minimum 44px tap targets for accessibility
- **Typography**: Responsive text sizing with proper contrast ratios

## 🎯 Performance Features

- **Code Splitting** with Next.js App Router automatic optimization
- **Bundle Optimization** with tree shaking and dead code elimination
- **Static Generation** for optimal loading performance
- **Image Optimization** ready for future image assets
- **Lazy Loading** for off-screen components
- **Efficient Re-renders** with proper React memoization
- **TypeScript Strict Mode** for compile-time error detection

## ✨ Implemented Features Showcase

### ✅ Completed Features
- **Responsive Dashboard** with overview metrics
-   **Interactive Charts** (Line, Bar, Pie) with Recharts
-   **Advanced Data Table** with sorting, filtering, and search
-   **Export Functionality** (CSV and PDF with professional styling)
-   **Mobile-First Design** with touch-optimized interactions
-   **TypeScript Integration** with full type safety
-   **State Management** with Zustand
-   **Modern Icons** using Lucide React (no emojis)
-   **Professional Styling** with Tailwind CSS
-   **Error Handling** and loading states
-   **Accessibility** considerations with proper ARIA labels

### 🚀 Key Highlights
- **Zero Compilation Errors**: Clean build with no ESLint warnings
- **Hydration-Safe**: No server/client mismatches
- **Production Ready**: Optimized build with proper error boundaries
- **Developer Experience**: Hot reload, TypeScript intellisense, and clean code structure

## 🔮 Future Enhancements

### Potential Additions
- [ ] **Real-time WebSocket Integration** for live data updates
- [ ] **User Authentication** with role-based access control
- [ ] **Campaign Management** with CRUD operations
- [ ] **Advanced Analytics Features** (cohort analysis, funnel tracking)
- [ ] **Data Persistence** with database integration
- [ ] **API Integration** with real marketing platforms
- [ ] **Multi-tenant Support** for agency management
- [ ] **Custom Dashboard Builder** with drag-and-drop widgets
- [ ] **Advanced Filtering** with date ranges and custom queries
- [ ] **Notification System** for alerts and updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with proper TypeScript types
4. Ensure all tests pass and no ESLint errors
5. Add tests if applicable
6. Commit your changes (`git commit -m 'Add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Submit a pull request with detailed description

### Development Guidelines
- Follow the existing code style and TypeScript patterns
- Ensure responsive design for all screen sizes
- Use Lucide React icons for consistency
- Add proper error handling and loading states
- Update README if adding new features

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the powerful React framework with App Router
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Recharts](https://recharts.org/) for the beautiful and responsive charting library
- [Lucide](https://lucide.dev/) for the comprehensive icon library
- [Zustand](https://github.com/pmndrs/zustand) for lightweight state management
- [TypeScript](https://www.typescriptlang.org/) for type safety and developer experience
- [Vercel](https://vercel.com/) for seamless deployment and hosting

## 🏆 Project Status

**Status**: ✅ Production Ready  
**Build Status**: ✅ Passing  
**Type Safety**: ✅ 100% TypeScript  
**Responsive**: ✅ Mobile, Tablet, Desktop  
**Accessibility**: ✅ WCAG Guidelines Followed  

---

Built with ❤️ for modern analytics dashboards by **Vidita Singh**

*A comprehensive, production-ready analytics dashboard showcasing modern web development practices with Next.js, TypeScript, and advanced data visualization capabilities.*
