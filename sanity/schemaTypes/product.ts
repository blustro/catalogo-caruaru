import { defineType } from 'sanity';

const product = defineType({
  name: 'product',
  type: 'document',
  title: 'Produto',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Nome do Produto',
    },
    {
      name: 'category',
      type: 'string',
      title: 'Categoria',
    },
    {
      name: 'price',
      type: 'number',
      title: 'Preço',
    },
    {
      name: 'description',
      type: 'text',
      title: 'Descrição',
    },
    {
      name: 'image',
      type: 'image',
      title: 'Imagem',
      options: { hotspot: true },
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'title' },
    },
    {
      name: 'inStock',
      type: 'boolean',
      title: 'Em Estoque',
    },
  ],
});

export default product;
