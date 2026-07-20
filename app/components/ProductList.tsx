/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Image from 'next/image';
import { useState, useMemo, useRef } from 'react';

// Simulando a configuração do Banner (poderia vir de um banco ou .env)
const SHOW_BANNER = true;

export default function ProductList({ products }: { products: any[] }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState('default');
  const [limit, setLimit] = useState(12);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const categories = [
    'Todos',
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === 'Todos' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Ordenação simplificada (sem preço)
    return result.sort((a, b) => {
      if (sortBy === 'name-asc') return a.title.localeCompare(b.title);
      if (sortBy === 'name-desc') return b.title.localeCompare(a.title);
      return 0; // 'default'
    });
  }, [search, selectedCategory, sortBy, products]);

  // ... (useEffect do IntersectionObserver permanece igual) ...

  return (
    <div className='w-full overflow-x-hidden flex flex-col min-h-screen'>
      {/* 1. Banner Condicional */}
      {SHOW_BANNER && (
        <div className='w-full bg-slate-900 text-white text-center py-2 text-sm font-medium tracking-wide'>
          🎉 Promoção de Black Friday! Consulte nossas condições pelo WhatsApp.
        </div>
      )}

      <div className='sticky top-0 bg-gray-50/95 backdrop-blur-sm p-4 mb-6 border-b z-10'>
        <div className='flex flex-col gap-3 mb-4'>
          {/* 2. Contraste Ajustado no Input (placeholder:text-gray-500) */}
          <input
            type='text'
            placeholder='Buscar produtos...'
            className='w-full p-3 rounded-xl border border-gray-300 shadow-sm outline-none focus:ring-2 focus:ring-slate-800 text-gray-900 placeholder:text-gray-500'
            onChange={(e) => {
              setSearch(e.target.value);
              setLimit(12);
            }}
          />

          <div className='relative w-full'>
            {/* 3. Contraste Ajustado e Remoção dos Preços no Select */}
            <select
              className='w-full p-3 rounded-xl border border-gray-300 bg-white shadow-sm outline-none appearance-none pr-10 text-gray-900 font-medium'
              onChange={(e) => {
                setSortBy(e.target.value);
                setLimit(12);
              }}
            >
              <option value='default'>Ordenar por...</option>
              <option value='name-asc'>Nome (A - Z)</option>
              <option value='name-desc'>Nome (Z - A)</option>
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-600'>
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M19 9l-7 7-7-7'
                />
              </svg>
            </div>
          </div>
        </div>

        <div className='flex gap-2 overflow-x-auto pb-2'>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setLimit(12);
              }}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-800 text-white font-medium'
                  : 'bg-white text-gray-700 border border-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 px-4 flex-1'>
        {filteredProducts.slice(0, limit).map((product) => (
          <div
            key={product._id}
            className='bg-white rounded-xl p-3 shadow-sm border border-gray-200 flex flex-col'
          >
            <div className='h-32 bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden relative'>
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  className='object-cover'
                />
              ) : (
                <span className='text-gray-400 text-xs'>Sem foto</span>
              )}
            </div>
            <span className='text-[10px] font-bold uppercase tracking-wider text-slate-500'>
              {product.category}
            </span>
            <h2 className='text-sm font-bold text-gray-900 mt-1 line-clamp-2 mb-4'>
              {product.title}
            </h2>
            {/* 4. Preço Removido daqui */}
            <a
              href={`https://wa.me/5500999999999?text=Tenho interesse em: ${product.title}`}
              className='block w-full text-center bg-slate-900 text-white font-semibold py-2.5 text-xs rounded-lg mt-auto hover:bg-slate-800 transition-colors'
            >
              Fazer Pedido
            </a>
          </div>
        ))}
      </div>
      <div ref={sentinelRef} className='h-10' />

      {/* 5. Novo Footer Institucional */}
      <footer className='w-full bg-white border-t border-gray-200 mt-12 py-8 px-4 text-center'>
        <div className='max-w-7xl mx-auto flex flex-col gap-4'>
          <h3 className='font-bold text-gray-900'>Nosso Catálogo</h3>
          <p className='text-sm text-gray-600'>
            Atendimento de Segunda a Sexta, das 08h às 18h.
          </p>
          <div className='flex justify-center items-center gap-2 text-sm text-gray-600 mt-2'>
            <span>💳 Aceitamos Cartões</span>
            <span>•</span>
            <span>💠 Pix</span>
          </div>
          <p className='text-xs text-gray-400 mt-4'>
            © 2026 Nome da Empresa. Rua Exemplo, 123, Centro - Cidade/UF.
          </p>
        </div>
      </footer>
    </div>
  );
}
