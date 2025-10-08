/**
 * Detects the lightness of the background color
 * @param color - The background color to detect the lightness of
 * @returns The lightness of the background color
 */
export const detectBackgroundColorLightness = (color: string) => {
  const rgb = color.match(/\d+/g)

  if (!rgb) {
    return 'dark'
  }

  const [r, g, b] = rgb.map(Number)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000

  return brightness > 128 ? 'light' : 'dark'
}

/**
 * Detects the lightness of the foreground color based on the background color
 * @param color - The background color to detect the lightness of
 * @returns The lightness of the foreground color
 */
export const detectForegroundColorLightness = (color: string) => {
  const lightness = detectBackgroundColorLightness(color)

  return lightness === 'dark' ? 'white' : 'black'
}
