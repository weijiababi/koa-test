exports.calData = data => {
  let result = {
    data,
    total: data.length && data.length > 0 ? data.length : 0
  }
  return result
}
