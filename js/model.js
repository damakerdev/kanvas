import { COMPONENTS } from "./registry.js";

export function createProj(name="my cool site") {
    return {
        schemaVersion: 1,
        meta: {
            name,
            createdAt: new Date().toISOString()
        },
        counters: {},//#TODO to give ids 
        page: {
            id: "root-page",
            type: "page",
            children: []
        }
    }
}

export function generateId(project, type){
    if(!project.counters[type]){
        project.counters[type]=0;
    }
    project.counters[type]++;
    return `${type}-${project.counters[type]}`;
    // heading-1, yadayada-9 counts
}

export function addNode(project, parentId, type, idx=null){
    const newProj=structuredClone(project);
    const parentNode=findNode(newProj.page, parentId)
    if(!parentNode){
        console.error("parent node not found:", parentId)
        return project;
    }
    const compoDefn=COMPONENTS[type];
    if(!compoDefn){
        console.error("unknown component type: ",type);
        alert(`ooopss! ${type} is coming in the next version! :P`)
        return project
    }

    const newNodeId = generateId(newProj,type);
    const newNode= {
        id: newNodeId,
        type: type,
        ...(compoDefn.defaults.content !==undefined? {content: compoDefn.defaults.content}:{}),
        styles: structuredClone(compoDefn.defaults.styles),
        ...(compoDefn.isContainer? {children: []}:{})
    };
    parentNode.children.push(newNode)
    return newProj;
}

export function findNode(node, id){
    if(node.id===id) return node;
    if(!node.children){
        return null;
    }
    for( const child of node.children){
        const found=findNode(child,id);
        if(found) return found;
    }
    return null;
}

