create-shader-program [![npm version](https://badge.fury.io/js/create-shader-program.svg)](http://badge.fury.io/js/create-shader-program) [![Build Status](https://travis-ci.org/chinedufn/create-shader-program.svg?branch=master)](https://travis-ci.org/chinedufn/create-shader-program)
===============

> Compiles, links and returns a shader program from a give vertex and fragment shader

## To Install

```
$ npm install --save create-shader-program
```

## Background / Initial Motivation

`create-shader-program` hopes to be a small convenience wrapper around shader program creation.

```js
var createShaderProgram = require('create-shader-program')
```

## Usage

```js
var createShaderProgram = require('create-shader-program')
var canvas = document.createElement('canvas')
var gl = canvas.getContext('webgl')

var vertexShaderString = `
  precision mediump float;

  attribute vec2 position;
  attribute vec4   foobar    ;

  void main () {
    gl_Position = vec4(position, 0, 1);
  }
`

var fragmentShaderString = `
  precision mediump float;

  uniform vec4 color;

  void main () {
    gl_FragColor = color;
  }
`

var programObject = createShaderProgram(gl, vertexShaderString, fragmentShaderString)

if (programObject.err) {
  // A vertex shader, fragment shader, or shader program link error
  console.log(programObject.err.message)
} else {
  // Your compiled shader program
  console.log(programObject.program)
}
```

## API

### `createShaderProgram(gl, vertexShaderString, fragmentShaderString)` -> `shaderProgram`

#### gl

**Required**

Type: `WebGL Context`

Your shader program's WebGL context

#### vertexShaderString

*Required*

Type: `function`

Your GLSL vertex shader

```glsl
var vertexShader = `
  precision mediump float;

  attribute vec2 position;
  attribute vec4   foobar    ;

  void main () {
    gl_Position = vec4(position, 0, 1);
  }
`
```

#### fragmentShaderString

*Required*

Type: `object`

Your GLSL fragment shader

```js
var fragmentShader = `
  precision mediump float;

  uniform vec4 color;

  void main () {
    gl_FragColor = color;
  }
`
```

## License

MIT
