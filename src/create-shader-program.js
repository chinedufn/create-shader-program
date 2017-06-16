// TODO: Don't actually need this. We can get the information that we need
// directly from the shader program
var getAttributesUniforms = require('get-attributes-uniforms')

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

  var vertexShaderAttributesUniforms = getAttributesUniforms(vertexShaderString)
  var fragmentShaderAttributesUniforms = getAttributesUniforms(fragmentShaderString)

  var shaderObj = {
    attributes: {},
    program: shaderProgram,
    uniforms: {}
  }

  // Loop through all of our attributes and get their locations
  Object.keys(vertexShaderAttributesUniforms.attributes).forEach(function (attributeName) {
    getAttributeLocations(attributeName, vertexShaderAttributesUniforms.attributes[attributeName])
  })
  Object.keys(fragmentShaderAttributesUniforms.attributes).forEach(function (attributeName) {
    getAttributeLocations(attributeName, fragmentShaderAttributesUniforms.attributes[attributeName])
  })

  // Loop through all of the uniforms and get their locations
  Object.keys(vertexShaderAttributesUniforms.uniforms).forEach(function (uniformName) {
    getUniformLocations(uniformName, vertexShaderAttributesUniforms.uniforms[uniformName])
  })
  Object.keys(fragmentShaderAttributesUniforms.uniforms).forEach(function (uniformName) {
    getUniformLocations(uniformName, fragmentShaderAttributesUniforms.uniforms[uniformName])
  })

  return shaderObj

  function getUniformLocations (uniformName, uniformType) {
    // If the uniform is not an array we get it's location
    var openBracketIndex = uniformName.indexOf('[')
    if (openBracketIndex === -1) {
      shaderObj.uniforms[uniformName] = {
        location: gl.getUniformLocation(shaderProgram, uniformName),
        type: uniformType
      }
    } else {
      // If the uniform if an array we get the location of each element in the array
      var closedBracketIndex = uniformName.indexOf(']')
      // We're converting someUniformArray[n] -> n
      var uniformArraySize = Number(uniformName.substring(openBracketIndex + 1, closedBracketIndex))
      // We're converting someUniformArray[n] -> someUniformArray
      var uniformArrayName = uniformName.substring(0, openBracketIndex)

      // Get the uniform location of each element in the array
      //  Naming convention -> someUniform1, someUniform2, ... someAtribute25
      for (var arrayElement = 0; arrayElement < uniformArraySize; arrayElement++) {
        // ex: shaderObj[someUniform2] = gl.getUniformLocation(shaderProgram, someUniform[2])
        shaderObj.uniforms[uniformArrayName + arrayElement] = {
          location: gl.getUniformLocation(shaderProgram, uniformArrayName + '[' + arrayElement + ']'),
          type: uniformType
        }
      }
    }
  }

  function getAttributeLocations (attributeName, attributeType) {
    shaderObj.attributes[attributeName] = {
      location: gl.getAttribLocation(shaderProgram, attributeName),
      type: attributeType
    }
  }
}
