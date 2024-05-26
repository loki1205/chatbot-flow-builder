import {  Position, getConnectedEdges }  from 'reactflow';
import CustomHandle from '../CustomHandler'
import { BiMessageRoundedDetail } from "react-icons/bi";
import whatsAppLogo from '../../assets/images/whatsapp-icon-modified.png'
function MessageNode({ data, isConnectable }) {

  const isHandleConnectable = (nodeInternals, nodeId, edges) => {
    const node = nodeInternals.get(nodeId);
    const connectedEdges = getConnectedEdges([node], edges);
    const sourceEdges =  connectedEdges.filter(x => x.source === node.id);
    return sourceEdges.length >= 1 ? false : true;
  }
  return (
    <div className="text-updater-node">
      <CustomHandle type="target" position={Position.Left}  isConnectable={isConnectable} />
      <div>
        <div className='node-head p-1 d-flex justify-content-between align-items-center'>
          <div className='d-flex flex-row h-100 align-items-center'>
            <BiMessageRoundedDetail size={10} className='img' color='#6f7596' />
            <span className='head-text'>Send Message</span>
          </div>
          <div className="h-100 whatsapp-div d-flex justify-content-center align-items-center">
            <img width={12} src={whatsAppLogo} className='w-100 h-100' alt="whatsapp icon"/>
          </div>
        </div>
        <div className='node-body px-2'>
          <span className='body-text'>{data.label}</span>
        </div>
      </div>
      <CustomHandle type="source" position={Position.Right} isConnectable={isHandleConnectable}/>
    </div>
  );
}

export default MessageNode;