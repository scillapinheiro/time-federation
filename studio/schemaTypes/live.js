import {defineType, defineField, defineArrayMember} from 'sanity'

export const live = defineType({
  name: 'live',
  title: 'Live (agenda)',
  type: 'document',
  fields: [
    defineField({
      name: 'shows',
      title: 'Shows',
      description: 'Quando a data passa, o show vai sozinho para "Shows anteriores".',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'show',
          fields: [
            defineField({name: 'date', title: 'Data', type: 'date', validation: (r) => r.required()}),
            defineField({name: 'city', title: 'Cidade, país', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'venue', title: 'Local', type: 'string', validation: (r) => r.required()}),
            defineField({
              name: 'status',
              title: 'Status',
              type: 'string',
              options: {
                list: [
                  {title: 'À venda', value: 'onsale'},
                  {title: 'Esgotado', value: 'soldout'},
                  {title: 'Em breve', value: 'soon'},
                ],
                layout: 'radio',
              },
              initialValue: 'soon',
            }),
            defineField({name: 'ticketsUrl', title: 'Link do ingresso', type: 'url'}),
          ],
          preview: {
            select: {date: 'date', city: 'city', venue: 'venue'},
            prepare: ({date, city, venue}) => ({title: `${date}  ${city}`, subtitle: venue}),
          },
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Live (agenda)'})},
})
