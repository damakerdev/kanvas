import { createStore } from "./store.js";
const store=createStore();

window.kanvasStore=store;

store.subscribe((state)=>{
    console.log("state updated:",state)
})

console.log("kanvas initialized!! run this to see the project state obj: kanvasStore.dispatch({type: 'ADD_NODE', payload:{parentId: 'root-page',type:'heading'}})")