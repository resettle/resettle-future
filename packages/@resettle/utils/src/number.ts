/**
 * Round a number to 2 decimal places
 * @param value - The number to round
 * @returns The rounded number
 */
export const round2 = (value: number) => {
  const sign = Math.sign(value)

  return (sign * Math.round(Math.abs(value) * 100)) / 100
}

/**
 * Round a number to 3 decimal places
 * @param value - The number to round
 * @returns The rounded number
 */
export const round3 = (value: number) => {
  const sign = Math.sign(value)

  return (sign * Math.round(Math.abs(value) * 1000)) / 1000
}
