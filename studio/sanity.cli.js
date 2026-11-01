import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'ig03yas6',
    dataset: 'production'
  },
  studioHost: 'timefederation',
  deployment: {
    appId: 'zmiertoiv6dfo938sxtjhmdy',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: false,
  },
})
