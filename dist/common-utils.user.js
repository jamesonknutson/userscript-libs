//@ts-check

// ==UserScript==
// @name         Common Userscript Library
// @description  Functions I use often
// @author       Jameson Knutson (https://github.com/jamesonknutson)
// @version      1.0
// @license      MIT
// @match        *://*/*
// @downloadURL  https://github.com/jamesonknutson/userscript-libs/raw/refs/heads/master/dist/common-utils.user.js
// @grant        GM_info
// ==/UserScript==

// ==UserLibrary==
// @name         Common Userscript Library
// @description  Functions that any TagPro script could benefit from
// @version      1.0
// @license      MIT
// ==/UserLibrary==

/**
 * Creates a proxied `console` object that injects the scripts name as a prefix, with some coloring for different log levels.
 * 
 * @param {string} [scriptName=GM_info.script.name] The script's name, or the prefix to use.
 * @returns {typeof console}
 */
function createLogger(
  scriptName = GM_info.script.name,
) {
  const logLevels = {
    log: '#268bd2', // Blue
    info: '#2aa198', // Cyan
    warn: '#d33682', // Magenta
    error: '#dc322f', // Red
    debug: '#6c71c4', // Violet
  }

  return new Proxy(console, {
    get: (target, prop) => {
      const color = logLevels?.[prop]

      /** @type {(typeof console)[keyof typeof logLevels]} */
      const value = target[prop]

      if (typeof value === 'function' && color) {
        return (/** @type {Parameters<typeof value>} */ ...args) =>
          value.call(target, ...makeColoredText(scriptName, color), ...args)
      }

      return value
    },
  })

  function makeColoredText(/** @type {string} */ text, /** @type {string} */ color) {
    return [`%c${text}`, `background: ${color}; color: white; padding: 2px 4px;`]
  }
}