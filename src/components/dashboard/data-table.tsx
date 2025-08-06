import React, { useState, useMemo, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Download, Filter, Search, X, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { TableRow, PaginationInfo } from "@/lib/types";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/utils";

interface Column {
  key: keyof TableRow;
  header: string;
  sortable?: boolean;
  render?: (value: string | number) => React.ReactNode;
}

interface DataTableProps {
  data: TableRow[];
  pagination: PaginationInfo;
  onPageChange?: (page: number) => void;
  onSort?: (key: keyof TableRow) => void;
  loading?: boolean;
  className?: string;
}

interface FilterState {
  status: string;
  dateRange: string;
  minSpend: string;
  maxSpend: string;
}

const DataTable: React.FC<DataTableProps> = ({
  data,
  pagination,
  onPageChange,
  onSort,
  loading = false,
  className,
}) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof TableRow; direction: "asc" | "desc" } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: "all",
    dateRange: "all",
    minSpend: "",
    maxSpend: "",
  });
  
  const exportMenuRef = useRef<HTMLDivElement>(null);

  // Close export menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setShowExportMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const columns: Column[] = [
    { key: "campaign", header: "Campaign", sortable: true },
    { key: "clicks", header: "Clicks", sortable: true, render: (value: string | number) => formatNumber(Number(value)) },
    { key: "impressions", header: "Impressions", sortable: true, render: (value: string | number) => formatNumber(Number(value)) },
    { key: "ctr", header: "CTR", sortable: true, render: (value: string | number) => formatPercentage(Number(value)) },
    { key: "cpc", header: "CPC", sortable: true, render: (value: string | number) => formatCurrency(Number(value)) },
    { key: "spend", header: "Spend", sortable: true, render: (value: string | number) => formatCurrency(Number(value)) },
    { key: "conversions", header: "Conversions", sortable: true, render: (value: string | number) => formatNumber(Number(value)) },
    { key: "revenue", header: "Revenue", sortable: true, render: (value: string | number) => formatCurrency(Number(value)) },
    { key: "roas", header: "ROAS", sortable: true, render: (value: string | number) => `${Number(value).toFixed(2)}x` },
    { 
      key: "status", 
      header: "Status", 
      sortable: true,
      render: (value: string | number) => (
        <span className={cn(
          "px-2 py-1 rounded-full text-xs font-medium",
          value === "active" && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
          value === "paused" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
          value === "completed" && "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
        )}>
          {String(value)}
        </span>
      )
    },
  ];

  const filteredData = useMemo(() => {
    let filtered = data;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(row => 
        row.campaign.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status !== "all") {
      filtered = filtered.filter(row => row.status === filters.status);
    }

    // Apply spend range filter
    if (filters.minSpend !== "" || filters.maxSpend !== "") {
      filtered = filtered.filter(row => {
        const spend = row.spend;
        const min = filters.minSpend !== "" ? parseFloat(filters.minSpend) : 0;
        const max = filters.maxSpend !== "" ? parseFloat(filters.maxSpend) : Infinity;
        return spend >= min && spend <= max;
      });
    }

    return filtered;
  }, [data, searchTerm, filters]);

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === "asc" 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === "asc" 
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });

    return sorted;
  }, [filteredData, sortConfig]);

  const handleSort = (key: keyof TableRow) => {
    const direction = sortConfig?.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
    onSort?.(key);
  };

  const handleFilterChange = (filterKey: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [filterKey]: value }));
  };

  const clearFilters = () => {
    setFilters({
      status: "all",
      dateRange: "all",
      minSpend: "",
      maxSpend: "",
    });
    setSearchTerm("");
  };

  const exportToCSV = () => {
    const headers = columns.map(col => col.header);
    const csvData = sortedData.map(row => 
      columns.map(col => {
        const value = row[col.key];
        // Handle special formatting for CSV
        if (col.key === 'spend' || col.key === 'revenue' || col.key === 'cpc') {
          return typeof value === 'number' ? value.toFixed(2) : value;
        }
        if (col.key === 'ctr') {
          return typeof value === 'number' ? (value * 100).toFixed(2) + '%' : value;
        }
        if (col.key === 'roas') {
          return typeof value === 'number' ? value.toFixed(2) + 'x' : value;
        }
        return value;
      })
    );

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `campaign-performance-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    // Create a printable window with proper PDF styling
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups to export PDF');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Campaign Performance Report</title>
        <meta charset="utf-8">
        <style>
          @media print {
            @page {
              margin: 0.5in;
              size: A4 landscape;
            }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
          
          body { 
            font-family: 'Arial', sans-serif; 
            margin: 0; 
            padding: 20px;
            color: #333;
            line-height: 1.4;
          }
          
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #ddd;
            padding-bottom: 20px;
          }
          
          h1 { 
            color: #2563eb; 
            margin: 0 0 10px 0;
            font-size: 24px;
            font-weight: bold;
          }
          
          .meta-info {
            display: flex;
            justify-content: space-between;
            margin: 15px 0;
            font-size: 14px;
            color: #666;
          }
          
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 20px;
            font-size: 11px;
          }
          
          th, td { 
            border: 1px solid #ddd; 
            padding: 8px 6px; 
            text-align: left;
            white-space: nowrap;
          }
          
          th { 
            background-color: #f8fafc; 
            font-weight: bold;
            color: #374151;
            border-bottom: 2px solid #ddd;
          }
          
          tr:nth-child(even) { 
            background-color: #f9fafb; 
          }
          
          tr:hover {
            background-color: #f3f4f6;
          }
          
          .status-active { 
            color: #059669; 
            font-weight: 600;
            background-color: #d1fae5;
            padding: 2px 6px;
            border-radius: 12px;
            font-size: 10px;
          }
          
          .status-paused { 
            color: #d97706; 
            font-weight: 600;
            background-color: #fef3c7;
            padding: 2px 6px;
            border-radius: 12px;
            font-size: 10px;
          }
          
          .status-completed { 
            color: #6b7280; 
            font-weight: 600;
            background-color: #f3f4f6;
            padding: 2px 6px;
            border-radius: 12px;
            font-size: 10px;
          }
          
          .currency {
            text-align: right;
            font-weight: 500;
          }
          
          .number {
            text-align: right;
            font-weight: 500;
          }
          
          .percentage {
            text-align: right;
            color: #059669;
            font-weight: 500;
          }
          
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 12px;
            color: #6b7280;
          }
          
          .summary {
            background-color: #f8fafc;
            padding: 15px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #2563eb;
          }
          
          .summary h3 {
            margin: 0 0 10px 0;
            color: #1f2937;
            font-size: 16px;
          }
          
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            font-size: 12px;
          }
          
          .summary-item {
            text-align: center;
          }
          
          .summary-label {
            color: #6b7280;
            font-size: 11px;
          }
          
          .summary-value {
            font-weight: bold;
            color: #1f2937;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Campaign Performance Report</h1>
          <div class="meta-info">
            <span><strong>Generated:</strong> ${new Date().toLocaleString()}</span>
            <span><strong>Total Campaigns:</strong> ${sortedData.length}</span>
          </div>
        </div>

        <div class="summary">
          <h3>Summary Statistics</h3>
          <div class="summary-grid">
            <div class="summary-item">
              <div class="summary-label">Total Spend</div>
              <div class="summary-value">$${sortedData.reduce((sum, row) => sum + (row.spend || 0), 0).toLocaleString()}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Total Revenue</div>
              <div class="summary-value">$${sortedData.reduce((sum, row) => sum + (row.revenue || 0), 0).toLocaleString()}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Total Clicks</div>
              <div class="summary-value">${sortedData.reduce((sum, row) => sum + (row.clicks || 0), 0).toLocaleString()}</div>
            </div>
            <div class="summary-item">
              <div class="summary-label">Avg ROAS</div>
              <div class="summary-value">${(sortedData.reduce((sum, row) => sum + (row.roas || 0), 0) / sortedData.length).toFixed(2)}x</div>
            </div>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              ${columns.map(col => `<th>${col.header}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${sortedData.map(row => `
              <tr>
                ${columns.map(col => {
                  const value = row[col.key];
                  let cellClass = '';
                  let cellContent = '';
                  
                  if (col.key === 'status') {
                    cellClass = `status-${value}`;
                    cellContent = `<span class="${cellClass}">${value}</span>`;
                  } else if (col.key === 'spend' || col.key === 'revenue') {
                    cellContent = `<span class="currency">$${typeof value === 'number' ? value.toLocaleString() : value}</span>`;
                  } else if (col.key === 'cpc') {
                    cellContent = `<span class="currency">$${typeof value === 'number' ? value.toFixed(2) : value}</span>`;
                  } else if (col.key === 'ctr') {
                    cellContent = `<span class="percentage">${typeof value === 'number' ? (value * 100).toFixed(1) + '%' : value}</span>`;
                  } else if (col.key === 'roas') {
                    cellContent = `<span class="percentage">${typeof value === 'number' ? value.toFixed(2) + 'x' : value}</span>`;
                  } else if (col.key === 'clicks' || col.key === 'impressions' || col.key === 'conversions') {
                    cellContent = `<span class="number">${typeof value === 'number' ? value.toLocaleString() : value}</span>`;
                  } else {
                    cellContent = String(value);
                  }
                  
                  return `<td>${cellContent}</td>`;
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p><strong>ADmyBRAND Analytics Dashboard</strong> • Campaign Performance Report</p>
          <p>This report contains ${sortedData.length} campaigns with data as of ${new Date().toLocaleDateString()}</p>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 100);
            }, 500);
          };
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handleExport = (format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      exportToCSV();
    } else {
      exportToPDF();
    }
  };

  const totalPages = Math.ceil(pagination.totalItems / pagination.itemsPerPage);

  return (
    <Card className={cn("card-hover w-full", className)}>
      <CardHeader className="pb-4">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <CardTitle className="text-lg sm:text-xl font-semibold">Campaign Performance</CardTitle>
          <div className="flex items-center justify-end space-x-2">
            <div className="relative" ref={exportMenuRef}>
              <Button variant="outline" size="sm" onClick={() => setShowExportMenu(!showExportMenu)} className="w-full sm:w-auto">
                <Download className="h-4 w-4 mr-2" />
                <span>Export</span>
              </Button>
              {showExportMenu && (
                <div className="absolute right-0 top-10 z-50 bg-background border border-border rounded-md shadow-lg p-2 min-w-[140px] sm:min-w-[120px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm"
                    onClick={() => {
                      handleExport('csv');
                      setShowExportMenu(false);
                    }}
                  >
                    Export CSV
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm"
                    onClick={() => {
                      handleExport('pdf');
                      setShowExportMenu(false);
                    }}
                  >
                    Print/PDF
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1 max-w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-center justify-between sm:justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="flex-1 sm:flex-none">
              <Filter className="h-4 w-4 mr-2" />
              <span>Filters</span>
              {(filters.status !== "all" || filters.minSpend !== "" || filters.maxSpend !== "") && (
                <span className="ml-2 h-2 w-2 bg-primary rounded-full flex-shrink-0"></span>
              )}
            </Button>
            
            {/* Mobile stats summary */}
            <div className="block sm:hidden text-xs text-muted-foreground bg-muted px-3 py-2 rounded-md">
              {sortedData.length}/{data.length}
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="border-t border-border pt-4 space-y-4 bg-muted/20 p-4 rounded-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground block">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full p-3 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground block">Min Spend ($)</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minSpend}
                  onChange={(e) => handleFilterChange('minSpend', e.target.value)}
                  className="w-full p-3 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground block">Max Spend ($)</label>
                <input
                  type="number"
                  placeholder="No limit"
                  value={filters.maxSpend}
                  onChange={(e) => handleFilterChange('maxSpend', e.target.value)}
                  className="w-full p-3 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div className="flex items-end space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="w-full h-11"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs text-muted-foreground bg-background px-3 py-2 rounded border">
              <span>Results: {sortedData.length} of {data.length} campaigns</span>
              {sortedData.length !== data.length && (
                <span className="text-primary font-medium">Filtered</span>
              )}
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {/* Mobile Card View - Hidden on larger screens */}
        <div className="block lg:hidden">
          {loading ? (
            <div className="space-y-4 p-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="border border-border rounded-lg p-4 space-y-3 animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 p-4">
              {sortedData.map((row, rowIndex) => (
                <div key={rowIndex} className="border border-border rounded-lg p-4 space-y-3 hover:bg-muted/30 transition-colors">
                  {/* Campaign Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm sm:text-base truncate">{row.campaign}</h3>
                      <div className="mt-1">
                        <span className={cn(
                          "inline-flex px-2 py-1 rounded-full text-xs font-medium",
                          row.status === "active" && "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                          row.status === "paused" && "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
                          row.status === "completed" && "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                        )}>
                          {row.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Spend</div>
                      <div className="font-semibold text-red-600">{formatCurrency(row.spend)}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground">Revenue</div>
                      <div className="font-semibold text-green-600">{formatCurrency(row.revenue)}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground">ROAS</div>
                      <div className="font-semibold">{row.roas.toFixed(2)}x</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-muted-foreground">CTR</div>
                      <div className="font-semibold">{formatPercentage(row.ctr)}</div>
                    </div>
                  </div>
                  
                  {/* Additional Metrics - Collapsible */}
                  <details className="group">
                    <summary className="cursor-pointer text-xs sm:text-sm text-primary font-medium list-none flex items-center">
                      <span>More details</span>
                      <ChevronDown className="h-3 w-3 ml-1 transition-transform group-open:rotate-180" />
                    </summary>
                    <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-3 text-xs sm:text-sm">
                      <div className="space-y-1">
                        <div className="text-muted-foreground">Clicks</div>
                        <div className="font-medium">{formatNumber(row.clicks)}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground">Impressions</div>
                        <div className="font-medium">{formatNumber(row.impressions)}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground">CPC</div>
                        <div className="font-medium">{formatCurrency(row.cpc)}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-muted-foreground">Conversions</div>
                        <div className="font-medium">{formatNumber(row.conversions)}</div>
                      </div>
                    </div>
                  </details>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Table View - Hidden on mobile and tablet */}
        <div className="hidden lg:block overflow-x-auto mobile-scroll">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-border">
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={cn(
                      "px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-medium text-muted-foreground",
                      column.sortable && "cursor-pointer hover:text-foreground"
                    )}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.header}</span>
                      {column.sortable && (
                        <span className="text-xs">
                          {sortConfig?.key === column.key ? (
                            sortConfig.direction === "asc" ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : (
                              <ChevronDown className="h-3 w-3" />
                            )
                          ) : (
                            <ChevronsUpDown className="h-3 w-3 opacity-50" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className="border-b border-border">
                    {columns.map((column) => (
                      <td key={String(column.key)} className="px-3 sm:px-6 py-4">
                        <div className="h-4 bg-muted rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                sortedData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="border-b border-border hover:bg-muted/50 transition-colors"
                  >
                    {columns.map((column) => (
                      <td key={String(column.key)} className="px-3 sm:px-6 py-4 text-xs sm:text-sm">
                        {column.render
                          ? column.render(row[column.key])
                          : String(row[column.key] || "")}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination - Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-6 py-4 border-t border-border bg-muted/10">
          <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left order-2 sm:order-1">
            <span className="hidden sm:inline">Showing </span>
            <span className="font-medium">{((pagination.currentPage - 1) * pagination.itemsPerPage) + 1}-{Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)}</span>
            <span className="hidden sm:inline"> of </span>
            <span className="sm:hidden">/</span>
            <span className="font-medium">{pagination.totalItems}</span>
            <span className="hidden sm:inline"> results</span>
          </div>
          
          <div className="flex items-center justify-center space-x-1 sm:space-x-2 order-1 sm:order-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
              className="h-8 w-8 sm:h-9 sm:w-auto sm:px-3"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Previous</span>
            </Button>
            
            {/* Page numbers for tablet and desktop */}
            <div className="hidden sm:flex items-center space-x-1">
              {totalPages <= 7 ? (
                // Show all pages if 7 or fewer
                Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={page === pagination.currentPage ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange?.(page)}
                    className="h-8 w-8 text-xs"
                  >
                    {page}
                  </Button>
                ))
              ) : (
                // Show condensed pagination for more than 7 pages
                <>
                  {pagination.currentPage > 3 && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => onPageChange?.(1)} className="h-8 w-8 text-xs">1</Button>
                      {pagination.currentPage > 4 && <span className="text-muted-foreground text-xs">...</span>}
                    </>
                  )}
                  
                  {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                    const page = Math.max(1, Math.min(totalPages - 2, pagination.currentPage - 1)) + i;
                    return (
                      <Button
                        key={page}
                        variant={page === pagination.currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange?.(page)}
                        className="h-8 w-8 text-xs"
                      >
                        {page}
                      </Button>
                    );
                  })}
                  
                  {pagination.currentPage < totalPages - 2 && (
                    <>
                      {pagination.currentPage < totalPages - 3 && <span className="text-muted-foreground text-xs">...</span>}
                      <Button variant="outline" size="sm" onClick={() => onPageChange?.(totalPages)} className="h-8 w-8 text-xs">{totalPages}</Button>
                    </>
                  )}
                </>
              )}
            </div>
            
            {/* Mobile page indicator */}
            <div className="sm:hidden px-3 py-1 bg-background border border-border rounded text-xs font-medium">
              {pagination.currentPage}/{totalPages}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= totalPages}
              className="h-8 w-8 sm:h-9 sm:w-auto sm:px-3"
            >
              <span className="hidden sm:inline mr-1">Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTable; 