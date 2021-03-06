class ImageAnalyser {

  constructor(hrController, pixelResolution, imgData) {
    this.hrController = hrController
    this.pixelResolution = pixelResolution
    this.rgb = this.processImage(imgData)
    this.calculateMeans()
  }

  processImage(imgData) {
    if (imgData) {
      let red = []
        , green = []
        , blue = []
        , alpha = []

      for (let x = 0; x < this.pixelResolution * this.pixelResolution; x++) {
        red[x] = imgData.data[0 + (4 * x)]
        green[x] = imgData.data[1 + (4 * x)]
        blue[x] = imgData.data[2 + (4 * x)]
        alpha[x] = imgData.data[3 + (4 * x)]
      }

      return {
        red: red
        , green: green
        , blue: blue
          // , alpha: alpha
      }
    } else {
      return undefined
    }
  }

  calculateMeans() {
    if (this.rgb) {
      if (this.rgbRobust) {
        this.rgb = this.rgbRobust
      }
      let r = 0
        , g = 0
        , b = 0
      for (let x = 0; x < this.rgb.red.length; x++) {
        r += this.rgb.red[x]
        g += this.rgb.green[x]
        b += this.rgb.blue[x]
      }

      r = r / this.rgb.red.length
      g = g / this.rgb.red.length
      b = b / this.rgb.red.length
      if (!this.rgbRobust) {
        this.calculateRobustMean(r, g, b)
      } else {
        this.hrController.circularBufferRed.push(r)
        this.hrController.circularBufferGreen.push(g)
        this.hrController.circularBufferBlue.push(b)
      }
    }
  }

  calculateRobustMean(r, g, b) {
    console.log(r, g, b)
    this.rgbRobust = {}
    this.rgbRobust.red = []
    this.rgbRobust.green = []
    this.rgbRobust.blue = []

    for (let x = 0; x < this.rgb.green.length; x++) {

      let d = Math.pow(this.rgb.red[x] - r, 2) + Math.pow(this.rgb.blue[x] - b, 2) + Math.pow(this.rgb.green[x] - g, 2)
      console.log(d)
      if (d < 25000) {

        this.rgbRobust.red.push(this.rgb.red[x])
        this.rgbRobust.green.push(this.rgb.green[x])
        this.rgbRobust.blue.push(this.rgb.blue[x])
      }
    }
    this.calculateMeans()
  }
}
module.exports = ImageAnalyser
