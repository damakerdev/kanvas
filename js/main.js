import { createStore } from "./store.js";
import { renderNode } from "./renderer.js";
import { findNode } from "./model.js";
const store=createStore();

window.kanvasStore=store;

const canvasElem=document.querySelector('.canvas');
const compoPalElem=document.querySelector('.palette');

function renderApp(state){
    canvasElem.innerHTML='';
    const rootPage=state.project.page;
    if(!rootPage.children|| rootPage.children.length===0){
        canvasElem.innerHTML=`<p>drag components here or click to add them</p>`;
        return;
    }

    for(const child of rootPage.children){
        const elem=renderNode(child, state.selectedId)
        canvasElem.appendChild(elem)
    }
}

canvasElem.addEventListener('click',(e)=>{
    const nodeElem=e.target.closest(`[data-node-id]`);

    if(nodeElem){
        const nodeId=nodeElem.dataset.nodeId;
        store.dispatch({
            type: 'SELECT_NODE',
            payload:{id: nodeId}
        })
    } else {
        store.dispatch({ 
            type: 'SELECT_NODE', 
            payload: {id:null}
        })
    }
})

compoPalElem.addEventListener('click',(e)=>{
    const item=e.target.closest('[data-type]');
    if(!item){
        return;
    }
    // console.log("foundd compo:",item.dataset.type)
    const type=item.dataset.type;
    const currState=store.getState();
    let targetParentId='root-page';
    if(currState.selectedId){
        const selectedNode=findNode(currState.project.page,currState.selectedId);
        if(selectedNode&& (selectedNode.type==='section'||selectedNode.type==='card')){
            targetParentId=selectedNode.id;
        }
    }
    
    if(type!=='section' && targetParentId==='root-page'){
        const sections=currState.project.page.children.filter(child=>child.type==='section');
        if(sections.length>0){
            targetParentId=sections[sections.length-1].id;
        } else {
            alert('please create a section first!');
            return;
        }
    }

    store.dispatch({
        type: 'ADD_NODE',
        payload: {
            parentId: targetParentId,
            type: type
        }
    })
})

store.subscribe((state)=>{
    // console.log("state updated:",state)
    renderApp(state);
})

renderApp(store.getState());

console.log("kanvas initialized!!")