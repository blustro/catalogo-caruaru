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
      name: 'slug',
      title: 'Slug (URL Amigável)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
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
      name: 'price',
      title: 'Preço Regular (R$)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),

    // --- BLOCO DE PROMOÇÃO COM TOGGLE ---
    defineField({
      name: 'isOnSale',
      title: 'Colocar em Promoção?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'promotionalPrice',
      title: 'Preço Promocional (R$)',
      type: 'number',
      hidden: ({ document }) => !document?.isOnSale, // Só aparece se o toggle estiver ativo
    }),
    defineField({
      name: 'saleBadgeText',
      title: 'Texto da Tag de Promoção (ex: 20% OFF)',
      type: 'string',
      hidden: ({ document }) => !document?.isOnSale, // Só aparece se o toggle estiver ativo
    }),

    defineField({
      name: 'sizes',
      title: 'Tamanhos Disponíveis',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),

    // --- IMAGENS (Array com suporte a múltiplas fotos e hotspot) ---
    defineField({
      name: 'images',
      title: 'Imagens do Produto',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
      options: {
        layout: 'grid',
      },
    }),

    // --- DESCRIÇÃO COM WYSIWYG (Block Content) ---
    defineField({
      name: 'description',
      title: 'Descrição Detalhada',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Título 3', value: 'h3' },
            { title: 'Bullet', value: 'bullet' },
          ],
          lists: [{ title: 'Bullet', value: 'bullet' }],
          // Habilita formatações ricas como Negrito, Itálico, etc.
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Underline', value: 'underline' },
            ],
          },
        },
      ],
    }),

    defineField({
      name: 'isFeatured',
      title: 'Produto em Destaque',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'images.0', // Usa a primeira imagem do array como miniatura no painel
    },
  },
});
