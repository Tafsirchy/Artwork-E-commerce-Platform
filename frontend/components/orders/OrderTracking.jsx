"use client";

import React from "react";
import { Check, Package, Truck, CheckCircle2, Clock } from "lucide-react";

const steps = [
  { id: "placed", label: "Order Placed", icon: Package },
  { id: "processing", label: "Processing", icon: Clock },
  { id: "shipped", label: "In Transit", icon: Truck },
  { id: "delivered", label: "Delivered", icon: CheckCircle2 },
];

export default function OrderTracking({ order }) {
  // Determine current step index
  let currentStep = 0;
  if (order.isPaid || order.paymentMethod === "COD") currentStep = 1;
  if (order.isTransit) currentStep = 2;
  if (order.isDelivered) currentStep = 3;

  return (
    <div className="w-full py-12 px-4">
      <div className="relative flex justify-between items-center max-w-4xl mx-auto">
        {/* Connection Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gallery-border -translate-y-1/2 z-0" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-gallery-gold -translate-y-1/2 z-0 transition-all duration-1000" 
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index <= currentStep;
          const isCompleted = index < currentStep;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 bg-white ${
                  isActive 
                    ? "border-gallery-gold text-gallery-gold" 
                    : "border-gallery-border text-gallery-muted"
                }`}
              >
                {isCompleted || isActive ? <Check size={24} strokeWidth={2.5} /> : <Icon size={20} />}
              </div>
              
              <div className="absolute top-16 text-center whitespace-nowrap">
                <p className={`text-[10px] tracking-[0.2em] uppercase font-bold transition-colors ${
                  isActive ? "text-gallery-text" : "text-gallery-muted"
                }`}>
                  {step.label}
                </p>
                {isActive && index === currentStep && (
                  <p className="text-[8px] text-gallery-gold tracking-widest mt-1 animate-pulse">ACTIVE</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
