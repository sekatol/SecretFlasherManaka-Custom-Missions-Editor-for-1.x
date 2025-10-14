import React, { useState } from 'react';
import './ZoneSelector.css';

const ZoneSelector = ({ zones = [], currentZone, onSelect, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState(currentZone);

  const filteredZones = zones.filter(zone =>
    zone.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    zone.stage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = () => {
    onSelect(selectedZone);
    onClose();
  };

  return (
    <div className="zone-selector-overlay" onClick={onClose}>
      <div className="zone-selector-modal" onClick={(e) => e.stopPropagation()}>
        <div className="zone-selector-header">
          <h3>选择地点</h3>
          <button className="zone-selector-close" onClick={onClose}>✕</button>
        </div>

        <div className="zone-selector-search">
          <input
            type="text"
            placeholder="搜索地点ID或场景..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />
        </div>

        <div className="zone-selector-list">
          {filteredZones.length === 0 ? (
            <div className="zone-selector-empty">
              <p>没有找到匹配的地点</p>
            </div>
          ) : (
            filteredZones.map((zone) => (
              <div
                key={zone.id}
                className={`zone-selector-item ${selectedZone === zone.id ? 'selected' : ''}`}
                onClick={() => setSelectedZone(zone.id)}
                onDoubleClick={handleSelect}
              >
                <div className="zone-selector-item-header">
                  <span className="zone-selector-icon">📍</span>
                  <span className="zone-selector-id">{zone.id}</span>
                  {selectedZone === zone.id && (
                    <span className="zone-selector-check">✓</span>
                  )}
                </div>
                <div className="zone-selector-item-body">
                  <div className="zone-selector-info">
                    <span className="label">场景:</span>
                    <span className="value">{zone.stage}</span>
                  </div>
                  <div className="zone-selector-info">
                    <span className="label">坐标:</span>
                    <span className="value">
                      ({zone.x?.toFixed(1)}, {zone.y?.toFixed(1)}, {zone.z?.toFixed(1)})
                    </span>
                  </div>
                  <div className="zone-selector-info">
                    <span className="label">半径:</span>
                    <span className="value">{zone.r}m</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="zone-selector-footer">
          <button className="btn-cancel" onClick={onClose}>取消</button>
          <button 
            className="btn-confirm" 
            onClick={handleSelect}
            disabled={!selectedZone}
          >
            确认选择
          </button>
        </div>
      </div>
    </div>
  );
};

export default ZoneSelector;
