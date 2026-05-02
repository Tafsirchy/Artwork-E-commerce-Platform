"use client";

import NextTopLoader from 'nextjs-toploader';

const ProgressBarProvider = ({ children }) => {
  return (
    <>
      <NextTopLoader
        color="#D4AF37"
        initialPosition={0.08}
        crawlSpeed={200}
        height={3}
        crawl={true}
        showSpinner={false}
        easing="ease"
        speed={200}
        shadow="0 0 10px #D4AF37,0 0 5px #D4AF37"
      />
      {children}
    </>
  );
};

export default ProgressBarProvider;
