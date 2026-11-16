import { toInlineStyles } from "../core/utils"
import { CHANGE_TEXT, TABLE_RESIZE,APPLY_STYLE,CHANGE_STYLES, CHANGE_TITLE } from "./types"

// Pure Function
export function rootReducer(state, action) {
  let prevState
  let field
  let val
  // console.log("ACTION",action)
  switch (action.type) {
    case TABLE_RESIZE:
      field = action.data.type === 'col' ? 'colState' : 'rowState'
      prevState = state[field] || {}
      prevState[action.data.id] = action.data.value
      return { ...state, [field]: prevState }// id,value - колонки и значение колонки
    case CHANGE_TEXT:
      prevState = state['dataState'] || {}
      prevState[action.data.id] = action.data.value
      return { ...state, currentText: action.data.value, dataState: prevState }
    case CHANGE_STYLES:
      return { ...state, currentStyles: action.data }
    case APPLY_STYLE:
      field = "stylesState"
      val = state[field] || {}
      action.data.ids.forEach(id => {
        val[id] = {...val[id], ...action.data.value}
              })
      return {
        ...state, [field]:val, currentStyles:{...state.currentStyles, ...action.data.value}
      }
    case CHANGE_TITLE:
      return {...state,title: action.data}
    default:return state
  }
}
