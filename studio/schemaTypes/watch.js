import {defineType, defineField, defineArrayMember} from 'sanity'

export const watch = defineType({
  name: 'watch',
  title: 'Watch',
  type: 'document',
  fields: [
    defineField({
      name: 'tapes',
      title: 'Fitas VHS',
      description: 'Arraste para mudar a ordem. A primeira fita é a que começa no videocassete.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'tape',
          fields: [
            defineField({
              name: 'youtubeUrl',
              title: 'Link do YouTube',
              type: 'url',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'type',
              title: 'Tipo',
              type: 'string',
              options: {list: [{title: 'Live set', value: 'liveset'}, {title: 'Episódio', value: 'episode'}], layout: 'radio'},
              initialValue: 'episode',
            }),
            defineField({
              name: 'label',
              title: 'Etiqueta da fita',
              description: 'Texto curto na fita. Exemplo: LIVE SET, EP04',
              type: 'string',
              validation: (r) => r.required().max(12),
            }),
            defineField({name: 'title', title: 'Título', type: 'localeString', validation: (r) => r.required()}),
            defineField({name: 'description', title: 'Descrição curta', type: 'localeString'}),
            defineField({name: 'duration', title: 'Duração', description: 'Exemplo: 43 MIN ou 7:24', type: 'string'}),
            defineField({name: 'hidden', title: 'Esconder do site', type: 'boolean', initialValue: false}),
          ],
          preview: {
            select: {label: 'label', title: 'title.pt', hidden: 'hidden'},
            prepare: ({label, title, hidden}) => ({title: `${label}  ${title || ''}`, subtitle: hidden ? 'Escondida' : ''}),
          },
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Watch'})},
})
