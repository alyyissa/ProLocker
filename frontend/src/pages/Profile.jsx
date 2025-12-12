import React, { useEffect, useState } from "react";
import { getMyOrders } from "../services/orders/orderServies";
import { useAuth } from "../context/AuthContext";
import { logoutUser as logoutApi } from "../services/auth/authService";
import { useNavigate } from "react-router-dom";
import OrderPopup from "../components/order/OrderPopup";

const Profile = () => {
    const { user, logoutUser } = useAuth();
    const navigate = useNavigate();

    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    const openPopup = (order) => {
    setSelectedOrder(order);
    setShowPopup(true);
    };

    const closePopup = () => {
    setShowPopup(false);
    setSelectedOrder(null);
    };

    const [orders, setOrders] = useState([]);
    const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        window.scrollTo(0, 0);
        if (user) fetchOrders(1)
    }, [user]);

    const fetchOrders = async (page) => {
        try {
        setLoading(true);
        const data = await getMyOrders(user.id, page, 3);

        setOrders(data.orders);
        setMeta({
            page: data.page,
            totalPages: data.totalPages,
        });
        } catch (error) {
        console.error("Failed to load orders:", error);
        } finally {
        setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            await logoutApi();
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            logoutUser();
            navigate('/')
        } catch (error) {
            throw error
        }
    };

    if (!loading && orders.length === 0) {
    return (
    <div className="pt-[69px] md:pt-[109px] px-3 sm:px-4 md:px-11 lg:px-13 xl:px-12 2xl:px-16 min-h-[94dvh]">
        
        <div className="max-w-7xl mx-auto py-20">
            <h1 className="text-center mb-15 text-4xl ultra-regular">Profile</h1>
            <div className="bg-white border border-gray-300 p-6 rounded-xl shadow-sm text-center">
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
                You have no orders yet
            </h2>
            <p className="text-slate-600">Your orders will appear here once you place one.</p>
            <button className="mt-10 rounded-xl bg-cocoprimary py-3 px-12 font-semibold text-background cursor-pointer" onClick={handleLogout}>
                Logout
            </button>
            </div>
        </div>
    </div>
    );
    }
  return (
    <div className="pt-[69px] md:pt-[109px] px-3 sm:px-4 md:px-11 lg:px-13 xl:px-12 2xl:px-16 min-h-[94dvh]">
        <div className="max-w-7xl mx-auto py-20">
            <div className="flex flex-wrap justify-between items-center gap-6">
                <div className="max-w-96">
                    <h2 className="text-slate-900 text-2xl font-bold mb-3">Order History</h2>
                    <p className="text-base text-slate-600">View your past orders</p>
                </div>
            </div>

                <div className="space-y-6 mt-6">
                {orders.map((order) => (
                    <div
                    key={order.id}
                    className="bg-white rounded-xl border border-gray-300 overflow-hidden p-6"
                    >
                    <div className="flex flex-wrap justify-between gap-6">
                        <div className="max-w-96">
                        <div className="flex items-center gap-4">
                            <span className="text-[15px] font-semibold text-slate-600">
                            Order: <span className="font-bold">#{order.trackingNumber}</span>
                            </span>

                            <span
                            className={`px-3 py-1.5 text-xs font-medium rounded-md ${
                                order.status === "Delivered"
                                ? "bg-green-100 text-green-900"
                                : order.status === "Pending"
                                ? "bg-yellow-100 text-yellow-900"
                                : "bg-blue-100 text-blue-900"
                            }`}
                            >
                            {order.status}
                            </span>
                        </div>

                        <p className="text-slate-600 text-sm mt-3">
                            Placed on {new Date(order.createdAt).toLocaleString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                })}
                        </p>
                        </div>

                        <div className="text-right">
                        <p className="text-lg font-semibold text-slate-900">
                            ${Number(order.totalPrice).toFixed(2)}
                        </p>
                        <p className="text-slate-600 text-sm mt-2">
                            {order.orderItems.length} items
                        </p>
                        </div>
                    </div>

                    <hr className="border-gray-300 my-6" />

                    <div className="flex flex-wrap items-center gap-8">
                        {order.orderItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 p-1 rounded-md overflow-hidden">
                            <img
                                src={item.productVarient.product.mainImage || 'https://pearlbrandsonline.com/wp-content/uploads/2025/06/710932304522.jpg'}
                                alt={item.productVarient.product.name}
                                className="w-full h-full object-contain"
                            />
                            </div>
                            <div>
                            <p className="text-[15px] font-medium text-slate-900">
                                {item.productVarient.product.name}
                            </p>
                            <p className="text-xs text-slate-600 mt-1">
                                Qty: {item.quantity},  Size: {item.productVarient.size}
                            </p>
                            </div>
                        </div>
                        ))}
                    </div>

                    <div className="mt-8 flex flex-wrap gap-4">
                        <button className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-slate-900 font-medium cursor-pointer hover:bg-gray-50 transition flex items-center gap-2"
                        onClick={() => openPopup(order)}
                        >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-4 h-4"
                            viewBox="0 0 511.999 511.999"
                        >
                            <path d="M508.745 246.041c-4.574-6.257-113.557-153.206-252.748-153.206S7.818 239.784 3.249 246.035a16.896 16.896 0 0 0 0 19.923c4.569 6.257 113.557 153.206 252.748 153.206s248.174-146.95 252.748-153.201a16.875 16.875 0 0 0 0-19.922zM255.997 385.406c-102.529 0-191.33-97.533-217.617-129.418 26.253-31.913 114.868-129.395 217.617-129.395 102.524 0 191.319 97.516 217.617 129.418-26.253 31.912-114.868 129.395-217.617 129.395z" />
                            <path d="M255.997 154.725c-55.842 0-101.275 45.433-101.275 101.275s45.433 101.275 101.275 101.275S357.272 311.842 357.272 256s-45.433-101.275-101.275-101.275zm0 168.791c-37.23 0-67.516-30.287-67.516-67.516s30.287-67.516 67.516-67.516 67.516 30.287 67.516 67.516-30.286 67.516-67.516 67.516z" />
                        </svg>
                        View Details
                        </button>
                        {
                            showPopup && (
                                <OrderPopup order={selectedOrder} onClose={closePopup}/>
                            )
                        }
                    </div>
                </div>
            ))}
            </div>

            {orders.length > 0 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-slate-600">
                Showing <span className="font-medium">{meta.page}</span> of{" "}
                <span className="font-medium">{meta.totalPages}</span> pages
                </div>

                <div className="flex gap-3">
                <button
                    className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50"
                    onClick={() => fetchOrders(meta.page - 1)}
                    disabled={meta.page === 1}
                >
                    Prev
                </button>

                {[...Array(meta.totalPages)].map((_, i) => (
                    <button
                    key={i}
                    onClick={() => fetchOrders(i + 1)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition cursor-pointer 
                        ${
                        meta.page === i + 1
                            ? "bg-indigo-600 text-white"
                            : "bg-white border border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                    {i + 1}
                    </button>
                ))}

                <button
                    className="px-3 py-1 bg-white border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 transition disabled:opacity-50"
                    onClick={() => fetchOrders(meta.page + 1)}
                    disabled={meta.page === meta.totalPages}
                >
                    Next
                </button>
                </div>
            </div>
            )}
        </div>
    </div>
  );
};

export default Profile;
