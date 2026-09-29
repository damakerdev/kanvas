export function renderNode(node)
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

    if(node.children && node.children.length>0){
        for(const child of node.children){
            const rendered=renderNode(child);
            elem.appendChild(rendered);
        }
    }
    return elem;
}