import React, { useState } from 'react';
import {useOnSelectionChange,useStore } from 'reactflow'
import { BiMessageRoundedDetail } from "react-icons/bi";
import { IoArrowBackSharp } from "react-icons/io5";

export const Sidebar = (props) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const [isSettingsPanelVisible, setIsSettingsPanelVisible] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [nodeData, setNodeData] = useState('');
  useOnSelectionChange({
    onChange: ({ nodes }) => {
      console.log(nodes)
      setSelectedNode(nodes[0]);
      setNodeData(nodes[0]?.data.label);
      if(nodes.length > 0 && nodes[0].selected){
        setIsSettingsPanelVisible(true);
      }
      else{
        unselectNode();
      }
    },
  }); // select node and show settings panel visibility

  const resetSelectedElements = useStore((actions) => actions.unselectNodesAndEdges);

  const updateValue = (value) => {
    setNodeData(value);
    props.onValueChange(value,selectedNode.id);
  }

  const unselectNode = () => {
    setIsSettingsPanelVisible(false)
    resetSelectedElements();
  }

  if(isSettingsPanelVisible){
    return (
      <aside>
        <div className='d-flex border-top border-bottom align-items-center settings-head'>
          <IoArrowBackSharp onClick={unselectNode} />
          <span className='w-100 text-center'>Message</span>
        </div>
        <div className='settings-body border-bottom px-2 py-3'>
          <label className='text-secondary' htmlFor="nodeData">Text</label>
          <textarea onChange={(e) => updateValue(e.target.value, selectedNode.id)} className='w-100' value={nodeData}  id="nodeData" name="nodeData" rows="4"/>        </div>
      </aside>
    );
  }
  else{
    return (
      <aside className='p-3'>
        <div className="dndnode input d-flex flex-column" onDragStart={(event) => onDragStart(event, 'messageNode')} draggable>
          <BiMessageRoundedDetail size={20} className='img' color='#6f7596' />
          <span className='text mt-1'>Message</span>
        </div>
      </aside>
    );
  }
};
