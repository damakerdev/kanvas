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

    const selectedNode=state.selectedId? findNode(state.project.page,state.selectedId):null;
    let pHtml='';
    if(!selectedNode) {
        // return;
        pHtml='<p>select an element to edit</p>';
    } else {
        pHtml = `
            <label class="inspector-selected">Selected: <span>${selectedNode.id}</span></label>
            ${selectedNode.content!==undefined ?
                `
                    <label class="inspector-text-label">Text Content:</label>
                    <input type="text" id="inspector-content-input" value="${selectedNode.content}"/>
                `
                :
                ``}
                <button id="inspector-delete-btn">delete element</button>
            `;

    }

    inspectorElem.innerHTML= `
        <div class="inspector-section">
            <h3 class="inspector-headr">inspector window</h3>
            <div class="inspector-properties">
                ${pHtml}
            </div>
        </div>
        <div class="inspector-section">
                <h3 class="inspector-headr">Element Tree</h3>
                <div id="elem-tree-list">
                    ${renderElemTree(state.project.page,state.selectedId)}
                </div>
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

    const treeListElem=inspectorElem.querySelector('#elem-tree-list')
    if(treeListElem){
        treeListElem.addEventListener('click',(e)=>{
            const treeitem=e.target.closest('[data-node-id]')
            if(treeitem){
                const nodeId=treeitem.dataset.nodeId;
                store.dispatch({
                    type:'SELECT_NODE',
                    payload:{id:nodeId}
                })
            }
        })
    }

    const delBtn=inspectorElem.querySelector('#inspector-delete-btn')
    if(delBtn){
        delBtn.addEventListener('click',()=>{
            store.dispatch({
                type:'DELETE_NODE',
                payload: {
                  id: selectedNode.id
                }
            })
        })
    }

}

function renderElemTree(node, selectedId, depth=0){
    if(!node){
        return '';
    }
    let html='';
    if(node.type!=='page'){
        const isSelected=node.id===selectedId
        const tabgap=(depth===0)?8:(depth*24);
        html+=`
            <div data-node-id="${node.id}" style="padding-left: ${tabgap}px; padding-top: 8px; padding-bottom: 8px; cursor: pointer;font-size:13px; display: flex; align-items: center; ${isSelected ? 'background-color: #2d2d2d16; font-weight: 500;' : 'color: #333;'}">
                <span>
                    ${node.type}
                    <span style="color: #8c8c9a; font-size: 11px;">
                        (${node.id})
                    </span>
                </span>
            </div>
        `
    }
    if(node.children && node.children.length>0){
        for(const child of node.children){
            html+=renderElemTree(child,selectedId,node.type==='page'?depth:depth+1)
        }
    }
    return html;
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