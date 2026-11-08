import {defineType, defineField, defineArrayMember} from 'sanity'

export const music = defineType({
  name: 'music',
  title: 'Music',
  type: 'document',
  fields: [
    defineField({
      name: 'tracks',
      title: 'Faixas',
      description: 'No site, as faixas aparecem da mais nova para a mais antiga (pela data de lançamento).',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'track',
          fields: [
            defineField({
              name: 'spotifyUrl',
              title: 'Link da faixa no Spotify',
              type: 'url',
              validation: (r) => r.required(),
            }),
            defineField({name: 'title', title: 'Título', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'artists', title: 'Artistas', type: 'string'}),
            defineField({name: 'releaseDate', title: 'Data de lançamento', type: 'date', validation: (r) => r.required()}),
            defineField({
              name: 'label',
              title: 'Texto da etiqueta da fita',
              description: 'Opcional. Use para encurtar títulos longos.',
              type: 'string',
              validation: (r) => r.max(24),
            }),
            defineField({name: 'hidden', title: 'Esconder do site', type: 'boolean', initialValue: false}),
          ],
          preview: {
            select: {title: 'title', date: 'releaseDate', hidden: 'hidden'},
            prepare: ({title, date, hidden}) => ({title, subtitle: [date, hidden && 'Escondida'].filter(Boolean).join('  ')}),
          },
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Music'})},
})
