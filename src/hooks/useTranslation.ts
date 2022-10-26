import { useCallback } from 'react'
import accessDeepProperty from 'lodash.get'

import { interpolate, Interpolations } from '../utils'
import useTranslationContext from './useTranslationContext'

type Options = { ignoreError?: boolean }

type Translate = (key: string, interpolations?: Interpolations, options?: Options) => string

export const useTranslation = () => {
  const { language, locale } = useTranslationContext()

  const handleTranslationError = useCallback((key) => {
    const errorMessage = `Missing translation: '${key}'`
    console.error(errorMessage, '\nLang:', language)
    return errorMessage
  }, [language])

  const t = useCallback<Translate>((key, interpolations, options = {}) => {
    const rawTranslation = accessDeepProperty(locale, key)

    if (typeof rawTranslation !== 'string') {
      if (options.ignoreError) return ''

      return handleTranslationError(key)
    }

    return interpolate(rawTranslation, interpolations)
  }, [locale, handleTranslationError])

  return { t }
}

export default useTranslation
