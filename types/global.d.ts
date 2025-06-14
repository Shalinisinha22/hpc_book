declare global {
  interface Window {
    __tokenExpirationTimeout?: number
  }
}

export {}