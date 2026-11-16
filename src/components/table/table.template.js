// Объект с кодами ASCII для букв A и Z.
// A = 65, Z = 90.

import { defaultStyles } from "../../constants";
import { toInlineStyles } from "../../core/utils";
import { parse } from "../../core/parse";

// Используем их, чтобы автоматически получить буквы A, B, C ... Z.
const CODES = {
  A: 65,
  Z: 90,
};

// заданное значение ширины
const DEFAULT_WIDTH = 120;
// заданое значение высоты
const DEFAULT_HEIGHT = 24;

// функция размера ширины колонок
function getWidth(state,index) {
  return (state[index] || DEFAULT_WIDTH) + "px";
}
// функция размера в зависимости от размера колонки и строчки
function withWidthFrom(state) {
  return function (col,index) {
    return {
      col,index, width:getWidth(state.colState,index)
     }
   }
}
// функция высоты в зависимости от  размера колонки и строчки
function getHeight(state, index) {
  return (state[index] || DEFAULT_HEIGHT) + "px";
}

// Создаёт одну ячейку таблицы.
//
// Результат:
// <div class="cell"></div>

// function toCell(row,col) {
//   return `
//     <div class="cell" data-col="${col} data-row="${row}"></div>
//   `;
// }
//
function toCell(state,row) {
  return function (_, col) {
    const id = `${row}:${col}`
    const width = getWidth(state.colState, col)
    const data = state.dataState[id]
    const styles = toInlineStyles({...defaultStyles,...state.stylesState[id]})
    return `
         <div
         class="cell"
         data-col="${col}"
         data-type="cell"
         data-id="${id}"
         contenteditable="true"
         data-value="${data || ''}"
         style="${styles}; width: ${width}"
         >${ parse(data) || ''}</div>
       `;
  }

}

// Создаёт одну колонку с названием.
//
// Например:
// toColumn('A')
//
// Вернёт:
// <div class="column">A</div>
function toColumn({ col, index, width }) {
  return `
    <div class="column"
    data-type="resizable"
    data-col="${index}"
    style="width:${width}">
      ${col}
      <div class="col-resize" data-resize="col"></div>
    </div>
  `;
}

// Создаёт одну строку таблицы.
//
// index — номер строки.
// content — содержимое строки.
//
// Например:
// createRow(1, '<div class="cell"></div>')
//
// Вернёт:
//
// <div class="row">
//   <div class="row-info">1</div>
//   <div class="row-data">
//     <div class="cell"></div>
//   </div>
// </div>
function createRow(index, content, state) {
  const resizer = index ? '<div class="row-resize" data-resize="row"></div>' : ''
  const height = getHeight(state,index)
  return `
    <div class="row" data-type="resizable" data-row="${index}" style="height:${height}">
      <div class="row-info">${index ? index : ""}
        ${resizer}
      </div>
      <div class="row-data">${content}</div>
    </div>
  `;
}

// Преобразует индекс массива в букву.
//
// Второй аргумент index автоматически передаётся методом map().
//
// Например:
//
// index = 0 → String.fromCharCode(65 + 0) → "A"
// index = 1 → String.fromCharCode(65 + 1) → "B"
// index = 2 → String.fromCharCode(65 + 2) → "C"
// ...
// index = 25 → "Z"
//
// Первый параметр "_" нам не нужен,
// поэтому вместо него используется символ "_".
function toChar(_, index) {
  return String.fromCharCode(CODES.A + index);
}


// Главная функция, которая создаёт всю таблицу.
//
// rowsCount = 20 означает,
// что по умолчанию будет создано 20 строк.
export function createTable(rowsCount = 15, state = {}) {
  state = {
    rowState: {},
     colState: {},
     dataState:{},
    currentText: '',
     ...state
  }
  // Вычисляем количество колонок.
  //
  // Между A и Z находится 26 букв:
  //
  // 90 - 65 + 1 = 26
  const colsCount = CODES.Z - CODES.A + 1;

  // Массив, в который будем складывать готовые строки таблицы.
  const rows = [];

  // Создаём заголовки колонок A-Z.
  //
  // new Array(26)
  // создаёт массив из 26 элементов.
  //
  // fill("")
  // заполняет его пустыми значениями:
  //
  // ["", "", "", ...]
  //
  // map(toChar)
  // превращает индексы элементов в буквы:
  //
  // ["A", "B", "C", ..., "Z"]
  //
  // map(toColumn)
  // превращает каждую букву в HTML:
  //
  // [
  //   '<div class="column">A</div>',
  //   '<div class="column">B</div>',
  //   ...
  // ]
  //
  // join("")
  // объединяет всё в одну строку.
  const cols = new Array(colsCount)
    .fill("")
    .map(toChar)
    .map(withWidthFrom(state))
    .map(toColumn)
    .join("");

  // Создаём первую строку — строку с заголовками A-Z.
  //
  // index = null, поэтому row-info будет пустым.
  //
  // Получится примерно:
  //
  // <div class="row">
  //   <div class="row-info"></div>
  //   <div class="row-data">
  //     <div class="column">A</div>
  //     <div class="column">B</div>
  //     ...
  //   </div>
  // </div>
  rows.push(createRow(null, cols, {}));

  // Создаём обычные строки таблицы.
  //
  // Если rowsCount = 20,
  // цикл выполнится 20 раз:
  //
  // i = 0 → строка 1
  // i = 1 → строка 2
  // ...
  // i = 19 → строка 20
  for (let row = 0; row < rowsCount; row++) {
    // Создаём 26 ячеек для каждой строки.
    //
    // new Array(colsCount)
    // → массив из 26 элементов
    //
    // fill("")
    // → заполняем пустыми значениями
    //
    // map(toCell)
    // → каждое значение превращаем в:
    // <div class="cell"></div>
    //
    // join("")
    // → объединяем все ячейки в одну строку.
    const cells = new Array(colsCount)
      .fill("")
      .map(toCell(state,row))
      .join("");

    // Добавляем готовую строку в массив rows.
    //
    // i + 1 нужен потому, что i начинается с 0,
    // а пользователю нужны номера строк начиная с 1.
    rows.push(createRow(row + 1, cells,state.rowState));
  }

  // Объединяем все строки таблицы
  // в одну большую HTML-строку.
  //
  // Эта строка затем может быть вставлена в DOM.
  return rows.join("");
}
