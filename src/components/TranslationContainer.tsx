import { useMemo } from 'react'

import { TranslationContext } from '../contexts'
import { Locales } from '../types'
import { useLanguage } from '../hooks'

type Props = {
  locales: Locales,
  defaultLanguage: string,
  cookieKey?: string
  children: React.ReactNode,
}

export default function TranslationContainer ({ locales, defaultLanguage, children, cookieKey }: Props) {
  const supportedLanguages = useMemo(() => Object.keys(locales), [locales])

  const [language, setLanguage] = useLanguage(supportedLanguages, defaultLanguage, cookieKey)

  const locale = useMemo(() => locales[language], [language, locales])

  return (
    <TranslationContext.Provider value={{ language, setLanguage, locales, locale, cookieKey }}>
      {children}
    </TranslationContext.Provider>
  )
}
