// web/src/app/page.tsx
import { client } from '@/sanity/lib/client';
import ProductList from '@/app/components/ProductList';

export default async function Page() {
  const products = await client.fetch(`*[_type == "product"]{
    _id,
    title,
    price,
    category,
    "imageUrl": image.asset->url
  }`);

  return (
    <main className='max-w-7xl mx-auto px-4 py-12 bg-gray-50 min-h-screen'>
      <header className='mb-12 text-center'>
        <h1 className='text-4xl font-extrabold text-gray-900 mb-2'>
          Catálogo de Materiais
        </h1>
        <p className='text-gray-600'>
          Busque e encontre o que precisa para sua obra.
        </p>
      </header>

      <ProductList products={products} />
    </main>
  );
}
