import * as Sentry from '@sentry/react'
Sentry.init({
  dsn: 'https://561257baf60ad6ef400917ddc32b528e@o4511755199774720.ingest.us.sentry.io/4511755228938240',
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.2,
})

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'framer-motion'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </StrictMode>,
)
