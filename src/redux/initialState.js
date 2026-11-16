import { defaultStyles,defaultTitle } from "../constants";
import { storage } from "../core/utils";

// начальное  состояние для ячеек таблицы (для State)
const defaultState = {
   title:defaultTitle,
   rowState: {},
   colState: {},
   dataState: {},
   stylesState:{},
   currentText: '',
   currentStyles:defaultStyles,

}

const normalaize = state => ({
  ...state,
  currentStyles: defaultStyles,
  currentText:''
})

export const initialState = storage('excel-state') ? normalaize (storage('excel-state')) : defaultState
