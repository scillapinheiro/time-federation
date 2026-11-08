import {localeString, localeText} from './localized'
import {settings} from './settings'
import {watch} from './watch'
import {music} from './music'
import {gallery} from './gallery'
import {live} from './live'
import {store} from './store'
import {storytelling} from './storytelling'
import {join} from './join'

export const schemaTypes = [localeString, localeText, settings, storytelling, watch, music, gallery, live, store, join]

// Each section is a single document edited in place
export const singletons = [
  {id: 'storytelling', title: 'Storytelling'},
  {id: 'watch', title: 'Watch'},
  {id: 'music', title: 'Music'},
  {id: 'gallery', title: 'Galeria'},
  {id: 'live', title: 'Live (agenda)'},
  {id: 'store', title: 'Store'},
  {id: 'join', title: 'Join (grupo do WhatsApp)'},
  {id: 'settings', title: 'Geral, seções e Booking'},
]
