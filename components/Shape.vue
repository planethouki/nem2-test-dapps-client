<template>
  <div>
    <div :id="id"></div>
  </div>
</template>

<script>
import { SVG } from '@svgdotjs/svg.js'

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
      shape: null,
      size: null,
      color1: null,
      color2: null,
      metallic: null,
      smoothness: null
    }
  },
  mounted () {
    this.shape = Number(`0x${this.mosaicId.substr(0, 1)}`)
    this.size = Number(`0x${this.mosaicId.substr(1, 1)}`)
    this.color1 = this.mosaicId.substr(2, 6)
    this.color2 = this.mosaicId.substr(8,6)
    this.metallic = Number(`0x${this.mosaicId.substr(14, 1)}`)
    this.smoothness = Number(`0x${this.mosaicId.substr(15, 1)}`)
    console.log(this.shape, this.size, this.color1, this.color2, this.metallic, this.smoothness)
    const draw = SVG().addTo(`#${this.id}`).size(100, 100)
    switch (this.shape) {
      case 0:
        draw.rect(100, 100)
        break
      case 1:
        draw.circle(100)
        break
      case 2:
        draw.polyline([[50,13.397], [0,100], [100,100]])
        break
      case 3:
        draw.polyline([[93.30,25], [93.30,75], [50,100], [6.6987,75], [6.6987,25], [50,0], [93.3,25]])
        break
      case 4:
        draw.polyline([[50,13.397], [0,100], [100,100]])
        break
      case 5:
        draw.ellipse(50, 100).move(25, 0)
        break
      case 6:
        draw
          .polyline([[0, -100], [20, -20], [100, 0], [20, 20], [0, 100], [-20, 20], [-100, 0], [-20, -20]])
          .transform({
            translateX: 50,
            translateY: 50,
            scale: 0.5
          })
          break
      case 7:
        draw
          .polyline([[100,10], [40,198], [190,78], [10,78], [160,198]])
          .transform({
            translateX: -50,
            translateY: -50,
            scale: 0.5
          })
        break
    }

    draw.fill(`#${this.color1}`)
  }
}
</script>

<style scoped>

</style>
