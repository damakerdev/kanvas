export function renderNode(node,selectedId)
{
    let elem;
    if(node.type==='section'){
        elem=document.createElement('section')
    } else if(node.type==='heading'){
        elem=document.createElement('h1')
        elem.textContent=node.content || '';
    } else if(node.type==='paragraph'){
        elem=document.createElement('p')
        elem.textContent=node.content||'';
    } else {
        elem=document.createElement('div')
        elem.textContent=node.content||'';
    }

    elem.dataset.nodeId=node.id;
    elem.className=`node ${node.type}`;
    if(node.styles){
        for(const [prop,val] of Object.entries(node.styles)){
            elem.style[prop]=val;
        }
    }

    if(node.id===selectedId){
        elem.style.outline="2px solid #5b5bf0";
        elem.style.outlineOffset="2px";
    } else {
        elem.style.outline="none";
    }

    if(node.children && node.children.length>0){
        for(const child of node.children){
            const rendered=renderNode(child, selectedId);
            elem.appendChild(rendered);
        }
    }
    return elem;
}