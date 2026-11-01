import {defineType, defineField, defineArrayMember} from 'sanity'

export const gallery = defineType({
  name: 'gallery',
  title: 'Galeria',
  type: 'document',
  fields: [
    defineField({
      name: 'photos',
      title: 'Fotos',
      description: 'Arraste para mudar a ordem. As 7 primeiras marcadas como destaque aparecem no mosaico.',
      type: 'array',
      options: {layout: 'grid'},
      of: [
        defineArrayMember({
          type: 'image',
          name: 'photo',
          options: {hotspot: true},
          fields: [
            defineField({
              name: 'alt',
              title: 'Descrição da foto',
              description: 'Usada por leitores de tela e pelo Google.',
              type: 'localeString',
              validation: (r) => r.required(),
            }),
            defineField({name: 'featured', title: 'Destaque no mosaico', type: 'boolean', initialValue: true}),
          ],
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Galeria'})},
})
