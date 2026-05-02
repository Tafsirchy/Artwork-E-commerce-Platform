import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gallery-bg pt-12 sm:pt-24 pb-20">
      <div className="container mx-auto px-6">
        <div className="bg-white p-10 md:p-16 border border-gallery-border shadow-sm">
        <h1 className="text-3xl md:text-5xl font-extralight text-gallery-text tracking-widest uppercase mb-12 text-center">
          Privacy <span className="font-serif text-gallery-gold">Policy</span>
        </h1>

        <div className="space-y-12 text-gallery-muted font-light leading-relaxed">
          <section>
            <h2 className="text-sm tracking-[0.3em] uppercase text-gallery-text font-bold mb-4">1. Data Collection</h2>
            <p className="mb-4">We collect information that you provide directly to us, such as when you create an account, make a purchase, or communicate with us. This may include your name, email address, shipping address, and payment information.</p>
          </section>

          <section>
            <h2 className="text-sm tracking-[0.3em] uppercase text-gallery-text font-bold mb-4">2. Use of Information</h2>
            <p className="mb-4">The information we collect is used to process your transactions, manage your account, and provide you with a personalized experience. We may also use your email to send you updates about new artists, collections, and exclusive gallery events.</p>
          </section>

          <section>
            <h2 className="text-sm tracking-[0.3em] uppercase text-gallery-text font-bold mb-4">3. Data Protection</h2>
            <p>We implement a variety of security measures to maintain the safety of your personal information. Your payment data is processed through secure, encrypted gateways (Stripe) and is never stored directly on our servers.</p>
          </section>

          <section>
            <h2 className="text-sm tracking-[0.3em] uppercase text-gallery-text font-bold mb-4">4. Third-Party Disclosure</h2>
            <p>We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential.</p>
          </section>
        </div>
        </div>
      </div>
    </div>
  );
}
