import { act, renderHook, waitFor } from '@testing-library/react'

import { setBrowserLanguage } from 'utils'

import { useLanguage } from '..'

beforeEach(() => { setBrowserLanguage('pt-BR') })

it('gets the initial locale from the browser language', () => {
  setBrowserLanguage('en-US')

  const { result } = renderHook(() => useLanguage(['en-US', 'pt-BR'], 'pt-BR'))

  const [language] = result.current

  expect(language).toEqual('en-US')
})

it('sets the html document language', () => {
  setBrowserLanguage('en-US')

  renderHook(() => useLanguage(['en-US', 'pt-BR'], 'pt-BR'))

  expect(document.documentElement.lang).toEqual('en-US')
})

it('uses defaultLanguage if the browser language is not supported', () => {
  setBrowserLanguage('unsupported')

  const { result } = renderHook(() => useLanguage(['en-US', 'pt-BR'], 'pt-BR'))

  const [language] = result.current

  expect(language).toEqual('pt-BR')
})

it('updates the language on callback called', () => {
  setBrowserLanguage('pt-BR')

  const { result } = renderHook(() => useLanguage(['en-US', 'pt-BR'], 'pt-BR'))

  const [language, setLanguage] = result.current

  act(() => {
    setLanguage('en-US')
  })

  waitFor(() => {
    expect(language).toEqual('en-US')
  })
})

it('uses defaultLanguage if the updated language is not supported', () => {
  setBrowserLanguage('en-US')

  const { result } = renderHook(() => useLanguage(['en-US', 'pt-BR'], 'pt-BR'))

  const [language, setLanguage] = result.current

  const consoleError = jest.spyOn(console, 'error').mockImplementation(() => null)

  act(() => {
    setLanguage('unsupported')
  })

  waitFor(() => {
    expect(language).toEqual('pt-BR')
  })

  expect(consoleError).toBeCalledWith('Unsupported language: ', 'unsupported')

  consoleError.mockRestore()
})
