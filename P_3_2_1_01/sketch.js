// P_3_2_1_01
// config
var textTyped = 'Say somthing ...!'
var fontSize = 72 * 2
// out put range
var rangeStart = 4
var rangeEnd = 20
// other
var fillColor = '#00b8b8'
var strokeColor = '#de3d83'
var bgColor = '#e4bd0b'

var font

function setup () {
  createCanvas(windowWidth, windowHeight)
  // noLoop()

  opentype.load('data/FreeSans.otf', function (err, f) {
    if (err) {
      console.log(err)
    } else {
      font = f
      loop()
    }
  })

  // Create an Audio input
  mic = new p5.AudioIn()

  // start the Audio Input.
  // By default, it does not .connect() (to the computer speakers)
  mic.start()
}

function draw () {
  if (!font) {
    console.warn('no font')
    return false
  }

  background(bgColor)
  // margin border
  translate(100, height / 2)

 // / Get the overall volume (between 0 and 1.0)
  var vol = mic.getLevel()
  // set the range
  var _vol = map(vol, 0, 0.01, rangeStart, rangeEnd)

  // fill(fillColor)
  // stroke(strokeColor)

  if (textTyped.length > 0) {
    // get a path from OpenType.js
    var fontPath = font.getPath(textTyped, 0, 0, fontSize)
    // convert it to a g.Path object
    var path = new g.Path(fontPath.commands)
    // resample it with equidistant points
    path = g.resampleByLength(path, 11)
    // path = g.resampleByAmount(path, 500);
    console.log('vol', vol)
    console.log('h', _vol)
    // lines
    stroke(strokeColor)
    strokeWeight(1.0)
    var l = _vol * 2
    for (var i = 0; i < path.commands.length; i++) {
      var pnt = path.commands[i]
      line(pnt.x - l, pnt.y - l, pnt.x + l, pnt.y + l)
    }

    // dots
    fill(fillColor)
    noStroke()
    var diameter = _vol / 10
    for (var i = 0; i < path.commands.length; i++) {
      var pnt = path.commands[i]
      // on every 2nd point
      if (i % 2 == 0) {
        ellipse(pnt.x, pnt.y, diameter, diameter)
      }
    }
  }

  // noLoop()
}

function keyReleased () {
  // export png
  if (keyCode == CONTROL) saveCanvas(gd.timestamp(), 'png')
}

function keyPressed () {
  if (keyCode == DELETE || keyCode == BACKSPACE) {
    if (textTyped.length > 0) {
      textTyped = textTyped.substring(0, textTyped.length - 1)
      loop()
    }
  }
}

function keyTyped () {
  if (keyCode >= 32) {
    textTyped += key
    loop()
  }
}
