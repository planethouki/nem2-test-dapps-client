<template>
  <div>
    <div :id="id"></div>
  </div>
</template>

<script>
import { SVG } from '@svgdotjs/svg.js'

async function hash(str) {
  const encoder = new TextEncoder()
  const data = encoder.encode(str)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  // console.log(hashArray)
  return hashArray
  // const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  // console.log(hashHex)
  // return hashHex
}

export default {
  name: "Shape",
  props: {
    mosaicId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      id: `shape-${Math.random().toString(32).substring(2)}`,
      reserve: null,
      vertices: null,
      color1: null,
      distortion: null,
      metallic: null,
      smoothness: null
    }
  },
  async mounted () {
    this.vertices = Number(`0x${this.mosaicId.substr(0, 1)}`) + 3
    this.reserve = Number(`0x${this.mosaicId.substr(1, 1)}`)
    this.color1 = this.mosaicId.substr(2, 6)
    this.distortion = this.mosaicId.substr(8,6)
    this.metallic = Number(`0x${this.mosaicId.substr(14, 1)}`)
    this.smoothness = Number(`0x${this.mosaicId.substr(15, 1)}`)
    const draw = SVG().addTo(`#${this.id}`).size(100, 100)

    const distortionHashArray = await hash(this.distortion)

    const angleEach = 2 * Math.PI / this.vertices
    const points = [...Array(this.vertices).keys()]
      .map((n) => {
        const current = n * angleEach
        return [Math.sin(current), -Math.cos(current)]
      })
      .map(([x, y], index) => {
        const normalized = distortionHashArray[index] / 256
        const delta = (normalized - 0.5) / 2
        const radius = 40 * (1 + delta)
        return [x * radius, y * radius]
      })
      .map(([x, y]) => [x + 50, y + 50])

    draw.polyline(points)

    draw.transform({
      translateX: -10,
      translateY: -10,
      scale: 0.8
    })

    draw.fill(`#${this.color1}`)
  }
}
</script>

<style scoped>

</style>
