var test = require('tape')
var createContext = require('gl')

var createShaderProgram = require('../')

test('Create working shader program', function (t) {
  var gl = createContext(10, 10)

  var vertexShader = `
    precision mediump float;

    attribute vec2 position;
    attribute vec4   foobar    ;

    void main () {
      gl_Position = vec4(position, 0, 1);
    }
  `

  var fragmentShader = `
    precision mediump float;

    uniform vec4 color;

    void main () {
      gl_FragColor = color;
    }
  `

  t.doesNotThrow(createShaderProgram.bind(null, gl, vertexShader, fragmentShader))
  t.end()
})

test('Typo in shader program', function (t) {
  var gl = createContext(10, 10)

  var vertexShader = `
    precision mediump float;

    typoattribute vec2 position;
    attribute vec4   foobar    ;

    void main () {
      gl_Position = vec4(position, 0, 1);
    }
  `

  var fragmentShader = `
    precision mediump float;

    uniform vec4 color;

    void main () {
      gl_FragColor = color;
    }
  `

  // TODO: Better error messaging
  // TODO: Return error instead of throw? Not sure..
  var programObject = createShaderProgram(gl, vertexShader, fragmentShader)
  t.ok(
    programObject.err.message.match(/syntax/),
    'Returns a syntax error message'
  )
  t.end()
})
