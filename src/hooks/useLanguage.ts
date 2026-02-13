import { useCallback, useEffect, useState } from 'react'

type UseLanguage = (supportedLanguages: string[], defaultLanguage: string) => (
  [string, (language: string) => void]
)

const useLanguage: UseLanguage = (supportedLanguages: string[], defaultLanguage: string) => {
  const [language, setLanguage] = useState(defaultLanguage)

  const setInitialLanguage = () => {
    const getInitialLanguage = () => {
      const storedLanguage = window.localStorage.getItem('lang')
      if (storedLanguage && supportedLanguages.includes(storedLanguage)) {
        return storedLanguage
      }

      const browserLanguage = window.navigator.language
      if (browserLanguage && supportedLanguages.includes(browserLanguage)) {
        return browserLanguage
      }

      return defaultLanguage
    }

    const initialLanguage = getInitialLanguage()
    setLanguage(initialLanguage)
    window.localStorage.setItem('lang', initialLanguage)
  }

  /**
   * Because of client-only dependencies,
   * the initial server-rendered language may differ from the client.
   * We update it here to prevent hydration mismatches in SSR.
   */
  useEffect(setInitialLanguage, [defaultLanguage, supportedLanguages])

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const handleSetLanguage = useCallback((language: string) => {
    const isLanguageSupported = supportedLanguages.includes(language)
    const newLanguage = isLanguageSupported ? language : defaultLanguage
    setLanguage(newLanguage)
    window.localStorage.setItem('lang', newLanguage)

    if (!isLanguageSupported) {
      console.error('Unsupported language: ', language)
    }
  }, [supportedLanguages, defaultLanguage])

  return [language, handleSetLanguage]
}

export default useLanguage
