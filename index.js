import { diffWordsWithSpace, createPatch } from 'diff';
import supportsColor from 'supports-color';

/**
 * Returns `true` if Mocha is running in a browser.
 * Checks for `process.browser`.
 * @returns {boolean}
 * @private
 */
function isBrowser() {
  return Boolean(process.browser);
}

function defaultOptions() {
  return {
    maxDiffSize: 8192,
    inlineDiff: false,
    useColors: !isBrowser() && (supportsColor.stdout || process.env.MOCHA_COLORS !== undefined),
    colors: {
      pass: 90,
      fail: 31,
      'bright pass': 92,
      'bright fail': 91,
      'bright yellow': 93,
      pending: 36,
      suite: 0,
      'error title': 0,
      'error message': 31,
      'error stack': 90,
      checkmark: 32,
      fast: 90,
      medium: 33,
      slow: 31,
      green: 32,
      light: 90,
      'diff gutter': 90,
      'diff added': 32,
      'diff removed': 31,
      'diff added inline': '30;42',
      'diff removed inline': '30;41'
    },
  }
}

/**
 * Returns a diff between 2 strings with coloured ANSI output.
 *
 * @description
 * The diff will be either inline or unified dependent on the value
 * of `Base.inlineDiff`.
 *
 * @param {string} actual
 * @param {string} expected
 * @return {string} Diff
 */
export function generateDiff (actual, expected, options) {
  options = {
    ...defaultOptions(),
    ...options,
  };

  try {
    var maxLen = options.maxDiffSize;
    var skipped = 0;
    if (maxLen > 0) {
      skipped = Math.max(actual.length - maxLen, expected.length - maxLen);
      actual = actual.slice(0, maxLen);
      expected = expected.slice(0, maxLen);
    }
    let result = options.inlineDiffs
      ? inlineDiff(actual, expected, options)
      : unifiedDiff(actual, expected, options);
    if (skipped > 0) {
      result = `${result}\n      [mocha] output truncated to ${maxLen} characters, see "maxDiffSize" reporter-option\n`;
    }
    return result;
  } catch (err) {
    var msg =
      '\n      ' +
      color('diff added', '+ expected') +
      ' ' +
      color('diff removed', '- actual:  failed to generate Mocha diff') +
      '\n';
    return msg;
  }
}

/**
 * Returns inline diff between 2 strings with coloured ANSI output.
 *
 * @private
 * @param {String} actual
 * @param {String} expected
 * @return {string} Diff
 */
function inlineDiff(actual, expected, options) {
  var msg = errorDiff(actual, expected);

  // linenos
  var lines = msg.split('\n');
  if (lines.length > 4) {
    var width = String(lines.length).length;
    msg = lines
      .map(function (str, i) {
        return pad(++i, width) + ' |' + ' ' + str;
      })
      .join('\n');
  }

  // legend
  msg =
    '\n' +
    color('diff removed inline', 'actual', options) +
    ' ' +
    color('diff added inline', 'expected', options) +
    '\n\n' +
    msg +
    '\n';

  // indent
  msg = msg.replace(/^/gm, '      ');
  return msg;
}

/**
 * Returns unified diff between two strings with coloured ANSI output.
 *
 * @private
 * @param {String} actual
 * @param {String} expected
 * @return {string} The diff.
 */
function unifiedDiff(actual, expected) {
  var indent = '      ';
  function cleanUp(line) {
    if (line[0] === '+') {
      return indent + colorLines('diff added', line);
    }
    if (line[0] === '-') {
      return indent + colorLines('diff removed', line);
    }
    if (line.match(/@@/)) {
      return '--';
    }
    if (line.match(/\\ No newline/)) {
      return null;
    }
    return indent + line;
  }
  function notBlank(line) {
    return typeof line !== 'undefined' && line !== null;
  }
  var msg = createPatch('string', actual, expected);
  var lines = msg.split('\n').splice(5);
  return (
    '\n      ' +
    colorLines('diff added', '+ expected') +
    ' ' +
    colorLines('diff removed', '- actual') +
    '\n\n' +
    lines.map(cleanUp).filter(notBlank).join('\n')
  );
}

/**
 * Color `str` with the given `type`,
 * allowing colors to be disabled,
 * as well as user-defined color
 * schemes.
 *
 * @private
 * @param {string} type
 * @param {string} str
 * @return {string}
 */
export function color(type, str, options) {
  options = {
    ...defaultOptions(),
    ...options,
  }

  if (!options.useColors) {
    return String(str);
  }
  return '\u001b[' + options.colors[type] + 'm' + str + '\u001b[0m';
}

/**
 * Returns character diff for `err`.
 *
 * @private
 * @param {String} actual
 * @param {String} expected
 * @return {string} the diff
 */
function errorDiff(actual, expected) {
  return diffWordsWithSpace(actual, expected)
    .map(function (str) {
      if (str.added) {
        return colorLines('diff added inline', str.value);
      }
      if (str.removed) {
        return colorLines('diff removed inline', str.value);
      }
      return str.value;
    })
    .join('');
}

/**
 * Colors lines for `str`, using the color `name`.
 *
 * @private
 * @param {string} name
 * @param {string} str
 * @return {string}
 */
function colorLines(name, str) {
  return str
    .split('\n')
    .map(function (str) {
      return color(name, str);
    })
    .join('\n');
}

/**
 * Pads the given `str` to `len`.
 *
 * @private
 * @param {string} str
 * @param {string} len
 * @return {string}
 */
function pad(str, len) {
  str = String(str);
  return Array(len - str.length + 1).join(' ') + str;
}