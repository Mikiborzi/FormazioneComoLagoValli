// Polyfill per browser datati (es. macOS Catalina / Safari 15.x, l'ultima
// versione disponibile su quei Mac). Il target di compilazione è dichiarato in
// package.json → "browserslist": abbassarlo sistema la *sintassi*, ma non i
// metodi aggiunti al runtime dopo Safari 14. Questi sono gli unici usati dai
// bundle Next/React attuali; sono pochi byte e non toccano i browser moderni.

if (!Object.hasOwn) {
  Object.hasOwn = function hasOwn(obj, key) {
    return Object.prototype.hasOwnProperty.call(Object(obj), key)
  }
}

if (!Array.prototype.at) {
  Array.prototype.at = function at(index) {
    const i = Math.trunc(index) || 0
    return this[i < 0 ? this.length + i : i]
  }
}

if (!String.prototype.at) {
  String.prototype.at = function at(index) {
    const i = Math.trunc(index) || 0
    return this[i < 0 ? this.length + i : i]
  }
}

if (!Array.prototype.findLast) {
  Array.prototype.findLast = function findLast(fn, thisArg) {
    for (let i = this.length - 1; i >= 0; i--) {
      if (fn.call(thisArg, this[i], i, this)) return this[i]
    }
    return undefined
  }
}

if (typeof Promise !== 'undefined' && !Promise.withResolvers) {
  Promise.withResolvers = function withResolvers() {
    let resolve, reject
    const promise = new Promise((res, rej) => { resolve = res; reject = rej })
    return { promise, resolve, reject }
  }
}
