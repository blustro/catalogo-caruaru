import ProductList from '@/app/components/ProductList';

export default function HomePage() {
  return (
    <main className='w-full max-w-7xl mx-auto px-2 md:px-4 py-6 md:py-12 bg-gray-50 min-h-screen'>
      <ProductList />
    </main>
  );
}
