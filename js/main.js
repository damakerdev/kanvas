import { createStore } from "./store.js";
import { renderNode } from "./renderer.js";
import { findNode } from "./model.js";
const store=createStore();

window.kanvasStore=store;

const canvasElem=document.querySelector('.canvas');
const compoPalElem=document.querySelector('.palette');
const inspectorElem=document.querySelector('.inspector');
let typinginInspector=false;

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

function renderInspector(state) {
    if(typinginInspector) return;

    if(!state.selectedId){
        inspectorElem.innerHTML=`
            <h3>inspector window</h3>
            <p>select an element to edit</p>        
        `;
        return;
    }

    const selectedNode=findNode(state.project.page,state.selectedId)
    if(!selectedNode) {
        return;
    }
    inspectorElem.innerHTML = `
        <h3>inspector window</h3>
        <div style="margin-top:12px;">
            <label style="font-size: 13px; font-weight:500; display:block; margin-bottom:4px;">Id: <span style="font-weight:400;">${selectedNode.id}</span></label>
            ${selectedNode.content!==undefined ?
                `
                    <label style="font-size: 13px; font-weight:500; display: block; margin-bottom:4px; margin-top:8px;">Text Content:</label>
                    <input type="text" id="inspector-content-input" value="${selectedNode.content}" style="width:100%; padding: 6px 8px; border: 1px solid #828282; border-radius:4px; font-size: 13px; outline: none;"/>
                `
                :
                `
                    <p style="font-size:13px; color: #6b6b76; margin-top:8px;">This ${selectedNode.type} has no text content</p>
                `
            }
        </div>
    `;

    const inputElem=inspectorElem.querySelector('#inspector-content-input');
    if(inputElem){
        inputElem.addEventListener('focus',()=>{
            typinginInspector=true;
        });
        inputElem.addEventListener('blur',()=>{
            typinginInspector=false;
        })
        inputElem.addEventListener('input',(ev)=>{
            store.dispatch({
                type: 'UPDATE_NODE_CONTENT',
                payload: {
                    id: selectedNode.id,
                    content: ev.target.value
                }
            })
        })
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
    renderInspector(state);
})

renderApp(store.getState());
renderInspector(store.getState());

console.log("kanvas initialized!!")