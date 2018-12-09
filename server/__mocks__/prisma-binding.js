// Simple mock that prevents HTTP requests

export class Prisma {
  get exists() {
    return new Proxy(this, {
      get: (target, propKey) => () => Promise.resolve(true),
    })
  }

  get query() {
    return new Proxy(this, {
      get: (target, propKey) => ({ data = {} } = {}) =>
        Promise.resolve(
            String(propKey).endsWith('s') ? [{ id: 'fake' }] : { id: 'fake' }
        ),
    })
  }

  get mutation() {
    return new Proxy(this, {
      get: (target, propKey) => ({ data = {} } = {}) =>
        Promise.resolve(
            String(propKey).includes('Many') ? { count: 1 } : { ...data }
        ),
    })
  }
}
