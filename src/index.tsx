import {createRoot} from 'react-dom/client'
import {MetronicI18nProvider} from './_metronic/i18n/Metronici18n'
import {AppRoutes} from './app/routing/AppRoutes'
import './_metronic/assets/sass/style.scss'
import './_metronic/assets/sass/plugins.scss'
import './_metronic/assets/sass/style.react.scss'

/**
 * TIP: Replace this style import with rtl styles to enable rtl mode
 *
 * import './_metronic/assets/css/style.rtl.css'
 **/

const container = document.getElementById('root')
if (container) {
  createRoot(container).render(
    <MetronicI18nProvider>
      <AppRoutes />
    </MetronicI18nProvider>
  )
}
