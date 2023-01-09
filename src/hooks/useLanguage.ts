import { useCallback, useEffect, useState } from 'react'

type UseLanguage = (supportedLanguages: string[], defaultLanguage: string) => (
  [string, (language: string) => void]
)

const useLanguage: UseLanguage = (supportedLanguages: string[], defaultLanguage: string) => {
  const getLocalLanguage = () => {
    const localLang = localStorage.getItem('lang')
    if (typeof localLang === 'string') {
      const isLocalLangSupported = supportedLanguages.includes(localLang)

      return isLocalLangSupported ? localLang : ''
    }
    return ''
  }

  const localLanguage = getLocalLanguage()

  let initialLanguage:string

  if (localLanguage !== '') {
    initialLanguage = localLanguage
  } else {
    const browserLanguage = window.navigator.language
    const isBrowserLangSupported = supportedLanguages.includes(browserLanguage)
    initialLanguage = isBrowserLangSupported ? browserLanguage : defaultLanguage
  }

  localStorage.setItem('lang', initialLanguage)

  const [language, setLanguage] = useState(initialLanguage)

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const handleSetLanguage = useCallback((language: string) => {
    const isLanguageSupported = supportedLanguages.includes(language)
    const newLanguage = isLanguageSupported ? language : defaultLanguage
    setLanguage(newLanguage)

    if (!isLanguageSupported) {
      console.error('Unsupported language: ', language)
    }
  }, [supportedLanguages, defaultLanguage])

  return [language, handleSetLanguage]
}

export default useLanguage
