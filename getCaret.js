function node_walk(node, func) {
    let result = func(node);
    for(node = node.firstChild; result !== false && node; node = node.nextSibling) {
        result = node_walk(node, func);
    }
    return result;
};
  
function getCaret(elem) {
    const sel = window.getSelection();
    let cum_length = [0, 0];
  
    if(sel.anchorNode == elem)
        cum_length = [sel.anchorOffset, sel.extentOffset];
    else {
        const nodes_to_find = [sel.anchorNode, sel.extentNode];
        if(!elem.contains(sel.anchorNode) || !elem.contains(sel.extentNode)) return undefined;
        else {
            let found = [0, 0];

            node_walk(elem, function(node) {
                for(let i = 0; i < 2; i++) {
                    if(node === nodes_to_find[i]) {
                        found[i] = true;

                        if(found[i === 0 ? 1 : 0]) return false; // all done
                    }
                }
        
                if(node.textContent && !node.firstChild) {
                    for(let i = 0; i < 2; i++) {
                        if(!found[i]) cum_length[i] += node.textContent.length;
                    }
                }
            });

            cum_length[0] += sel.anchorOffset;
            cum_length[1] += sel.extentOffset;
        }
    }

    if(cum_length[0] <= cum_length[1]) return cum_length;

    return [cum_length[1], cum_length[0]];
}

export default getCaret;