import React, { useState, useEffect } from 'react';
import { NodeFieldTypes } from '../config/nodeTypes';
import { FieldLibraryMapping } from '../config/actionLibrary';
import ZoneSelector from './ZoneSelector';
import CommandLibrarySelector from './CommandLibrarySelector';
import './PropertyPanel.css';

const PropertyPanel = ({ selectedNode, onUpdateNode, onUpdateContainerItem, onDeleteContainerItem, onCreateNewZone, onClose, allNodes }) => {
  const [formData, setFormData] = useState({});
  const [showZoneSelector, setShowZoneSelector] = useState(false);
  const [highlightedZone, setHighlightedZone] = useState(null);
  const [editingContainerItem, setEditingContainerItem] = useState(null); // { type: 'zone', data: {...} }
  
  // 指令库选择器状态
  const [showLibrary, setShowLibrary] = useState(false);
  const [currentLibraryType, setCurrentLibraryType] = useState(null);
  const [currentFieldName, setCurrentFieldName] = useState(null);

  useEffect(() => {
    if (selectedNode) {
      // 如果选中的是容器内的项，使用该项的数据
      if (selectedNode.selectedItem) {
        console.log('PropertyPanel: Setting formData from selectedItem:', selectedNode.selectedItem.data);
        setFormData(selectedNode.selectedItem.data || {});
        setEditingContainerItem(selectedNode.selectedItem);
      } else if (editingContainerItem) {
        // 如果正在编辑容器项，保持编辑状态
        console.log('PropertyPanel: Keeping editingContainerItem:', editingContainerItem);
        setFormData(editingContainerItem.data || {});
      } else {
        // 否则使用节点本身的表单数据
        console.log('PropertyPanel: Setting formData from node formData:', selectedNode.data.formData);
        setFormData(selectedNode.data.formData || {});
        setEditingContainerItem(null);
      }
    } else {
      setEditingContainerItem(null);
    }
  }, [selectedNode]);

  // 安全的容器项更新函数
  const updateContainerItem = (containerId, itemType, itemId, newData) => {
    console.log('PropertyPanel: updateContainerItem called:', { containerId, itemType, itemId, newData });
    if (onUpdateContainerItem) {
      console.log('PropertyPanel: Calling onUpdateContainerItem');
      onUpdateContainerItem(containerId, itemType, itemId, newData);
    } else {
      console.error('PropertyPanel: onUpdateContainerItem is not available!');
    }
  };

  console.log('PropertyPanel render:', { 
    hasSelectedNode: !!selectedNode, 
    nodeType: selectedNode?.type,
    hasSelectedItem: !!selectedNode?.selectedItem,
    selectedItemType: selectedNode?.selectedItem?.type,
    editingContainerItem,
    formData
  });

  if (!selectedNode) {
    return (
      <div className="property-panel empty">
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <p>选择一个节点以编辑其属性 (Select a node to edit properties)</p>
        </div>
      </div>
    );
  }

  // 如果选中的是容器内的项（地点或子条件）
  if (selectedNode.selectedItem || editingContainerItem) {
    const itemInfo = editingContainerItem || selectedNode.selectedItem;
    const { type: itemType, data: itemData } = itemInfo;
    
    if (itemType === 'zone') {
      return (
        <div className="property-panel">
          <div className="panel-header">
            <div className="panel-title">
              <button 
                onClick={() => {
                  console.log('PropertyPanel: Back to container list');
                  setEditingContainerItem(null);
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#888',
                  cursor: 'pointer',
                  fontSize: '18px',
                  padding: '0 8px 0 0',
                  marginRight: '4px'
                }}
                title="返回容器列表"
              >
                ←
              </button>
              <span className="node-icon">📍</span>
              <span>编辑区域 (Edit Zone)</span>
            </div>
            <button onClick={() => {
              setEditingContainerItem(null);
              onClose();
            }} className="btn-close" title="关闭 (Close)">✕</button>
          </div>
          <div className="panel-content">
            <div className="node-info">
              <div className="info-badge">区域定义 (Zone Definition)</div>
              <p className="info-description">编辑区域范围和属性 (Edit zone area and properties)</p>
            </div>
            <div className="form-fields">
              <div className="form-group">
                <label className="form-label">区域ID (Zone ID) <span className="required-star">*</span></label>
                <input
                  type="text"
                  value={formData.id || ''}
                  onChange={(e) => {
                    const newData = { ...formData, id: e.target.value };
                    setFormData(newData);
                    updateContainerItem(selectedNode.id, 'zone', itemData.id, newData);
                  }}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">场景 (Stage) <span className="required-star">*</span></label>
                <select
                  value={formData.stage || ''}
                  onChange={(e) => {
                    const newData = { ...formData, stage: e.target.value };
                    setFormData(newData);
                    updateContainerItem(selectedNode.id, 'zone', itemData.id, newData);
                  }}
                  className="form-select"
                >
                  <option value="">-- 请选择 --</option>
                  {['Apart', 'Mansion', 'Residence', 'Convenience', 'Hella', 'Downtown', 'StationFront', 'Park', 'ShoppingMall', 'Shop'].map(stage => (
                    <option key={stage} value={stage}>{stage}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">X坐标 (X Coordinate)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.x || 0}
                  onChange={(e) => {
                    const newData = { ...formData, x: parseFloat(e.target.value) || 0 };
                    setFormData(newData);
                    updateContainerItem(selectedNode.id, 'zone', itemData.id, newData);
                  }}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Y坐标 (Y Coordinate)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.y || 0}
                  onChange={(e) => {
                    const newData = { ...formData, y: parseFloat(e.target.value) || 0 };
                    setFormData(newData);
                    updateContainerItem(selectedNode.id, 'zone', itemData.id, newData);
                  }}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Z坐标 (Z Coordinate)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.z || 0}
                  onChange={(e) => {
                    const newData = { ...formData, z: parseFloat(e.target.value) || 0 };
                    setFormData(newData);
                    updateContainerItem(selectedNode.id, 'zone', itemData.id, newData);
                  }}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">半径 (Radius)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.r || 1}
                  onChange={(e) => {
                    const newData = { ...formData, r: parseFloat(e.target.value) || 1 };
                    setFormData(newData);
                    updateContainerItem(selectedNode.id, 'zone', itemData.id, newData);
                  }}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.outlinehidden || false}
                    onChange={(e) => {
                      const newData = { ...formData, outlinehidden: e.target.checked };
                      setFormData(newData);
                      updateContainerItem(selectedNode.id, 'zone', itemData.id, newData);
                    }}
                    className="form-checkbox"
                  />
                  <span className="checkbox-text">隐藏轮廓</span>
                </label>
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.compasshidden || false}
                    onChange={(e) => {
                      const newData = { ...formData, compasshidden: e.target.checked };
                      setFormData(newData);
                      updateContainerItem(selectedNode.id, 'zone', itemData.id, newData);
                    }}
                    className="form-checkbox"
                  />
                  <span className="checkbox-text">隐藏指南针</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (itemType === 'subcondition') {
      return (
        <div className="property-panel">
          <div className="panel-header">
            <div className="panel-title">
              <span className="node-icon">🔀</span>
              <span>编辑子条件 (Edit SubCondition)</span>
            </div>
            <button onClick={onClose} className="btn-close" title="关闭 (Close)">✕</button>
          </div>
          <div className="panel-content">
            <div className="node-info">
              <div className="info-badge">子条件 (SubCondition)</div>
              <p className="info-description">编辑子条件定义 (Edit subcondition definition)</p>
            </div>
            <div className="form-fields">
              <div className="form-group">
                <label className="form-label">子条件ID (SubCondition ID) <span className="required-star">*</span></label>
                <input
                  type="text"
                  value={formData.id || ''}
                  onChange={(e) => {
                    const newData = { ...formData, id: e.target.value };
                    setFormData(newData);
                    updateContainerItem(selectedNode.id, 'subcondition', itemData.id, newData);
                  }}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">条件表达式 (Condition Expression) <span className="required-star">*</span></label>
                <textarea
                  value={formData.condition || ''}
                  onChange={(e) => {
                    const newData = { ...formData, condition: e.target.value };
                    setFormData(newData);
                    updateContainerItem(selectedNode.id, 'subcondition', itemData.id, newData);
                  }}
                  rows={6}
                  className="form-textarea"
                  placeholder="例如: !(Crouching,HandcuffsBack,Blindfolded)"
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  // 处理容器节点 - 只显示信息，不可编辑
  if (selectedNode.type === 'zoneContainer') {
    const zones = selectedNode.data.zones || [];
    return (
      <div className="property-panel">
        <div className="panel-header">
          <div className="panel-title">
            <span className="node-icon">🗺️</span>
            <span>区域容器 (Zone Container)</span>
          </div>
          <button onClick={onClose} className="btn-close" title="关闭 (Close)">✕</button>
        </div>
        <div className="panel-content">
          <div className="node-info">
            <div className="info-badge">容器 (Container)</div>
            <p className="info-description">包含 {zones.length} 个区域定义。点击卡片可编辑。(Contains {zones.length} zone definitions. Click cards to edit.)</p>
          </div>
          <div className="container-list">
            <div className="container-list-header">
              区域列表 (Zone List)
              <div style={{fontSize: '11px', color: '#888', marginTop: '4px'}}>
                点击下方的编辑按钮来修改区域属性 (Click edit button below to modify zone properties)
              </div>
            </div>
            {zones.map((zone, index) => (
              <div key={zone.id} className="container-item" style={{cursor: 'pointer', transition: 'all 0.2s'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                  <div className="container-item-title">📍 {zone.id}</div>
                  <button 
                    className="btn-edit-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('PropertyPanel: Edit button clicked for zone:', zone);
                      // 直接设置编辑状态
                      const editItem = { type: 'zone', data: zone };
                      setEditingContainerItem(editItem);
                      setFormData(zone);
                      console.log('PropertyPanel: Set editingContainerItem to:', editItem);
                    }}
                    title="点击编辑此区域"
                    style={{
                      padding: '6px 14px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(76, 175, 80, 0.3)',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 8px rgba(76, 175, 80, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 4px rgba(76, 175, 80, 0.3)';
                    }}
                  >
                    ✏️ 编辑
                  </button>
                </div>
                <div className="container-item-detail">类型: {zone.areaType || 'sphere'}</div>
                <div className="container-item-detail">场景: {zone.stage}</div>
                <div className="container-item-detail">
                  坐标: ({zone.x?.toFixed(1)}, {zone.y?.toFixed(1)}, {zone.z?.toFixed(1)})
                </div>
                <div className="container-item-detail">半径: {zone.r}m</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (selectedNode.type === 'subConditionContainer') {
    const subconditions = selectedNode.data.subconditions || [];
    return (
      <div className="property-panel">
        <div className="panel-header">
          <div className="panel-title">
            <span className="node-icon">🔀</span>
            <span>子条件容器 (SubCondition Container)</span>
          </div>
          <button onClick={onClose} className="btn-close" title="关闭 (Close)">✕</button>
        </div>
        <div className="panel-content">
          <div className="node-info">
            <div className="info-badge">容器 (Container)</div>
            <p className="info-description">包含 {subconditions.length} 个子条件。点击卡片可编辑。(Contains {subconditions.length} subconditions. Click cards to edit.)</p>
          </div>
          <div className="container-list">
            <div className="container-list-header">子条件列表 (SubCondition List)</div>
            {subconditions.map((subcond, index) => (
              <div key={subcond.id} className="container-item">
                <div className="container-item-title">🔀 {subcond.id}</div>
                <div className="container-item-detail">{subcond.condition}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const nodeTemplate = selectedNode.data.nodeTemplate;
  
  // 动作节点特殊处理（它们的数据结构不同）
  const isActionNode = selectedNode.type?.startsWith('action_');
  
  // 模块节点特殊处理
  const isModuleNode = selectedNode.type === 'checkpoint_condition' || selectedNode.type === 'checkpoint_travelcondition';
  const moduleNodeLabels = {
    'checkpoint_condition': 'Condition 模块',
    'checkpoint_travelcondition': 'TravelCondition 模块'
  };
  
  const nodeIcon = isActionNode ? selectedNode.data.icon : (isModuleNode ? (selectedNode.type === 'checkpoint_condition' ? '⚙️' : '🚶') : nodeTemplate?.icon);
  const nodeLabel = isActionNode ? selectedNode.data.label : (isModuleNode ? moduleNodeLabels[selectedNode.type] : nodeTemplate?.label);
  const nodeCategory = isActionNode ? '动作执行' : (isModuleNode ? '检查点模块' : nodeTemplate?.category);
  const nodeDescription = isActionNode ? `${selectedNode.data.label} 动作节点` : (isModuleNode ? '检查点的条件模块' : nodeTemplate?.description);

  const handleFieldChange = (fieldName, value) => {
    const newFormData = { ...formData, [fieldName]: value };
    setFormData(newFormData);
    onUpdateNode(selectedNode.id, newFormData);
  };
  
  // 打开指令库选择器
  const openLibrary = (libraryType, fieldName) => {
    setCurrentLibraryType(libraryType);
    setCurrentFieldName(fieldName);
    setShowLibrary(true);
  };

  // 处理指令库选择
  const handleLibrarySelection = (selectedValues) => {
    if (currentFieldName) {
      // 特殊处理itemconditions字段
      if (currentFieldName === 'itemconditions') {
        // 将选中的物品类型转换为itemconditions格式
        const itemConditions = selectedValues.map(itemType => ({
          type: itemType,
          zone: 'valid' // 默认zone为valid
        }));
        handleFieldChange(currentFieldName, itemConditions);
      } else {
        // 如果是多选,保持数组格式;如果是单选,取第一个值
        const libraryConfig = FieldLibraryMapping[currentLibraryType];
        const value = libraryConfig?.multiSelect !== false ? selectedValues : selectedValues[0];
        handleFieldChange(currentFieldName, value);
      }
    }
  };

  const handleArrayAdd = (fieldName) => {
    const currentArray = formData[fieldName] || [];
    const newFormData = { ...formData, [fieldName]: [...currentArray, {}] };
    setFormData(newFormData);
    onUpdateNode(selectedNode.id, newFormData);
  };

  const handleArrayRemove = (fieldName, index) => {
    const currentArray = formData[fieldName] || [];
    const newArray = currentArray.filter((_, i) => i !== index);
    const newFormData = { ...formData, [fieldName]: newArray };
    setFormData(newFormData);
    onUpdateNode(selectedNode.id, newFormData);
  };

  const handleArrayItemChange = (fieldName, index, itemFieldName, value) => {
    const currentArray = formData[fieldName] || [];
    const newArray = [...currentArray];
    newArray[index] = { ...newArray[index], [itemFieldName]: value };
    const newFormData = { ...formData, [fieldName]: newArray };
    setFormData(newFormData);
    onUpdateNode(selectedNode.id, newFormData);
  };

  // 获取所有可用的地点
  const getAvailableZones = () => {
    if (!allNodes) return [];
    
    const zoneContainerNode = allNodes.find(node => node.type === 'zoneContainer');
    if (!zoneContainerNode || !zoneContainerNode.data.zones) return [];
    
    return zoneContainerNode.data.zones;
  };

  // 处理地点选择
  const handleZoneSelect = (zoneId) => {
    // 获取选中的区域详情
    const zones = getAvailableZones();
    const selectedZone = zones.find(z => z.id === zoneId);
    
    // 对于 dropItem 节点,填充区域引用并从区域获取坐标
    if (selectedNode.data.nodeType === 'action_dropItem' && selectedZone) {
      handleFieldChange('zone', zoneId);
      handleFieldChange('_useZoneRef', true);
      // 从区域复制坐标信息
      handleFieldChange('stage', selectedZone.stage);
      handleFieldChange('x', selectedZone.x || 0);
      handleFieldChange('y', selectedZone.y || 0);
      handleFieldChange('z', selectedZone.z || 0);
    } else {
      // 对于检查点节点,直接设置 zone 字段
      handleFieldChange('zone', zoneId);
    }
    
    setHighlightedZone(zoneId);
    setShowZoneSelector(false);
  };

  const renderField = (field) => {
    const value = formData[field.name] !== undefined ? formData[field.name] : field.default;

    // 特殊处理:检查点节点的zone字段显示地点选择器
    if (field.name === 'zone' && selectedNode.data.nodeTemplate?.type === 'checkpoint') {
      const zones = getAvailableZones();
      const selectedZone = zones.find(z => z.id === value);
      const useManualCoords = formData._manualZoneCoords === true;
      
      return (
        <div className="zone-field-container">
          {/* 模式选择按钮 */}
          <div className="form-group" style={{marginBottom: '12px'}}>
            <label className="form-label">地点设置方式 (Zone Setup Method)</label>
            <div style={{display: 'flex', gap: '8px'}}>
              <button
                type="button"
                className={`btn-toggle ${!useManualCoords ? 'active' : ''}`}
                onClick={() => {
                  handleFieldChange('_manualZoneCoords', false);
                  // 保留zone引用
                }}
                style={{
                  flex: 1,
                  padding: '8px',
                  border: '1px solid #555',
                  background: !useManualCoords ? '#2196F3' : 'transparent',
                  color: !useManualCoords ? '#fff' : '#aaa',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
              >
                📍 引用已有区域
              </button>
              <button
                type="button"
                className={`btn-toggle ${useManualCoords ? 'active' : ''}`}
                onClick={() => {
                  handleFieldChange('_manualZoneCoords', true);
                  setShowZoneSelector(false);
                }}
                style={{
                  flex: 1,
                  padding: '8px',
                  border: '1px solid #555',
                  background: useManualCoords ? '#4CAF50' : 'transparent',
                  color: useManualCoords ? '#fff' : '#aaa',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
              >
                ✏️ 手动创建区域
              </button>
            </div>
          </div>

          {/* 引用已有区域模式 */}
          {!useManualCoords && (
            <div 
              className="zone-field-selector"
              onClick={() => setHighlightedZone(value)}
              onDoubleClick={() => setShowZoneSelector(true)}
            >
              <div className="zone-field-display">
                <span className="zone-field-icon">📍</span>
                <span className="zone-field-value">
                  {value || '未选择地点 (No Zone Selected)'}
                </span>
              </div>
              {selectedZone && (
                <div className="zone-field-info">
                  <div className="zone-info-item">
                    <span className="label">场景 (Stage):</span>
                    <span className="value">{selectedZone.stage}</span>
                  </div>
                  <div className="zone-info-item">
                    <span className="label">坐标 (Coords):</span>
                    <span className="value">
                      ({selectedZone.x?.toFixed(1)}, {selectedZone.y?.toFixed(1)}, {selectedZone.z?.toFixed(1)})
                    </span>
                  </div>
                </div>
              )}
              <div className="zone-field-hint">
                点击高亮 · 双击选择 (Click to highlight · Double-click to select)
              </div>
            </div>
          )}

          {/* 手动创建区域模式 */}
          {useManualCoords && (
            <div className="manual-zone-creator" style={{
              padding: '12px',
              background: '#1e1e1e',
              border: '1px solid #4CAF50',
              borderRadius: '4px'
            }}>
              <div className="form-group">
                <label className="form-label">区域ID (Zone ID) <span className="required-star">*</span></label>
                <input
                  type="text"
                  value={formData._manualZoneId || ''}
                  onChange={(e) => handleFieldChange('_manualZoneId', e.target.value)}
                  placeholder="输入新区域的ID,如: checkpoint_zone_1"
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">场景 (Stage) <span className="required-star">*</span></label>
                <select
                  value={formData._manualZoneStage || 'Apart'}
                  onChange={(e) => handleFieldChange('_manualZoneStage', e.target.value)}
                  className="form-select"
                >
                  <option value="Apart">公寓</option>
                  <option value="Mansion">豪宅</option>
                  <option value="Residence">住宅区</option>
                  <option value="Convenience">便利店</option>
                  <option value="Hella">繁华街</option>
                  <option value="Downtown">市中心</option>
                  <option value="StationFront">车站前</option>
                  <option value="Park">公园</option>
                  <option value="Mall">购物中心</option>
                  <option value="Shop">服装店</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">坐标 (Coordinates)</label>
                <div style={{display: 'flex', gap: '8px'}}>
                  <input
                    type="number"
                    step="0.1"
                    value={formData._manualZoneX !== undefined ? formData._manualZoneX : 0}
                    onChange={(e) => handleFieldChange('_manualZoneX', parseFloat(e.target.value) || 0)}
                    placeholder="X"
                    className="form-input"
                  />
                  <input
                    type="number"
                    step="0.1"
                    value={formData._manualZoneY !== undefined ? formData._manualZoneY : 0}
                    onChange={(e) => handleFieldChange('_manualZoneY', parseFloat(e.target.value) || 0)}
                    placeholder="Y"
                    className="form-input"
                  />
                  <input
                    type="number"
                    step="0.1"
                    value={formData._manualZoneZ !== undefined ? formData._manualZoneZ : 0}
                    onChange={(e) => handleFieldChange('_manualZoneZ', parseFloat(e.target.value) || 0)}
                    placeholder="Z"
                    className="form-input"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">半径 (Radius)</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData._manualZoneR !== undefined ? formData._manualZoneR : 1}
                  onChange={(e) => handleFieldChange('_manualZoneR', parseFloat(e.target.value) || 1)}
                  placeholder="半径 (默认1)"
                  className="form-input"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  // 验证必填字段
                  if (!formData._manualZoneId || !formData._manualZoneStage) {
                    alert('请填写区域ID和场景！');
                    return;
                  }
                  // 调用 App.jsx 中的创建区域函数
                  if (onCreateNewZone) {
                    onCreateNewZone({
                      id: formData._manualZoneId,
                      stage: formData._manualZoneStage,
                      x: formData._manualZoneX || 0,
                      y: formData._manualZoneY || 0,
                      z: formData._manualZoneZ || 0,
                      r: formData._manualZoneR || 1,
                      outlinehidden: false,
                      compasshidden: false
                    });
                    // 设置检查点的zone字段为新创建的区域ID
                    handleFieldChange('zone', formData._manualZoneId);
                    // 切换回引用模式
                    handleFieldChange('_manualZoneCoords', false);
                  }
                }}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#4CAF50',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  marginTop: '8px'
                }}
              >
                ✅ 创建区域并应用 (Create Zone & Apply)
              </button>
            </div>
          )}
        </div>
      );
    }

    switch (field.type) {
      case NodeFieldTypes.HIDDEN:
        // 隐藏字段不渲染，只保存数据
        return null;

      case NodeFieldTypes.TEXT:
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.label}
            className="form-input"
          />
        );

      case NodeFieldTypes.NUMBER:
        return (
          <input
            type="number"
            value={value !== undefined ? value : ''}
            onChange={(e) => handleFieldChange(field.name, parseFloat(e.target.value) || 0)}
            placeholder={field.label}
            step="0.01"
            className="form-input"
          />
        );

      case NodeFieldTypes.BOOLEAN:
        return (
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => handleFieldChange(field.name, e.target.checked)}
              className="form-checkbox"
            />
            <span className="checkbox-text">{field.label}</span>
          </label>
        );

      case NodeFieldTypes.SELECT:
        return (
          <select
            value={value || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            className="form-select"
          >
            <option value="">-- 请选择 --</option>
            {field.options && field.options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case NodeFieldTypes.TEXTAREA:
        return (
          <textarea
            value={value || ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.label}
            rows={4}
            className="form-textarea"
          />
        );

      case NodeFieldTypes.COLOR:
        return (
          <div className="color-picker-group">
            <div className="color-inputs">
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={value?.r || 0}
                onChange={(e) => handleFieldChange(field.name, { ...value, r: parseFloat(e.target.value) })}
                placeholder="R"
                className="form-input-small"
              />
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={value?.g || 0}
                onChange={(e) => handleFieldChange(field.name, { ...value, g: parseFloat(e.target.value) })}
                placeholder="G"
                className="form-input-small"
              />
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={value?.b || 0}
                onChange={(e) => handleFieldChange(field.name, { ...value, b: parseFloat(e.target.value) })}
                placeholder="B"
                className="form-input-small"
              />
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={value?.a !== undefined ? value.a : 0.8}
                onChange={(e) => handleFieldChange(field.name, { ...value, a: parseFloat(e.target.value) })}
                placeholder="A"
                className="form-input-small"
              />
            </div>
            <div 
              className="color-preview" 
              style={{ 
                backgroundColor: `rgba(${(value?.r || 0) * 255}, ${(value?.g || 0) * 255}, ${(value?.b || 0) * 255}, ${value?.a || 0.8})` 
              }}
            />
          </div>
        );

      case NodeFieldTypes.ARRAY:
        const arrayValue = value || [];
        return (
          <div className="array-field">
            {arrayValue.map((item, index) => (
              <div key={index} className="array-item">
                <div className="array-item-header">
                  <span>项目 {index + 1}</span>
                  <button
                    onClick={() => handleArrayRemove(field.name, index)}
                    className="btn-remove-item"
                    title="删除此项"
                  >
                    ✕
                  </button>
                </div>
                <div className="array-item-fields">
                  {field.itemFields && field.itemFields.map((itemField, idx) => (
                    <div key={idx} className="form-group-compact">
                      <label className="form-label-small">{itemField.label}</label>
                      {itemField.type === NodeFieldTypes.TEXTAREA ? (
                        <textarea
                          value={item[itemField.name] || ''}
                          onChange={(e) => handleArrayItemChange(field.name, index, itemField.name, e.target.value)}
                          placeholder={itemField.label}
                          rows={3}
                          className="form-textarea-small"
                        />
                      ) : (
                        <input
                          type={itemField.type === NodeFieldTypes.NUMBER ? 'number' : 'text'}
                          value={item[itemField.name] || ''}
                          onChange={(e) => handleArrayItemChange(field.name, index, itemField.name, itemField.type === NodeFieldTypes.NUMBER ? parseFloat(e.target.value) : e.target.value)}
                          placeholder={itemField.label}
                          className="form-input-small"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button
              onClick={() => handleArrayAdd(field.name)}
              className="btn-add-item"
            >
              ➕ 添加{field.label}
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="property-panel">
      <div className="panel-header">
        <div className="panel-title">
          <span className="node-icon">{nodeIcon || '⚙️'}</span>
          <span>{nodeLabel || '节点'}</span>
        </div>
        <button onClick={onClose} className="btn-close" title="关闭">✕</button>
      </div>

      <div className="panel-content">
        <div className="node-info">
          <div className="info-badge">{nodeCategory || '未知类型'}</div>
          <p className="info-description">{nodeDescription || '编辑节点属性'}</p>
        </div>

        <div className="form-fields">
          {/* 动作节点特殊处理 */}
          {isActionNode ? (
            <>
              {selectedNode.data.nodeType === 'action_setStage' && (
                <>
                  <div className="form-group">
                    <label className="form-label">
                      目标场景 (Target Stage)
                      <button
                        type="button"
                        className="library-btn"
                        onClick={() => openLibrary('stage', 'stage')}
                        title="打开指令库"
                      >
                        📚
                      </button>
                      <span className="required-star">*</span>
                    </label>
                    <select
                      value={formData.stage || 'Apart'}
                      onChange={(e) => handleFieldChange('stage', e.target.value)}
                      className="form-select"
                    >
                      <option value="Apart">公寓</option>
                      <option value="Residence">住宅区</option>
                      <option value="Convenience">便利店</option>
                      <option value="Hella">繁华街</option>
                      <option value="Downtown">市中心</option>
                      <option value="Park">公园</option>
                      <option value="Mall">购物中心</option>
                      <option value="Shop">服装店</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.daytime !== false}
                        onChange={(e) => handleFieldChange('daytime', e.target.checked)}
                        className="form-checkbox"
                      />
                      <span className="checkbox-text">白天</span>
                    </label>
                  </div>
                </>
              )}
              
              {selectedNode.data.nodeType === 'action_equipCosplay' && (
                <div className="form-group">
                  <label className="form-label">服装部件 (Cosplay Parts) <span className="required-star">*</span></label>
                  <textarea
                    value={Array.isArray(formData.parts) ? formData.parts.join(', ') : (formData.parts || '')}
                    onChange={(e) => {
                      const parts = e.target.value.split(',').map(p => p.trim()).filter(Boolean);
                      handleFieldChange('parts', parts);
                    }}
                    placeholder="输入服装部件，用逗号分隔。如: m_cosplay_school_gal_blazer, m_cosplay_school_gal_skirt"
                    rows={4}
                    className="form-textarea"
                  />
                  <div className="field-hint">多个部件用逗号分隔 (Separate multiple parts with commas)</div>
                </div>
              )}
              
              {selectedNode.data.nodeType === 'action_unequipCosplay' && (
                <div className="form-group">
                  <label className="form-label">脱下的服装部件 (Parts to Remove) <span className="required-star">*</span></label>
                  <textarea
                    value={Array.isArray(formData.parts) ? formData.parts.join(', ') : (formData.parts || '')}
                    onChange={(e) => {
                      const parts = e.target.value.split(',').map(p => p.trim()).filter(Boolean);
                      handleFieldChange('parts', parts);
                    }}
                    placeholder="输入要脱下的服装部件，用逗号分隔。如: m_cosplay_school_gal_bag, m_cosplay_school_gal_blazer"
                    rows={4}
                    className="form-textarea"
                  />
                  <div className="field-hint">多个部件用逗号分隔 (Separate multiple parts with commas)</div>
                </div>
              )}
              
              {/* ManageCosplay 节点 - 统一管理服装 */}
              {selectedNode.data.nodeType === 'action_manageCosplay' && (
                <>
                  {/* 动作类型选择 */}
                  <div className="form-group">
                    <label className="form-label">动作类型 (Action Type) <span className="required-star">*</span></label>
                    <select
                      value={formData.action || 'equip'}
                      onChange={(e) => handleFieldChange('action', e.target.value)}
                      className="form-select"
                    >
                      <option value="equip">穿上 (Equip)</option>
                      <option value="unequip">脱下 (Unequip)</option>
                    </select>
                  </div>

                  {/* 仅在 unequip 时显示 "全部部件" 选项 */}
                  {formData.action === 'unequip' && (
                    <div className="form-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.allParts || false}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            handleFieldChange('allParts', checked);
                            // 如果勾选全部,清空 parts
                            if (checked) {
                              handleFieldChange('parts', []);
                            }
                          }}
                          className="form-checkbox"
                        />
                        <span className="checkbox-text">全部部件 (All Parts)</span>
                      </label>
                      <div className="field-hint">勾选后将脱下所有服装</div>
                    </div>
                  )}

                  {/* 服装部件输入框 (当未勾选全部时显示) */}
                  {(!formData.allParts || formData.action !== 'unequip') && (
                    <div className="form-group">
                      <label className="form-label">
                        服装部件 (Cosplay Parts)
                        <button
                          type="button"
                          className="library-btn"
                          onClick={() => openLibrary('parts_cosplay', 'parts')}
                          title="打开指令库"
                        >
                          📚
                        </button>
                      </label>
                      <textarea
                        value={Array.isArray(formData.parts) ? formData.parts.join(', ') : (formData.parts || '')}
                        onChange={(e) => {
                          const parts = e.target.value.split(',').map(p => p.trim()).filter(Boolean);
                          handleFieldChange('parts', parts);
                        }}
                        placeholder="输入服装部件，用逗号分隔。点击📚按钮打开指令库选择"
                        rows={4}
                        className="form-textarea"
                        disabled={formData.allParts && formData.action === 'unequip'}
                      />
                      <div className="field-hint">多个部件用逗号分隔，或点击📚按钮从指令库选择</div>
                    </div>
                  )}
                </>
              )}
              
              {/* ManageAdultToy 节点 - 统一管理成人玩具 */}
              {selectedNode.data.nodeType === 'action_manageAdultToy' && (
                <>
                  {/* 动作类型选择 */}
                  <div className="form-group">
                    <label className="form-label">动作类型 (Action Type) <span className="required-star">*</span></label>
                    <select
                      value={formData.action || 'equip'}
                      onChange={(e) => handleFieldChange('action', e.target.value)}
                      className="form-select"
                    >
                      <option value="equip">穿戴 (Equip)</option>
                      <option value="unequip">脱下 (Unequip)</option>
                    </select>
                  </div>

                  {/* 全部部件选项 */}
                  {formData.action === 'unequip' && (
                    <div className="form-group">
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={formData.allParts || false}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            handleFieldChange('allParts', checked);
                            if (checked) {
                              handleFieldChange('parts', []);
                            }
                          }}
                          className="form-checkbox"
                        />
                        <span className="checkbox-text">全部部件 (All Parts)</span>
                      </label>
                      <div className="field-hint">勾选后将脱下所有成人玩具</div>
                    </div>
                  )}

                  {/* 玩具部件输入框 */}
                  {(!formData.allParts || formData.action !== 'unequip') && (
                    <div className="form-group">
                      <label className="form-label">
                        玩具部件 (Adult Toy Parts)
                        <button
                          type="button"
                          className="library-btn"
                          onClick={() => openLibrary('parts_adulttoy', 'parts')}
                          title="打开指令库"
                        >
                          📚
                        </button>
                      </label>
                      <textarea
                        value={Array.isArray(formData.parts) ? formData.parts.join(', ') : (formData.parts || '')}
                        onChange={(e) => {
                          const parts = e.target.value.split(',').map(p => p.trim()).filter(Boolean);
                          handleFieldChange('parts', parts);
                        }}
                        placeholder="输入玩具部件，用逗号分隔。点击📚按钮打开指令库选择"
                        rows={4}
                        className="form-textarea"
                        disabled={formData.allParts && formData.action === 'unequip'}
                      />
                      <div className="field-hint">
                        可用部件: Vibrator, TitRotor, KuriRotor, PistonAnal, PistonPussy, EyeMask
                      </div>
                    </div>
                  )}
                </>
              )}
              
              {/* ManageHandcuffs 节点 - 统一管理手铐 */}
              {selectedNode.data.nodeType === 'action_manageHandcuffs' && (
                <>
                  {/* 动作类型选择 */}
                  <div className="form-group">
                    <label className="form-label">动作类型 (Action Type) <span className="required-star">*</span></label>
                    <select
                      value={formData.action || 'lock'}
                      onChange={(e) => handleFieldChange('action', e.target.value)}
                      className="form-select"
                    >
                      <option value="lock">锁上 (Lock)</option>
                      <option value="unlock">解锁 (Unlock)</option>
                    </select>
                  </div>

                  {/* Lock 模式下的字段 */}
                  {formData.action !== 'unlock' && (
                    <>
                      {/* 手铐类型选择 */}
                      <div className="form-group">
                        <label className="form-label">
                          手铐类型 (Handcuff Type)
                          <button
                            type="button"
                            className="library-btn"
                            onClick={() => openLibrary('handcuffstype', 'handcuffstype')}
                            title="打开指令库"
                          >
                            📚
                          </button>
                        </label>
                        <select
                          value={formData.handcuffstype || 'KeyHandcuff'}
                          onChange={(e) => handleFieldChange('handcuffstype', e.target.value)}
                          className="form-select"
                        >
                          <option value="KeyHandcuff">钥匙手铐 (Key Handcuff)</option>
                          <option value="TimerHandcuff">计时手铐 (Timer Handcuff)</option>
                        </select>
                        <div className="field-hint">
                          钥匙手铐需要 HandcuffKey 解锁，计时手铐会自动解锁
                        </div>
                      </div>

                      {/* 附着到物体 */}
                      <div className="form-group">
                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={formData.attachtoobject || false}
                            onChange={(e) => handleFieldChange('attachtoobject', e.target.checked)}
                            className="form-checkbox"
                          />
                          <span className="checkbox-text">附着到物体 (Attach to Object)</span>
                        </label>
                        <div className="field-hint">手铐是否附着到场景中的物体</div>
                      </div>

                      {/* 持续时长 (仅计时手铐) */}
                      {formData.handcuffstype === 'TimerHandcuff' && (
                        <div className="form-group">
                          <label className="form-label">持续时长 (Duration)</label>
                          <input
                            type="number"
                            value={formData.duration || 0}
                            onChange={(e) => handleFieldChange('duration', parseFloat(e.target.value) || 0)}
                            placeholder="秒数，如: 60"
                            className="form-input"
                            min="0"
                            step="1"
                          />
                          <div className="field-hint">计时手铐的持续时长（秒）</div>
                        </div>
                      )}
                    </>
                  )}

                  {/* Unlock 模式提示 */}
                  {formData.action === 'unlock' && (
                    <div className="form-group">
                      <div className="field-hint" style={{ padding: '12px', background: '#f0f0f0', borderRadius: '4px' }}>
                        ℹ️ 解锁模式不需要额外参数，会直接移除玩家身上的手铐。
                      </div>
                    </div>
                  )}
                </>
              )}
              
              {selectedNode.data.nodeType === 'action_dropItem' && (
                <>
                  <div className="form-group">
                    <label className="form-label">
                      物品类型 (Item Type)
                      <button
                        type="button"
                        className="library-btn"
                        onClick={() => openLibrary('itemtype', 'itemtype')}
                        title="打开指令库"
                      >
                        📚
                      </button>
                      <span className="required-star">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.itemtype || ''}
                      onChange={(e) => handleFieldChange('itemtype', e.target.value)}
                      placeholder="如: Coat, HandcuffKey, VibeRemocon, DildoFloor 等"
                      className="form-input"
                    />
                  </div>
                  
                  {/* 位置输入方式选择 */}
                  <div className="form-group">
                    <label className="form-label">位置来源 (Position Source)</label>
                    <div style={{display: 'flex', gap: '8px', marginBottom: '8px'}}>
                      <button
                        type="button"
                        className={`btn-toggle ${!formData._useZoneRef ? 'active' : ''}`}
                        onClick={() => {
                          handleFieldChange('_useZoneRef', false);
                          // 清除 zone 引用
                          if (formData.zone) {
                            const { zone, ...rest } = formData;
                            setFormData(rest);
                            onUpdateNode(selectedNode.id, { formData: rest });
                          }
                        }}
                        style={{
                          flex: 1,
                          padding: '8px',
                          border: '1px solid #555',
                          background: !formData._useZoneRef ? '#4CAF50' : 'transparent',
                          color: !formData._useZoneRef ? '#fff' : '#aaa',
                          cursor: 'pointer',
                          borderRadius: '4px'
                        }}
                      >
                        ✏️ 手动输入坐标
                      </button>
                      <button
                        type="button"
                        className={`btn-toggle ${formData._useZoneRef ? 'active' : ''}`}
                        onClick={() => {
                          handleFieldChange('_useZoneRef', true);
                          setShowZoneSelector(true);
                        }}
                        style={{
                          flex: 1,
                          padding: '8px',
                          border: '1px solid #555',
                          background: formData._useZoneRef ? '#2196F3' : 'transparent',
                          color: formData._useZoneRef ? '#fff' : '#aaa',
                          cursor: 'pointer',
                          borderRadius: '4px'
                        }}
                      >
                        📍 引用已有区域
                      </button>
                    </div>
                  </div>

                  {/* 如果选择引用区域,显示区域信息 */}
                  {formData._useZoneRef && formData.zone && (() => {
                    const zones = getAvailableZones();
                    const refZone = zones.find(z => z.id === formData.zone);
                    return refZone ? (
                      <div className="zone-reference-display" style={{
                        padding: '12px',
                        background: '#1e1e1e',
                        border: '1px solid #2196F3',
                        borderRadius: '4px',
                        marginBottom: '12px'
                      }}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
                          <span style={{color: '#2196F3', fontWeight: 'bold'}}>📍 {refZone.id}</span>
                          <button
                            type="button"
                            onClick={() => setShowZoneSelector(true)}
                            style={{
                              padding: '4px 8px',
                              background: 'transparent',
                              border: '1px solid #2196F3',
                              color: '#2196F3',
                              cursor: 'pointer',
                              borderRadius: '3px',
                              fontSize: '12px'
                            }}
                          >
                            更换区域
                          </button>
                        </div>
                        <div style={{fontSize: '12px', color: '#aaa'}}>
                          <div>场景: {refZone.stage}</div>
                          <div>坐标: ({refZone.x?.toFixed(1)}, {refZone.y?.toFixed(1)}, {refZone.z?.toFixed(1)})</div>
                        </div>
                      </div>
                    ) : null;
                  })()}

                  {/* 手动输入模式 */}
                  {!formData._useZoneRef && (
                    <>
                      <div className="form-group">
                        <label className="form-label">场景 (Stage) <span className="required-star">*</span></label>
                        <select
                          value={formData.stage || 'Apart'}
                          onChange={(e) => handleFieldChange('stage', e.target.value)}
                          className="form-select"
                        >
                          <option value="Apart">公寓</option>
                          <option value="Mansion">豪宅</option>
                          <option value="Residence">住宅区</option>
                          <option value="Convenience">便利店</option>
                          <option value="Hella">繁华街</option>
                          <option value="Downtown">市中心</option>
                          <option value="StationFront">车站前</option>
                          <option value="Park">公园</option>
                          <option value="Mall">购物中心</option>
                          <option value="Shop">服装店</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label">坐标 (Coordinates)</label>
                        <div style={{display: 'flex', gap: '8px'}}>
                          <input
                            type="number"
                            step="0.1"
                            value={formData.x !== undefined ? formData.x : 0}
                            onChange={(e) => handleFieldChange('x', parseFloat(e.target.value) || 0)}
                            placeholder="X"
                            className="form-input"
                          />
                          <input
                            type="number"
                            step="0.1"
                            value={formData.y !== undefined ? formData.y : 0}
                            onChange={(e) => handleFieldChange('y', parseFloat(e.target.value) || 0)}
                            placeholder="Y"
                            className="form-input"
                          />
                          <input
                            type="number"
                            step="0.1"
                            value={formData.z !== undefined ? formData.z : 0}
                            onChange={(e) => handleFieldChange('z', parseFloat(e.target.value) || 0)}
                            placeholder="Z"
                            className="form-input"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
              
              {selectedNode.data.nodeType === 'action_teleportPlayer' && (
                <>
                  <div className="form-group">
                    <label className="form-label">目标场景 <span className="required-star">*</span></label>
                    <select
                      value={formData.stage || 'Apart'}
                      onChange={(e) => handleFieldChange('stage', e.target.value)}
                      className="form-select"
                    >
                      <option value="Apart">公寓</option>
                      <option value="Residence">住宅区</option>
                      <option value="Convenience">便利店</option>
                      <option value="Hella">繁华街</option>
                      <option value="Downtown">市中心</option>
                      <option value="Park">公园</option>
                      <option value="Mall">购物中心</option>
                      <option value="Shop">服装店</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">坐标</label>
                    <div style={{display: 'flex', gap: '8px'}}>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.x !== undefined ? formData.x : 0}
                        onChange={(e) => handleFieldChange('x', parseFloat(e.target.value) || 0)}
                        placeholder="X"
                        className="form-input"
                      />
                      <input
                        type="number"
                        step="0.1"
                        value={formData.y !== undefined ? formData.y : 0}
                        onChange={(e) => handleFieldChange('y', parseFloat(e.target.value) || 0)}
                        placeholder="Y"
                        className="form-input"
                      />
                      <input
                        type="number"
                        step="0.1"
                        value={formData.z !== undefined ? formData.z : 0}
                        onChange={(e) => handleFieldChange('z', parseFloat(e.target.value) || 0)}
                        placeholder="Z"
                        className="form-input"
                      />
                    </div>
                  </div>
                </>
              )}
              
              {selectedNode.data.nodeType === 'action_addItem' && (
                <>
                  <div className="form-group">
                    <label className="form-label">物品类型 <span className="required-star">*</span></label>
                    <input
                      type="text"
                      value={formData.itemtype || ''}
                      onChange={(e) => handleFieldChange('itemtype', e.target.value)}
                      placeholder="如: Key, Coin 等"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">数量</label>
                    <input
                      type="number"
                      value={formData.count !== undefined ? formData.count : 1}
                      onChange={(e) => handleFieldChange('count', parseInt(e.target.value) || 1)}
                      placeholder="1"
                      className="form-input"
                    />
                  </div>
                </>
              )}
              
              {selectedNode.data.nodeType === 'action_setVibrator' && (
                <div className="form-group">
                  <label className="form-label">振动器强度 (Vibrator Level) <span className="required-star">*</span></label>
                  <select
                    value={formData.level || 'Off'}
                    onChange={(e) => handleFieldChange('level', e.target.value)}
                    className="form-select"
                  >
                    <option value="Off">关闭 (Off)</option>
                    <option value="Low">低强度 (Low)</option>
                    <option value="Medium">中强度 (Medium)</option>
                    <option value="High">高强度 (High)</option>
                    <option value="Random">随机 (Random)</option>
                  </select>
                  <div className="field-hint">设置振动器的强度等级</div>
                </div>
              )}
              
              {selectedNode.data.nodeType === 'action_setPiston' && (
                <div className="form-group">
                  <label className="form-label">活塞强度 (Piston Level) <span className="required-star">*</span></label>
                  <select
                    value={formData.level || 'Off'}
                    onChange={(e) => handleFieldChange('level', e.target.value)}
                    className="form-select"
                  >
                    <option value="Off">关闭 (Off)</option>
                    <option value="Low">低强度 (Low)</option>
                    <option value="Medium">中强度 (Medium)</option>
                    <option value="High">高强度 (High)</option>
                    <option value="Random">随机 (Random)</option>
                  </select>
                  <div className="field-hint">设置活塞的强度等级</div>
                </div>
              )}
              
              {/* setCoatState 外套状态控制节点 */}
              {selectedNode.data.nodeType === 'action_setCoatState' && (
                <>
                  <div className="form-group">
                    <label className="form-label">
                      🧥 外套状态 (Coat States)
                      <button
                        type="button"
                        className="library-btn"
                        onClick={() => openLibrary('states_coat', 'states')}
                        title="打开外套状态选择器"
                      >
                        📚
                      </button>
                      <span className="required-star">*</span>
                    </label>
                    <textarea
                      value={Array.isArray(formData.states) ? formData.states.join(', ') : (formData.states || '')}
                      onChange={(e) => {
                        const states = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                        handleFieldChange('states', states);
                      }}
                      placeholder="点击 📚 按钮选择外套状态，或手动输入（用逗号分隔）"
                      rows={3}
                      className="form-textarea"
                    />
                    <div className="field-hint">
                      💡 可以同时选择多个状态。点击 📚 按钮打开选择器
                    </div>
                  </div>
                  
                  <div className="info-box" style={{
                    background: 'linear-gradient(135deg, rgba(156, 39, 176, 0.1), rgba(103, 58, 183, 0.1))',
                    border: '1px solid #9C27B0',
                    padding: '12px',
                    borderRadius: '6px',
                    marginTop: '12px'
                  }}>
                    <div style={{fontSize: '12px', color: '#cccccc', lineHeight: '1.6'}}>
                      <p style={{margin: '0 0 6px 0', fontWeight: 600, color: '#BA68C8'}}>外套状态组合规则：</p>
                      <ul style={{margin: 0, paddingLeft: '20px'}}>
                        <li><strong>可组合</strong>：FrontOpen1、FrontOpen2、BackOpen 可同时选择</li>
                        <li><strong>可组合</strong>：FrontClosed、BackClosed 可同时选择</li>
                        <li><strong>互斥</strong>：AllOpen 和 AllClosed 与其他所有状态互斥</li>
                        <li><strong>提示</strong>：AllOpen = FrontOpen2 + BackOpen</li>
                        <li><strong>提示</strong>：AllClosed = FrontClosed + BackClosed</li>
                      </ul>
                    </div>
                  </div>
                </>
              )}
              
              {/* unequipAdultToy 节点特殊表单 */}
              {selectedNode.data.nodeType === 'action_unequipAdultToy' && (
                <div className="form-group">
                  <label className="form-label">
                    脱掉的玩具部件 (Parts to Remove) <span className="required-star">*</span>
                  </label>
                  <textarea
                    value={Array.isArray(formData.parts) ? formData.parts.join(', ') : (formData.parts || '')}
                    onChange={(e) => {
                      const parts = e.target.value.split(',').map(p => p.trim()).filter(Boolean);
                      handleFieldChange('parts', parts);
                    }}
                    placeholder="输入要脱下的玩具部件，用逗号分隔。如: Vibrator, TitRotor, PistonAnal, EyeMask"
                    rows={4}
                    className="form-textarea"
                  />
                  <div className="field-hint">
                    多个部件用逗号分隔。可用部件: Vibrator, TitRotor, KuriRotor, PistonAnal, PistonPussy, EyeMask
                  </div>
                </div>
              )}
            </>
          ) : /* 特殊处理检查点节点,只编辑核心字段 */
          nodeTemplate?.type === 'checkpoint' ? (
            <>
              {/* 基础信息组 */}
              <div className="field-group">
                <div className="field-group-header">📌 基础信息</div>
                {renderField({ name: 'id', label: '检查点ID', type: NodeFieldTypes.TEXT, default: '' })}
                <div className="field-hint">唯一标识此检查点，用于连线和引用</div>
              </div>

              {/* 地点引用组 */}
              <div className="field-group">
                <div className="field-group-header">� 地点引用 (zone)</div>
                {renderField({ name: 'zone', label: '地点引用', type: NodeFieldTypes.TEXT, required: true, default: '' })}
                <div className="field-hint">引用 zones 容器中定义的地点ID</div>
              </div>

              {/* Condition 和 TravelCondition 提示 */}
              <div className="field-group">
                <div className="field-group-header">📋 Condition 和 TravelCondition</div>
                <div className="info-box" style={{background: '#2d2d2d', padding: '12px', borderRadius: '6px', marginBottom: '12px', border: '1px solid #404040'}}>
                  <div style={{fontSize: '13px', color: '#cccccc', lineHeight: '1.6'}}>
                    <p style={{margin: '0 0 8px 0', fontWeight: 600, color: '#e0e0e0'}}>⚙️ Condition 和 TravelCondition 在模块节点中编辑</p>
                    <p style={{margin: '0 0 8px 0'}}>• <strong style={{color: '#4CAF50'}}>Condition 模块</strong>：从检查点的 <strong>condition</strong> 锚点连接</p>
                    <p style={{margin: '0 0 8px 0'}}>• <strong style={{color: '#2196F3'}}>TravelCondition 模块</strong>：从检查点的 <strong>travelcondition</strong> 锚点连接</p>
                    <p style={{margin: 0}}>导入 JSON 时会自动创建这些模块节点</p>
                  </div>
                </div>
                
                {/* 顺序调整提示 */}
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.travelFirst || false}
                      onChange={(e) => handleFieldChange('travelFirst', e.target.checked)}
                      className="form-checkbox"
                    />
                    <span className="checkbox-text">TravelCondition 优先显示</span>
                  </label>
                  <div className="field-hint">控制检查点卡片中模块的显示顺序</div>
                </div>
              </div>

              {/* 下一步检查点组 */}
              <div className="field-group">
                <div className="field-group-header">➡️ 下一步 (nextcheckpoint)</div>
                {renderField({ name: 'nextcheckpoint', label: '下一检查点ID', type: NodeFieldTypes.TEXT, default: '' })}
                <div className="field-hint">
                  输入下一个检查点的 ID，或从 <strong>nextcheckpoint</strong> 锚点手动连线
                </div>
                
                {/* 高级选项：选择器类型 */}
                <div style={{marginTop: '16px', padding: '12px', background: '#2d2d2d', borderRadius: '6px', border: '1px solid #404040'}}>
                  <div style={{fontSize: '12px', fontWeight: 600, color: '#cccccc', marginBottom: '8px'}}>
                    🔀 高级：动态跳转（可选）
                  </div>
                  {renderField({ name: 'nextSelectorType', label: '选择器类型', type: NodeFieldTypes.SELECT, options: ['', 'SpecificId', 'RandomId'], default: '' })}
                  {formData.nextSelectorType === 'SpecificId' && renderField({ name: 'nextSpecificId', label: '指定ID', type: NodeFieldTypes.TEXT, default: '' })}
                  {formData.nextSelectorType === 'RandomId' && renderField({ name: 'nextRandomIds', label: '随机ID列表（逗号分隔）', type: NodeFieldTypes.TEXT, default: '' })}
                  <div className="field-hint">
                    留空使用简单的 nextcheckpoint 字符串；设置选择器类型以实现条件跳转或随机分支
                  </div>
                </div>
              </div>
            </>
          ) : /* 模块节点特殊处理 (checkpoint_condition 和 checkpoint_travelcondition) */
          selectedNode.type === 'checkpoint_condition' ? (
            <>
              <div className="form-group">
                <label className="form-label">💬 描述文本</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  placeholder="输入检查点描述..."
                  rows={4}
                  className="form-textarea"
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  ⚙️ 触发条件
                  <button
                    type="button"
                    className="library-btn"
                    onClick={() => openLibrary('condition_full', 'condition')}
                    title="打开指令库（全部可选项）"
                  >
                    📚
                  </button>
                </label>
                <input
                  type="text"
                  value={formData.condition || ''}
                  onChange={(e) => handleFieldChange('condition', e.target.value)}
                  placeholder="例如: [FrontClosed,BackClosed]"
                  className="form-input"
                />
                <div className="field-hint">
                  💡 支持服装、玩具、状态、外套状态等所有条件
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">❌ 失败描述 (Fail Description)</label>
                <textarea
                  value={formData.faildescription || ''}
                  onChange={(e) => handleFieldChange('faildescription', e.target.value)}
                  placeholder="条件违反时显示的文本，如: go back and try again"
                  rows={3}
                  className="form-textarea"
                />
                <div className="field-hint">
                  💡 此文本会自动创建一个失败描述节点，连接到 onviolatecondition 输出（仅UI显示，不导出到JSON）
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">⏱️ 持续时间(秒)</label>
                <input
                  type="number"
                  value={formData.duration !== undefined ? formData.duration : 1}
                  onChange={(e) => handleFieldChange('duration', parseFloat(e.target.value) || 1)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">💎 RP奖励</label>
                <input
                  type="number"
                  value={formData.rp || 0}
                  onChange={(e) => handleFieldChange('rp', parseFloat(e.target.value) || 0)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.reset !== false}
                    onChange={(e) => handleFieldChange('reset', e.target.checked)}
                    className="form-checkbox"
                  />
                  <span className="checkbox-text">可重置</span>
                </label>
              </div>
              <div className="form-group">
                <label className="form-label">🚫 隐藏面板</label>
                <select
                  value={formData.hidepanel || ''}
                  onChange={(e) => handleFieldChange('hidepanel', e.target.value)}
                  className="form-select"
                >
                  <option value="">不隐藏</option>
                  <option value="IfNotCondition">条件未满足时隐藏</option>
                  <option value="Always">始终隐藏</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">
                  📦 物品条件 (Item Conditions)
                  <button
                    type="button"
                    className="library-btn"
                    onClick={() => openLibrary('itemtype', 'itemconditions')}
                    title="打开物品库"
                  >
                    📚
                  </button>
                </label>
                <textarea
                  value={typeof formData.itemconditions === 'string' 
                    ? formData.itemconditions 
                    : (Array.isArray(formData.itemconditions) 
                      ? JSON.stringify(formData.itemconditions, null, 2) 
                      : '')}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      handleFieldChange('itemconditions', parsed);
                    } catch {
                      handleFieldChange('itemconditions', e.target.value);
                    }
                  }}
                  placeholder='[{"type":"Coat","zone":"Starting zone"}]'
                  rows={4}
                  className="form-textarea"
                />
                <div className="field-hint">
                  💡 JSON数组格式，点击📚按钮可选择物品类型。zone可以是区域ID或"valid"/"invalid"/"任意"
                </div>
              </div>
            </>
          ) : selectedNode.type === 'checkpoint_travelcondition' ? (
            <>
              <div className="form-group">
                <label className="form-label">🚶 移动描述</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  placeholder="输入移动时的描述..."
                  rows={4}
                  className="form-textarea"
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  🚶⚙️ 移动条件
                  <button
                    type="button"
                    className="library-btn"
                    onClick={() => openLibrary('condition_full', 'condition')}
                    title="打开指令库（全部可选项）"
                  >
                    📚
                  </button>
                </label>
                <input
                  type="text"
                  value={formData.condition || ''}
                  onChange={(e) => handleFieldChange('condition', e.target.value)}
                  placeholder='例如: [FrontOpen2,BackOpen] 或 C.clothed.outerwear=="naked"'
                  className="form-input"
                />
                <div className="field-hint">
                  💡 支持服装、玩具、状态、外套状态等所有条件
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">❌ 失败描述 (Fail Description)</label>
                <textarea
                  value={formData.faildescription || ''}
                  onChange={(e) => handleFieldChange('faildescription', e.target.value)}
                  placeholder="条件违反时显示的文本，如: go back and try again"
                  rows={3}
                  className="form-textarea"
                />
                <div className="field-hint">
                  💡 此文本会自动创建一个失败描述节点，连接到 onviolatecondition 输出（仅UI显示，不导出到JSON）
                </div>
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.hideprogress || false}
                    onChange={(e) => handleFieldChange('hideprogress', e.target.checked)}
                    className="form-checkbox"
                  />
                  <span className="checkbox-text">隐藏移动进度</span>
                </label>
              </div>
            </>
          ) : selectedNode.type === 'description' ? (
            <>
              <div className="form-group">
                <label className="form-label">📝 描述内容</label>
                <textarea
                  value={formData.text || ''}
                  onChange={(e) => handleFieldChange('text', e.target.value)}
                  placeholder="输入描述文本..."
                  rows={6}
                  className="form-textarea"
                />
                <div className="field-hint">此文本可以连接到需要描述的节点</div>
              </div>
            </>
          ) : (
            /* 其他节点类型使用原有的字段遍历方式 */
            nodeTemplate && nodeTemplate.fields && nodeTemplate.fields.map((field, index) => (
              <div key={index} className="form-group">
                {field.type !== NodeFieldTypes.BOOLEAN && (
                  <label className="form-label">
                    {field.label}
                    {field.required && <span className="required-star">*</span>}
                  </label>
                )}
                {renderField(field)}
              </div>
            ))
          )}
        </div>
      </div>

      {showZoneSelector && (
        <ZoneSelector
          zones={getAvailableZones()}
          currentZone={formData.zone}
          onSelect={handleZoneSelect}
          onClose={() => setShowZoneSelector(false)}
        />
      )}
      
      {/* 指令库选择器 */}
      {showLibrary && (
        <CommandLibrarySelector
          libraryType={currentLibraryType}
          selectedValues={Array.isArray(formData[currentFieldName]) 
            ? formData[currentFieldName] 
            : (formData[currentFieldName] ? [formData[currentFieldName]] : [])
          }
          onChange={handleLibrarySelection}
          multiSelect={FieldLibraryMapping[currentLibraryType]?.multiSelect !== false}
          isOpen={showLibrary}
          onClose={() => setShowLibrary(false)}
        />
      )}
    </div>
  );
};

export default PropertyPanel;
