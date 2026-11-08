import {defineType, defineField, defineArrayMember} from 'sanity'

const SECTIONS = [
  {title: 'Storytelling', value: 'storytelling'},
  {title: 'Watch', value: 'watch'},
  {title: 'Music', value: 'music'},
  {title: 'Galeria', value: 'gallery'},
  {title: 'Store', value: 'store'},
  {title: 'Live (agenda)', value: 'live'},
  {title: 'Join', value: 'join'},
  {title: 'Booking', value: 'booking'},
]

export const settings = defineType({
  name: 'settings',
  title: 'Geral, seções e Booking',
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
      name: 'sections',
      title: 'Seções do site',
      description: 'Arraste para mudar a ordem da página e do menu. Desmarque "Ligada" para esconder a seção. A Home fica sempre em primeiro.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'sectionItem',
          fields: [
            defineField({
              name: 'section',
              title: 'Seção',
              type: 'string',
              options: {list: SECTIONS},
              validation: (r) => r.required(),
            }),
            defineField({name: 'enabled', title: 'Ligada', type: 'boolean', initialValue: true}),
            defineField({
              name: 'title',
              title: 'Nome no menu e título da seção',
              description: 'Opcional. Em branco, usa o nome padrão do site.',
              type: 'localeString',
            }),
            defineField({
              name: 'subtitle',
              title: 'Subtítulo da seção',
              description: 'Opcional. A frase que aparece embaixo do título. Em branco, usa o texto padrão.',
              type: 'localeString',
            }),
          ],
          preview: {
            select: {section: 'section', enabled: 'enabled', name: 'title.pt'},
            prepare: ({section, enabled, name}) => ({
              title: name || SECTIONS.find((o) => o.value === section)?.title || section,
              subtitle: enabled === false ? 'Desligada' : 'Ligada',
            }),
          },
        }),
      ],
      initialValue: SECTIONS.map(({value}) => ({_type: 'sectionItem', section: value, enabled: !['store', 'live'].includes(value)})),
      validation: (r) =>
        r.custom((items = []) => {
          const keys = items.map((i) => i.section)
          return new Set(keys).size === keys.length ? true : 'Cada seção só pode aparecer uma vez.'
        }),
    }),
    defineField({
      name: 'shareImage',
      title: 'Imagem de compartilhamento',
      description: 'Aparece quando alguém compartilha o link do site. Ideal: 1200 × 630 px.',
      type: 'image',
    }),
    defineField({name: 'shareText', title: 'Texto de compartilhamento', type: 'localeText'}),
  ],
  preview: {prepare: () => ({title: 'Geral, seções e Booking'})},
})
