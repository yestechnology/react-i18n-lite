import { useEffect } from 'react'
import { fireEvent, render, screen } from '@testing-library/react'

import { useTranslationContext } from '../../hooks'
import { Locales } from '../../types'
import { setBrowserLanguage } from '../../utils'
import TranslationContainer from '../TranslationContainer'

const locales = {
  'pt-BR': {
    hello: 'Olá',
    greetings: {
      morning: 'Bom dia',
      afternoon: 'Boa tarde'
    }
  },
  'en-US': {
    hello: 'Hello',
    greetings: {
      morning: 'Good morning',
      afternoon: 'Good afternoon'
    }
  }
}

const defaultProps = {
  locales,
  defaultLanguage: 'pt-BR',
  children: null
}

type Props = {
  locales?: Locales,
  defaultLanguage?: string,
  children?: React.ReactNode
}

const renderContainer = (props?: Props) => {
  return render(
    <TranslationContainer {...defaultProps} {...props} />
  )
}

const contextValueTester = jest.fn()

const ContextTester = () => {
  const contextValue = useTranslationContext()

  useEffect(() => {
    contextValueTester(contextValue)
  }, [contextValue])

  const updateLanguage = () => {
    contextValue.setLanguage('en-US')
  }

  return <button onClick={updateLanguage}>setLanguage</button>
}

beforeEach(() => { setBrowserLanguage('pt-BR') })

it('updates the locale on setLanguage called', () => {
  renderContainer({ children: <ContextTester /> })

  expect(contextValueTester).toHaveBeenLastCalledWith({
    language: 'pt-BR',
    setLanguage: expect.any(Function),
    locales: locales,
    locale: locales['pt-BR']
  })

  const updateLanguageButton = screen.getByRole('button')
  fireEvent.click(updateLanguageButton)

  expect(contextValueTester).toHaveBeenLastCalledWith({
    language: 'en-US',
    setLanguage: expect.any(Function),
    locales: locales,
    locale: locales['en-US']
  })
})

it('gets the initial locale from the browser language', () => {
  setBrowserLanguage('en-US')

  renderContainer({ children: <ContextTester /> })

  expect(contextValueTester).toHaveBeenLastCalledWith({
    language: 'en-US',
    setLanguage: expect.any(Function),
    locales: locales,
    locale: locales['en-US']
  })
})

it('sets the html document language', () => {
  renderContainer({ children: <ContextTester /> })

  expect(document.documentElement.lang).toEqual('pt-BR')

  const updateLanguageButton = screen.getByRole('button')
  fireEvent.click(updateLanguageButton)

  expect(document.documentElement.lang).toEqual('en-US')
})
