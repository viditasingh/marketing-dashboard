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
    <Card className={cn("card-hover", className)}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg font-semibold">Campaign Performance</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative" ref={exportMenuRef}>
              <Button variant="outline" size="sm" onClick={() => setShowExportMenu(!showExportMenu)}>
                <Download className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Export</span>
              </Button>
              {showExportMenu && (
                <div className="absolute right-0 top-10 z-50 bg-background border border-border rounded-md shadow-lg p-2 min-w-[120px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
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
                    className="w-full justify-start"
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
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Filters</span>
            {(filters.status !== "all" || filters.minSpend !== "" || filters.maxSpend !== "") && (
              <span className="ml-1 h-2 w-2 bg-primary rounded-full"></span>
            )}
          </Button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="border-t border-border pt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full p-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Min Spend</label>
                <input
                  type="number"
                  placeholder="0"
                  value={filters.minSpend}
                  onChange={(e) => handleFilterChange('minSpend', e.target.value)}
                  className="w-full p-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-2 block">Max Spend</label>
                <input
                  type="number"
                  placeholder="No limit"
                  value={filters.maxSpend}
                  onChange={(e) => handleFilterChange('maxSpend', e.target.value)}
                  className="w-full p-2 border border-border rounded-md bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div className="flex items-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground">
              Showing {sortedData.length} of {data.length} campaigns
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto mobile-scroll">
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
        
        {/* Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-6 py-4 border-t border-border">
          <div className="text-sm text-muted-foreground text-center sm:text-left">
            Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{" "}
            {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} of{" "}
            {pagination.totalItems} results
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(pagination.currentPage - 1)}
              disabled={pagination.currentPage <= 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {pagination.currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange?.(pagination.currentPage + 1)}
              disabled={pagination.currentPage >= totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTable; 