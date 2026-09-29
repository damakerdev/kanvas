import { createStore } from "./store.js";
import { renderNode } from "./renderer.js";
const store=createStore();

window.kanvasStore=store;

const canvasElem=document.querySelector('.canvas');

function renderApp(state){
    canvasElem.innerHTML='';
    const rootPage=state.project.page;
    if(!rootPage.children|| rootPage.children.length===0){
        canvasElem.innerHTML=`<p>drag components here or click to add them</p>`;
        return;
    }

    for(const child of rootPage.children){
        const elem=renderNode(child)
        canvasElem.appendChild(elem)
    }
}


store.subscribe((state)=>{
    // console.log("state updated:",state)
    renderApp(state);
})

renderApp(store.getState());

console.log("kanvas initialized!!")