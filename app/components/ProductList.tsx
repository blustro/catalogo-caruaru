/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Image from 'next/image';
import { useState, useMemo, useRef } from 'react';
import { Filter, Search, ChevronDown, Check } from 'lucide-react';

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const SHOW_BANNER = true;

export default function ProductList({ products }: { products: any[] }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [sortBy, setSortBy] = useState('default');
  const [limit, setLimit] = useState(12);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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

    return result.sort((a, b) => {
      if (sortBy === 'name-asc') return a.title.localeCompare(b.title);
      if (sortBy === 'name-desc') return b.title.localeCompare(a.title);
      return 0;
    });
  }, [search, selectedCategory, sortBy, products]);

  // ... (Mantenha o seu useEffect do IntersectionObserver aqui) ...

  const applyCategoryAndClose = (cat: string) => {
    setSelectedCategory(cat);
    setLimit(12);
    // Fecha o menu lateral automaticamente ao escolher a categoria
    setIsFilterOpen(false);
  };

  return (
    // Adicionado 'font-sans' para corrigir o problema da Times New Roman
    <div className='w-full overflow-x-hidden flex flex-col min-h-screen bg-gray-50 font-sans text-slate-900'>
      {SHOW_BANNER && (
        <div className='w-full bg-slate-900 text-white text-center py-2 px-4 text-sm font-medium tracking-wide leading-tight'>
          🎉 Promoção de Black Friday! Consulte nossas condições pelo WhatsApp.
        </div>
      )}

      {/* Header Fixo com Busca, Ordenação e Botão de Categorias */}
      <div className='sticky top-0 bg-white/95 backdrop-blur-md p-4 mb-6 border-b z-10 flex flex-col gap-4 shadow-sm'>
        {/* Linha 1: Título e Botão do Menu de Categorias */}
        <div className='flex items-center justify-between'>
          <h1 className='text-xl font-black tracking-tight text-slate-800'>
            Catálogo
          </h1>

          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger
              render={
                <Button
                  variant='outline'
                  className='flex items-center gap-2 font-medium bg-white'
                >
                  <Filter className='w-4 h-4' />
                  {/* Mostra a categoria selecionada no botão, se não for "Todos" */}
                  {selectedCategory === 'Todos'
                    ? 'Categorias'
                    : selectedCategory}
                </Button>
              }
            ></SheetTrigger>

            <SheetContent
              side='right'
              className='w-[85vw] sm:max-w-md overflow-y-auto p-6 font-sans'
            >
              <SheetHeader className='mb-6 text-left'>
                <SheetTitle className='text-xl font-bold text-slate-900'>
                  Categorias
                </SheetTitle>
              </SheetHeader>

              {/* Espaçamento melhorado dentro do Sheet (gap-2 e py-4) */}
              <div className='flex flex-col gap-2 mt-4'>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => applyCategoryAndClose(cat)}
                    className={`flex items-center justify-between w-full px-4 py-4 rounded-xl text-base text-left transition-all ${
                      selectedCategory === cat
                        ? 'bg-slate-900 text-white font-bold shadow-md'
                        : 'text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-100'
                    }`}
                  >
                    {cat}
                    {selectedCategory === cat && (
                      <Check className='w-5 h-5 text-white' />
                    )}
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Linha 2: Busca e Ordenação (Fora do Sheet, como pedido) */}
        <div className='flex flex-col gap-3'>
          <div className='relative w-full'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
            <input
              type='text'
              placeholder='O que você procura?'
              value={search}
              className='w-full pl-11 p-3.5 rounded-xl border border-gray-300 shadow-sm outline-none focus:ring-2 focus:ring-slate-800 text-gray-900 placeholder:text-gray-500 font-medium'
              onChange={(e) => {
                setSearch(e.target.value);
                setLimit(12);
              }}
            />
          </div>

          <div className='relative w-full'>
            <select
              value={sortBy}
              className='w-full p-3.5 rounded-xl border border-gray-300 bg-white shadow-sm outline-none appearance-none pr-11 text-gray-900 font-medium'
              onChange={(e) => {
                setSortBy(e.target.value);
                setLimit(12);
              }}
            >
              <option value='default'>Padrão</option>
              <option value='name-asc'>Nome (A - Z)</option>
              <option value='name-desc'>Nome (Z - A)</option>
            </select>
            <ChevronDown className='absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none' />
          </div>
        </div>
      </div>

      {/* Grid de Produtos */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 px-4 flex-1 max-w-7xl mx-auto w-full'>
        {filteredProducts.slice(0, limit).map((product) => (
          <div
            key={product._id}
            className='bg-white rounded-xl p-3 shadow-sm border border-gray-200 flex flex-col hover:shadow-md transition-shadow'
          >
            <div className='h-40 bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden relative'>
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  className='object-cover'
                />
              ) : (
                <span className='text-gray-400 text-xs font-medium'>
                  Sem foto
                </span>
              )}
            </div>
            <span className='text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1'>
              {product.category}
            </span>
            <h2 className='text-sm font-bold text-gray-900 mt-1 line-clamp-3 mb-4 leading-snug'>
              {product.title}
            </h2>

            <a
              href={`https://wa.me/5500999999999?text=Tenho interesse em: ${product.title}`}
              className='block w-full text-center bg-emerald-600 text-white font-bold py-3 text-sm rounded-lg mt-auto hover:bg-emerald-700 transition-colors shadow-sm'
            >
              Consultar
            </a>
          </div>
        ))}
      </div>
      <div ref={sentinelRef} className='h-10' />

      {/* Footer */}
      <footer className='w-full bg-white border-t border-gray-200 mt-12 py-10 px-4 text-center'>
        <div className='max-w-7xl mx-auto flex flex-col gap-4'>
          <h3 className='font-black text-gray-900 text-lg'>Nosso Catálogo</h3>
          <p className='text-sm text-gray-600 font-medium'>
            Atendimento de Segunda a Sexta, das 08h às 18h.
          </p>
          <div className='flex justify-center items-center gap-3 text-sm text-gray-700 font-semibold mt-2'>
            <span className='bg-gray-100 px-3 py-1 rounded-full'>
              💳 Cartões
            </span>
            <span className='bg-gray-100 px-3 py-1 rounded-full'>💠 Pix</span>
          </div>
          <p className='text-xs text-gray-400 mt-6 font-medium'>
            © 2026 Nome da Empresa. Rua Exemplo, 123, Centro - Cidade/UF.
          </p>
        </div>
      </footer>
    </div>
  );
}
