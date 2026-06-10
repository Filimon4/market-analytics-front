export function buildUrl<T extends object>(template: string, params: T) {
  return template.replace(/:([a-zA-Z0-9_]+)/g, (_, key) => {
    if (!(key in params)) {
      throw new Error(`Missing parameter: ${key}`)
    }
    return encodeURIComponent(String(params[key as keyof T]))
  })
}
