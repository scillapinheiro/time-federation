import {defineType, defineField} from 'sanity'

// Short text in English and Portuguese
export const localeString = defineType({
  name: 'localeString',
  title: 'Texto (EN / PT)',
  type: 'object',
  fields: [
    defineField({name: 'en', title: 'Inglês', type: 'string'}),
    defineField({name: 'pt', title: 'Português', type: 'string'}),
  ],
})

// Longer text in English and Portuguese
export const localeText = defineType({
  name: 'localeText',
  title: 'Texto longo (EN / PT)',
  type: 'object',
  fields: [
    defineField({name: 'en', title: 'Inglês', type: 'text', rows: 3}),
    defineField({name: 'pt', title: 'Português', type: 'text', rows: 3}),
  ],
})
