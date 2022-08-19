import { renderHook } from '@testing-library/react'

import { TranslationContext } from 'contexts'
import { ReactNode } from 'react'

import useTranslation from '../useTranslation'

const locales = {
  'pt-BR': {
    hello: 'Olá',
    greetings: {
      morning: 'Bom dia',
      afternoon: 'Boa tarde, {{name}}'
    }
  },
  'en-US': {
    hello: 'Hello',
    greetings: {
      morning: 'Good morning',
      afternoon: 'Good afternoon, {{name}}'
    }
  }
}

const translationContextValue = {
  language: 'pt-BR',
  setLanguage: jest.fn(),
  locales,
  locale: locales['pt-BR']
}

const MockTranslationContext = ({ children }: { children: ReactNode }) => (
  <TranslationContext.Provider value={translationContextValue} >
    {children}
  </TranslationContext.Provider>
)

it('translates the given key', () => {
  const { result } = renderHook(() => useTranslation(), { wrapper: MockTranslationContext })

  expect(result.current.t('greetings.morning')).toBe('Bom dia')
})

it('translates the given key and interpolates the given values', () => {
  const { result } = renderHook(() => useTranslation(), { wrapper: MockTranslationContext })

  expect(result.current.t('greetings.afternoon', { name: 'John' })).toBe('Boa tarde, John')
})

it('returns an error message if the key does not exist', () => {
  const { result } = renderHook(() => useTranslation(), { wrapper: MockTranslationContext })

  const consoleError = jest.spyOn(console, 'error').mockImplementation(() => null)

  expect(result.current.t('bye')).toBe("Missing translation: 'bye'")
  expect(consoleError).toBeCalledWith("Missing translation: 'bye'", '\nLang:', 'pt-BR')

  consoleError.mockRestore()
})
