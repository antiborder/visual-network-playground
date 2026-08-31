import type { Metadata } from "next";
import { Geist, Geist_Mono, Caveat, Nunito } from "next/font/google";
import { GlobalNav } from "@/components/GlobalNav";
import { APP_NAME } from "@/lib/brand";
import "katex/dist/katex.min.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Storybook-card fonts only — the outer app keeps Geist Sans above. See
// app/globals.css's `--font-storybook-*` tokens for where these apply.
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: APP_NAME,
    template: `%s — ${APP_NAME}`,
  },
  description:
    "Learn how networks actually work through interactive visualizations and hands-on experiments — drag an address, cause a conflict, watch a packet find its way.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-neutral-900">
        <GlobalNav />
        <main className="flex-1 mx-auto w-full max-w-6xl px-3 sm:px-4 py-5 sm:py-8">{children}</main>
      </body>
    </html>
  );
}
