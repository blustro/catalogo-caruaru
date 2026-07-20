/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import {
  Filter,
  Search,
  ChevronDown,
  Check,
  Loader2,
  ChevronRight,
} from 'lucide-react';

// Importação da Server Action que criamos
import { fetchProducts } from '@/app/actions/getProducts';

// Componentes do Shadcn
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const SHOW_BANNER = true;

// Mapeamento de Categorias e Subcategorias
const CATEGORY_MAP: Record<string, string[]> = {
  Todos: [],
  Ferramentas: ['Manuais', 'Elétricas', 'Baterias', 'Medição'],
  Hidráulica: ['Tubos', 'Conexões', 'Bombas', 'Filtros'],
  Elétrica: ['Iluminação', 'Fios e Cabos', 'Quadros', 'Tomadas'],
  Ferragens: ['Fechaduras', 'Dobradiças', 'Pregos e Parafusos', 'Trincos'],
  Jardinagem: ['Vasos', 'Sementes', 'Equipamentos', 'Adubos'],
};

export default function ProductList() {
  // Estados para dados e paginação
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Estados dos Filtros
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedSubcategory, setSelectedSubcategory] = useState('Todas');
  const [sortBy, setSortBy] = useState('default');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);

  // 1. Debounce para a Busca (Evita disparar requisições a cada tecla)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  // 2. Busca de dados inicial / quando os filtros mudam (Sem disparar setState síncrono no topo)
  useEffect(() => {
    let isCancelled = false;

    async function loadData() {
      setIsInitialLoading(true);
      setPage(0);

      try {
        const result = await fetchProducts({
          category: selectedCategory,
          subcategory: selectedSubcategory,
          search: debouncedSearch,
          sortBy: sortBy,
          page: 0,
          pageSize: 12,
        });

        if (!isCancelled) {
          setProducts(result.products);
          setHasMore(result.hasMore);
          setTotalCount(result.total);
        }
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      } finally {
        if (!isCancelled) {
          setIsInitialLoading(false);
        }
      }
    }

    loadData();

    // Cleanup caso o usuário mude os filtros muito rápido
    return () => {
      isCancelled = true;
    };
  }, [selectedCategory, selectedSubcategory, debouncedSearch, sortBy]);

  // Observer de Rolagem para carregar a próxima página (Infinite Scroll / Lazy Loading)
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isLoadingMore &&
          !isInitialLoading
        ) {
          setIsLoadingMore(true);
          const nextPage = page + 1;

          try {
            const result = await fetchProducts({
              category: selectedCategory,
              subcategory: selectedSubcategory,
              search: debouncedSearch,
              sortBy: sortBy,
              page: nextPage,
              pageSize: 12,
            });

            setProducts((prev) => [...prev, ...result.products]);
            setPage(nextPage);
            setHasMore(result.hasMore);
          } catch (error) {
            console.error('Erro ao carregar mais produtos:', error);
          } finally {
            setIsLoadingMore(false);
          }
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [
    hasMore,
    isLoadingMore,
    isInitialLoading,
    page,
    selectedCategory,
    selectedSubcategory,
    debouncedSearch,
    sortBy,
  ]);

  // Handler ao mudar de categoria principal no menu
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory('Todas'); // Reseta a subcategoria ao trocar de categoria principal
  };

  return (
    <div className='w-full overflow-x-hidden flex flex-col min-h-screen bg-gray-50 font-sans text-slate-900'>
      {/* Banner de Promoções */}
      {SHOW_BANNER && (
        <div className='w-full bg-slate-900 text-white text-center py-2 px-4 text-sm font-medium tracking-wide leading-tight'>
          🎉 Promoção de Black Friday! Consulte nossas condições pelo WhatsApp.
        </div>
      )}

      {/* Header Fixo de Controles */}
      <div className='sticky top-0 bg-white/95 backdrop-blur-md p-4 mb-6 border-b z-10 flex flex-col gap-4 shadow-sm'>
        {/* Linha Topo: Título + Botão Drawer de Filtros */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-xl font-black tracking-tight text-slate-800'>
              Catálogo
            </h1>
            <p className='text-xs text-gray-500 font-medium'>
              {totalCount}{' '}
              {totalCount === 1 ? 'produto encontrado' : 'produtos encontrados'}
            </p>
          </div>

          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger
              render={
                <Button
                  variant='outline'
                  className='flex items-center gap-2 font-medium bg-white'
                >
                  <Filter className='w-4 h-4' />
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
                  Categorias & Subcategorias
                </SheetTitle>
              </SheetHeader>

              {/* Lista de Categorias Principais */}
              <div className='flex flex-col gap-3'>
                <label className='text-xs font-bold uppercase tracking-wider text-gray-400'>
                  Categorias Principais
                </label>
                <div className='flex flex-col gap-2'>
                  {Object.keys(CATEGORY_MAP).map((cat) => (
                    <div key={cat} className='flex flex-col gap-1'>
                      <button
                        onClick={() => handleCategorySelect(cat)}
                        className={`flex items-center justify-between w-full px-4 py-3.5 rounded-xl text-sm text-left font-semibold transition-all ${
                          selectedCategory === cat
                            ? 'bg-slate-900 text-white shadow-md'
                            : 'text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-100'
                        }`}
                      >
                        <span className='flex items-center gap-2'>{cat}</span>
                        {selectedCategory === cat ? (
                          <Check className='w-4 h-4 text-white' />
                        ) : (
                          CATEGORY_MAP[cat].length > 0 && (
                            <ChevronRight className='w-4 h-4 text-gray-400' />
                          )
                        )}
                      </button>

                      {/* Subcategorias Dinâmicas (Aparecem quando a Categoria está Selecionada) */}
                      {selectedCategory === cat &&
                        CATEGORY_MAP[cat].length > 0 && (
                          <div className='ml-4 pl-3 border-l-2 border-slate-200 flex flex-col gap-1.5 my-2'>
                            <label className='text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1'>
                              Subcategorias
                            </label>
                            <button
                              onClick={() => setSelectedSubcategory('Todas')}
                              className={`text-xs text-left px-3 py-2 rounded-lg transition-colors ${
                                selectedSubcategory === 'Todas'
                                  ? 'bg-slate-200 text-slate-900 font-bold'
                                  : 'text-gray-600 hover:bg-gray-100'
                              }`}
                            >
                              • Todas desta categoria
                            </button>
                            {CATEGORY_MAP[cat].map((sub) => (
                              <button
                                key={sub}
                                onClick={() => setSelectedSubcategory(sub)}
                                className={`text-xs text-left px-3 py-2 rounded-lg transition-colors flex items-center justify-between ${
                                  selectedSubcategory === sub
                                    ? 'bg-slate-200 text-slate-900 font-bold'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                              >
                                <span>{sub}</span>
                                {selectedSubcategory === sub && (
                                  <Check className='w-3.5 h-3.5 text-slate-900' />
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>

              <Button
                className='w-full mt-8 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3'
                onClick={() => setIsFilterOpen(false)}
              >
                Ver Produtos ({totalCount})
              </Button>
            </SheetContent>
          </Sheet>
        </div>

        {/* Linha Baixo: Campo de Busca & Ordenação */}
        <div className='flex flex-col gap-3'>
          <div className='relative w-full'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
            <input
              type='text'
              placeholder='O que você procura?'
              value={search}
              className='w-full pl-11 p-3.5 rounded-xl border border-gray-300 shadow-sm outline-none focus:ring-2 focus:ring-slate-800 text-gray-900 placeholder:text-gray-500 font-medium'
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className='relative w-full'>
            <select
              value={sortBy}
              className='w-full p-3.5 rounded-xl border border-gray-300 bg-white shadow-sm outline-none appearance-none pr-11 text-gray-900 font-medium'
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value='default'>Ordenação Padrão</option>
              <option value='name-asc'>Nome (A - Z)</option>
              <option value='name-desc'>Nome (Z - A)</option>
            </select>
            <ChevronDown className='absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none' />
          </div>
        </div>
      </div>

      {/* Grid de Produtos */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr'>
        {/* State 1: Carregamento Inicial (Skeletons) */}
        {isInitialLoading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className='bg-white rounded-xl p-3 border border-gray-200 animate-pulse flex flex-col gap-2'
            >
              <div className='h-40 bg-gray-200 rounded-lg w-full' />
              <div className='h-3 bg-gray-200 rounded w-1/2' />
              <div className='h-4 bg-gray-200 rounded w-3/4' />
              <div className='h-9 bg-gray-200 rounded-lg mt-auto' />
            </div>
          ))
        ) : products.length === 0 ? (
          /* State 2: Lista Vazia */
          <div className='col-span-full text-center py-16 flex flex-col items-center justify-center'>
            <p className='text-gray-500 text-base font-semibold'>
              Nenhum produto encontrado.
            </p>
            <p className='text-gray-400 text-xs mt-1'>
              Tente mudar o termo de busca ou limpar os filtros de categoria.
            </p>
          </div>
        ) : (
          /* State 3: Renderização dos Produtos */
          products.map((product) => (
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

              {/* Badges de Categoria e Subcategoria */}
              <div className='flex items-center gap-1.5 flex-wrap mb-1'>
                <span className='text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded'>
                  {product.category}
                </span>
                {product.subcategory && (
                  <span className='text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded'>
                    {product.subcategory}
                  </span>
                )}
              </div>

              <h2 className='text-sm font-bold text-gray-900 mt-1 line-clamp-3 mb-4 leading-snug'>
                {product.title}
              </h2>

              <a
                href={`https://wa.me/5500999999999?text=Tenho interesse em: ${product.title}`}
                target='_blank'
                rel='noopener noreferrer'
                className='block w-full text-center bg-emerald-600 text-white font-bold py-3 text-sm rounded-lg mt-auto hover:bg-emerald-700 transition-colors shadow-sm'
              >
                Consultar
              </a>
            </div>
          ))
        )}
      </div>

      {/* Sentinela de Rolagem + Spinner de Carregamento para Próximas Páginas */}
      <div ref={sentinelRef} className='py-8 flex justify-center items-center'>
        {isLoadingMore && (
          <div className='flex items-center gap-2 text-slate-600 font-medium text-sm'>
            <Loader2 className='w-5 h-5 animate-spin text-slate-800' />
            <span>Carregando mais produtos...</span>
          </div>
        )}
      </div>

      {/* Footer Institucional */}
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
