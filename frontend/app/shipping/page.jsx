import React from 'react';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gallery-bg pt-12 sm:pt-24 pb-20">
      <div className="container mx-auto px-6">
        <div className="bg-white p-10 md:p-16 border border-gallery-border shadow-sm">
        <h1 className="text-3xl md:text-5xl font-extralight text-gallery-text tracking-widest uppercase mb-12 text-center">
          Shipping <span className="font-serif text-gallery-gold">& Delivery</span>
        </h1>

        <div className="space-y-12 text-gallery-muted font-light leading-relaxed">
          <section>
            <h2 className="text-sm tracking-[0.3em] uppercase text-gallery-text font-bold mb-4">Domestic Shipping</h2>
            <p className="mb-4">All domestic orders are processed and shipped within 3-5 business days. Once your artwork is dispatched, you will receive a tracking number via email.</p>
            <p>We partner with specialized art couriers to ensure your piece arrives in pristine condition. Standard shipping within the contiguous United States typically takes 4-7 business days.</p>
          </section>

          <section>
            <h2 className="text-sm tracking-[0.3em] uppercase text-gallery-text font-bold mb-4">International Shipping</h2>
            <p className="mb-4">We proudly ship worldwide. International orders are subject to customs clearance procedures, which can cause delays beyond our original delivery estimates.</p>
            <p>Please note that international buyers are responsible for any customs duties, taxes, or import fees that may apply to their shipment.</p>
          </section>

          <section>
            <h2 className="text-sm tracking-[0.3em] uppercase text-gallery-text font-bold mb-4">Packaging & Care</h2>
            <p>Every piece of art is meticulously packaged using archival-quality materials. Unframed prints are rolled in heavy-duty tubes, while framed pieces and canvases are custom-crated for maximum protection during transit.</p>
          </section>

          <section>
            <h2 className="text-sm tracking-[0.3em] uppercase text-gallery-text font-bold mb-4">Lost or Damaged Items</h2>
            <p>In the rare event that your artwork arrives damaged, please contact us within 48 hours of delivery. Keep all original packaging materials and provide photographic evidence of the damage so we can initiate a claim with our courier and arrange a replacement or refund.</p>
          </section>
        </div>
        </div>
      </div>
    </div>
  );
}
