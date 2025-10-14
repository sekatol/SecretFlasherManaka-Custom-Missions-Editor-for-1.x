import React, { useCallback, useState, useRef, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';

import SerekaTaskNode from './components/SerekaTaskNode';
import ZoneContainer from './components/ZoneContainer';
import SubConditionContainer from './components/SubConditionContainer';
import ActionNode from './components/ActionNode';
import CheckpointModuleNode from './components/CheckpointModuleNode';
import DescriptionNode from './components/DescriptionNode';
import Sidebar from './components/Sidebar';
import PropertyPanel from './components/PropertyPanel';
import TabBar from './components/TabBar';
import { SerekaTaskConverter } from './utils/taskConverter';
import { WorkspaceManager } from './utils/workspaceManager';
import './App.css';

const nodeTypes = {
  serekaTaskNode: SerekaTaskNode,
  zoneContainer: ZoneContainer,
  subConditionContainer: SubConditionContainer,
  description: DescriptionNode,
  // 检查点模块节点
  checkpoint_condition: CheckpointModuleNode,
  checkpoint_travelcondition: CheckpointModuleNode,
  // 新合并动作节点类型
  action_manageCosplay: ActionNode,
  action_manageAdultToy: ActionNode,
  action_manageHandcuffs: ActionNode,
  // 旧动作节点类型
  action_setStage: ActionNode,
  action_equipCosplay: ActionNode,
  action_unequipCosplay: ActionNode,
  action_unequipAllCosplay: ActionNode,
  action_equipAdultToy: ActionNode,
  action_lockHandcuffs: ActionNode,
  action_unlockHandcuffs: ActionNode,
  action_dropItem: ActionNode,
  action_teleportPlayer: ActionNode,
  action_setPlayerPosition: ActionNode,
  action_setCoatState: ActionNode,  // 外套状态控制
  action_addItem: ActionNode,
  action_setVibrator: ActionNode,
  action_setPiston: ActionNode,
  action_unequipAdultToy: ActionNode,
};

const initialNodes = [];
const initialEdges = [];

function App() {
  console.log('App component rendering...');
  
  // ReactFlow实例
  const { screenToFlowPosition, setViewport, getViewport } = useReactFlow();
  
  // 标签页状态管理
  const [tabs, setTabs] = useState(() => {
    const saved = WorkspaceManager.loadWorkspace();
    if (saved && saved.tabs && saved.tabs.length > 0) {
      return saved.tabs;
    }
    return [{
      id: 'tab-1',
      name: '工作流 1',
      nodes: [],
      edges: [],
      selectedNode: null,
      viewport: { x: 0, y: 0, zoom: 1 },
    }];
  });
  
  const [activeTabId, setActiveTabId] = useState(() => {
    const saved = WorkspaceManager.loadWorkspace();
    return saved?.activeTabId || 'tab-1';
  });
  
  // 获取当前活动标签页
  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];
  
  // 使用当前标签页的数据
  const [nodes, setNodes, onNodesChange] = useNodesState(activeTab.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(activeTab.edges || []);
  const [selectedNode, setSelectedNode] = useState(activeTab.selectedNode || null);
  const [showPropertyPanel, setShowPropertyPanel] = useState(false);
  const [history, setHistory] = useState([{ nodes: [], edges: [] }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [clipboard, setClipboard] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [statusMessage, setStatusMessage] = useState(''); // 状态消息
  const [exportPath, setExportPath] = useState(''); // 导出路径
  const fileInputRef = useRef(null);
  let nodeIdCounter = useRef(1);
  
  // 页面加载时恢复viewport
  useEffect(() => {
    if (activeTab && activeTab.viewport) {
      setTimeout(() => {
        setViewport(activeTab.viewport, { duration: 0 });
        console.log('恢复viewport:', activeTab.viewport);
      }, 100);
    }
  }, []);

  const onConnect = useCallback(
    (params) => {
      // 根据连接类型确定边的颜色
      let edgeColor = '#888';
      let edgeAnimated = true;
      
      // 根据 sourceHandle 确定颜色
      if (params.sourceHandle === 'oncomplete') {
        edgeColor = '#4CAF50'; // 绿色 - 完成
      } else if (params.sourceHandle === 'onviolatecondition') {
        edgeColor = '#FF5722'; // 红色 - 违反
      } else if (params.sourceHandle === 'condition') {
        edgeColor = '#4CAF50'; // 绿色 - 条件
      } else if (params.sourceHandle === 'travelcondition') {
        edgeColor = '#2196F3'; // 蓝色 - 移动条件
      } else if (params.sourceHandle === 'nextcheckpoint') {
        edgeColor = '#FF9800'; // 橙色 - 下一检查点
      }
      
      // 添加连线,移除 label,添加 markerEnd 箭头
      setEdges((eds) => addEdge({ 
        ...params, 
        type: 'smoothstep',
        animated: edgeAnimated,
        style: { stroke: edgeColor, strokeWidth: 2 },
        markerEnd: {
          type: 'arrowclosed',
          color: edgeColor,
          width: 20,
          height: 20
        }
      }, eds));
      
      // 自动填充 nextcheckpoint 字段
      // 当从检查点的 nextcheckpoint 锚点连接到另一个检查点的 in 锚点时
      if (params.sourceHandle === 'nextcheckpoint' && params.targetHandle === 'in') {
        const sourceNode = nodes.find(n => n.id === params.source);
        const targetNode = nodes.find(n => n.id === params.target);
        
        // 确保源节点是检查点，目标节点也是检查点
        if (sourceNode?.data?.nodeTemplate?.type === 'checkpoint' && 
            targetNode?.data?.nodeTemplate?.type === 'checkpoint') {
          
          const targetCheckpointId = targetNode.data.formData?.id;
          
          if (targetCheckpointId) {
            // 更新源节点的 nextcheckpoint 字段
            setNodes((nds) =>
              nds.map((node) => {
                if (node.id === params.source) {
                  return {
                    ...node,
                    data: {
                      ...node.data,
                      formData: {
                        ...node.data.formData,
                        nextcheckpoint: targetCheckpointId
                      }
                    }
                  };
                }
                return node;
              })
            );
            
            // 如果选中了源节点，同时更新 PropertyPanel
            setSelectedNode((selected) => {
              if (selected?.id === params.source) {
                return {
                  ...selected,
                  data: {
                    ...selected.data,
                    formData: {
                      ...selected.data.formData,
                      nextcheckpoint: targetCheckpointId
                    }
                  }
                };
              }
              return selected;
            });
          }
        }
      }
    },
    [setEdges, setNodes, nodes]
  );

  // 保存历史记录（提前定义，供其他函数使用）
  const saveToHistory = useCallback(() => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push({ nodes: [...nodes], edges: [...edges] });
      // 限制历史记录数量为50
      if (newHistory.length > 50) {
        newHistory.shift();
        return newHistory;
      }
      return newHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [nodes, edges, historyIndex]);

  // 选中容器内的项（地点或子条件）- 提前定义供 onAddNode 使用
  const onItemSelect = useCallback((containerId, itemType, item) => {
    console.log('onItemSelect called:', { containerId, itemType, item });
    // 使用 setNodes 获取最新的 nodes,避免闭包问题
    setNodes((currentNodes) => {
      const containerNode = currentNodes.find(n => n.id === containerId);
      console.log('Found container node:', containerNode);
      if (containerNode) {
        const newSelectedNode = {
          ...containerNode,
          selectedItem: { type: itemType, data: item }
        };
        console.log('Setting selected node:', newSelectedNode);
        setSelectedNode(newSelectedNode);
        setShowPropertyPanel(true);
        setContextMenu(null);
      }
      return currentNodes; // 不修改 nodes,只是读取
    });
  }, []); // 移除 nodes 依赖,因为我们用函数式更新

  const onAddNode = useCallback((nodeTemplate) => {
    // 特殊处理：如果是 zone 类型，添加到 zoneContainer
    if (nodeTemplate.type === 'zone') {
      setNodes((nds) => {
        // 查找或创建 zoneContainer
        let zoneContainer = nds.find(n => n.type === 'zoneContainer');
        
        if (!zoneContainer) {
          // 创建新的 zoneContainer，并注入 onItemSelect 回调
          zoneContainer = {
            id: `zone_container_${nodeIdCounter.current++}`,
            type: 'zoneContainer',
            position: { x: 100, y: 100 },
            style: { width: 600, height: 400 },
            data: { 
              zones: [], 
              label: '地点列表',
              onItemSelect: onItemSelect  // 注入回调
            }
          };
        }
        
        // 创建新的 zone 数据
        const newZone = nodeTemplate.fields.reduce((acc, field) => {
          acc[field.name] = field.default;
          return acc;
        }, {});
        
        // 生成唯一 ID
        if (!newZone.id || newZone.id === '') {
          const existingIds = zoneContainer.data.zones.map(z => z.id);
          let counter = 1;
          let newId = `zone_${counter}`;
          while (existingIds.includes(newId)) {
            counter++;
            newId = `zone_${counter}`;
          }
          newZone.id = newId;
        }
        
        // 更新 zoneContainer
        const updatedContainer = {
          ...zoneContainer,
          data: {
            ...zoneContainer.data,
            zones: [...zoneContainer.data.zones, newZone]
          }
        };
        
        // 如果是新容器，添加它；否则更新现有容器
        let newNodes;
        if (!nds.find(n => n.type === 'zoneContainer')) {
          newNodes = [...nds, updatedContainer];
        } else {
          newNodes = nds.map(n => n.type === 'zoneContainer' ? updatedContainer : n);
        }
        
        setTimeout(() => saveToHistory(), 0);
        return newNodes;
      });
      return;
    }
    
    // 特殊处理：如果是 condition 类型，添加到 subConditionContainer
    if (nodeTemplate.type === 'condition') {
      setNodes((nds) => {
        // 查找或创建 subConditionContainer
        let subCondContainer = nds.find(n => n.type === 'subConditionContainer');
        
        if (!subCondContainer) {
          // 创建新的 subConditionContainer，并注入 onItemSelect 回调
          subCondContainer = {
            id: `subcond_container_${nodeIdCounter.current++}`,
            type: 'subConditionContainer',
            position: { x: 100, y: 600 },
            style: { width: 600, height: 300 },
            data: { 
              subconditions: [], 
              label: '子条件列表',
              onItemSelect: onItemSelect  // 注入回调
            }
          };
        }
        
        // 创建新的 subcondition 数据
        const newSubCondition = nodeTemplate.fields.reduce((acc, field) => {
          acc[field.name] = field.default;
          return acc;
        }, {});
        
        // 生成唯一 ID
        if (!newSubCondition.id || newSubCondition.id === '') {
          const existingIds = subCondContainer.data.subconditions.map(sc => sc.id);
          let counter = 1;
          let newId = `subcond_${counter}`;
          while (existingIds.includes(newId)) {
            counter++;
            newId = `subcond_${counter}`;
          }
          newSubCondition.id = newId;
        }
        
        // 更新 subConditionContainer
        const updatedContainer = {
          ...subCondContainer,
          data: {
            ...subCondContainer.data,
            subconditions: [...subCondContainer.data.subconditions, newSubCondition]
          }
        };
        
        // 如果是新容器，添加它；否则更新现有容器
        let newNodes;
        if (!nds.find(n => n.type === 'subConditionContainer')) {
          newNodes = [...nds, updatedContainer];
        } else {
          newNodes = nds.map(n => n.type === 'subConditionContainer' ? updatedContainer : n);
        }
        
        setTimeout(() => saveToHistory(), 0);
        return newNodes;
      });
      return;
    }
    
    // 判断是否是动作节点
    const isActionNode = nodeTemplate.type.startsWith('action_');
    
    const newNode = {
      id: `node_${nodeIdCounter.current++}`,
      type: isActionNode ? nodeTemplate.type : 'serekaTaskNode',
      position: {
        x: Math.random() * 300 + 250,
        y: Math.random() * 300 + 100,
      },
      data: {
        nodeTemplate: nodeTemplate,
        nodeType: nodeTemplate.type,  // 保存节点类型供ActionNode使用
        label: nodeTemplate.label,
        icon: nodeTemplate.icon,
        color: nodeTemplate.color,
        formData: nodeTemplate.fields.reduce((acc, field) => {
          acc[field.name] = field.default;
          return acc;
        }, {})
      },
    };
    setNodes((nds) => {
      const newNodes = nds.concat(newNode);
      // 添加节点后保存到历史记录
      setTimeout(() => saveToHistory(), 0);
      return newNodes;
    });
  }, [setNodes, saveToHistory, onItemSelect]);

  const onAddCustomNode = useCallback(() => {
    alert('自定义节点功能即将推出！\n您可以在这里创建自己的节点类型。');
  }, []);

  // ReactFlow拖拽Drop处理
  const onDrop = useCallback((event) => {
    event.preventDefault();
    
    const nodeData = event.dataTransfer.getData('application/reactflow-node');
    
    if (!nodeData) return;
    
    try {
      const nodeTemplate = JSON.parse(nodeData);
      
      // 使用screenToFlowPosition转换鼠标坐标到画布坐标
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      
      // 创建节点，但指定位置
      const isActionNode = nodeTemplate.type && nodeTemplate.type.startsWith('action_');
      const newNode = {
        id: `node_${nodeIdCounter.current++}`,
        type: isActionNode ? nodeTemplate.type : 'serekaTaskNode',
        position: position,
        data: {
          nodeTemplate: nodeTemplate,
          nodeType: nodeTemplate.type,
          label: nodeTemplate.label,
          icon: nodeTemplate.icon,
          color: nodeTemplate.color,
          formData: nodeTemplate.fields.reduce((acc, field) => {
            acc[field.name] = field.default;
            return acc;
          }, {})
        },
      };
      
      setNodes((nds) => {
        const newNodes = nds.concat(newNode);
        setTimeout(() => saveToHistory(), 0);
        return newNodes;
      });
      
      console.log('拖拽添加节点:', nodeTemplate.label, '位置:', position);
    } catch (error) {
      console.error('拖拽解析失败:', error);
    }
  }, [setNodes, saveToHistory, screenToFlowPosition]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }, []);

  // 文件导入处理（用于文件面板）
  useEffect(() => {
    window.handleFileImport = (json) => {
      try {
        const { nodes: loadedNodes, edges: loadedEdges } = SerekaTaskConverter.fromSerekaJSON(json);
        
        // 创建新标签页
        const newTabId = `tab-${Date.now()}`;
        const newTab = {
          id: newTabId,
          name: json.title || `导入-${new Date().toLocaleTimeString()}`,
          nodes: loadedNodes.map(node => {
            if (node.type === 'zoneContainer' || node.type === 'subConditionContainer') {
              return {
                ...node,
                data: {
                  ...node.data,
                  onItemSelect: onItemSelect
                }
              };
            }
            return node;
          }),
          edges: loadedEdges,
          selectedNode: null,
          viewport: { x: 0, y: 0, zoom: 1 },
        };
        
        const updatedTabs = [...tabs, newTab];
        setTabs(updatedTabs);
        setActiveTabId(newTabId);
        setNodes(newTab.nodes);
        setEdges(newTab.edges);
        setSelectedNode(null);
        
        WorkspaceManager.saveWorkspace(updatedTabs, newTabId);
        console.log('文件导入成功:', newTab.name);
      } catch (error) {
        console.error('文件导入失败:', error);
        alert('文件导入失败: ' + error.message);
      }
    };
  }, [tabs, onItemSelect, setNodes, setEdges]);

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setShowPropertyPanel(true);
    setContextMenu(null); // 关闭右键菜单
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setShowPropertyPanel(false);
    setContextMenu(null); // 关闭右键菜单
  }, []);

  // 检查点分组移动 - 拖动检查点时同步移动关联的模块和动作节点
  const onNodeDrag = useCallback((event, node) => {
    // 只处理检查点节点的拖动
    if (!node.data?.nodeTemplate || node.data.nodeTemplate.type !== 'checkpoint') {
      return;
    }
    
    const checkpointId = node.id;
    const deltaX = node.position.x - (node.data.lastPosition?.x || node.position.x);
    const deltaY = node.position.y - (node.data.lastPosition?.y || node.position.y);
    
    // 如果没有移动，直接返回
    if (deltaX === 0 && deltaY === 0) return;
    
    setNodes((nds) => {
      return nds.map((n) => {
        // 检查是否是关联节点（模块节点或动作节点）
        const isModuleNode = n.id.startsWith(`${checkpointId}_module_`);
        const isActionNodeFromThisCheckpoint = n.id.startsWith('action_') && 
          edges.some(edge => {
            // 检查这个动作节点是否通过连线关联到此检查点的模块
            const moduleIds = [
              `${checkpointId}_module_condition`,
              `${checkpointId}_module_travelcondition`
            ];
            return moduleIds.some(moduleId => 
              (edge.source === moduleId && edge.target === n.id) ||
              edges.some(e2 => e2.source === moduleId && e2.target.startsWith('action_') && 
                edges.some(e3 => e3.source === e2.target && e3.target === n.id))
            );
          });
        
        // 如果是关联节点，同步移动
        if (isModuleNode || isActionNodeFromThisCheckpoint) {
          return {
            ...n,
            position: {
              x: n.position.x + deltaX,
              y: n.position.y + deltaY
            }
          };
        }
        
        // 更新检查点节点的 lastPosition
        if (n.id === checkpointId) {
          return {
            ...n,
            data: {
              ...n.data,
              lastPosition: { x: node.position.x, y: node.position.y }
            }
          };
        }
        
        return n;
      });
    });
  }, [edges, setNodes]);

  // 右键菜单
  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    setSelectedNode(node);
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      node: node,
    });
  }, []);

  const onPaneContextMenu = useCallback((event) => {
    event.preventDefault();
    setContextMenu({
      x: event.clientX,
      y: event.clientY,
      node: null,
    });
  }, []);

  const onUpdateNode = useCallback((nodeId, formData) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              formData: formData,
            },
          };
        }
        return node;
      })
    );
    
    // 自动连线逻辑：如果是检查点节点且修改了 nextcheckpoint 字段
    const currentNode = nodes.find(n => n.id === nodeId);
    if (currentNode?.data?.nodeTemplate?.type === 'checkpoint' && formData.nextcheckpoint) {
      const targetCheckpointId = formData.nextcheckpoint;
      
      // 查找目标检查点节点（通过 formData.id 匹配）
      const targetNode = nodes.find(n => 
        n.data?.nodeTemplate?.type === 'checkpoint' && 
        n.data?.formData?.id === targetCheckpointId
      );
      
      if (targetNode) {
        // 检查是否已存在连线
        const edgeId = `e-${nodeId}-${targetNode.id}-nextcheckpoint`;
        const edgeExists = edges.some(e => e.id === edgeId);
        
        if (!edgeExists) {
          // 创建新连线
          setEdges((eds) => [
            ...eds,
            {
              id: edgeId,
              source: nodeId,
              sourceHandle: 'nextcheckpoint',
              target: targetNode.id,
              targetHandle: 'in',
              type: 'smoothstep',
              animated: true,
              style: { stroke: '#FF9800', strokeWidth: 2 },
              label: 'Next'
            }
          ]);
        }
      }
    }
    
    // 保存到历史记录
    saveToHistory();
  }, [setNodes, setEdges, nodes, edges, saveToHistory]);

  // 更新容器内的地点或子条件
  const onUpdateContainerItem = useCallback((containerId, itemType, itemId, updatedItem) => {
    console.log('App: onUpdateContainerItem called:', { containerId, itemType, itemId, updatedItem });
    setNodes((nds) => {
      console.log('App: Current nodes:', nds.filter(n => n.type === 'zoneContainer' || n.type === 'subConditionContainer'));
      const newNodes = nds.map((node) => {
        if (node.id === containerId) {
          console.log('App: Found container node:', node);
          if (itemType === 'zone') {
            const updatedNode = {
              ...node,
              data: {
                ...node.data,
                zones: node.data.zones.map(z => {
                  if (z.id === itemId) {
                    console.log('App: Updating zone from', z, 'to', updatedItem);
                    return updatedItem;
                  }
                  return z;
                })
              }
            };
            console.log('App: Updated container node:', updatedNode);
            return updatedNode;
          } else if (itemType === 'subcondition') {
            return {
              ...node,
              data: {
                ...node.data,
                subconditions: node.data.subconditions.map(s => s.id === itemId ? updatedItem : s)
              }
            };
          }
        }
        return node;
      });
      console.log('App: New nodes:', newNodes.filter(n => n.type === 'zoneContainer' || n.type === 'subConditionContainer'));
      return newNodes;
    });
    saveToHistory();
  }, [setNodes, saveToHistory]);

  // 删除容器内的项
  const onDeleteContainerItem = useCallback((containerId, itemType, itemId) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === containerId) {
          if (itemType === 'zone') {
            return {
              ...node,
              data: {
                ...node.data,
                zones: node.data.zones.filter(z => z.id !== itemId)
              }
            };
          } else if (itemType === 'subcondition') {
            return {
              ...node,
              data: {
                ...node.data,
                subconditions: node.data.subconditions.filter(s => s.id !== itemId)
              }
            };
          }
        }
        return node;
      })
    );
    saveToHistory();
  }, [setNodes, saveToHistory]);

  // 从检查点/动作节点创建新区域
  const createNewZone = useCallback((newZoneData) => {
    console.log('App: createNewZone called:', newZoneData);
    setNodes((nds) => {
      // 查找或创建 zoneContainer
      let zoneContainer = nds.find(n => n.type === 'zoneContainer');
      
      if (!zoneContainer) {
        // 创建新的 zoneContainer
        zoneContainer = {
          id: `zone_container_${nodeIdCounter.current++}`,
          type: 'zoneContainer',
          position: { x: 100, y: 100 },
          style: { width: 600, height: 400 },
          data: { 
            zones: [], 
            label: '区域定义列表',
            onItemSelect: onItemSelect
          }
        };
      }
      
      // 检查ID是否已存在
      const existingIds = zoneContainer.data.zones.map(z => z.id);
      if (existingIds.includes(newZoneData.id)) {
        alert(`区域ID "${newZoneData.id}" 已存在！请使用不同的ID。`);
        return nds;
      }
      
      // 创建新区域
      const newZone = {
        id: newZoneData.id,
        stage: newZoneData.stage,
        x: newZoneData.x !== undefined ? newZoneData.x : 0,
        y: newZoneData.y !== undefined ? newZoneData.y : 0,
        z: newZoneData.z !== undefined ? newZoneData.z : 0,
        r: newZoneData.r !== undefined ? newZoneData.r : 1,
        outlinehidden: newZoneData.outlinehidden !== undefined ? newZoneData.outlinehidden : false,
        compasshidden: newZoneData.compasshidden !== undefined ? newZoneData.compasshidden : false
      };
      
      // 更新 zoneContainer
      const updatedContainer = {
        ...zoneContainer,
        data: {
          ...zoneContainer.data,
          zones: [...zoneContainer.data.zones, newZone]
        }
      };
      
      // 如果是新容器,添加它;否则更新现有容器
      let newNodes;
      if (!nds.find(n => n.type === 'zoneContainer')) {
        newNodes = [...nds, updatedContainer];
      } else {
        newNodes = nds.map(n => n.type === 'zoneContainer' ? updatedContainer : n);
      }
      
      setTimeout(() => saveToHistory(), 0);
      return newNodes;
    });
  }, [setNodes, saveToHistory, onItemSelect]);

  // 撤销
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const { nodes: prevNodes, edges: prevEdges } = history[newIndex];
      setNodes(prevNodes);
      setEdges(prevEdges);
    }
  }, [historyIndex, history, setNodes, setEdges]);

  // 重做
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const { nodes: nextNodes, edges: nextEdges } = history[newIndex];
      setNodes(nextNodes);
      setEdges(nextEdges);
    }
  }, [historyIndex, history, setNodes, setEdges]);

  // 复制
  const copyNode = useCallback(() => {
    if (selectedNode && selectedNode.type !== 'zoneContainer' && selectedNode.type !== 'subConditionContainer') {
      setClipboard({ node: selectedNode });
    }
  }, [selectedNode]);

  // 剪切
  const cutNode = useCallback(() => {
    if (selectedNode && selectedNode.type !== 'zoneContainer' && selectedNode.type !== 'subConditionContainer') {
      setClipboard({ node: selectedNode });
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
      setSelectedNode(null);
      setShowPropertyPanel(false);
      saveToHistory();
    }
  }, [selectedNode, setNodes, saveToHistory]);

  // 粘贴
  const pasteNode = useCallback(() => {
    if (clipboard?.node) {
      const newNode = {
        ...clipboard.node,
        id: `node_${nodeIdCounter.current++}`,
        position: {
          x: clipboard.node.position.x + 50,
          y: clipboard.node.position.y + 50,
        },
      };
      setNodes((nds) => [...nds, newNode]);
      saveToHistory();
    }
  }, [clipboard, setNodes, saveToHistory]);

  // 删除
  const deleteSelected = useCallback(() => {
    if (selectedNode && selectedNode.type !== 'zoneContainer' && selectedNode.type !== 'subConditionContainer') {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
      setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
      setSelectedNode(null);
      setShowPropertyPanel(false);
      saveToHistory();
    }
  }, [selectedNode, setNodes, setEdges, saveToHistory]);

  // 选择导出文件夹
  const selectExportFolder = useCallback(() => {
    // 创建一个隐藏的input元素来选择文件夹
    const input = document.createElement('input');
    input.type = 'file';
    input.webkitdirectory = true; // 选择文件夹
    input.onchange = (e) => {
      const files = e.target.files;
      if (files.length > 0) {
        // 获取文件夹路径（从第一个文件的路径中提取）
        const path = files[0].path || files[0].webkitRelativePath;
        const folderPath = path.substring(0, path.lastIndexOf('\\') || path.lastIndexOf('/'));
        setExportPath(folderPath);
        setStatusMessage('✅ 已选择导出文件夹: ' + folderPath);
        setTimeout(() => setStatusMessage(''), 3000);
      }
    };
    input.click();
  }, []);

  // 打开导出文件夹
  const openExportFolder = useCallback(() => {
    if (!exportPath) {
      setStatusMessage('❌ 请先选择导出文件夹');
      setTimeout(() => setStatusMessage(''), 3000);
      return;
    }
    
    // 使用window.open在新窗口中打开文件夹
    // 注意: 这在浏览器中可能受限，在Electron中可以使用shell.openPath
    if (window.require) {
      try {
        const { shell } = window.require('electron');
        shell.openPath(exportPath);
      } catch (error) {
        setStatusMessage('❌ 无法打开文件夹: ' + error.message);
        setTimeout(() => setStatusMessage(''), 3000);
      }
    } else {
      setStatusMessage('⚠️ 浏览器环境不支持直接打开文件夹');
      setTimeout(() => setStatusMessage(''), 3000);
    }
  }, [exportPath]);

  // 导出到指定路径
  const exportToPath = useCallback(() => {
    if (!exportPath) {
      // 如果没有选择路径，使用默认导出
      onSaveWorkflow();
      return;
    }
    
    try {
      const serekaJSON = generateSerekaJSON(nodes, edges);
      const jsonString = JSON.stringify(serekaJSON, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${serekaJSON.title || '塞雷卡任务'}_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setStatusMessage(`✅ 任务已导出到: ${exportPath}`);
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (error) {
      console.error('导出失败:', error);
      setStatusMessage('❌ 导出失败: ' + error.message);
    }
  }, [nodes, edges, exportPath]);

  // 保存工作流
  const onSaveWorkflow = useCallback(() => {
    console.log('导出按钮被点击');
    console.log('当前节点数量:', nodes.length);
    console.log('当前连线数量:', edges.length);
    
    try {
      const serekaJSON = SerekaTaskConverter.toSerekaJSON(nodes, edges);
      console.log('转换后的JSON:', serekaJSON);
      
      const jsonString = JSON.stringify(serekaJSON, null, 2);
      
      // 下载JSON文件
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${serekaJSON.title || '塞雷卡任务'}_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      console.log('保存的任务JSON:', serekaJSON);
      setStatusMessage('✅ 任务已成功导出为JSON文件');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (error) {
      console.error('导出失败:', error);
      setStatusMessage('❌ 导出失败: ' + error.message);
    }
  }, [nodes, edges]);

  // 快捷键处理
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 忽略在输入框中的按键
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      // Ctrl/Cmd + S: 保存
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        onSaveWorkflow();
      }
      // Ctrl/Cmd + Z: 撤销
      else if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      // Ctrl/Cmd + Shift + Z 或 Ctrl/Cmd + Y: 重做
      else if ((e.ctrlKey || e.metaKey) && (e.shiftKey && e.key === 'z' || e.key === 'y')) {
        e.preventDefault();
        redo();
      }
      // Ctrl/Cmd + C: 复制
      else if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        copyNode();
      }
      // Ctrl/Cmd + X: 剪切
      else if ((e.ctrlKey || e.metaKey) && e.key === 'x') {
        e.preventDefault();
        cutNode();
      }
      // Ctrl/Cmd + V: 粘贴
      else if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        pasteNode();
      }
      // Delete 或 Backspace: 删除
      else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        deleteSelected();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, copyNode, cutNode, pasteNode, deleteSelected, onSaveWorkflow]);

  // 点击任意地方关闭右键菜单
  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  // 自动保存当前标签页到工作区
  useEffect(() => {
    const currentViewport = getViewport();
    const updatedTabs = tabs.map(t => 
      t.id === activeTabId 
        ? { ...t, nodes, edges, selectedNode, viewport: currentViewport }
        : t
    );
    
    if (JSON.stringify(updatedTabs) !== JSON.stringify(tabs)) {
      setTabs(updatedTabs);
      
      // 防抖保存到localStorage
      const timer = setTimeout(() => {
        WorkspaceManager.saveWorkspace(updatedTabs, activeTabId);
        console.log('工作区已自动保存', updatedTabs.map(t => ({ id: t.id, name: t.name })));
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [nodes, edges, selectedNode, activeTabId, tabs, getViewport]);

  // 标签页切换处理
  const handleTabClick = useCallback((tabId) => {
    if (tabId === activeTabId) return;
    
    // 保存当前标签页状态和viewport
    const currentViewport = getViewport();
    const updatedTabs = tabs.map(t => 
      t.id === activeTabId 
        ? { ...t, nodes, edges, selectedNode, viewport: currentViewport }
        : t
    );
    setTabs(updatedTabs);
    
    // 切换到新标签页
    const newActiveTab = updatedTabs.find(t => t.id === tabId);
    if (newActiveTab) {
      setActiveTabId(tabId);
      setNodes(newActiveTab.nodes || []);
      setEdges(newActiveTab.edges || []);
      setSelectedNode(newActiveTab.selectedNode || null);
      
      // 恢复viewport
      if (newActiveTab.viewport) {
        setTimeout(() => {
          setViewport(newActiveTab.viewport, { duration: 200 });
        }, 0);
      }
      
      console.log('已切换到标签页:', newActiveTab.name);
    }
  }, [tabs, activeTabId, nodes, edges, selectedNode, getViewport, setViewport]);

  // 新建标签页
  const handleNewTab = useCallback(() => {
    const newTabId = `tab-${Date.now()}`;
    const newTab = {
      id: newTabId,
      name: `工作流 ${tabs.length + 1}`,
      nodes: [],
      edges: [],
      selectedNode: null,
      viewport: { x: 0, y: 0, zoom: 1 },
    };
    
    const updatedTabs = [...tabs, newTab];
    setTabs(updatedTabs);
    setActiveTabId(newTabId);
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    
    WorkspaceManager.saveWorkspace(updatedTabs, newTabId);
    console.log('新建标签页:', newTab.name);
  }, [tabs]);

  // 关闭标签页
  const handleTabClose = useCallback((tabId) => {
    if (tabs.length === 1) {
      alert('至少需要保留一个标签页');
      return;
    }
    
    const updatedTabs = tabs.filter(t => t.id !== tabId);
    setTabs(updatedTabs);
    
    // 如果关闭的是当前标签页，切换到第一个
    if (tabId === activeTabId) {
      const newActiveTab = updatedTabs[0];
      setActiveTabId(newActiveTab.id);
      setNodes(newActiveTab.nodes || []);
      setEdges(newActiveTab.edges || []);
      setSelectedNode(newActiveTab.selectedNode || null);
    }
    
    WorkspaceManager.saveWorkspace(updatedTabs, activeTabId === tabId ? updatedTabs[0].id : activeTabId);
    console.log('已关闭标签页');
  }, [tabs, activeTabId]);

  const onLoadWorkflow = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileLoad = useCallback((event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        const { nodes: loadedNodes, edges: loadedEdges } = SerekaTaskConverter.fromSerekaJSON(json);
        
        // 为容器节点添加回调函数
        const nodesWithCallbacks = loadedNodes.map(node => {
          if (node.type === 'zoneContainer' || node.type === 'subConditionContainer') {
            console.log('Injecting onItemSelect into node:', node.id, node.type);
            return {
              ...node,
              data: {
                ...node.data,
                onItemSelect: onItemSelect
              }
            };
          }
          return node;
        });
        
        console.log('Nodes after callback injection:', nodesWithCallbacks.filter(n => 
          n.type === 'zoneContainer' || n.type === 'subConditionContainer'
        ).map(n => ({ id: n.id, type: n.type, hasOnItemSelect: !!n.data.onItemSelect })));
        
        setNodes(nodesWithCallbacks);
        setEdges(loadedEdges);
        
        // 初始化历史记录为当前加载的状态
        setHistory([{ nodes: nodesWithCallbacks, edges: loadedEdges }]);
        setHistoryIndex(0);
        
        // 更新节点ID计数器
        const maxId = Math.max(...loadedNodes.map(n => parseInt(n.id.replace(/\D/g, '')) || 0), 0);
        nodeIdCounter.current = maxId + 1;
        
        setStatusMessage(`✅ 成功加载任务: ${json.title || '未命名任务'}`);
        setTimeout(() => setStatusMessage(''), 3000);
      } catch (error) {
        console.error('加载任务失败:', error);
        setStatusMessage('❌ 加载任务失败！请检查文件格式是否正确');
      }
    };
    reader.readAsText(file);
    
    // 重置文件输入
    event.target.value = '';
  }, [setNodes, setEdges, onItemSelect]);

  const onClearWorkflow = useCallback(() => {
    if (window.confirm('确定要清空当前工作流吗？此操作不可撤销。')) {
      setNodes([]);
      setEdges([]);
      setSelectedNode(null);
      setShowPropertyPanel(false);
      nodeIdCounter.current = 1;
    }
  }, [setNodes, setEdges]);

  // 测试函数：手动触发 onItemSelect
  const testItemSelect = () => {
    const zoneContainer = nodes.find(n => n.type === 'zoneContainer');
    if (zoneContainer && zoneContainer.data.zones && zoneContainer.data.zones.length > 0) {
      const firstZone = zoneContainer.data.zones[0];
      console.log('Test: Manually calling onItemSelect with:', zoneContainer.id, 'zone', firstZone);
      onItemSelect(zoneContainer.id, 'zone', firstZone);
    } else {
      alert('没有找到地点容器或地点为空');
    }
  };

  return (
    <div className="app">
      {/* 标签页栏 */}
      <TabBar 
        tabs={tabs}
        activeTab={activeTabId}
        onTabClick={handleTabClick}
        onTabClose={handleTabClose}
        onNewTab={handleNewTab}
        onClear={onClearWorkflow}
      />
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileLoad}
        style={{ display: 'none' }}
      />
      
      <div className="main-content">
        {/* VS Code风格侧边栏 */}
        <Sidebar 
          onAddNode={onAddNode} 
          onAddCustomNode={onAddCustomNode}
          exportPath={exportPath}
          onExportPathChange={setExportPath}
          onSelectFolder={selectExportFolder}
          onOpenFolder={openExportFolder}
          onExport={exportToPath}
        />
        
        <div className="flow-container">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onNodeDrag={onNodeDrag}
            onPaneClick={onPaneClick}
            onNodeContextMenu={onNodeContextMenu}
            onPaneContextMenu={onPaneContextMenu}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            snapToGrid
            snapGrid={[15, 15]}
            panOnScroll={true}
            panOnDrag={[0, 1, 2]}
            zoomOnScroll={true}
            zoomOnPinch={true}
            zoomOnDoubleClick={true}
            preventScrolling={true}
            defaultEdgeOptions={{
              type: 'smoothstep',
              animated: true,
              style: { stroke: '#888', strokeWidth: 2 },
              markerEnd: {
                type: 'arrowclosed',
                color: '#888'
              }
            }}
            edgesUpdatable={true}
            edgesFocusable={true}
            elementsSelectable={true}
          >
            <Panel position="top-right">
              <div className="info-panel">
                <div className="info-item">
                  <span className="info-label">节点:</span>
                  <span className="info-value">{nodes.length}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">连接:</span>
                  <span className="info-value">{edges.length}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">历史:</span>
                  <span className="info-value">{historyIndex}/{history.length - 1}</span>
                </div>
              </div>
            </Panel>
            <Controls />
            <MiniMap 
              nodeColor={(node) => node.data.nodeTemplate?.color || '#9E9E9E'}
              zoomable={true}
              pannable={true}
            />
            <Background variant="dots" gap={15} size={1} />
          </ReactFlow>

          {/* 右键菜单 */}
          {contextMenu && (
            <div
              className="context-menu"
              style={{ top: contextMenu.y, left: contextMenu.x }}
              onClick={(e) => e.stopPropagation()}
            >
              {contextMenu.node ? (
                // 节点右键菜单
                contextMenu.node.type !== 'zoneContainer' && contextMenu.node.type !== 'subConditionContainer' ? (
                  <>
                    <div className="context-menu-item" onClick={() => { copyNode(); setContextMenu(null); }}>
                      <span>📋 复制</span>
                      <span className="shortcut">Ctrl+C</span>
                    </div>
                    <div className="context-menu-item" onClick={() => { cutNode(); setContextMenu(null); }}>
                      <span>✂️ 剪切</span>
                      <span className="shortcut">Ctrl+X</span>
                    </div>
                    <div className="context-menu-item" onClick={() => { deleteSelected(); setContextMenu(null); }}>
                      <span>🗑️ 删除</span>
                      <span className="shortcut">Delete</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="context-menu-item" onClick={() => { 
                      setSelectedNode(contextMenu.node);
                      setShowPropertyPanel(true);
                      setContextMenu(null); 
                    }}>
                      <span>📝 查看容器</span>
                    </div>
                    <div className="context-menu-divider" />
                    <div className="context-menu-item disabled">
                      <span style={{fontSize: '11px', color: '#888'}}>💡 点击容器内的卡片可编辑具体项</span>
                    </div>
                  </>
                )
              ) : (
                // 画布右键菜单
                <>
                  <div className="context-menu-item" onClick={() => { pasteNode(); setContextMenu(null); }} disabled={!clipboard}>
                    <span>📄 粘贴</span>
                    <span className="shortcut">Ctrl+V</span>
                  </div>
                  <div className="context-menu-divider" />
                  <div className="context-menu-item" onClick={() => { undo(); setContextMenu(null); }} disabled={historyIndex === 0}>
                    <span>↶ 撤销</span>
                    <span className="shortcut">Ctrl+Z</span>
                  </div>
                  <div className="context-menu-item" onClick={() => { redo(); setContextMenu(null); }} disabled={historyIndex >= history.length - 1}>
                    <span>↷ 重做</span>
                    <span className="shortcut">Ctrl+Shift+Z</span>
                  </div>
                  <div className="context-menu-divider" />
                  <div className="context-menu-item" onClick={() => { onSaveWorkflow(); setContextMenu(null); }}>
                    <span>💾 保存</span>
                    <span className="shortcut">Ctrl+S</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        
        {showPropertyPanel && (
          <PropertyPanel
            selectedNode={selectedNode}
            onUpdateNode={onUpdateNode}
            onUpdateContainerItem={onUpdateContainerItem}
            onDeleteContainerItem={onDeleteContainerItem}
            onCreateNewZone={createNewZone}
            onClose={() => setShowPropertyPanel(false)}
            allNodes={nodes}
          />
        )}
      </div>
      
      {/* 底部状态栏 */}
      {statusMessage && (
        <div className="status-bar">
          <span className="status-message">{statusMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
// 更新时间戳以触发热更新: 2025-01-13 19:59
