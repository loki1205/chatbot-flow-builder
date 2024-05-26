import React, { useMemo } from 'react';
import { getConnectedEdges, Handle, useNodeId, useStore } from 'reactflow';

const selector = (s) => ({
    nodeInternals: s.nodeInternals,
    edges: s.edges,
}); // to get the node details, and edge connection details of selected nodes.

const CustomHandle = (props) => {
    const { nodeInternals, edges } = useStore(selector); // store data in variable
    const nodeId = useNodeId(); // get node Id of selected node

    const isHandleConnectable = useMemo(() => {
        if (typeof props.isConnectable === 'function') {
            return props.isConnectable(nodeInternals, nodeId, edges);
        }

        if (typeof props.isConnectable === 'number') {
            const node = nodeInternals.get(nodeId);
            const connectedEdges = getConnectedEdges([node], edges);

            return connectedEdges.length < props.isConnectable;
        }

        return props.isConnectable;
    }, [nodeInternals, edges, nodeId, props]); //  function to decide if a handle is connectable

    return (
        <Handle {...props} isConnectable={isHandleConnectable}></Handle>
    );
};

export default CustomHandle;