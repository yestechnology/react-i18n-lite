import { useEffect, useMemo, useState } from 'react'

import { TranslationContext } from 'contexts'
import { Locales } from 'types'

type Props = {
  locales: Locales,
  defaultLanguage: string,
  children: React.ReactNode,
}

export default function TranslationContainer ({ locales, defaultLanguage, children }: Props) {
  const urlSearchParams = new URLSearchParams(location.search)
  const initialLanguage = urlSearchParams.get('lang') || defaultLanguage

  const supportedLanguages = useMemo(() => Object.keys(locales), [locales])

  const [language, setLanguage] = useState(initialLanguage)

  useEffect(() => {
    document.documentElement.lang = language

    if (!supportedLanguages.includes(language)) {
      console.error('Unsupported language: ', language)
    }
  }, [language, supportedLanguages])

  const locale = useMemo(() => locales[language], [language, locales])

  return (
    <TranslationContext.Provider value={{ language, setLanguage, locales, locale }}>
      {children}
    </TranslationContext.Provider>
  )
}
