import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes, singletons} from './schemaTypes'

const singletonIds = new Set(singletons.map((s) => s.id))

// Two panels: production feeds the live site, staging feeds hml and test links
const workspace = ({name, title, subtitle, dataset}) => ({
  name,
  title,
  subtitle,
  basePath: `/${name}`,

  projectId: 'ig03yas6',
  dataset,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Conteúdo do site')
          .items(singletons.map((s) => S.listItem().title(s.title).id(s.id).child(S.document().schemaType(s.id).documentId(s.id)))),
    }),
  ],

  schema: {
    types: schemaTypes,
    // Sections cannot be created twice or deleted
    templates: (templates) => templates.filter(({schemaType}) => !singletonIds.has(schemaType)),
  },

  document: {
    actions: (actions, {schemaType}) =>
      singletonIds.has(schemaType) ? actions.filter(({action}) => !['duplicate', 'delete', 'unpublish'].includes(action)) : actions,
  },
})

export default defineConfig([
  workspace({name: 'producao', title: 'Produção', subtitle: 'Site oficial', dataset: 'production'}),
  workspace({name: 'homologacao', title: 'Homologação', subtitle: 'Site de testes (hml)', dataset: 'staging'}),
])
