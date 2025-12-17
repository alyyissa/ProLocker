import { useEffect, useState, useCallback } from "react";
import { getOrders, updateOrderStatus } from "../../services/orders/orderServies";
import OrderPopup from "../order/OrderPopup";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [showStatusDropdown, setShowStatusDropdown] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("All Dates");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const limit = 10;

  // Status options
  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "PENDING", label: "Pending" },
    { value: "CONFIRMED", label: "Confirmed" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "DECLINED", label: "Declined" },
  ];

  // Date filter options
  const dateOptions = [
    { value: "All Dates", label: "All Dates" },
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "thisWeek", label: "This Week" },
    { value: "lastWeek", label: "Last Week" },
    { value: "thisMonth", label: "This Month" },
    { value: "lastMonth", label: "Last Month" },
    { value: "thisYear", label: "This Year" },
    { value: "lastYear", label: "Last Year" },
  ];

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  // Fetch orders function
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {
        status: selectedStatus || undefined,
        date: selectedDate !== "All Dates" ? selectedDate : undefined,
        search: debouncedSearchTerm || undefined,
        page: currentPage,
        limit: limit,
      };
      
      const response = await getOrders(filters);
      
      setOrders(response.data);
      setTotalPages(response.totalPages);
      setTotalOrders(response.total);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again.");
      setOrders([]);
      setTotalPages(1);
      setTotalOrders(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedStatus, selectedDate, debouncedSearchTerm, limit]);

  // Fetch orders when filters change
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle status filter
  const handleStatusFilter = (e) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle date filter
  const handleDateFilter = (e) => {
    setSelectedDate(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handle page change
  const handlePageChange = (page) => {
    const validPage = Math.max(1, page);
    if (validPage >= 1 && validPage <= totalPages) {
      setCurrentPage(validPage);
    }
  };

  // Status color styling
  const statusColor = (status) => {
    switch (status) {
      case "DELIVERED":
        return "text-green-700";
      case "PENDING":
        return "text-yellow-700";
      case "DECLINED":
        return "text-red-700";
      case "CONFIRMED":
        return "text-blue-700";
      default:
        return "text-slate-700";
    }
  };

  // Format status for display
  const formatStatus = (status) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  // Format price for display
  const formatPrice = (price) => {
    if (price === undefined || price === null) return "$0.00";
    return `$${parseFloat(price).toFixed(2)}`;
  };

  // Clear all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("");
    setSelectedDate("All Dates");
    setCurrentPage(1);
  };

  const handleOrderClick = (order) => {
  setSelectedOrder(order);
  setIsPopupOpen(true);
};

// Handle closing the popup
const handleClosePopup = () => {
  setIsPopupOpen(false);
  setSelectedOrder(null);
}; 

const handleUpdateStatus = async (orderId, newStatus) => {
  try {
    setUpdatingOrderId(orderId);
    await updateOrderStatus(orderId, newStatus);
    
    // Refresh orders after status update
    await fetchOrders();
    
    // Close dropdown and show success message
    setShowStatusDropdown(null);
    
    // Optional: Show success toast/notification
    console.log(`Order ${orderId} status updated to ${newStatus}`);
  } catch (error) {
    console.error('Error updating order status:', error);
    // Optional: Show error message
  } finally {
    setUpdatingOrderId(null);
  }
};

// Toggle status dropdown
const toggleStatusDropdown = (orderId) => {
  setShowStatusDropdown(showStatusDropdown === orderId ? null : orderId);
};

// Close status dropdown
const closeStatusDropdown = () => {
  setShowStatusDropdown(null);
};

// Close dropdown when clicking outside
useEffect(() => {
  const handleClickOutside = (event) => {
    if (showStatusDropdown && !event.target.closest('.status-dropdown')) {
      setShowStatusDropdown(null);
    }
  };

  document.addEventListener('click', handleClickOutside);
  return () => {
    document.removeEventListener('click', handleClickOutside);
  };
}, [showStatusDropdown]);


  return (
    <>
    <div className="p-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-2xl font-semibold text-slate-900">
            Order History
          </h3>
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
        
        <p className="text-sm text-gray-500 mb-6">
          Total: {totalOrders} orders
        </p>

        <div className="border border-gray-300 rounded-md p-4">
          {/* Search + Filter Section */}
          <div className="flex flex-wrap gap-4 justify-between items-center">
            <div className="bg-white flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md w-72">
              <svg 
                className="w-4 h-4 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                className="bg-transparent text-sm w-full outline-0 placeholder-gray-400"
                placeholder="Search by tracking number..."
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Status Filter */}
              <select 
                value={selectedStatus}
                onChange={handleStatusFilter}
                className="bg-white px-4 py-2 border border-gray-300 rounded-md text-sm outline-0 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Date Filter */}
              <select 
                value={selectedDate}
                onChange={handleDateFilter}
                className="bg-white px-4 py-2 border border-gray-300 rounded-md text-sm outline-0 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                {dateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active filters indicator */}
          {(selectedStatus || selectedDate !== "All Dates" || debouncedSearchTerm) && (
            <div className="mt-3 text-sm text-gray-600">
              Active filters: 
              {selectedStatus && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  Status: {statusOptions.find(opt => opt.value === selectedStatus)?.label}
                </span>
              )}
              {selectedDate !== "All Dates" && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  Date: {dateOptions.find(opt => opt.value === selectedDate)?.label}
                </span>
              )}
              {debouncedSearchTerm && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded">
                  Search: "{debouncedSearchTerm}"
                </span>
              )}
            </div>
          )}

          <hr className="border-gray-300 my-4" />

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading orders...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 text-red-500">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-red-600 font-medium">{error}</p>
              <button 
                onClick={fetchOrders}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Retry
              </button>
            </div>
          )}

          {/* Orders Table */}
          {!loading && !error && (
            <>
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4 text-left text-sm font-medium text-slate-600 uppercase tracking-wider">
                        Tracking Number
                      </th>
                      <th className="p-4 text-left text-sm font-medium text-slate-600 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="p-4 text-left text-sm font-medium text-slate-600 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="p-4 text-left text-sm font-medium text-slate-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="p-4 text-left text-sm font-medium text-slate-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-12 text-center">
                          <div className="text-gray-400 mb-3">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </div>
                          <p className="text-gray-500 font-medium">
                            {debouncedSearchTerm || selectedStatus || selectedDate !== "All Dates" 
                              ? "No orders found matching your filters" 
                              : "No orders found"}
                          </p>
                          {(debouncedSearchTerm || selectedStatus || selectedDate !== "All Dates") && (
                            <button
                              onClick={handleClearFilters}
                              className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Clear filters to see all orders
                            </button>
                          )}
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr 
                          key={order.id} 
                          className="hover:bg-gray-50 transition duration-150"
                        >
                          <td className="p-4">
                            <div className="text-sm font-medium text-gray-900 hover:underline cursor-pointer"
                            onClick={() => handleOrderClick(order)}
                            >
                              {order.trackingNumber || "N/A"}
                            </div>
                          </td>
                          <td className="p-4 text-sm text-gray-700">
                            {order.createdAt ? formatDate(order.createdAt) : "N/A"}
                          </td>
                          <td className="p-4 text-sm font-medium text-gray-900">
                            {formatPrice(order.totalPrice)}
                          </td>
                          <td className="p-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColor(order.status)} bg-opacity-10 ${order.status === 'DELIVERED' ? 'bg-green-100' : order.status === 'PENDING' ? 'bg-yellow-100' : order.status === 'DECLINED' ? 'bg-red-100' : 'bg-blue-100'}`}>
                              {formatStatus(order.status)}
                            </span>
                          </td>
                          <td className="p-4 relative">
  <div className="status-dropdown">
    <button 
      className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-100 transition cursor-pointer"
      onClick={() => toggleStatusDropdown(order.id)}
      disabled={updatingOrderId === order.id}
    >
      {updatingOrderId === order.id ? (
        <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      )}
    </button>
    
    {/* Status Dropdown Menu */}
    {showStatusDropdown === order.id && (
      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
        <div className="py-1">
          <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
            Change Status
          </div>
          {statusOptions
            .filter(option => option.value !== "" && option.value !== order.status)
            .map((option) => (
              <button
                key={option.value}
                onClick={() => handleUpdateStatus(order.id, option.value)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                disabled={updatingOrderId === order.id}
              >
                {option.label}
              </button>
            ))}
          <div className="border-t border-gray-100">
            <button
              onClick={closeStatusDropdown}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && orders.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                    Showing {orders.length} of {totalOrders} orders
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 text-sm border rounded-md flex items-center gap-1 cursor-pointer ${
                        currentPage === 1 
                          ? 'text-gray-400 border-gray-300 cursor-not-allowed' 
                          : 'text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-3 py-1 text-sm border rounded-md min-w-[40px] ${
                              currentPage === pageNum 
                                ? 'bg-tertiary text-white border-tertiary' 
                                : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button 
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 text-sm border rounded-md flex items-center gap-1 ${
                        currentPage === totalPages
                          ? 'text-gray-400 border-gray-300 cursor-not-allowed' 
                          : 'text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 cursor-pointer'
                      }`}
                    >
                      Next
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
    {isPopupOpen && selectedOrder && (
      <OrderPopup
        isOpen={isPopupOpen}
        onClose={handleClosePopup}
        order={selectedOrder}
      />
    )}
    </>
  );
};

export default Orders;