import { Outfit, Monsieur_La_Doulaise } from "next/font/google";
import "./globals.css";
import PageTransition from "@/components/ui/PageTransition";
import ConditionalShell from "@/components/ui/ConditionalShell";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const signatureFont = Monsieur_La_Doulaise({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-signature",
  display: "swap",
});

export const metadata = {
  title: "Bristiii - Modern Art Gallery",
  description: "A quiet gallery space where the walls disappear and the art becomes the focus.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${outfit.variable} ${signatureFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gallery-bg font-outfit">
        <ConditionalShell>
          <PageTransition>
            {children}
          </PageTransition>
        </ConditionalShell>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          theme="light"
        />
      </body>
    </html>
  );
}
