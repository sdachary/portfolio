import '@testing-library/jest-dom'

HTMLCanvasElement.prototype.getContext = function () {
  return {
    clearRect: () => {},
    fillRect: () => {},
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    save: () => {},
    restore: () => {},
    beginPath: () => {},
    arc: () => {},
    fill: () => {},
    stroke: () => {},
    moveTo: () => {},
    lineTo: () => {},
    createRadialGradient: () => ({ addColorStop: () => {} }),
    globalAlpha: 1,
  }
}
