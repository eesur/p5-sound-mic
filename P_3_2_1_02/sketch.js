// P_3_2_1_02

/**
 * fontgenerator with static elements (svg files)
 *
 * MOUSE
 * position x          : module rotation
 * position y          : module size
 *
 * KEYS
 * a-z                 : text input (keyboard)
 * alt                 : toggle modules
 * del, backspace      : remove last letter
 * ctrl                : save png + pdf
 */

var doSave = false

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

var shapeSet = 0
var module1, module2

var font

function preload () {
  module1 = loadImage('data/A_01.svg')
  module2 = loadImage('data/A_02.svg')
}

function setup () {
  createCanvas(windowWidth, windowHeight)

  opentype.load('data/FreeSans.otf', function (err, f) {
    if (err) {
      console.log(err)
    } else {
      font = f
    }
  })
  // Create an Audio input
  mic = new p5.AudioIn()

  // start the Audio Input.
  // By default, it does not .connect() (to the computer speakers)
  mic.start()
}

function draw () {
  background(bgColor)
  noStroke()
  imageMode(CENTER)

 // / Get the overall volume (between 0 and 1.0)
  var vol = mic.getLevel()
  // set the range
  var _vol = map(vol, 0, 0.01, rangeStart, rangeEnd)
  var xVol = _vol
  var yVol = _vol * 2

  // margin border
  translate(100, height / 2)

  if (textTyped.length > 0 && font != undefined) {
    // get a path from OpenType.js
    var fontPath = font.getPath(textTyped, 0, 0, fontSize)
    // convert it to a g.Path object
    var path = new g.Path(fontPath.commands)
    // resample it with equidistant points
    path = g.resampleByLength(path, 6)

    // ------ svg modules ------
    // module1
    var diameter = 30

    for (var i = 0; i < path.commands.length - 1; i++) {
      var pnt = path.commands[i]
      var nextPnt = path.commands[i + 1]

      // skip this loop if one of the points doesn't have coordinates (could happen for path closing commands)
      if (!pnt.x || !nextPnt.x) continue

      // on every third point
      if (i % 3 == 0) {
        // rotate the module facing to the next one (i+1)
        push()
        var angle = atan2(pnt.y - nextPnt.y, pnt.x - nextPnt.x)
        translate(pnt.x, pnt.y)
        rotate(angle)
        rotate(radians(-xVol))
        image(module1, 0, 0, diameter + (yVol / 2.5), diameter + (yVol / 2.5))
        pop()
      }
    }

    // module2
    diameter = 18
    for (var i = 0; i < path.commands.length - 1; i++) {
      var pnt = path.commands[i]
      var nextPnt = path.commands[i + 1]

      // skip this loop if one of the points doesn't have coordinates (could happen for path closing commands)
      if (!pnt.x || !nextPnt.x) continue

      // on every third point
      if (i % 3 == 0) {
        // rotate the module facing to the next one (i+1)
        push()
        var angle = atan2(pnt.y - nextPnt.y, pnt.x - nextPnt.x)
        translate(pnt.x, pnt.y)
        rotate(angle)
        rotate(radians(xVol))
        image(module2, 0, 0, diameter + (yVol / 2.5), diameter + (yVol / 2.5))
        pop()
      }
    }
  }
}

function keyReleased () {
  // export png
  if (keyCode == CONTROL) saveCanvas(gd.timestamp(), 'png')
}

function keyPressed () {
  if (keyCode == DELETE || keyCode == BACKSPACE) {
    if (textTyped.length > 0) {
      textTyped = textTyped.substring(0, textTyped.length - 1)
    }
  }

  if (keyCode == ALT) {
    shapeSet = (shapeSet + 1) % 4
    switch (shapeSet) {
      case 0:
        module1 = loadImage('data/A_01.svg')
        module2 = loadImage('data/A_02.svg')
        break
      case 1:
        module1 = loadImage('data/B_01.svg')
        module2 = loadImage('data/B_02.svg')
        break
      case 2:
        module1 = loadImage('data/C_01.svg')
        module2 = loadImage('data/C_02.svg')
        break
      case 3:
        module1 = loadImage('data/D_01.svg')
        module2 = loadImage('data/D_02.svg')
        break
    }
  }
}

function keyTyped () {
  if (keyCode >= 32) {
    textTyped += key
  }
}
