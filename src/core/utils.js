import {defaultStyles} from "../constants"

// Pure functions
export function capitalize(string) {
  if (typeof string !== "string") {
    return "";
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function range(start, end) {
  if (start > end) {
    [end,start] = [start,end]
  }
  return new Array(end - start + 1)
    .fill('')
    .map((_,index) => start + index)
}
// функция помощник для записи в localStorage
export function storage(key, data) {
  if (!data) {
    return JSON.parse(localStorage.getItem(key))
  }
   localStorage.setItem(key, JSON.stringify(data))
}

// функция проверки обьекта store для записи в store
export function isEqual(a, b) {
  if (typeof a === 'object' && typeof b === 'object') {
    return JSON.stringify(a) === JSON.stringify(b)
  }
  return a === b
}

//regex
export function camelToDashCase(str) {
  return str.replace(/([A-Z])/g, g => `-${g[0].toLowerCase()}`)
}

// функция преобразование стилей в строку
export function toInlineStyles(styles={}) {
  return Object.keys(styles).map(key => `${camelToDashCase(key)} : ${styles[key]}`).join(";")
}

// debounce clear
export function debounce(fn, wait) {
  let timeout;
  return function (...args) {
    const later = () => {
      clearTimeout(timeout)
      fn.apply(this,args)
      // fn(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later,wait)
  }
}
