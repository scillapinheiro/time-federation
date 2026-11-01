import {defineType, defineField, defineArrayMember} from 'sanity'

export const store = defineType({
  name: 'store',
  title: 'Store',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Nome do produto', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'kicker', title: 'Rótulo acima do nome', description: 'Exemplo: Jaqueta oficial', type: 'localeString'}),
    defineField({name: 'description', title: 'Descrição', type: 'localeText'}),
    defineField({name: 'shopifyUrl', title: 'Link do produto no Shopify', type: 'url'}),
    defineField({
      name: 'photos',
      title: 'Fotos',
      description: 'A primeira é a foto principal. As outras viram miniaturas.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          name: 'photo',
          options: {hotspot: true},
          fields: [
            defineField({name: 'alt', title: 'Descrição da foto', type: 'localeString', validation: (r) => r.required()}),
            defineField({
              name: 'framing',
              title: 'Enquadramento',
              type: 'string',
              options: {list: [{title: 'Foto inteira', value: 'center'}, {title: 'Zoom no detalhe (bordado)', value: 'detail'}]},
              initialValue: 'center',
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Store'})},
})
