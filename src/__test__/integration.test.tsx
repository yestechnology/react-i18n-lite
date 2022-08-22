import { render, screen } from '@testing-library/react'

import { useTranslation } from '../hooks'
import { Locales } from '../types'
import { Interpolations, setBrowserLanguage } from '../utils'
import { TranslationContainer } from '../components'

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

type TranslationProps = {
  translationKey: string,
  interpolations?: Interpolations
}

const TranslationTester = ({ translationKey = 'greetings.morning', interpolations }: TranslationProps) => {
  const { t } = useTranslation()

  return <div>{t(translationKey, interpolations)}</div>
}

const defaultTranslationProps: TranslationProps = {
  translationKey: 'greetings.morning',
  interpolations: {}
}

const renderContainer = (props?: Props, translationProps?: TranslationProps) => {
  return render(
    <TranslationContainer {...defaultProps} {...props}>
      <TranslationTester {...defaultTranslationProps} {...translationProps} />
    </TranslationContainer>
  )
}

beforeEach(() => { setBrowserLanguage('pt-BR') })

it('translates the given key', () => {
  renderContainer()

  const translatedText = screen.getByText('Bom dia')

  expect(translatedText).toBeInTheDocument()
})

it('translates the given key and interpolates the given values', () => {
  renderContainer({}, { translationKey: 'greetings.afternoon', interpolations: { name: 'John' } })

  const translatedText = screen.getByText('Boa tarde, John')

  expect(translatedText).toBeInTheDocument()
})

it('returns an error message if the key does not exist', () => {
  const consoleError = jest.spyOn(console, 'error').mockImplementation(() => null)

  renderContainer({}, { translationKey: 'greetings.night' })

  const translatedText = screen.getByText("Missing translation: 'greetings.night'")

  expect(translatedText).toBeInTheDocument()
  expect(consoleError).toBeCalledWith("Missing translation: 'greetings.night'", '\nLang:', 'pt-BR')

  consoleError.mockRestore()
})

it('gets the initial locale from the URL', () => {
  setBrowserLanguage('en-US')

  renderContainer()

  const translatedText = screen.getByText('Good morning')

  expect(translatedText).toBeInTheDocument()
})
