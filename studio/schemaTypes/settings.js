import {defineType, defineField, defineArrayMember} from 'sanity'

export const settings = defineType({
  name: 'settings',
  title: 'Geral e Booking',
  type: 'document',
  fields: [
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp para booking',
      description: 'Só números, com país e DDD. Exemplo: 5547988044644',
      type: 'string',
      validation: (r) => r.required().regex(/^\d{12,13}$/, {name: 'número com país e DDD'}),
    }),
    defineField({
      name: 'whatsappMessage',
      title: 'Mensagem que já vem escrita no WhatsApp',
      type: 'localeString',
    }),
    defineField({
      name: 'socials',
      title: 'Redes sociais',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'social',
          fields: [
            defineField({
              name: 'icon',
              title: 'Rede',
              type: 'string',
              options: {list: ['spotify', 'soundcloud', 'instagram', 'youtube']},
              validation: (r) => r.required(),
            }),
            defineField({name: 'name', title: 'Nome exibido', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'url', title: 'Link', type: 'url', validation: (r) => r.required()}),
          ],
          preview: {select: {title: 'name', subtitle: 'url'}},
        }),
      ],
    }),
    defineField({name: 'youtubeChannel', title: 'Link do canal do YouTube', type: 'url'}),
    defineField({
      name: 'showStore',
      title: 'Mostrar a Store no site',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'showLive',
      title: 'Mostrar a Live (agenda) no site',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'shareImage',
      title: 'Imagem de compartilhamento',
      description: 'Aparece quando alguém compartilha o link do site. Ideal: 1200 × 630 px.',
      type: 'image',
    }),
    defineField({name: 'shareText', title: 'Texto de compartilhamento', type: 'localeText'}),
  ],
  preview: {prepare: () => ({title: 'Geral e Booking'})},
})
