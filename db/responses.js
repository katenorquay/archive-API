const errorMessage = (message) => {
  const obj = {
    error: message
  }
  return obj
}

const successMessage = (message) => {
  const obj = {
    success: message
  }
  return obj
}


module.exports = {
  errorMessage: errorMessage,
  successMessage: successMessage
}
