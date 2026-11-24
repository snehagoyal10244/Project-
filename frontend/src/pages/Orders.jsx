import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, ArrowRight, Download, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { ordersApi } from '../services/api';

const Orders = () => {
  const { showToast } = useCart();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fallbackOrders = [
    {
      id: "NVR-98421-E",
      date: "October 24, 2024",
      status: "In Transit",
      statusColor: "text-tertiary bg-tertiary-fixed/30",
      total: 580.00,
      trackingCode: "TRK-NV-8842-IT",
      items: [
        {
          name: "Oversized Pure Cashmere Cocoon Cardigan",
          color: "Oatmeal Melange",
          size: "M",
          qty: 1,
          price: 320.00,
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuADddT2dqoFRwr-l_EflfYnzyj6YXuMDMvT5nts_f8eHcNhgJFbf-Y-195QApvxmOWlOt-AZ8wd5C6HdFpS5dMIpc405FWrq3rbdXFwvIoweR-2T1zrA5p7V0_h9TCSXcMW__LOUpPcxueMaqRknU6cBT0cPBPpDnp0MYaoTAVl6wTc7Vpvzi1-OWubAn6HiVUlbC2V9ou6vMbAcz59LtmucmRMQZM9RcGBT3_PneQf"
        },
        {
          name: "Minimalist Travertine Vessel & Object",
          color: "Cream Travertine",
          size: "Standard",
          qty: 1,
          price: 165.00,
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCtHTpwR4kYaVZ5E0da6Qx5cS9t9OF3zQOaBPF22xDsLVyB3mP2nNn8NUqgrWkTy8CAUdQWU7ZNuQZB6BgtkQ1qjLe_3ytHQKRfJ9ZdfgVWOXcHAEpSvNEp2g6-XnvKf34cXqY5C2gKwI0EXCZoDb_T4C-V5fRfEQzqW713d-hEZ9l2o7KNWk-APDPp4VjmYFV9B4xWULxvW2kfRs3nGfDgg7ZE80C46Apk611-Eh5X"
        },
        {
          name: "Monolith Brass Incense Well",
          color: "Raw Brass",
          size: "Standard",
          qty: 1,
          price: 95.00,
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCQKGYZuHmuGLDxEIZwPa5CCNlqQVEVq4QTyuYS498jR88LF-QYBxfxjfarZ1J_zwHzirsJ7hHqvBrm0s_zeXfuJfQgtrUal9MjH9a24AlFZS35NqtmqSE4Fcbd3jK0QJ_IhK0CCFsXHpFMQ5WDJXqCvOhMfK8chQxG5A9uBx-i5c-GgbBjahL-U1YEMi7tZe4L8DT415GMkVFEXMNwzCLzqLHMXlrwTywN0ZRMcgvU"
        }
      ]
    },
    {
      id: "NVR-77192-A",
      date: "September 12, 2024",
      status: "Delivered",
      statusColor: "text-on-surface bg-surface-container-high",
      total: 380.00,
      trackingCode: "TRK-NV-7719-FR",
      items: [
        {
          name: "Structured Leather Shopper Tote",
          color: "Espresso Brown",
          size: "One Size",
          qty: 1,
          price: 380.00,
          image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1ZPfAJ6a8MGvHKsWJH3hYcRarhcakHaXhh0aYxzaHmCoGAlqMgy_WNsBZfx_vgEASNu2KHby-1Zba4py1tMr7XTS5qnhUaKKyKuaeOwMtuHQ3rUlAZuGta-yKws0n966CZbUcR6fqoE6P6-BnoGBX24vVJ9zVlV5IdY82exE8xNB_ce2ttggxVXnd8dycuBICq4fCgglNjO77CB3iKNDjtZfRCKd8YUxwaK-iChQV"
        }
      ]
    }
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (localStorage.getItem('novara_token')) {
          const res = await ordersApi.getMyOrders();
          if (res && res.orders && res.orders.length > 0) {
            const formatted = res.orders.map(o => ({
              id: o.orderNumber,
              date: new Date(o.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
              status: o.status,
              statusColor: o.status === 'Delivered' ? 'text-on-surface bg-surface-container-high' : 'text-tertiary bg-tertiary-fixed/30',
              total: o.totalAmount,
              trackingCode: o.trackingNumber,
              items: o.items.map(item => ({
                name: item.name,
                color: item.selectedColor || 'Default',
                size: item.selectedSize || 'Standard',
                qty: item.quantity,
                price: item.price,
                image: item.image
              }))
            }));
            setOrders(formatted);
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Could not fetch orders from backend, using fallback:', err.message);
      }
      setOrders(fallbackOrders);
      setIsLoading(false);
    };

    fetchOrders();
  }, []);

  return (
    <div className="w-full bg-background min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 lg:px-8 space-y-8">
        <div>
          <span className="font-label-sm text-label-sm uppercase tracking-[0.2em] text-primary text-xs font-semibold">
            Historical Archive
          </span>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">
            Order Dossiers & Receipts
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant text-sm mt-1">
            Review past acquisitions, track current dispatches, and download VAT invoices.
          </p>
        </div>

        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id} className="bg-surface-container-lowest rounded-xl border border-surface-container-high shadow-sm overflow-hidden">
              {/* Order Header */}
              <div className="p-5 sm:p-6 bg-surface-container-low/50 border-b border-surface-container-high flex flex-wrap items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-6">
                  <div>
                    <span className="text-on-surface-variant block text-[11px] uppercase">Order Reference</span>
                    <span className="font-semibold text-on-surface">{order.id}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block text-[11px] uppercase">Acquisition Date</span>
                    <span className="font-semibold text-on-surface">{order.date}</span>
                  </div>
                  <div>
                    <span className="text-on-surface-variant block text-[11px] uppercase">Total Dossier</span>
                    <span className="font-semibold text-on-surface">${order.total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full font-semibold uppercase text-[10px] tracking-wider ${order.statusColor}`}>
                    {order.status}
                  </span>
                  <Link 
                    to="/tracking" 
                    className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Track Live</span>
                  </Link>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-5 sm:p-6 divide-y divide-surface-container-high">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-16 h-20 object-cover rounded-lg bg-surface-container flex-shrink-0"
                      />
                      <div>
                        <h4 className="font-headline-sm font-semibold text-on-surface text-sm">{item.name}</h4>
                        <p className="text-on-surface-variant text-xs mt-0.5">
                          Color: {item.color} • Size: {item.size} • Qty: {item.qty}
                        </p>
                        <span className="font-semibold text-primary text-xs mt-1 block">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => showToast(`Generating invoice for ${order.id}...`)}
                      className="hidden sm:flex items-center gap-1 text-on-surface-variant hover:text-on-surface text-xs font-semibold"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Invoice</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
