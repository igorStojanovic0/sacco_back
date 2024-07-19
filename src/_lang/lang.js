const _ = require('lodash');
const lang = 'en'

module.exports = function (key) {
  let languages = {};

  switch (lang) {
    case 'en':
      languages = require('./en');
      break;
    default:
      languages = {};
  }
  return _.get(languages, key) || '';
}
