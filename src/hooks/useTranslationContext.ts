import { useContext } from 'react'

import { TranslationContext } from '../contexts'

export default function useTranslationContext () {
  return useContext(TranslationContext)
}
