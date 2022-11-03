# react-i18n-lite

Simple, lightweight internationalization tool for React apps

![Tests](https://github.com/yestechnology/react-i18n-lite/actions/workflows/tests.yml/badge.svg)

## Table of Contents

- [react-i18n-lite](#react-i18n-lite)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Setup](#setup)
    - [TranslationContainer props](#translationcontainer-props)
    - [Building `Locales`](#building-locales)
    - [`useTranslation`](#usetranslation)
    - [Interpolating strings](#interpolating-strings)
    - [Options](#options)
    - [Changing the language](#changing-the-language)

## Installation

To install, you can use [npm](https://npmjs.org/) or [yarn](https://yarnpkg.com):


    $ npm install --save react-i18n-lite
    $ yarn add react-i18n-lite


## Usage

### Setup

To setup react-i18n-lite in your project, you'll need to wrap your app in `TranslationContainer`, passing in the locales dictionaries and the default language as props:

```jsx
import { TranslationContainer } from 'react-i18n-lite'

// ... other setup

const App = () => {
  return (
    <TranslationContainer locales={locales} defaultLanguage="en-US">
      <RootComponent />
    </TranslationContainer>
  );
};
```

### TranslationContainer props

| Prop            | Type             | Description                                                                                                                                                                                                             |
| --------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| locales         | `Locales` object | An object which keys are strings representing the language and values are the respective `Locale` object. Example: `{'pt-BR': localePtBr, 'en-US': localeEnUs}` (Check [Building `Locales`](#building-locales) section) |
| defaultLanguage | string           | The default language set to the system, will be used as initial value if the browser language is not included in `locales`                                                                                              |

### Building `Locales`

The `Locales` are simple JS objects to map keys to their respective trasnlations. For example, an english dictionary could be:

```js
{
  greetings: {
    hello: 'Hello',
    morning: 'Good morning'
  },
  objects: {
    world: 'World',
  }
}
```

The portuguese version of that dictionary would be:

```js
{
  greetings: {
    hello: 'Olá',
    morning: 'Bom dia'
  },
  objects: {
    world: 'Mundo',
  }
}
```

### `useTranslation`

After wrapping the app in `TranslationContainer`, you just need to use the `useTranslation` hook to get the translator function and then call it with the expression key:
```jsx
import { useTranslation } from 'react-i18n-lite'

const TranslatedComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      {t('greetings.hello')} {t('objects.world')}
    </div>
  )
}
```

The translator function will then return the translated text using the current language.


### Interpolating strings

To interpolate strings in your translations, first add the names of the interpolated data in the value of the dictionary:

```js
{
  greetings:
    double-hello: 'Hello, {{firstPerson}} and {{secondPerson}}!'
  }
}
```

Then, in the translator call, pass the interpolations as second argument:

```jsx
import { useTranslation } from 'react-i18n-lite'

const TranslatedComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      {t('greetings.double-hello', { firstPerson: 'Gabriel', secondPerson: 'Ricardo' })}
    </div>
  )
}
```

### Options

You can pass an `options` object as third argument for `t`. The available keys are:

| Key         | Type      | Description                                                                                                    | Default Value |
| ----------- | --------- | -------------------------------------------------------------------------------------------------------------- | ------------- |
| ignoreError | `boolean` | If `true`, when the translation key is not found, no errors will be logged and `t` will return an empty string | `false`       |

### Changing the language

By default, react-i18n-lite uses `navigator.language` to define the initial app language. If you need to override this behavior, you can use the function `setLanguage` returned by `useTranslation`:

```jsx
const { language, setLanguage } = useTranslation()

const updateLanguage = () => {
  setLanguage('pt-BR')
}

return (
  <>
  <span>{language}</span>
  <button onClick={updateLanguage}>
    Update language
  </button>
  </>
)
```
