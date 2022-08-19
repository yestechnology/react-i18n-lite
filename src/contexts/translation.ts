import { createContext } from 'react'

import { Locale, Locales } from 'types'

type TranslationContextValue = {
  language: string
  setLanguage: (language: string) => void
  locales: Locales
  locale: Locale
}

const TranslationContext = createContext<TranslationContextValue>({} as TranslationContextValue)

export default TranslationContext
