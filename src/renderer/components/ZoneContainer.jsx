import React, { useState } from 'react';
import { NodeResizer } from 'reactflow';
import './ZoneContainer.css';

const ZoneContainer = ({ data, selected, id }) => {
  const { zones = [], onZoneSelect, onItemSelect } = data;
  const [hoveredZone, setHoveredZone] = useState(null);

  console.log('ZoneContainer render:', { id, hasOnItemSelect: !!onItemSelect, zonesCount: zones.length });

  // 点击容器背景（不是卡片）时不阻止传播，让 ReactFlow 处理节点选中
  // 只有点击卡片时才阻止传播
  const handleContainerClick = (e) => {
    // 如果点击的是容器背景（不是卡片），不阻止传播
    // 这样可以选中容器节点本身
    console.log('Container background clicked');
  };

  // 处理卡片点击 - 选中该项进行编辑
  const handleCardClick = (e, zone) => {
    e.stopPropagation(); // 卡片点击阻止传播，避免选中容器节点
    console.log('Card clicked:', { zone, hasOnItemSelect: !!onItemSelect });
    if (onItemSelect) {
      console.log('Calling onItemSelect with:', id, 'zone', zone);
      onItemSelect(id, 'zone', zone);
    } else {
      console.warn('onItemSelect is not available!');
    }
  };

  return (
    <>
      <NodeResizer 
        color="#2196F3" 
        isVisible={selected}
        minWidth={300}
        minHeight={200}
      />
      <div className="zone-container" onClick={handleContainerClick}>
        <div className="zone-container-header">
          <div className="zone-icon">🗺️</div>
          <div className="zone-title">区域定义 (Zone Definitions)</div>
          <div className="zone-count">{zones.length} 个区域 ({zones.length} zones)</div>
        </div>
        
        <div className="zone-grid">
          {zones.length === 0 ? (
            <div className="zone-empty">
              <p>暂无区域 (No zones)</p>
              <small>从左侧添加区域节点 (Add zone nodes from sidebar)</small>
            </div>
          ) : (
            zones.map((zone, index) => {
              console.log('Rendering zone card:', zone.id);
              return (
                <div
                  key={zone.id}
                  className={`zone-card ${zone.selected ? 'selected' : ''} ${hoveredZone === zone.id ? 'hovered' : ''}`}
                  onClick={(e) => {
                    console.log('!!! ZONE CARD CLICKED !!!', zone.id);
                    handleCardClick(e, zone);
                  }}
                  onMouseEnter={() => setHoveredZone(zone.id)}
                  onMouseLeave={() => setHoveredZone(null)}
                  style={{
                    pointerEvents: 'auto',
                    zIndex: 10,
                    position: 'relative'
                  }}
                >
                  <div className="zone-card-header">
                    <span className="zone-card-icon">📍</span>
                    <span className="zone-card-id">{zone.id}</span>
                  </div>
                <div className="zone-card-body">
                  <div className="zone-info-item">
                    <span className="zone-label">类型 (Type):</span>
                    <span className="zone-value zone-type">{zone.areaType || 'sphere'}</span>
                  </div>
                  <div className="zone-info-item">
                    <span className="zone-label">场景 (Stage):</span>
                    <span className="zone-value">{zone.stage}</span>
                  </div>
                  <div className="zone-info-item">
                    <span className="zone-label">坐标 (Pos):</span>
                    <span className="zone-value">
                      ({zone.x?.toFixed(1)}, {zone.y?.toFixed(1)}, {zone.z?.toFixed(1)})
                    </span>
                  </div>
                  <div className="zone-info-item">
                    <span className="zone-label">半径 (Radius):</span>
                    <span className="zone-value">{zone.r}m</span>
                  </div>
                  {zone.ringEnabled && (
                    <div className="zone-ring-indicator">
                      <div 
                        className="zone-ring-color" 
                        style={{ 
                          backgroundColor: `rgba(${zone.ringColor?.r * 255 || 0}, ${zone.ringColor?.g * 255 || 0}, ${zone.ringColor?.b * 255 || 0}, ${zone.ringColor?.a || 0.8})` 
                        }}
                      />
                      <span>光环效果 (Ring)</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
          )}
        </div>
      </div>
    </>
  );
};

export default ZoneContainer;
