export class Emitter {
  constructor() {
    this.listeners = {}
  }
  //уведомление слушателей если они есть
  emit (event,...args) {
    if(!Array.isArray(this.listeners[event])){
      return false;
    }
    this.listeners[event].forEach((listener)=>{
      listener(...args);
    })
    return true;
  }
  // подписка на уведомление
  subscribe(event,fn){
     this.listeners[event]= this.listeners[event] || []
     this.listeners[event].push(fn)
     return () =>{
       this.listeners[event] =
         this.listeners[event].filter(listener => listener !== fn);
     }
  }
}

// const emitter = new Emitter();
// emitter.subscribe("vladilen", data => console.log('Sub:',data));
// emitter.emit('vladilen',42)