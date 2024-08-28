import {createRoot} from 'react-dom/client'
import {MetronicI18nProvider} from './_metronic/i18n/Metronici18n'
import {AppRoutes} from './app/routing/AppRoutes'

import './_metronic/assets/sass/style.scss'
import './_metronic/assets/sass/plugins.scss'
import './_metronic/assets/sass/style.react.scss'

import {Provider} from 'react-redux'
import {store} from './store'

const container = document.getElementById('root')
if (container) {
  createRoot(container).render(
    <MetronicI18nProvider>
      <Provider store={store}>
        <AppRoutes />
      </Provider>
    </MetronicI18nProvider>
  )
}
