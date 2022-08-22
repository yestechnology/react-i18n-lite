import { useEffect, useState } from 'react'

type UseLanguage = (supportedLanguages: string[], defaultLanguage: string) => (
  [string, (language: string) => void]
)

const useLanguage: UseLanguage = (supportedLanguages: string[], defaultLanguage: string) => {
  const browserLanguage = window.navigator.language
  const isBrowserLangSupported = supportedLanguages.includes(browserLanguage)
  const initialLanguage = isBrowserLangSupported ? browserLanguage : defaultLanguage

  const [language, setLanguage] = useState(initialLanguage)

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const handleSetLanguage = (language: string) => {
    const isLanguageSupported = supportedLanguages.includes(language)
    const newLanguage = isLanguageSupported ? language : defaultLanguage
    setLanguage(newLanguage)

    if (!isLanguageSupported) {
      console.error('Unsupported language: ', language)
    }
  }

  return [language, handleSetLanguage]
}

export default useLanguage
