'use server';

import { createClient } from 'next-sanity';

// Configure com os dados do seu projeto Sanity
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

export interface FetchProductsParams {
  category?: string;
  subcategory?: string;
  search?: string;
  sortBy?: string;
  page?: number;
  pageSize?: number;
}

export async function fetchProducts({
  category = 'Todos',
  subcategory = 'Todas',
  search = '',
  sortBy = 'default',
  page = 0,
  pageSize = 12,
}: FetchProductsParams) {
  const start = page * pageSize;
  const end = start + pageSize;

  // Construção dinâmica de filtros GROQ
  let filter = `_type == "product"`;

  if (category && category !== 'Todos') {
    filter += ` && category == "${category}"`;
  }

  if (subcategory && subcategory !== 'Todas') {
    filter += ` && subcategory == "${subcategory}"`;
  }

  if (search.trim()) {
    filter += ` && title match "*${search.trim()}*"`;
  }

  // Ordenação
  let order = '';
  if (sortBy === 'name-asc') order = '| order(title asc)';
  if (sortBy === 'name-desc') order = '| order(title desc)';

  // Consulta paginada de produtos
  const query = `*[${filter}] ${order} [${start}...${end}] {
    _id,
    title,
    category,
    subcategory,
    imageUrl
  }`;

  // Consulta para total de itens (usado para saber se a lista acabou)
  const countQuery = `count(*[${filter}])`;

  const [products, total] = await Promise.all([
    client.fetch(query),
    client.fetch(countQuery),
  ]);

  return {
    products,
    hasMore: start + products.length < total,
    total,
  };
}
