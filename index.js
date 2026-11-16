import { Excel } from "./src/components/excel/Excel";
import { Header } from "./src/components/header/Header";
import { Toolbar } from "./src/components/toolbar/Toolbar";
import { Formula } from "./src/components/formula/Formula";
import { Table } from "./src/components/table/Table";
import { createStore } from "./src/core/createStore";
import { storage,debounce} from "./src/core/utils"
import "./src/scss/index.scss";
import { rootReducer } from "./src/redux/rootReducer";
import { initialState } from "./src/redux/initialState";

const store = createStore(rootReducer, initialState)

const stateListener = debounce (state => {
  console.log("App State", state),
  storage('excel-state',state)
}, 300)

store.subscribe( stateListener )

const excel = new Excel("#app", {
  components: [Header, Toolbar, Formula, Table],
  store,
});

excel.render();
