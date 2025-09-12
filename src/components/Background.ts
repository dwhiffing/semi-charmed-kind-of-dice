import { createElement } from '../utils/createElement'

const noise = (x: number, y: number, t: number) => {
  const n1 = Math.sin(x * 0.02 + t) * Math.cos(y * 0.02)
  const n2 = Math.sin(x * 0.01 + y * 0.01 + t * 2) * 0.5
  const n3 = Math.sin((x + y) * 0.005 + t * 1.5) * 0.3
  return n1 + n2 + n3
}

export const Background = () => {
  const canvas = createElement('canvas', {
    className: 'background-canvas',
  }) as HTMLCanvasElement

  const ctx = canvas.getContext('2d')!

  const scale = 0.2
  const resize = () => {
    canvas.width = Math.floor(window.innerWidth * scale)
    canvas.height = Math.floor(window.innerHeight * scale)
  }
  resize()

  let resizeTimeout: number
  const debouncedResize = () => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(resize, 100)
  }
  window.addEventListener('resize', debouncedResize)

  const purpleShades = [
    '#42176A',
    '#441771',
    '#471976',
    '#4a1a7a',
    '#4c1b7e',
    '#511C85',
  ]

  let time = 0
  const animate = () => {
    time += 0.00025

    const imageData = ctx.createImageData(canvas.width, canvas.height)
    const data = imageData.data

    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const n = noise(x, y, time)
        const index = Math.floor(((n + 1.8) / 3.6) * purpleShades.length)
        const colorIndex = Math.min(purpleShades.length - 1, Math.max(0, index))

        const color = purpleShades[colorIndex]
        const r = parseInt(color.slice(1, 3), 16)
        const g = parseInt(color.slice(3, 5), 16)
        const b = parseInt(color.slice(5, 7), 16)

        const pixelIndex = (y * canvas.width + x) * 4
        data[pixelIndex] = r
        data[pixelIndex + 1] = g
        data[pixelIndex + 2] = b
        data[pixelIndex + 3] = 255
      }
    }

    ctx.putImageData(imageData, 0, 0)
    requestAnimationFrame(animate)
  }
  animate()

  return canvas
}
