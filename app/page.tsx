import ProductList from '@/app/components/ProductList';
import { fetchProducts } from './actions/getProducts';

export default async function HomePage() {
  const initialData = await fetchProducts({ page: 0, pageSize: 12 });

  return (
    <main className='w-full max-w-7xl mx-auto px-2 md:px-4 py-6 md:py-12 bg-gray-50 min-h-screen'>
      <ProductList initialProducts={initialData.products} />
    </main>
  );
}
