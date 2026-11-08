import {defineType, defineField, defineArrayMember} from 'sanity'

const paragraphs = 'Deixe uma linha em branco entre um parágrafo e outro.'

export const storytelling = defineType({
  name: 'storytelling',
  title: 'Storytelling',
  type: 'document',
  fields: [
    defineField({name: 'headline', title: 'Frase de abertura', type: 'localeString'}),
    defineField({name: 'whoWeAre', title: 'Quem somos', description: paragraphs, type: 'localeText'}),
    defineField({name: 'whatWeSee', title: 'O que vemos', description: paragraphs, type: 'localeText'}),
    defineField({name: 'whatWeFight', title: 'Contra o que lutamos', description: paragraphs, type: 'localeText'}),
    defineField({name: 'mission', title: 'Nossa missão', description: paragraphs, type: 'localeText'}),
    defineField({name: 'crewIntro', title: 'Frase acima das fotos da banda', type: 'localeString'}),
    defineField({
      name: 'members',
      title: 'Integrantes',
      description: 'Arraste para mudar a ordem.',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'member',
          fields: [
            defineField({name: 'name', title: 'Nome', type: 'string', validation: (r) => r.required()}),
            defineField({name: 'bio', title: 'História do personagem', type: 'localeText'}),
            defineField({
              name: 'photo',
              title: 'Foto',
              description: 'Foto em pé (retrato). Use o ponto de foco para manter o rosto no enquadramento.',
              type: 'image',
              options: {hotspot: true},
              fields: [defineField({name: 'alt', title: 'Descrição da foto', type: 'localeString'})],
            }),
          ],
          preview: {select: {title: 'name', media: 'photo'}},
        }),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Storytelling'})},
})
