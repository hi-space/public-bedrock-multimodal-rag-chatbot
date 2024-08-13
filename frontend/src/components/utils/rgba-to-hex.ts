export const rgbaToHex = (rgba, forceRemoveAlpha = false) => {
  // Extract the rgba values
  const values = rgba.match(/\d+(\.\d+)?/g).map(Number)

  // Convert r, g, b values to hex
  const hex = values
    .slice(0, 3)
    .map(value => {
      const hexValue = value.toString(16)
      return hexValue.length === 1 ? '0' + hexValue : hexValue
    })
    .join('')

  // Convert alpha value to hex if present and not removed
  let alphaHex = ''
  if (!forceRemoveAlpha && values.length === 4) {
    const alpha = Math.round(values[3] * 255)
    alphaHex = alpha.toString(16)
    if (alphaHex.length === 1) {
      alphaHex = '0' + alphaHex
    }
  }

  return `#${hex}${alphaHex}`
}
