import {defineType, defineField} from 'sanity'

export const join = defineType({
  name: 'join',
  title: 'Join (grupo do WhatsApp)',
  type: 'document',
  fields: [
    defineField({
      name: 'groupUrl',
      title: 'Link do grupo do WhatsApp',
      description: 'O convite do grupo, no formato https://chat.whatsapp.com/...',
      type: 'url',
      validation: (r) => r.uri({scheme: ['https']}),
    }),
    defineField({name: 'lead', title: 'Chamada principal', type: 'localeText'}),
    defineField({name: 'text', title: 'Texto de apoio', type: 'localeText'}),
  ],
  preview: {prepare: () => ({title: 'Join'})},
})
