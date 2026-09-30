import { createProj, addNode, findNode } from "./model.js";

export function createStore(){
    let state= {
        project: createProj(),
        selectedId: null
    }

    const listeners=[]

    return {
        getState(){
            return state;
        }, 
        dispatch(action){
            switch(action.type){
                case 'CREATE_PROJECT':
                    state.project=createProj(action.payload.name);
                    break;
                case 'ADD_NODE':
                    state.project=addNode(state.project,action.payload.parentId,action.payload.type)
                    break
                case 'SELECT_NODE':
                    state.selectedId=action.payload.id;
                    break
                case 'UPDATE_NODE_CONTENT':
                    const { id, content}=action.payload;
                    const projcopy=structuredClone(state.project)
                    const target=findNode(projcopy.page, id)
                    if(target){
                        target.content=content;
                    }
                    state.project=projcopy;
                    break;
                default:
                    console.warn("unknown action type: ",action.type)
                    return
            }
            listeners.forEach(listenr=>listenr(state));
        },

        subscribe(listener){
            listeners.push(listener);
            return()=>{
                const index=listeners.indexOf(listener);
                if(index>-1){
                    listeners.splice(index,1)
                }
            }
        },
    }
}