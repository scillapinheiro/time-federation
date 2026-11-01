import {localeString, localeText} from './localized'
import {settings} from './settings'
import {watch} from './watch'
import {music} from './music'
import {gallery} from './gallery'
import {live} from './live'
import {store} from './store'

export const schemaTypes = [localeString, localeText, settings, watch, music, gallery, live, store]

// Each section is a single document edited in place
export const singletons = [
  {id: 'watch', title: 'Watch'},
  {id: 'music', title: 'Music'},
  {id: 'gallery', title: 'Galeria'},
  {id: 'live', title: 'Live (agenda)'},
  {id: 'store', title: 'Store'},
  {id: 'settings', title: 'Geral e Booking'},
]
