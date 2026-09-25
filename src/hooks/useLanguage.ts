import { useCallback, useEffect, useState } from 'react'

type UseLanguage = (
  supportedLanguages: string[],
  defaultLanguage: string,
  cookieKey?: string
) => [string, (language: string) => void]

const STORAGE_KEY = 'lang'
const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365

const getCookie = (name: string): string | null => {
  const prefix = `${encodeURIComponent(name)}=`
  const entry = document.cookie
    .split('; ')
    .find((row) => row.startsWith(prefix))

  return entry ? decodeURIComponent(entry.slice(prefix.length)) : null
}

const setCookie = (name: string, value: string) => {
  document.cookie = [
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
    'path=/',
    `max-age=${ONE_YEAR_IN_SECONDS}`,
    'SameSite=Lax'
  ].join('; ')
}

const readStoredLanguage = (cookieKey?: string) =>
  cookieKey ? getCookie(cookieKey) : window.localStorage.getItem(STORAGE_KEY)

const storeLanguage = (language: string, cookieKey?: string) => {
  if (cookieKey) {
    setCookie(cookieKey, language)
  } else {
    window.localStorage.setItem(STORAGE_KEY, language)
  }
}

const useLanguage: UseLanguage = (supportedLanguages, defaultLanguage, cookieKey) => {
  const [language, setLanguage] = useState(defaultLanguage)

  /**
   * Because of client-only dependencies,
   * the initial server-rendered language may differ from the client.
   * We update it here to prevent hydration mismatches in SSR.
   */
  useEffect(() => {
    const getInitialLanguage = () => {
      const storedLanguage = readStoredLanguage(cookieKey)
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
    storeLanguage(initialLanguage, cookieKey)
  }, [defaultLanguage, supportedLanguages, cookieKey])

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  const handleSetLanguage = useCallback((language: string) => {
    const isLanguageSupported = supportedLanguages.includes(language)
    const newLanguage = isLanguageSupported ? language : defaultLanguage
    setLanguage(newLanguage)
    storeLanguage(newLanguage, cookieKey)

    if (!isLanguageSupported) {
      console.error('Unsupported language: ', language)
    }
  }, [supportedLanguages, defaultLanguage, cookieKey])

  return [language, handleSetLanguage]
}

export default useLanguage
