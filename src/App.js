import React, { useState, useRef, useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  getConnectedEdges,
} from 'reactflow';
import 'reactflow/dist/style.css';
import MessageNode from './components/nodes/MessageNode.js';
import {Sidebar} from './components/Sidebar.js';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import './assets/css/index.scss';

const initialNodes = JSON.parse(localStorage.getItem('nodes')) || [
  {
    id: '1',
    type: 'messageNode',
    data: { label: 'Click on node to change text' },
    position: { x: 250, y: 5 },
  },
];

const initialEdges = JSON.parse(localStorage.getItem('edges')) || [];

const nodeTypes = { messageNode: MessageNode };


let id = localStorage.getItem('id') || 0;
const getId = () => `messageNode_${id++}`;

const App = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('');
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds))
  ,[]);

  const [openAlert,setOpenAlert] = useState(false);

  const showAlert = (severity, message) => {
    setOpenAlert(true);
    setAlertMessage(message);
    setAlertSeverity(severity)
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlert(false);
  };

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);


  const onValueChange = (value,id) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          node.data = {
            ...node.data,
            label: value,
          };
        }
        return node;
      })
    );
  }

  const saveNodes = () => {
    if(nodes.length === 1){
      showAlert('success', 'Content Flow Saved');
      localStorage.setItem('nodes', JSON.stringify(nodes));
      localStorage.setItem('edges', JSON.stringify(edges));
      localStorage.setItem('id',id)
    } 
    else if(nodes.length > 1){
      const connectedEdges = getConnectedEdges(nodes,edges);
      if(connectedEdges.length === 0){
        showAlert('error', 'Cannot Save Flow');
      }
      else{
        const validateNodesPresence = nodes.map((x) => {
          let availableConnections = connectedEdges.filter((y) => (y.source === x.id) || (y.target === x.id));
          return availableConnections.length >= 1 ? true : false;
        })
        if(validateNodesPresence.some((x) => x === false)){
          showAlert('error', 'Cannot Save Flow');
        }
        else{
          showAlert('success', 'Content Flow Saved');
          localStorage.setItem('nodes', JSON.stringify(nodes));
          localStorage.setItem('edges', JSON.stringify(edges));
          localStorage.setItem('id',id)
        }
      }
    }
  }

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `Click on node to change text` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance],
  );
  return (
    <>
      <div className='save-wrapper px-5 d-flex justify-content-end align-items-center'>
        <button type="button" onClick={saveNodes} className="btn m-0 p-0 p-1 btn-outline-secondary">Save Changes</button>
      </div>
      <div className="dndflow">
        <ReactFlowProvider>
          <div className="reactflow-wrapper" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onInit={setReactFlowInstance}
              onDrop={onDrop}
              onDragOver={onDragOver}
              fitView
              zoomOnScroll = {false}
              zoomOnPinch = {false}
              preventScrolling = {false}
              nodeTypes={nodeTypes}
            >
            </ReactFlow>
          </div>
          <Sidebar onValueChange={onValueChange}/>
        </ReactFlowProvider>
      </div>
      <Snackbar open={openAlert} anchorOrigin={{vertical: 'top', horizontal: 'center'}} autoHideDuration={1500} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={alertSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
      </>
  );
};

export default App;
