/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Image from 'next/image';
import { useState, useMemo, useRef, useEffect } from 'react';

export default function ProductList({ products }: { products: any[] }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState('Todos');
  const [limit, setLimit] = useState(12); // Mostra 12 inicialmente
  const sentinelRef = useRef<HTMLDivElement>(null);

  const categories = [
    'Todos',
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const filteredProducts = useMemo(() => {
    // 1. Filtragem
    const result = products.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === 'Todos' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // 2. Ordenação
    return result.sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'name-asc') return a.title.localeCompare(b.title);
      return 0; // 'default'
    });
  }, [search, selectedCategory, sortBy, products]);

  // Lógica do Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLimit((prev) => prev + 12);
        }
      },
      { threshold: 0.1 },
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [limit]); // Recria o observer se o limite mudar

  return (
    <div className='w-full overflow-x-hidden px-0 md:px-4'>
      {/* Barra de Busca, Ordenar e Filtros */}
      <div className='sticky top-0 bg-gray-50/90 backdrop-blur-sm p-4 mb-8 border-b z-10'>
        <div className='flex flex-col gap-3 mb-6'>
          {/* Busca - Ocupa a largura total */}
          <input
            type='text'
            placeholder='Buscar...'
            className='w-full p-3 rounded-xl border border-gray-200 shadow-sm outline-none focus:ring-2 focus:ring-emerald-500'
            onChange={(e) => {
              setSearch(e.target.value);
              setLimit(12);
            }}
          />

          {/* Select com seta customizada */}
          <div className='relative w-full'>
            <select
              className='w-full p-3 rounded-xl border border-gray-200 bg-white shadow-sm outline-none appearance-none pr-10'
              onChange={(e) => {
                setSortBy(e.target.value);
                setLimit(12);
              }}
            >
              <option value='default'>Ordenar por...</option>
              <option value='price-asc'>Preço (Menor ao maior)</option>
              <option value='price-desc'>Preço (Maior ao menor)</option>
              <option value='name-asc'>Nome (A-Z)</option>
            </select>

            {/* Ícone da seta (SVG) posicionado à direita */}
            <div className='pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500'>
              <svg
                className='w-4 h-4'
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
                setLimit(12); // Reseta na interação
              }}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      {/* Grid de Produtos com auto-rows-fr */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr'>
        {filteredProducts.slice(0, limit).map((product) => (
          <div
            key={product._id}
            className='bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-all flex flex-col'
          >
            <div className='h-48 bg-gray-200 rounded-xl mb-4 flex items-center justify-center overflow-hidden relative'>
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  className='object-cover'
                />
              ) : (
                <span className='text-gray-400'>Sem imagem</span>
              )}
            </div>

            <span className='text-xs font-bold uppercase tracking-wider text-blue-600'>
              {product.category}
            </span>
            <h2 className='text-lg font-bold text-gray-800 mt-2'>
              {product.title}
            </h2>
            <p className='text-2xl font-black text-emerald-600 mt-2 mb-4'>
              R$ {product.price?.toFixed(2) || '0.00'}
            </p>

            {/* O mt-auto empurra este botão sempre para baixo */}
            <a
              href={`https://wa.me/5511962436235?text=Tenho interesse em: ${product.title}`}
              className='mt-auto block w-full text-center bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-colors'
            >
              Pedir via WhatsApp
            </a>
          </div>
        ))}
      </div>
      <div ref={sentinelRef} className='h-10' />
    </div>
  );
}
