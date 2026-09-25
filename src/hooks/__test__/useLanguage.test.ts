import { act, renderHook } from '@testing-library/react'

import { setBrowserLanguage } from '../../utils'
import { useLanguage } from '..'

const SUPPORTED_LANGUAGES = ['en-US', 'pt-BR']
const DEFAULT_LANGUAGE = 'pt-BR'
const COOKIE_KEY = 'lang'

const getCookie = (name: string) => {
  const prefix = `${name}=`
  const entry = document.cookie.split('; ').find((row) => row.startsWith(prefix))
  return entry ? decodeURIComponent(entry.slice(prefix.length)) : null
}

const clearCookie = (name: string) => {
  document.cookie = `${name}=; path=/; max-age=0`
}

beforeEach(() => {
  setBrowserLanguage('pt-BR')
  localStorage.removeItem('lang')
  clearCookie(COOKIE_KEY)
})

it('gets the initial locale from the browser language', () => {
  setBrowserLanguage('en-US')

  const { result } = renderHook(() => useLanguage(SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE))

  expect(result.current[0]).toEqual('en-US')
})

it('gets the initial locale from the Local Storage language', () => {
  localStorage.setItem('lang', 'en-US')

  const { result } = renderHook(() => useLanguage(SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE))

  expect(result.current[0]).toEqual('en-US')
})

it('sets the html document language', () => {
  setBrowserLanguage('en-US')

  renderHook(() => useLanguage(SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE))

  expect(document.documentElement.lang).toEqual('en-US')
})

it('uses defaultLanguage if the browser language is not supported', () => {
  setBrowserLanguage('unsupported')

  const { result } = renderHook(() => useLanguage(SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE))

  expect(result.current[0]).toEqual('pt-BR')
})

it('updates the language on callback called', () => {
  const { result } = renderHook(() => useLanguage(SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE))

  act(() => {
    result.current[1]('en-US')
  })

  expect(result.current[0]).toEqual('en-US')
})

it('uses defaultLanguage if the updated language is not supported', () => {
  setBrowserLanguage('en-US')
  const consoleError = jest.spyOn(console, 'error').mockImplementation(() => null)

  const { result } = renderHook(() => useLanguage(SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE))

  act(() => {
    result.current[1]('unsupported')
  })

  expect(result.current[0]).toEqual('pt-BR')
  expect(consoleError).toHaveBeenCalledWith('Unsupported language: ', 'unsupported')

  consoleError.mockRestore()
})

describe('with cookieKey', () => {
  it('gets the initial locale from the cookie, ignoring Local Storage', () => {
    document.cookie = `${COOKIE_KEY}=en-US; path=/`
    localStorage.setItem('lang', 'pt-BR')

    const { result } = renderHook(() =>
      useLanguage(SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, COOKIE_KEY)
    )

    expect(result.current[0]).toEqual('en-US')
  })

  it('persists the language to the cookie instead of Local Storage', () => {
    const { result } = renderHook(() =>
      useLanguage(SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE, COOKIE_KEY)
    )

    act(() => {
      result.current[1]('en-US')
    })

    expect(getCookie(COOKIE_KEY)).toEqual('en-US')
    expect(localStorage.getItem('lang')).toBeNull()
  })
})
