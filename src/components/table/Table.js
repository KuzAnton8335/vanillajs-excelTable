import { ExcelComponent } from "../../core/ExcelComponent.js";
import { $ } from "../../core/dom";
import { TableSelection } from "./TableSelection";
import { isCell, matrix, nextSelector, shouldResize } from "./table.function";
import { resizeHandler } from "./table.resize";
import { createTable } from "./table.template";
import * as actions from "../../redux/actions";
import { defaultStyles } from "../../constants.js";
import { parse } from "../../core/parse.js";

export class Table extends ExcelComponent {
  static className = "excel__table";

  constructor($root, options) {
    super($root, {
      name: "Table",
      listeners: ["mousedown", "keydown", "input"],
      ...options,
    });
  }

  toHtml() {
    return createTable(25,this.store.getState());
  }

  prepare() {
    this.selection = new TableSelection();
  }

  init() {
    super.init();
    const $cell = this.$root.find('[data-id="0:0"]');
    this.selectCell($cell)


    this.$on("formula:input", value => {
      this.selection.current.attr('data-value', value);
      this.selection.current.text(parse(value));
      this.updateTextInStore(value);
    });

    this.$on('formula:done', () => {
      this.selection.current.focus()
    })

    this.$on('toolbar:applyStyle', value => {
      console.log('Table style', value)
      this.selection.applyStyle(value)
      this.$dispatch(actions.applyStyle({
        value,
        ids:this.selection.selectedIds
      }))
    })
  }

  selectCell($cell) {
    this.selection.select($cell);
    this.$emit('table:select', $cell);
    const styles = $cell.getStyles(Object.keys(defaultStyles))
    console.log("Styles to dispatch", styles)
    this.$dispatch(actions.changeStyle(styles))
  }

  // размеры таблицы
  async resizeTable(event) {

    try {
      const data = await resizeHandler(this.$root, event);
      this.$dispatch(actions.tableResize(data));
    }
    catch (error) {
       console.warn('Resize error'. error.message)
    }

   }

  // onMousedown - логика управления мышью
  onMousedown(event) {
    if (shouldResize(event)) {
      this.resizeTable(event)
    } else if (isCell(event)) {
      const $target = $(event.target);
      if (event.shiftKey) {
        // group
        const target = $target.id(true);
        const current = this.selection.current.id(true);

        const $cells = matrix(target, current).map(id =>
          this.$root.find(`[data-id="${id}"]`),
        );
        this.selection.selectGroup($cells);
      } else {
        this.selection.select($target);
      }
    }
  }

  onKeydown(event) {
    const keys = [
      "Enter",
      "Tab",
      "ArrowLeft",
      "ArrowRight",
      "ArrowDown",
      "ArrowUp",
    ];
    const { key } = event;
    if (keys.includes(key) && !event.shiftKey) {
      event.preventDefault();
      const id = this.selection.current.id(true);

      const $next = this.$root.find(nextSelector(key, id));
      this.selectCell($next)
    }
  }

  updateTextInStore(value) {
    this.$dispatch(actions.changeText({
      id: this.selection.current.id(),
      value
    }))
  }

  onInput(event) {
    const $target = $(event.target)
    this.updateTextInStore($target.text())
  }
}
