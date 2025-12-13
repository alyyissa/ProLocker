import React, { useEffect, useState } from 'react';
import { getDeliveryFee } from '../../services/delivery/deliveryService';

const OrderPopup = ({ isOpen, onClose, order }) => {
  const [deliveryFee, setDeliveryFee] = useState(0);

  // Lock scroll when popup is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  // Fetch delivery fee
  useEffect(() => {
    const fetchDelivery = async () => {
      const fee = await getDeliveryFee();
      setDeliveryFee(Number(fee) || 0);
    };
    fetchDelivery();
  }, []);

  console.log(order.orderItems)

  const finalTotal = Number(order.totalPrice || 0) + deliveryFee;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-99 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white bg-black/30 hover:bg-black/40 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
        >
          X
        </button>

        {/* TOP HEADER */}
        <div className="bg-indigo-600 px-6 py-3">
          <div className="flex items-center gap-5">
            <h2 className="text-lg font-semibold text-white">Order Confirmation</h2>
            <span className="bg-white/20 text-white text-xs font-medium px-2.5 py-1 rounded-full">
              {order.status}
            </span>
          </div>
          <p className="text-slate-200 text-sm mt-2">Thank you for your order!</p>
        </div>

        <div className="p-5">
          {/* Order Info */}
          <div className="flex flex-wrap justify-between items-center gap-4">
            <div>
              <p className="text-slate-500 text-sm font-semibold">Order Number</p>
              <p className="text-slate-900 text-sm font-medium mt-2">#{order.trackingNumber}</p>
            </div>

            <div>
              <p className="text-slate-500 text-sm font-semibold">Date</p>
              <p className="text-slate-900 text-sm font-medium mt-2">
                {new Date(order.createdAt).toLocaleString([], { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </div>

            <div>
              <p className="text-slate-500 text-sm font-semibold">Total</p>
              <p className="text-sm font-medium text-indigo-700 mt-2">
                ${finalTotal.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-gray-100 rounded-xl p-4 mt-4">
            <h3 className="text-base font-medium text-slate-900 mb-6">Delivery Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-slate-500 text-sm font-semibold">Customer</p>
                <p className="text-slate-900 text-sm font-medium mt-2">{order.firstName} {order.lastName}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm font-semibold">Shipping Method</p>
                <p className="text-slate-900 text-sm font-medium mt-2">Delivery</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm font-semibold">Address</p>
                <p className="text-slate-900 text-sm font-medium mt-2">{order.address}, {order.city}</p>
              </div>
              <div>
                <p className="text-slate-500 text-sm font-semibold">Phone</p>
                <p className="text-slate-900 text-sm font-medium mt-2">{order.phoneNumber}</p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mt-4">
            <h3 className="text-base font-medium text-slate-900 mb-6">Order Items ({order.orderItems.length})</h3>
            <div className="space-y-4">
              {order.orderItems.map((item) => {
              const originalTotal = Number(item.originalPrice) * Number(item.quantity);
              const actualTotal = Number(item.unitPrice) * Number(item.quantity);
                  console.log(actualTotal)
              return (
                <div key={item.id} className="flex items-start gap-4 max-sm:flex-col">
                  <div className="w-[70px] h-[70px] bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
                    <img
                      src={item.productVarient.product.mainImage || "/placeholder.png"}
                      className="w-14 h-14 object-contain rounded-sm"
                    />
                  </div>

                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-slate-900">{item.productVarient.product.name}</h4>
                    <p className="text-slate-500 text-xs font-medium mt-2">
                      Qty: {item.quantity}, Size: {item.productVarient.size}
                    </p>
                  </div>

                  <div className="text-right">
                    {originalTotal > actualTotal && (
                      <p className="text-slate-500 text-sm font-medium line-through">
                        ${originalTotal.toFixed(2)}
                      </p>
                    )}
                    <p className="text-slate-900 text-sm font-semibold">
                      ${actualTotal.toFixed(2)}
                    </p>
                  </div>
                </div>
              );
            })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-100 rounded-xl p-4 mt-8">
            <h3 className="text-base font-medium text-slate-900 mb-6">Order Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="text-sm text-slate-500 font-semibold">Subtotal</p>
                <p className="text-slate-900 text-sm font-semibold">${Number(order.totalPrice).toFixed(2)}</p>
              </div>

              <div className="flex justify-between">
                <p className="text-sm text-slate-500 font-semibold">Delivery</p>
                <p className="text-slate-900 text-sm font-semibold">${deliveryFee.toFixed(2)}</p>
              </div>

              <div className="flex justify-between pt-3 border-t border-gray-300">
                <p className="text-[15px] font-semibold text-slate-900">Total</p>
                <p className="text-[15px] font-semibold text-indigo-700">${finalTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPopup;
