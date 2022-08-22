export const setBrowserLanguage = (language: string) => {
  Object.defineProperty(window, 'navigator', {
    writable: true,
    value: { ...window.navigator, language }
  })
}
