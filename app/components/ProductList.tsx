/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Image from 'next/image';
import { useState, useMemo } from 'react';

export default function ProductList({ products }: { products: any[] }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Extrair categorias únicas automaticamente
  const categories = [
    'Todos',
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  // Lógica de filtragem (Busca + Categoria)
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        selectedCategory === 'Todos' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory, products]);

  return (
    <div className='w-full'>
      {/* Barra de Busca e Filtros */}
      <div className='sticky top-0 bg-gray-50/90 backdrop-blur-sm p-4 mb-8 border-b z-10'>
        <input
          type='text'
          placeholder='Buscar produto...'
          className='w-full p-4 rounded-xl border border-gray-200 shadow-sm mb-4 focus:ring-2 focus:ring-emerald-500 outline-none'
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className='flex gap-2 overflow-x-auto pb-2'>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
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

      {/* Grid de Produtos */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className='bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition-all'
          >
            <div className='h-48 bg-gray-200 rounded-xl mb-4 flex items-center justify-center overflow-hidden'>
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  className='h-full w-full object-cover'
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
              R$ {product.price.toFixed(2)}
            </p>
            <a
              href={`https://wa.me/5500999999999?text=Tenho interesse em: ${product.title}`}
              className='block w-full text-center bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition-colors'
            >
              Pedir via WhatsApp
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
