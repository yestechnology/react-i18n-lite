export const setSearchParams = (search: string) => {
  Object.defineProperty(window, 'location', {
    writable: true,
    value: { ...window.location, search }
  })
}
