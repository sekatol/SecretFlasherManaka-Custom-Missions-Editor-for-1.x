// 塞雷卡任务JSON导入导出工具 - v2.0
// 重构：地点和子条件使用容器，检查点为完整节点

import { CheckpointNode, MissionInfoNode, TeleportNode } from '../config/nodeTypes';

// 辅助函数：递归清理空值和空数组
function cleanEmptyFields(obj) {
  if (Array.isArray(obj)) {
    return obj.filter(item => {
      if (item === null || item === undefined || item === '') return false;
      if (typeof item === 'object') {
        const cleaned = cleanEmptyFields(item);
        return Object.keys(cleaned).length > 0;
      }
      return true;
    });
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const cleaned = {};
    for (const [key, value] of Object.entries(obj)) {
      // 跳过空值
      if (value === null || value === undefined || value === '') continue;
      
      // 跳过空数组
      if (Array.isArray(value) && value.length === 0) continue;
      
      // 递归清理对象
      if (typeof value === 'object') {
        const cleanedValue = cleanEmptyFields(value);
        if (Array.isArray(cleanedValue)) {
          if (cleanedValue.length > 0) cleaned[key] = cleanedValue;
        } else if (Object.keys(cleanedValue).length > 0) {
          cleaned[key] = cleanedValue;
        }
      } else {
        cleaned[key] = value;
      }
    }
    return cleaned;
  }
  
  return obj;
}

export class SerekaTaskConverter {
  // 辅助方法：创建标准的边配置
  static createEdgeConfig(edgeData) {
    return {
      ...edgeData,
      type: 'smoothstep',
      animated: true,
      markerEnd: {
        type: 'arrowclosed',
        color: edgeData.style?.stroke || '#888',
        width: 20,
        height: 20
      }
      // 注意：不包含 label 属性
    };
  }

  // 辅助方法：从模块节点收集动作链
  static collectActionsFromModule(nodes, edges, moduleId, handleType) {
    const actions = [];
    
    // 查找从模块的指定句柄出发的第一个动作节点
    const firstEdge = edges.find(e => 
      e.source === moduleId && e.sourceHandle === handleType
    );
    
    if (!firstEdge) return actions;
    
    let currentNodeId = firstEdge.target;
    
    // 沿着 next 句柄追踪整个动作链
    while (currentNodeId) {
      const actionNode = nodes.find(n => n.id === currentNodeId);
      
      // 跳过 UI-only 节点（如失败描述节点）
      if (actionNode && actionNode.data && actionNode.data.uiOnly) {
        break;
      }
      
      if (!actionNode || !actionNode.type.startsWith('action_')) break;
      
      // 提取动作数据并转换为游戏原生格式
      if (actionNode.data && actionNode.data.formData) {
        const convertedAction = this.convertActionToGameFormat(actionNode.data.formData, actionNode.type);
        actions.push(convertedAction);
      }
      
      // 查找下一个动作
      const nextEdge = edges.find(e => 
        e.source === currentNodeId && e.sourceHandle === 'next'
      );
      currentNodeId = nextEdge ? nextEdge.target : null;
    }
    
    return actions;
  }

  // 将编辑器节点转换为塞雷卡JSON格式
  static toSerekaJSON(nodes, edges) {
    const result = {
      title: '',
      description: '',
      listmission: true,
      addtitleinlist: false,
      addtitleinpanel: false,
      zones: [],
      checkpoints: [],
      dialogue_nodes: [],
      subconditions: [],
      editorPositions: []
    };

    // 按节点类型分类处理
    nodes.forEach(node => {
      // ZoneContainer节点特殊处理
      if (node.type === 'zoneContainer') {
        if (node.data.zones && node.data.zones.length > 0) {
          node.data.zones.forEach(zone => {
            // 如果有保存的完整 areas，使用它；否则从字段重建
            const areas = zone.areas && zone.areas.length > 0 
              ? zone.areas 
              : [{
                  type: zone.areaType || 'sphere',
                  stage: zone.stage || 'Apart',
                  x: zone.x || 0,
                  y: zone.y || 0,
                  z: zone.z || 0,
                  r: zone.r || 0.5,
                  outlinehidden: zone.outlinehidden || false,
                  compasshidden: zone.compasshidden || false,
                  visualGuides: zone.ringEnabled ? {
                    ringEffect: {
                      enabled: true,
                      color: zone.ringColor || { r: 0, g: 1, b: 0, a: 0.8 },
                      radius: zone.r || 0.5
                    }
                  } : undefined
                }];
            
            result.zones.push({
              id: zone.id,
              areas: areas
            });
          });
        }
        result.editorPositions.push({
          id: 'zone_container',
          x: Math.round(node.position.x),
          y: Math.round(node.position.y)
        });
        return;
      }

      // SubConditionContainer节点特殊处理
      if (node.type === 'subConditionContainer') {
        if (node.data.subconditions && node.data.subconditions.length > 0) {
          node.data.subconditions.forEach(subcond => {
            result.subconditions.push({
              id: subcond.id,
              condition: subcond.condition
            });
          });
        }
        result.editorPositions.push({
          id: 'subcond_container',
          x: Math.round(node.position.x),
          y: Math.round(node.position.y)
        });
        return;
      }

      // 跳过模块节点（checkpoint_condition, checkpoint_travelcondition）
      // 这些节点的数据已经合并到检查点节点中
      if (node.type === 'checkpoint_condition' || node.type === 'checkpoint_travelcondition') {
        return;
      }
      
      // 跳过动作节点（action_*）
      // 这些节点的数据已经存储在模块节点的 oncomplete/onviolatecondition 中
      if (node.type && node.type.startsWith('action_')) {
        return;
      }
      
      // 跳过 Description 节点（已废弃）
      if (node.type === 'description') {
        return;
      }

      const { nodeTemplate, formData } = node.data;
      
      // 安全检查：如果没有 nodeTemplate，跳过
      if (!nodeTemplate || !nodeTemplate.type) {
        console.warn('跳过无效节点:', node);
        return;
      }
      
      switch (nodeTemplate.type) {
        case 'missionInfo':
          result.title = formData.title || '';
          result.description = formData.description || '';
          result.listmission = formData.listmission !== undefined ? formData.listmission : true;
          result.addtitleinlist = formData.addtitleinlist || false;
          result.addtitleinpanel = formData.addtitleinpanel || false;
          result.stage = formData.stage || 'Apart';
          break;

        case 'teleport':
          result.startPosition = {
            stage: formData.stage || 'Apart',
            x: formData.x || 0,
            y: formData.y || 0,
            z: formData.z || 0,
            description: formData.description || '任务传送起点'
          };
          break;

        case 'checkpoint':
          // 从检查点节点获取基本信息
          const checkpoint = {
            zone: formData.zone || ''
          };
          
          // 如果有id，添加id字段
          if (formData.id) {
            checkpoint.id = formData.id;
          }
          
          // 查找关联的模块节点
          const checkpointId = node.id;
          const conditionModule = nodes.find(n => 
            n.id === `${checkpointId}_module_condition`
          );
          const travelModule = nodes.find(n => 
            n.id === `${checkpointId}_module_travelcondition`
          );
          
          // 从 condition 模块节点构建 condition 对象
          if (conditionModule && conditionModule.data.formData) {
            const condData = conditionModule.data.formData;
            checkpoint.condition = {
              description: condData.description || '',
              duration: condData.duration || 1,
              condition: condData.condition || '',
              rp: condData.rp || 0,
              reset: condData.reset !== undefined ? condData.reset : true,
              hidepanel: condData.hidepanel || ''
            };
            
            // 处理 faildescription（从模块节点数据或连接的失败描述节点提取）
            if (condData.faildescription) {
              checkpoint.condition.faildescription = condData.faildescription;
            } else {
              // 从连接到 onviolatecondition 的失败描述节点提取
              const failEdge = edges.find(e => 
                e.source === conditionModule.id && e.sourceHandle === 'onviolatecondition'
              );
              if (failEdge) {
                const failNode = nodes.find(n => n.id === failEdge.target);
                if (failNode && failNode.data.uiOnly && failNode.data.formData?.description) {
                  checkpoint.condition.faildescription = failNode.data.formData.description;
                }
              }
            }
            
            // 处理 itemconditions
            if (condData.itemconditions) {
              try {
                const itemconds = typeof condData.itemconditions === 'string' 
                  ? JSON.parse(condData.itemconditions) 
                  : condData.itemconditions;
                if (Array.isArray(itemconds) && itemconds.length > 0) {
                  checkpoint.condition.itemconditions = itemconds;
                }
              } catch (e) {
                console.warn('Invalid itemconditions format:', condData.itemconditions);
              }
            }
            
            // 收集 oncomplete 动作
            const onCompleteActions = this.collectActionsFromModule(
              nodes, 
              edges, 
              conditionModule.id, 
              'oncomplete'
            );
            if (onCompleteActions.length > 0) {
              checkpoint.condition.oncomplete = onCompleteActions;
            }
            
            // 收集 onviolatecondition 动作（跳过 UI-only 节点）
            const onViolateActions = this.collectActionsFromModule(
              nodes,
              edges,
              conditionModule.id,
              'onviolatecondition'
            );
            if (onViolateActions.length > 0) {
              checkpoint.condition.onviolatecondition = onViolateActions;
            }
          } else {
            // 如果没有模块节点，使用默认值
            checkpoint.condition = {
              description: '',
              duration: 1,
              condition: '',
              rp: 0,
              reset: true,
              hidepanel: ''
            };
          }
          
          // 从 travelcondition 模块节点构建 travelcondition 对象
          if (travelModule && travelModule.data.formData) {
            const travelData = travelModule.data.formData;
            checkpoint.travelcondition = {
              description: travelData.description || '',
              condition: travelData.condition || ''
            };
            if (travelData.hideprogress) {
              checkpoint.travelcondition.hideprogress = true;
            }
            
            // 处理 faildescription（从模块节点数据或连接的失败描述节点提取）
            if (travelData.faildescription) {
              checkpoint.travelcondition.faildescription = travelData.faildescription;
            } else {
              // 从连接到 onviolatecondition 的失败描述节点提取
              const failEdge = edges.find(e => 
                e.source === travelModule.id && e.sourceHandle === 'onviolatecondition'
              );
              if (failEdge) {
                const failNode = nodes.find(n => n.id === failEdge.target);
                if (failNode && failNode.data.uiOnly && failNode.data.formData?.description) {
                  checkpoint.travelcondition.faildescription = failNode.data.formData.description;
                }
              }
            }
            
            // 收集 oncomplete 动作
            const onCompleteActions = this.collectActionsFromModule(
              nodes,
              edges,
              travelModule.id,
              'oncomplete'
            );
            if (onCompleteActions.length > 0) {
              checkpoint.travelcondition.oncomplete = onCompleteActions;
            }
            
            // 收集 onviolatecondition 动作（跳过 UI-only 节点）
            const onViolateActions = this.collectActionsFromModule(
              nodes,
              edges,
              travelModule.id,
              'onviolatecondition'
            );
            if (onViolateActions.length > 0) {
              checkpoint.travelcondition.onviolatecondition = onViolateActions;
            }
          }
          
          // 处理nextcheckpoint字段
          if (formData.nextSelectorType) {
            // 对象形式的nextcheckpoint
            checkpoint.nextcheckpoint = {
              selectortype: formData.nextSelectorType
            };
            if (formData.nextSelectorType === 'SpecificId') {
              checkpoint.nextcheckpoint.id = formData.nextSpecificId || '';
            } else if (formData.nextSelectorType === 'RandomId') {
              checkpoint.nextcheckpoint.ids = formData.nextRandomIds ? 
                formData.nextRandomIds.split(',').map(s => s.trim()) : [];
            }
          } else if (formData.nextcheckpoint) {
            // 简单字符串形式
            checkpoint.nextcheckpoint = formData.nextcheckpoint;
          }
          
          result.checkpoints.push(checkpoint);
          break;

        case 'dialogue':
          result.dialogue_nodes.push({
            id: formData.id || `dialogue_${node.id}`,
            lines: formData.lines || [],
            nextcheckpoint: formData.nextcheckpoint || ''
          });
          break;
      }

      // 保存编辑器中的节点位置
      result.editorPositions.push({
        id: formData.id || node.id,
        x: Math.round(node.position.x),
        y: Math.round(node.position.y)
      });
    });

    // 清理空数组
    if (result.zones.length === 0) delete result.zones;
    if (result.checkpoints.length === 0) delete result.checkpoints;
    if (result.dialogue_nodes.length === 0) delete result.dialogue_nodes;
    if (result.subconditions.length === 0) delete result.subconditions;

    // 深度清理所有空字段、空数组和空对象
    return cleanEmptyFields(result);
  }

  // 从塞雷卡JSON格式转换为编辑器节点
  static fromSerekaJSON(json) {
    const nodes = [];
    const edges = [];
    let nodeIdCounter = 1;
    
    // 自动计算容器尺寸的辅助函数
    const calculateContainerSize = (itemCount, cardWidth = 220, cardHeight = 160, padding = 32, gap = 12, maxCols = 6, headerHeight = 60) => {
      if (itemCount === 0) return { width: 400, height: 200 }; // 最小尺寸
      
      const cols = Math.min(itemCount, maxCols);
      const rows = Math.ceil(itemCount / maxCols);
      
      // 宽度 = 左右padding + 卡片宽度 * 列数 + 间距 * (列数-1)
      const width = padding * 2 + cols * cardWidth + (cols - 1) * gap;
      // 高度 = 上下padding + header + 卡片高度 * 行数 + 间距 * (行数-1)
      const height = padding * 2 + headerHeight + rows * cardHeight + (rows - 1) * gap;
      
      return { width, height };
    };
    
    // 布局配置
    const zoneCount = json.zones?.length || 0;
    const subcondCount = json.subconditions?.length || 0;
    
    // 计算容器尺寸 (地点卡片: 220x160, 子条件卡片: 280x120)
    const zoneDim = calculateContainerSize(zoneCount, 220, 160, 32, 12, 6, 60);
    const subcondDim = calculateContainerSize(subcondCount, 280, 120, 32, 12, 3, 60);
    
    const layout = {
      // 地点容器 - 左上角
      zoneX: 50,
      zoneY: 50,
      zoneW: zoneDim.width,
      zoneH: zoneDim.height,
      
      // 子条件容器 - 右上角
      subcondX: 50 + zoneDim.width + 50, // 地点容器右侧 + 间距
      subcondY: 50,
      subcondW: subcondDim.width,
      subcondH: subcondDim.height,
      
      // 任务信息 - 左侧中部
      missionX: 50,
      missionY: Math.max(zoneDim.height, subcondDim.height) + 100,
      
      // 传送点 - 右侧中部
      teleportX: 400,
      teleportY: Math.max(zoneDim.height, subcondDim.height) + 100,
      
      // 检查点流程 - 下方区域，确保在容器之下
      cpStartX: 50,
      cpStartY: Math.max(zoneDim.height, subcondDim.height) + 250,
      cpSpacingX: 1200,  // 横向间距（增大到1200以容纳动作链和模块节点）
      cpSpacingY: 700   // 纵向间距（增大到700以避免连线重叠）
    };

    const editorPositions = json.editorPositions || [];
    const getPos = (id, defX, defY) => {
      const pos = editorPositions.find(p => p.id === id);
      return pos ? { x: pos.x, y: pos.y } : { x: defX, y: defY };
    };

    // 1. 地点容器
    if (json.zones && json.zones.length > 0) {
      const zonesData = json.zones.map(zone => {
        // 保存所有 areas，不仅仅是第一个
        const areas = zone.areas || [];
        const primaryArea = areas[0] || {};
        
        return {
          id: zone.id,
          // 使用第一个 area 作为主要显示区域
          stage: primaryArea.stage,
          x: primaryArea.x,
          y: primaryArea.y,
          z: primaryArea.z,
          r: primaryArea.r,
          areaType: primaryArea.type,
          outlinehidden: primaryArea.outlinehidden,
          compasshidden: primaryArea.compasshidden,
          ringEnabled: primaryArea.visualGuides?.ringEffect?.enabled || false,
          ringColor: primaryArea.visualGuides?.ringEffect?.color || { r: 0, g: 1, b: 0, a: 0.8 },
          // 保存所有 areas 以便完整导出
          areas: areas
        };
      });
      
      nodes.push({
        id: `zone_container_${nodeIdCounter++}`,
        type: 'zoneContainer',
        position: getPos('zone_container', layout.zoneX, layout.zoneY),
        style: { width: layout.zoneW, height: layout.zoneH },
        data: { zones: zonesData, label: '地点列表' }
      });
    }

    // 2. 子条件容器
    if (json.subconditions && json.subconditions.length > 0) {
      const subcondsData = json.subconditions.map(sc => ({
        id: sc.id,
        condition: sc.condition
      }));
      
      nodes.push({
        id: `subcond_container_${nodeIdCounter++}`,
        type: 'subConditionContainer',
        position: getPos('subcond_container', layout.subcondX, layout.subcondY),
        style: { width: layout.subcondW, height: layout.subcondH },
        data: { subconditions: subcondsData, label: '子条件列表' }
      });
    }

    // 3. 任务信息
    if (json.title || json.description) {
      nodes.push({
        id: `${nodeIdCounter++}`,
        type: 'serekaTaskNode',
        position: getPos('mission_info', layout.missionX, layout.missionY),
        data: {
          nodeTemplate: MissionInfoNode,
          formData: {
            title: json.title || '',
            description: json.description || '',
            listmission: json.listmission,
            addtitleinlist: json.addtitleinlist,
            addtitleinpanel: json.addtitleinpanel,
            stage: json.stage || 'Apart'
          }
        }
      });
    }

    // 4. 传送点
    if (json.startPosition) {
      nodes.push({
        id: `${nodeIdCounter++}`,
        type: 'serekaTaskNode',
        position: getPos('start_position', layout.teleportX, layout.teleportY),
        data: {
          nodeTemplate: TeleportNode,
          formData: json.startPosition
        }
      });
    }

    // 5. 检查点流程（智能拓扑排序布局）
    if (json.checkpoints && json.checkpoints.length > 0) {
      const cpMap = {};
      const cpDataMap = {};  // 存储检查点数据
      
      // 第一步：创建检查点核心节点和ID映射
      json.checkpoints.forEach((cp, index) => {
        const checkpointNodeId = `checkpoint_${nodeIdCounter++}`;
        const cpId = cp.id || `cp_${index}`;
        cpMap[cpId] = checkpointNodeId;

        // 检测原始JSON中的字段顺序（用于后续模块排序）
        const jsonStr = JSON.stringify(cp);
        const travelIndex = jsonStr.indexOf('"travelcondition"');
        const conditionIndex = jsonStr.indexOf('"condition"');
        const travelFirst = travelIndex >= 0 && travelIndex < conditionIndex;

        // 构建检查点核心数据（只保留基础字段）
        const formData = {
          id: cp.id || '',
          zone: cp.zone || ''
        };

        // nextcheckpoint
        if (typeof cp.nextcheckpoint === 'string') {
          formData.nextcheckpoint = cp.nextcheckpoint;
        } else if (cp.nextcheckpoint && cp.nextcheckpoint.selectortype) {
          formData.nextSelectorType = cp.nextcheckpoint.selectortype;
          if (cp.nextcheckpoint.id) {
            formData.nextSpecificId = cp.nextcheckpoint.id;
          }
          if (cp.nextcheckpoint.ids) {
            formData.nextRandomIds = cp.nextcheckpoint.ids.join(',');
          }
        }

        // 保存完整的原始数据用于后续创建模块节点
        cpDataMap[cpId] = { 
          nodeId: checkpointNodeId, 
          formData, 
          originalCp: cp, 
          originalIndex: index,
          travelFirst // 保存顺序标记
        };
      });

      // 第二步：构建依赖图和计算层级
      const layers = this.calculateCheckpointLayers(json.checkpoints, cpMap);
      
      // 第三步：智能布局 - 线性流程纵向，分支流程横向
      let currentY = layout.cpStartY;
      let currentColumn = 0; // 当前列索引
      
      layers.forEach((layer, layerIndex) => {
        if (layer.length === 1) {
          // 单节点层：纵向堆叠，不换列
          const cpId = layer[0];
          const cpData = cpDataMap[cpId];
          if (!cpData) return;
          
          const x = layout.cpStartX + currentColumn * layout.cpSpacingX;
          const y = currentY;
          
          // 创建检查点核心节点
          nodes.push({
            id: cpData.nodeId,
            type: 'serekaTaskNode',
            position: getPos(cpId, x, y),
            data: {
              nodeTemplate: CheckpointNode,
              formData: cpData.formData
            }
          });
          
          currentY += layout.cpSpacingY; // 向下移动
          
        } else {
          // 多节点层：横向排列（分支），换列
          layer.forEach((cpId, branchIndex) => {
            const cpData = cpDataMap[cpId];
            if (!cpData) return;
            
            const x = layout.cpStartX + (currentColumn + branchIndex) * layout.cpSpacingX;
            const y = currentY;
            
            // 创建检查点核心节点
            nodes.push({
              id: cpData.nodeId,
              type: 'serekaTaskNode',
              position: getPos(cpId, x, y),
              data: {
                nodeTemplate: CheckpointNode,
                formData: cpData.formData
              }
            });
          });
          
          // 分支后，重置到最左列，向下移动
          currentColumn = 0;
          currentY += layout.cpSpacingY;
        }
      });

      // 5. 生成检查点的模块节点 (condition 和 travelcondition)
      Object.entries(cpDataMap).forEach(([cpId, cpInfo]) => {
        const { nodeId: checkpointNodeId, originalCp, travelFirst } = cpInfo;
        const checkpointNode = nodes.find(n => n.id === checkpointNodeId);
        if (!checkpointNode) return;
        
        const cpPos = checkpointNode.position;
        let moduleYOffset = -150; // 模块节点相对检查点的Y偏移（上方，增加间距）
        
        // 根据JSON原始顺序创建模块节点
        const modules = [];
        
        // 添加 condition 模块
        if (originalCp.condition) {
          modules.push({
            type: 'condition',
            data: originalCp.condition,
            travelFirst: false
          });
        }
        
        // 添加 travelcondition 模块
        if (originalCp.travelcondition) {
          modules.push({
            type: 'travelcondition',
            data: originalCp.travelcondition,
            travelFirst: true
          });
        }
        
        // 根据原始顺序排序
        modules.sort((a, b) => {
          if (travelFirst) {
            return a.travelFirst ? -1 : 1; // travelcondition 在前
          } else {
            return a.travelFirst ? 1 : -1; // condition 在前
          }
        });
        
        // 创建模块节点
        modules.forEach((module, moduleIndex) => {
          const moduleNodeId = `${checkpointNodeId}_module_${module.type}`;
          const isCondition = module.type === 'condition';
          const isTravelCondition = module.type === 'travelcondition';
          
          // 创建模块节点
          nodes.push({
            id: moduleNodeId,
            type: isCondition ? 'checkpoint_condition' : 'checkpoint_travelcondition',
            position: {
              x: cpPos.x + 500, // 放置在检查点右侧，增加到500
              y: cpPos.y + moduleYOffset + (moduleIndex * 280) // 垂直排列，增加间距到280
            },
            data: {
              nodeType: isCondition ? 'checkpoint_condition' : 'checkpoint_travelcondition',
              formData: isCondition ? {
                description: module.data.description || '',
                condition: module.data.condition || '',
                duration: module.data.duration || 1,
                rp: module.data.rp || 0,
                reset: module.data.reset !== undefined ? module.data.reset : true,
                hidepanel: module.data.hidepanel || '',
                itemconditions: module.data.itemconditions ? JSON.stringify(module.data.itemconditions) : '',
                faildescription: module.data.faildescription || ''  // 保存 faildescription
              } : {
                description: module.data.description || '',
                condition: module.data.condition || '',
                hideprogress: module.data.hideprogress || false,
                faildescription: module.data.faildescription || ''  // 保存 faildescription
              }
            },
            parentNode: undefined // 暂时不设父节点，后续可实现分组移动
          });
          
          // 如果有 faildescription，创建 UI-only 的失败描述节点
          if (module.data.faildescription) {
            const failNodeId = `${moduleNodeId}_faildesc_${nodeIdCounter++}`;
            
            nodes.push({
              id: failNodeId,
              type: 'description',
              position: {
                x: cpPos.x + 700, // 更靠右，避免与模块节点重叠
                y: cpPos.y + moduleYOffset + (moduleIndex * 280) + 100 // 与模块节点同高或稍低
              },
              data: {
                nodeType: 'description',
                formData: {
                  faildescription: module.data.faildescription,  // 设置 faildescription 字段
                  description: module.data.faildescription,      // 同时设置 description 作为备用
                  text: module.data.faildescription,             // 也设置 text 字段
                  type: 'failed'  // 标记为失败类型
                },
                uiOnly: true  // 标记为仅UI显示，不导出
              }
            });
            
            // 创建从模块节点的 onviolatecondition 输出到失败描述节点的连线
            edges.push(this.createEdgeConfig({
              id: `e-${moduleNodeId}-${failNodeId}`,
              source: moduleNodeId,
              sourceHandle: 'onviolatecondition',
              target: failNodeId,
              targetHandle: 'checkpoint',
              style: { stroke: '#FF5722' }  // 红色连线表示失败路径
            }));
          }
          
          // 保存模块节点ID到 cpDataMap，用于后续创建动作连线
          if (isCondition) {
            cpDataMap[cpId].conditionModuleId = moduleNodeId;
            // 保存 oncomplete 和 onviolatecondition 数据
            if (module.data.oncomplete) {
              cpDataMap[cpId].oncomplete = module.data.oncomplete;
            }
            if (module.data.onviolatecondition) {
              cpDataMap[cpId].conditionOnviolatecondition = module.data.onviolatecondition;
            }
          } else if (isTravelCondition) {
            cpDataMap[cpId].travelConditionModuleId = moduleNodeId;
            // 保存 oncomplete 和 onviolatecondition 数据
            if (module.data.oncomplete) {
              cpDataMap[cpId].travelOncomplete = module.data.oncomplete;
            }
            if (module.data.onviolatecondition) {
              cpDataMap[cpId].onviolatecondition = module.data.onviolatecondition;
            }
          }
        });
      });

      // 6. 创建检查点到模块的连线
      Object.entries(cpDataMap).forEach(([cpId, cpInfo]) => {
        const { nodeId: checkpointNodeId, conditionModuleId, travelConditionModuleId } = cpInfo;
        
        // 连接检查点.condition → Condition模块.checkpoint
        if (conditionModuleId) {
          edges.push(this.createEdgeConfig({
            id: `e-${checkpointNodeId}-${conditionModuleId}`,
            source: checkpointNodeId,
            sourceHandle: 'condition',
            target: conditionModuleId,
            targetHandle: 'checkpoint',
            animated: false,
            style: { stroke: '#4CAF50', strokeWidth: 2 }
          }));
        }
        
        // 连接检查点.travelcondition → TravelCondition模块.checkpoint
        if (travelConditionModuleId) {
          edges.push(this.createEdgeConfig({
            id: `e-${checkpointNodeId}-${travelConditionModuleId}`,
            source: checkpointNodeId,
            sourceHandle: 'travelcondition',
            target: travelConditionModuleId,
            targetHandle: 'checkpoint',
            animated: false,
            style: { stroke: '#2196F3', strokeWidth: 2 }
          }));
        }
      });

      // 7. 生成动作节点和连线（基于模块的 oncomplete 和 onviolatecondition）
      Object.entries(cpDataMap).forEach(([cpId, cpInfo]) => {
        const { 
          nodeId: checkpointNodeId, 
          conditionModuleId, 
          travelConditionModuleId, 
          oncomplete,  // condition 模块的 oncomplete
          conditionOnviolatecondition,  // condition 模块的 onviolatecondition
          travelOncomplete,  // travelcondition 模块的 oncomplete
          onviolatecondition  // travelcondition 模块的 onviolatecondition
        } = cpInfo;
        const checkpointNode = nodes.find(n => n.id === checkpointNodeId);
        if (!checkpointNode) return;
        
        const cpPos = checkpointNode.position;
        let lastConditionOnCompleteActionId = null; // condition 模块的 oncomplete 链
        let lastConditionOnViolateActionId = null; // condition 模块的 onviolatecondition 链
        let lastTravelOnCompleteActionId = null; // travelcondition 模块的 oncomplete 链
        let lastTravelOnViolateActionId = null; // travelcondition 模块的 onviolatecondition 链
        
        // 处理 condition 模块的 oncomplete 动作链
        if (oncomplete && Array.isArray(oncomplete) && conditionModuleId) {
          let previousNodeId = conditionModuleId;
          let previousHandle = 'oncomplete';
          
          const conditionModuleNode = nodes.find(n => n.id === conditionModuleId);
          const moduleY = conditionModuleNode ? conditionModuleNode.position.y : cpPos.y - 150;
          
          oncomplete.forEach((action, actionIndex) => {
            const actionNodeId = `action_${nodeIdCounter++}`;
            const { convertedType, convertedData } = this.convertActionNode(action);
            
            nodes.push({
              id: actionNodeId,
              type: convertedType,
              position: {
                x: cpPos.x + 950 + (actionIndex * 280),
                y: moduleY
              },
              data: {
                nodeType: convertedType,
                label: convertedData.type || action.type,
                icon: this.getActionIcon(convertedData.type || action.type),
                color: this.getActionColor(convertedData.type || action.type),
                formData: convertedData
              }
            });
            
            edges.push(this.createEdgeConfig({
              id: `e-${previousNodeId}-${actionNodeId}-${actionIndex === 0 ? 'oncomplete' : 'chain'}`,
              source: previousNodeId,
              sourceHandle: actionIndex === 0 ? previousHandle : 'next',
              target: actionNodeId,
              targetHandle: 'in',
              animated: false,
              style: { stroke: '#4CAF50', strokeWidth: 2 }
            }));
            
            previousNodeId = actionNodeId;
            if (actionIndex === oncomplete.length - 1) {
              lastConditionOnCompleteActionId = actionNodeId;
            }
          });
        }
        
        // 处理 condition 模块的 onviolatecondition 动作链
        if (conditionOnviolatecondition && Array.isArray(conditionOnviolatecondition) && conditionModuleId) {
          let previousNodeId = conditionModuleId;
          let previousHandle = 'onviolatecondition';
          
          const conditionModuleNode = nodes.find(n => n.id === conditionModuleId);
          const moduleY = conditionModuleNode ? conditionModuleNode.position.y : cpPos.y - 150;
          
          conditionOnviolatecondition.forEach((action, actionIndex) => {
            const actionNodeId = `action_${nodeIdCounter++}`;
            const { convertedType, convertedData } = this.convertActionNode(action);
            
            nodes.push({
              id: actionNodeId,
              type: convertedType,
              position: {
                x: cpPos.x + 950 + (actionIndex * 280),
                y: moduleY + 100  // 稍微偏下一点，与 oncomplete 链区分
              },
              data: {
                nodeType: convertedType,
                label: convertedData.type || action.type,
                icon: this.getActionIcon(convertedData.type || action.type),
                color: this.getActionColor(convertedData.type || action.type),
                formData: convertedData
              }
            });
            
            edges.push(this.createEdgeConfig({
              id: `e-${previousNodeId}-${actionNodeId}-${actionIndex === 0 ? 'onviolate' : 'chain'}`,
              source: previousNodeId,
              sourceHandle: actionIndex === 0 ? previousHandle : 'next',
              target: actionNodeId,
              targetHandle: 'in',
              animated: false,
              style: { stroke: '#FF5722', strokeWidth: 2 }
            }));
            
            previousNodeId = actionNodeId;
            if (actionIndex === conditionOnviolatecondition.length - 1) {
              lastConditionOnViolateActionId = actionNodeId;
            }
          });
        }
        
        // 处理 travelcondition 模块的 oncomplete 动作链
        if (travelOncomplete && Array.isArray(travelOncomplete) && travelConditionModuleId) {
          let previousNodeId = travelConditionModuleId;
          let previousHandle = 'oncomplete';
          
          const travelModuleNode = nodes.find(n => n.id === travelConditionModuleId);
          const moduleY = travelModuleNode ? travelModuleNode.position.y : cpPos.y + 130;
          
          travelOncomplete.forEach((action, actionIndex) => {
            const actionNodeId = `action_${nodeIdCounter++}`;
            const { convertedType, convertedData } = this.convertActionNode(action);
            
            nodes.push({
              id: actionNodeId,
              type: convertedType,
              position: {
                x: cpPos.x + 950 + (actionIndex * 280),
                y: moduleY
              },
              data: {
                nodeType: convertedType,
                label: convertedData.type || action.type,
                icon: this.getActionIcon(convertedData.type || action.type),
                color: this.getActionColor(convertedData.type || action.type),
                formData: convertedData
              }
            });
            
            edges.push(this.createEdgeConfig({
              id: `e-${previousNodeId}-${actionNodeId}-${actionIndex === 0 ? 'oncomplete' : 'chain'}`,
              source: previousNodeId,
              sourceHandle: actionIndex === 0 ? previousHandle : 'next',
              target: actionNodeId,
              targetHandle: 'in',
              animated: false,
              style: { stroke: '#4CAF50', strokeWidth: 2 }
            }));
            
            previousNodeId = actionNodeId;
            if (actionIndex === travelOncomplete.length - 1) {
              lastTravelOnCompleteActionId = actionNodeId;
            }
          });
        }
        
        // 处理 travelcondition 模块的 onviolatecondition 动作链
        if (onviolatecondition && Array.isArray(onviolatecondition) && travelConditionModuleId) {
          let previousNodeId = travelConditionModuleId;
          let previousHandle = 'onviolatecondition';
          
          const travelModuleNode = nodes.find(n => n.id === travelConditionModuleId);
          const moduleY = travelModuleNode ? travelModuleNode.position.y : cpPos.y + 130;
          
          onviolatecondition.forEach((action, actionIndex) => {
            const actionNodeId = `action_${nodeIdCounter++}`;
            const { convertedType, convertedData } = this.convertActionNode(action);
            
            nodes.push({
              id: actionNodeId,
              type: convertedType,
              position: {
                x: cpPos.x + 950 + (actionIndex * 280),
                y: moduleY + 100  // 稍微偏下一点，与 oncomplete 链区分
              },
              data: {
                nodeType: convertedType,
                label: convertedData.type || action.type,
                icon: this.getActionIcon(convertedData.type || action.type),
                color: this.getActionColor(convertedData.type || action.type),
                formData: convertedData
              }
            });
            
            edges.push(this.createEdgeConfig({
              id: `e-${previousNodeId}-${actionNodeId}-${actionIndex === 0 ? 'onviolate' : 'chain'}`,
              source: previousNodeId,
              sourceHandle: actionIndex === 0 ? previousHandle : 'next',
              target: actionNodeId,
              targetHandle: 'in',
              animated: false,
              style: { stroke: '#FF5722', strokeWidth: 2 }
            }));
            
            previousNodeId = actionNodeId;
            if (actionIndex === onviolatecondition.length - 1) {
              lastTravelOnViolateActionId = actionNodeId;
            }
          });
        }
        
        // 保存最后的动作节点信息
        if (lastConditionOnCompleteActionId || lastConditionOnViolateActionId || lastTravelOnCompleteActionId || lastTravelOnViolateActionId) {
          cpDataMap[cpId].lastConditionOnCompleteActionId = lastConditionOnCompleteActionId;
          cpDataMap[cpId].lastConditionOnViolateActionId = lastConditionOnViolateActionId;
          cpDataMap[cpId].lastTravelOnCompleteActionId = lastTravelOnCompleteActionId;
          cpDataMap[cpId].lastTravelOnViolateActionId = lastTravelOnViolateActionId;
        }
      });
      
      // 8. 创建从动作链末尾到下一个检查点的连线
      Object.entries(cpDataMap).forEach(([cpId, cpInfo]) => {
        const { nodeId: checkpointNodeId, formData, originalCp, lastOnCompleteActionId, lastOnViolateActionId, originalIndex } = cpInfo;
        
        // 确定下一个检查点的ID（支持多个分支）
        let nextCheckpointIds = [];
        let isRandomBranch = false;
        
        if (typeof formData.nextcheckpoint === 'string' && formData.nextcheckpoint) {
          // 情况1: nextcheckpoint 是字符串
          nextCheckpointIds = [formData.nextcheckpoint];
        } else if (formData.nextSelectorType === 'SpecificId' && formData.nextSpecificId) {
          // 情况2: nextcheckpoint 对象，selectortype 为 SpecificId
          nextCheckpointIds = [formData.nextSpecificId];
        } else if (formData.nextSelectorType === 'RandomId' && formData.nextRandomIds) {
          // 情况3: nextcheckpoint 对象，selectortype 为 RandomId，连接到所有分支
          nextCheckpointIds = formData.nextRandomIds.split(',').map(id => id.trim()).filter(id => id);
          isRandomBranch = true;
        } else if (originalIndex < json.checkpoints.length - 1) {
          // 情况4: 没有显式指定 nextcheckpoint，自动连接到下一个检查点
          const nextCp = json.checkpoints[originalIndex + 1];
          nextCheckpointIds = [nextCp.id || `cp_${originalIndex + 1}`];
        }
        
        // 为每个目标检查点创建连接
        nextCheckpointIds.forEach((nextCheckpointId, branchIndex) => {
          const nextCpInfo = cpDataMap[nextCheckpointId];
          if (nextCpInfo) {
            const targetNodeId = nextCpInfo.nodeId;
            
            // 确定源节点和源锚点
            let sourceNodeId, sourceHandle, edgeColor, edgeLabel;
            
            // 优先级：oncomplete > onviolatecondition > 直接连接
            if (lastOnCompleteActionId) {
              sourceNodeId = lastOnCompleteActionId;
              sourceHandle = 'nextcheckpoint';
              edgeColor = '#4CAF50';
              edgeLabel = isRandomBranch ? `分支${branchIndex + 1}` : 'oncomplete完成';
            } else if (lastOnViolateActionId) {
              sourceNodeId = lastOnViolateActionId;
              sourceHandle = 'nextcheckpoint';
              edgeColor = '#FF5722';
              edgeLabel = isRandomBranch ? `分支${branchIndex + 1}` : 'onviolate完成';
            } else {
              sourceNodeId = checkpointNodeId;
              sourceHandle = 'nextcheckpoint';
              edgeColor = '#8BC34A';
              edgeLabel = isRandomBranch ? `分支${branchIndex + 1}` : '直接下一步';
            }
            
            // 创建连接
            edges.push(this.createEdgeConfig({
              id: `e-${sourceNodeId}-${targetNodeId}-branch${branchIndex}`,
              source: sourceNodeId,
              sourceHandle: sourceHandle,
              target: targetNodeId,
              targetHandle: 'in',
              animated: isRandomBranch, // 随机分支使用动画
              style: { 
                stroke: edgeColor, 
                strokeWidth: 2,
                strokeDasharray: isRandomBranch ? '5,5' : undefined // 随机分支使用虚线
              }
            }));
          }
        });
      });
    }

    return { nodes, edges };
  }
  
  // 转换动作节点（旧格式 → 新格式）用于导入
  static convertActionNode(action) {
    const oldType = action.type;
    
    // equipCosplay/unequipCosplay/unequipAllCosplay → manageCosplay
    if (oldType === 'equipCosplay' || oldType === 'unequipCosplay' || oldType === 'unequipAllCosplay') {
      return {
        convertedType: 'action_manageCosplay',
        convertedData: {
          type: 'manageCosplay',
          action: oldType === 'equipCosplay' ? 'equip' : 'unequip',
          parts: action.parts || [],
          allParts: oldType === 'unequipAllCosplay' ? true : false
        }
      };
    }
    
    // equipAdultToy/unequipAdultToy → manageAdultToy
    if (oldType === 'equipAdultToy' || oldType === 'unequipAdultToy') {
      return {
        convertedType: 'action_manageAdultToy',
        convertedData: {
          type: 'manageAdultToy',
          action: oldType === 'equipAdultToy' ? 'equip' : 'unequip',
          parts: action.parts || [],
          allParts: false
        }
      };
    }
    
    // lockHandcuffs/unlockHandcuffs → manageHandcuffs
    if (oldType === 'lockHandcuffs' || oldType === 'unlockHandcuffs') {
      return {
        convertedType: 'action_manageHandcuffs',
        convertedData: {
          type: 'manageHandcuffs',
          action: oldType === 'lockHandcuffs' ? 'lock' : 'unlock',
          handcuffstype: action.handcuffstype || 'KeyHandcuff',
          attachtoobject: action.attachtoobject || false,
          duration: action.duration || 0
        }
      };
    }
    
    // SetCoatState → setCoatState（支持状态数组）
    if (oldType === 'SetCoatState') {
      return {
        convertedType: 'action_setCoatState',
        convertedData: {
          type: 'setCoatState',
          states: Array.isArray(action.states) ? action.states : (action.state ? [action.state] : [])
        }
      };
    }
    
    // 兼容旧版本的单个状态设置（SetCoatFrontOpen1等）
    if (oldType.startsWith('SetCoat') && oldType !== 'SetCoatState') {
      const stateMapping = {
        'SetCoatFrontOpen1': 'FrontOpen1',
        'SetCoatFrontOpen2': 'FrontOpen2',
        'SetCoatBackOpen': 'BackOpen',
        'SetCoatFrontClosed': 'FrontClosed',
        'SetCoatBackClosed': 'BackClosed',
        'SetCoatAllOpen': 'AllOpen',
        'SetCoatAllClosed': 'AllClosed'
      };
      
      return {
        convertedType: 'action_setCoatState',
        convertedData: {
          type: 'setCoatState',
          states: [stateMapping[oldType] || 'FrontClosed']
        }
      };
    }
    
    // 其他动作类型保持不变
    return {
      convertedType: `action_${oldType}`,
      convertedData: { ...action }
    };
  }
  
  // 转换动作节点（新格式 → 旧格式）用于导出
  static convertActionToGameFormat(formData, nodeType) {
    // manageCosplay → equipCosplay/unequipCosplay/unequipAllCosplay
    if (nodeType === 'action_manageCosplay' || formData.type === 'manageCosplay') {
      if (formData.allParts && formData.action === 'unequip') {
        return {
          type: 'unequipAllCosplay'
        };
      } else if (formData.action === 'equip') {
        return {
          type: 'equipCosplay',
          parts: formData.parts || []
        };
      } else {
        return {
          type: 'unequipCosplay',
          parts: formData.parts || []
        };
      }
    }
    
    // manageAdultToy → equipAdultToy/unequipAdultToy
    if (nodeType === 'action_manageAdultToy' || formData.type === 'manageAdultToy') {
      if (formData.action === 'equip') {
        return {
          type: 'equipAdultToy',
          parts: formData.parts || []
        };
      } else {
        return {
          type: 'unequipAdultToy',
          parts: formData.parts || []
        };
      }
    }
    
    // manageHandcuffs → lockHandcuffs/unlockHandcuffs
    if (nodeType === 'action_manageHandcuffs' || formData.type === 'manageHandcuffs') {
      if (formData.action === 'lock') {
        const result = {
          type: 'lockHandcuffs',
          handcuffstype: formData.handcuffstype || 'KeyHandcuff'
        };
        // 只在有值时才添加这些字段
        if (formData.attachtoobject !== undefined) {
          result.attachtoobject = formData.attachtoobject;
        }
        if (formData.duration !== undefined && formData.duration !== 0) {
          result.duration = formData.duration;
        }
        return result;
      } else {
        return {
          type: 'unlockHandcuffs'
        };
      }
    }
    
    // setCoatState 外套状态控制
    if (nodeType === 'action_setCoatState' || formData.type === 'setCoatState') {
      const states = Array.isArray(formData.states) ? formData.states : [];
      
      // 如果选择了 AllOpen 或 AllClosed，转换为对应的组合
      let finalStates = [...states];
      if (states.includes('AllOpen')) {
        finalStates = ['FrontOpen2', 'BackOpen'];
      } else if (states.includes('AllClosed')) {
        finalStates = ['FrontClosed', 'BackClosed'];
      }
      
      return {
        type: 'SetCoatState',
        states: finalStates
      };
    }
    
    // 其他动作类型保持不变
    return { ...formData };
  }
  
  // 获取动作节点图标
  static getActionIcon(actionType) {
    const icons = {
      setStage: '🌆',
      manageCosplay: '👗',        // 新合并节点
      manageAdultToy: '🔓',       // 新合并节点
      manageHandcuffs: '🔗',      // 新合并节点
      equipCosplay: '👗',         // 兼容旧类型
      unequipCosplay: '🧥',
      unequipAllCosplay: '👔',
      equipAdultToy: '🔓',
      unequipAdultToy: '🔓',
      lockHandcuffs: '🔗',
      unlockHandcuffs: '🔓',
      dropItem: '📦',
      teleportPlayer: '✈️',
      setPlayerPosition: '📍',
      setCoatState: '🧥',  // 外套状态控制
      addItem: '🎁'
    };
    return icons[actionType] || '⚙️';
  }
  
  // 获取动作节点颜色
  static getActionColor(actionType) {
    const colors = {
      setStage: '#FF6B6B',
      manageCosplay: '#FFB6C1',      // 新合并节点
      manageAdultToy: '#FF6EC7',     // 新合并节点
      manageHandcuffs: '#795548',    // 新合并节点
      equipCosplay: '#FFB6C1',       // 兼容旧类型
      unequipCosplay: '#795548',
      unequipAllCosplay: '#9E9E9E',
      equipAdultToy: '#FF6EC7',
      unequipAdultToy: '#FF6EC7',
      lockHandcuffs: '#795548',
      unlockHandcuffs: '#8D6E63',
      dropItem: '#FFA726',
      teleportPlayer: '#9C27B0',
      setPlayerPosition: '#00BCD4',
      setCoatState: '#9C27B0',  // 外套状态控制（紫色）
      addItem: '#4CAF50'
    };
    return colors[actionType] || '#607D8B';
  }

  // 计算检查点的层级结构（拓扑排序）
  static calculateCheckpointLayers(checkpoints, cpMap) {
    const layers = [];
    const visited = new Set();
    const inDegree = {};  // 入度
    const graph = {};     // 邻接表
    
    // 初始化图结构
    checkpoints.forEach((cp, index) => {
      const cpId = cp.id || `cp_${index}`;
      inDegree[cpId] = 0;
      graph[cpId] = [];
    });
    
    // 构建图和计算入度
    checkpoints.forEach((cp, index) => {
      const cpId = cp.id || `cp_${index}`;
      const nextIds = this.getNextCheckpointIds(cp, index, checkpoints);
      
      nextIds.forEach(nextId => {
        if (cpMap[nextId]) {  // 确保目标节点存在
          graph[cpId].push(nextId);
          inDegree[nextId] = (inDegree[nextId] || 0) + 1;
        }
      });
    });
    
    // 使用BFS进行分层
    let currentLayer = [];
    
    // 找出所有入度为0的节点（起始节点）
    checkpoints.forEach((cp, index) => {
      const cpId = cp.id || `cp_${index}`;
      if (inDegree[cpId] === 0) {
        currentLayer.push(cpId);
        visited.add(cpId);
      }
    });
    
    // 如果没有入度为0的节点（可能有循环），使用第一个节点
    if (currentLayer.length === 0 && checkpoints.length > 0) {
      const firstCpId = checkpoints[0].id || 'cp_0';
      currentLayer.push(firstCpId);
      visited.add(firstCpId);
    }
    
    // 分层处理
    while (currentLayer.length > 0) {
      layers.push([...currentLayer]);
      const nextLayer = [];
      
      currentLayer.forEach(cpId => {
        const neighbors = graph[cpId] || [];
        neighbors.forEach(nextId => {
          if (!visited.has(nextId)) {
            // 检查所有前驱节点是否都已访问
            let allPredecessorsVisited = true;
            checkpoints.forEach((cp, idx) => {
              const checkCpId = cp.id || `cp_${idx}`;
              const checkNextIds = this.getNextCheckpointIds(cp, idx, checkpoints);
              if (checkNextIds.includes(nextId) && !visited.has(checkCpId)) {
                allPredecessorsVisited = false;
              }
            });
            
            if (allPredecessorsVisited) {
              nextLayer.push(nextId);
              visited.add(nextId);
            }
          }
        });
      });
      
      currentLayer = nextLayer;
    }
    
    // 添加未访问的节点（处理孤立节点或循环）
    checkpoints.forEach((cp, index) => {
      const cpId = cp.id || `cp_${index}`;
      if (!visited.has(cpId)) {
        if (layers.length > 0) {
          layers[layers.length - 1].push(cpId);
        } else {
          layers.push([cpId]);
        }
        visited.add(cpId);
      }
    });
    
    return layers;
  }
  
  // 获取检查点的所有后继节点ID
  static getNextCheckpointIds(cp, index, checkpoints) {
    const nextIds = [];
    
    if (typeof cp.nextcheckpoint === 'string' && cp.nextcheckpoint) {
      nextIds.push(cp.nextcheckpoint);
    } else if (cp.nextcheckpoint && cp.nextcheckpoint.selectortype) {
      if (cp.nextcheckpoint.id) {
        nextIds.push(cp.nextcheckpoint.id);
      }
      if (cp.nextcheckpoint.ids && Array.isArray(cp.nextcheckpoint.ids)) {
        nextIds.push(...cp.nextcheckpoint.ids);
      }
    } else if (index < checkpoints.length - 1) {
      // 自动连接到下一个
      const nextCp = checkpoints[index + 1];
      nextIds.push(nextCp.id || `cp_${index + 1}`);
    }
    
    return nextIds;
  }
}

// 触发热更新 - 修复导出数据丢失问题
