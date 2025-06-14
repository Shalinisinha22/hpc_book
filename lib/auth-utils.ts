export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    // Add 10 second buffer to prevent edge cases
    return (payload.exp * 1000) - 10000 < Date.now()
  } catch {
    return true
  }
}

export const parseJwt = (token: string) => {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}