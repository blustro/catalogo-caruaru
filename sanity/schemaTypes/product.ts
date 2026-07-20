import { defineField, defineType } from 'sanity';

export const product = defineType({
  name: 'product',
  title: 'Produto',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nome do Produto',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Categoria',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subcategory',
      title: 'Subcategoria',
      type: 'string',
    }),
    defineField({
      name: 'imageUrl',
      title: 'URL da Imagem',
      type: 'url',
    }),
  ],
});
