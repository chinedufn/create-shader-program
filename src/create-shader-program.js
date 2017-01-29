module.exports = createShaderProgram

/**
 * Create a shader program given a vertex and fragment shader
 */
function createShaderProgram (gl, vertexShaderString, fragmentShaderString) {
  var vertexShader = gl.createShader(gl.VERTEX_SHADER)
  gl.shaderSource(vertexShader, vertexShaderString)
  gl.compileShader(vertexShader)

  // We were unable to compile the vertex shader, return an error
  // TODO: Pull out into a repo that handles shaderInfoLog -> error message
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    return {
      err: {
        message: gl.getShaderInfoLog(vertexShader)
      }
    }
  }

  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
  gl.shaderSource(fragmentShader, fragmentShaderString)
  gl.compileShader(fragmentShader)

  // We were unable to compile the fragment shader, return an error
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    return {
      err: {
        message: gl.getShaderInfoLog(vertexShader)
      }
    }
  }

  var shaderProgram = gl.createProgram()
  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    return {
      err: {
        message: gl.getProgramInfoLog(shaderProgram)
      }
    }
  }

  return {
    program: shaderProgram
  }
}
