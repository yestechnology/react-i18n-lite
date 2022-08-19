export type Interpolations = { [key: string]: string }

export default function interpolate (string: string, interpolations: Interpolations = {}) {
  Object.entries(interpolations).forEach(([key, value]) => {
    string = string.replace(`{{${key}}}`, value)
  })
  return string
}
