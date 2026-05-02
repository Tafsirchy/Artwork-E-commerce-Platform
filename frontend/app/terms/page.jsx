import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gallery-bg pt-32 pb-20 px-6 sm:px-12">
      <div className="max-w-4xl mx-auto bg-white p-10 md:p-16 border border-gallery-border shadow-sm">
        <h1 className="text-3xl md:text-5xl font-extralight text-gallery-text tracking-widest uppercase mb-12 text-center">
          Terms <span className="font-serif italic text-gallery-gold">& Conditions</span>
        </h1>
        
        <div className="space-y-12 text-gallery-muted font-light leading-relaxed">
          <section>
            <h2 className="text-sm tracking-[0.3em] uppercase text-gallery-text font-bold mb-4">1. General Overview</h2>
            <p className="mb-4">Welcome to Bristiii Gallery. By accessing or using our platform, you agree to be bound by these Terms and Conditions. Our platform is an exclusive digital space designed for the curation and acquisition of original artworks.</p>
          </section>

          <section>
            <h2 className="text-sm tracking-[0.3em] uppercase text-gallery-text font-bold mb-4">2. Artwork Authenticity</h2>
            <p className="mb-4">We guarantee the authenticity of every piece of artwork sold through our platform. All original works are accompanied by a Certificate of Authenticity signed by the artist or the gallery curator.</p>
          </section>

          <section>
            <h2 className="text-sm tracking-[0.3em] uppercase text-gallery-text font-bold mb-4">3. Purchases and Pricing</h2>
            <p>All prices are listed in USD and are subject to change without notice. We reserve the right to refuse or cancel any order for any reason, including limitations on quantities available for purchase or inaccuracies in product or pricing information.</p>
          </section>

          <section>
            <h2 className="text-sm tracking-[0.3em] uppercase text-gallery-text font-bold mb-4">4. Intellectual Property</h2>
            <p>The content on this website, including but not limited to images, text, and graphics, is the property of Bristiii Gallery and the respective artists. It is protected by copyright laws and may not be reproduced without explicit written permission.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
