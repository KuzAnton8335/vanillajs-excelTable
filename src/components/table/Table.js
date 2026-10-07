import { ExcelComponent } from "../../core/ExcelComponent";
import { $ } from "../../core/dom";
import { TableSelection } from "./TableSelection";
import { isCell, matrix, nextSelector, shouldResize } from "./table.function";
import { resizeHandler } from "./table.resize";
import { createTable } from "./table.template";

export class Table extends ExcelComponent {
  static className = "excel__table";

  constructor($root, options) {
    super($root, {
      name: "Table",
      listeners: ["mousedown", "keydown"],
      ...options,
    });
  }

  toHtml() {
    return createTable(20);
  }

  prepare() {
    this.selection = new TableSelection();
  }

  init() {
    super.init();
    const $cell = this.$root.find('[data-id="0:0"]');
    this.selection.select($cell);
    this.$on("it is working", text => {
      this.selection.current.text(text);
    });
  }
  // onMousedown - логика управления мышью
  onMousedown(event) {
    if (shouldResize(event)) {
      resizeHandler(this.$root, event);
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
      this.selection.select($next);
    }
  }
}
