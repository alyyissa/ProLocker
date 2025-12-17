import { useEffect, useState } from "react";
import { getOrders } from "../../services/orders/orderServies";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("All Dates");
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const limit = 10;

  const statusOptions = [
    { value: "", label: "All Status" },
    { value: "PENDING", label: "Pending" },
    { value: "CONFIRMED", label: "Confirmed" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "DECLINED", label: "Declined" },
  ];

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

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {
        status: selectedStatus || undefined,
        date: selectedDate !== "All Dates" ? selectedDate : undefined,
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, selectedStatus, selectedDate]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
   
  };

  const filteredOrders = orders.filter(order => 
    searchTerm === "" || 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const formatStatus = (status) => {
    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handlePageChange = (page) => {
    const validPage = Math.max(1, page);
    if (validPage >= 1 && validPage <= totalPages) {
    setCurrentPage(validPage);
    }
  };

  const handleStatusFilter = (e) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleDateFilter = (e) => {
    setSelectedDate(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="p-4">
      <div className="max-w-5xl mx-auto">
        <h3 className="text-2xl font-semibold text-slate-900">
          Order History
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Total: {totalOrders} orders
        </p>

        <div className="border border-gray-300 rounded-md p-4 mt-6">
          {/* Search + Filter */}
          <div className="flex flex-wrap gap-4 justify-between">
            <div className="bg-white flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md w-72">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                className="bg-transparent text-sm w-full outline-0"
                placeholder="Search by Order ID..."
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Status Filter */}
              <select 
                value={selectedStatus}
                onChange={handleStatusFilter}
                className="bg-white px-4 py-2 border border-gray-300 rounded-md text-sm outline-0"
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
                className="bg-white px-4 py-2 border border-gray-300 rounded-md text-sm outline-0"
              >
                {dateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <hr className="border-gray-300 my-4" />

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading orders...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-8">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={fetchOrders}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
                      <th className="p-4 text-left text-sm font-medium text-slate-600">Order ID</th>
                      <th className="p-4 text-left text-sm font-medium text-slate-600">Date</th>
                      <th className="p-4 text-left text-sm font-medium text-slate-600">Price</th>
                      <th className="p-4 text-left text-sm font-medium text-slate-600">Status</th>
                      <th className="p-4 text-left text-sm font-medium text-slate-600">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-300">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-gray-500">
                          No orders found
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50 transition">
                          <td className="p-4 text-sm font-medium">#{order.id}</td>
                          <td className="p-4 text-sm">
                            {order.createdAt ? formatDate(order.createdAt) : order.date || "N/A"}
                          </td>
                          <td className="p-4 text-sm">
                            ${order.total ? order.total.toFixed(2) : "0.00"}
                          </td>
                          <td className={`p-4 text-sm font-medium ${statusColor(order.status)}`}>
                            {formatStatus(order.status)}
                          </td>
                          <td className="p-4">
                            <button className="text-gray-600 hover:text-black">
                              •••
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 border rounded ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                    >
                      Prev
                    </button>
                    
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
                          className={`px-3 py-1 border rounded ${currentPage === pageNum ? 'bg-gray-300 font-medium' : 'hover:bg-gray-50'}`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button 
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 border rounded ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;