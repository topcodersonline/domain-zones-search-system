var nunjucks = require('nunjucks');
var urlHelper = require('./helpers/url');
var _ = require('lodash')

/**
 * template engine
 */
module.exports = function(app, path, options) {

  var nunenv = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(path, options)
  )

  nunenv.express(app)

  nunenv
  .addFilter('debug', function(obj) {
    return JSON.stringify(obj, null, 2)
  })

  .addFilter('intval', function(obj) {
    return parseInt(obj || 0, 10);
  })

  .addGlobal('in_array', function(element, array) {
    array = array || [];
    return array.indexOf(element) !== -1;
  })

  .addFilter('stringify', function(json) {
    return JSON.stringify(json, null, 4)
  })

  .addFilter('sortObject', function(array, field, order) {
    return _.chain(array)
    .cloneDeep()
    .map(function(val, key) {
      val.key = key
      return val
    })
    .sortBy([function(o) {
      if (order === 'asc') {
        return o[field]
      }
      return -o[field]
    }])
    .value();
  })

  .addFilter('slice', function(string, a, b) {
    if (_.isString(string) || _.isArray(string)) {
      return string.slice(a, b)
    }
    return string
  })

  .addFilter('split', function(string, delimiter) {
    return string.split(delimiter || ',')
  })

  .addFilter('shuffle', function(array) {
    return _.shuffle(array)
  })

  .addFilter('join', function(array, delimiter) {
    return array.join(delimiter || ',')
  })

  .addFilter('ceil', function(str) {
    return Math.ceil(str)
  })

  .addFilter('build', function(str, data) {
    return urlHelper.build(str, data);
  })

  return nunenv
}
