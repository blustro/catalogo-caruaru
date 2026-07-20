import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Meu Catálogo',
  description: 'Confira nossos produtos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='pt-BR'>
      {/* A classe da fonte injetada aqui garante que todo o app herde o estilo sans-serif */}
      <body
        className={`${inter.className} font-sans antialiased bg-gray-50 text-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}
