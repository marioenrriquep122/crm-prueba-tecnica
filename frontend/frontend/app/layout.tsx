import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CRM App',
  description: 'Sistema CRM – Prueba Técnica',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <nav className="bg-gray-900 text-white px-6 py-4 flex gap-8 items-center shadow-lg">
          <span className="font-bold text-xl">🏢 CRM</span>
          <Link href="/clientes" className="hover:text-blue-400 transition-colors text-sm font-medium">
            Clientes
          </Link>
          <Link href="/oportunidades" className="hover:text-blue-400 transition-colors text-sm font-medium">
            Oportunidades
          </Link>
        </nav>
        <main className="min-h-screen bg-gray-100">
          {children}
        </main>
      </body>
    </html>
  );
}