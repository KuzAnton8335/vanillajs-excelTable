import { DomListener } from "./DomListener";

export class ExcelComponent extends DomListener {
  constructor($root, options = {}) {
    super($root, options.listeners);
    this.name = options.name || "";
    this.emitter = options.emitter;
    this.subscribe = options.subscribe || []
    this.store = options.store;
    this.unsubscribers = [];
    this.storeSub = null;

    this.prepare();
  }

  // Настраиваем наш компонент до init
  //
  prepare() {}

  // Возвращаем шаблон компонента
  toHtml() {
    return ""; // must be overwritten in child classes
  }

  // уведовляем слушателей про событие event
  $emit(event, ...args) {
    this.emitter.emit(event, ...args);
  }
  // подписка на событие event
  $on(event, fn) {
    const unsub = this.emitter.subscribe(event, fn);
    this.unsubscribers.push(unsub);
  }

  $dispatch(action) {
    this.store.dispatch(action)
  }

  // Сюда приходят только те изменения п тем полям на которые мы подписались
  storeChange() { }

  // массив строчек для подписки store
  isWatching(key) {
    return this.subscribe.includes(key)
  }


  // инициализируем компонент
  // добовляем DOM слушателей
  init() {
    this.initDOMListeners();
  }

  // удолаем компонент
  // чистим слушателей
  destroy() {
    this.removeDOMListeners();
    this.unsubscribers.forEach(unsub => unsub());
     }
}
