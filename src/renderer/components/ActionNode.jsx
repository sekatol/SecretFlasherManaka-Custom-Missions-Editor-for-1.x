import React, { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { HandleTypes } from '../config/nodeTypes';
import { CosplayParts, AdultToyParts, ItemTypes, CoatStates } from '../config/actionLibrary';
import './ActionNode.css';

// 标签组件 - 将代码转换为带背景色的中文标签
const CodeTag = ({ code, type = 'part' }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // 根据代码查找对应的名称和分类
  const getTagInfo = () => {
    let item = null;
    let colorClass = 'tag-default';
    
    if (type === 'cosplay') {
      item = CosplayParts.find(p => p.id === code);
      colorClass = 'tag-cosplay';
    } else if (type === 'toy') {
      item = AdultToyParts.find(p => p.id === code);
      colorClass = 'tag-toy';
    } else if (type === 'item') {
      item = ItemTypes.find(p => p.id === code);
      colorClass = 'tag-item';
    } else if (type === 'coat') {
      item = CoatStates.find(s => s.id === code);
      colorClass = 'tag-coat';
    }
    
    return {
      name: item?.name || code,
      category: item?.category || '',
      colorClass,
      originalCode: code
    };
  };
  
  const tagInfo = getTagInfo();
  
  return (
    <span 
      className={`code-tag ${tagInfo.colorClass} ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={`${tagInfo.name}\n代码: ${tagInfo.originalCode}${tagInfo.category ? `\n分类: ${tagInfo.category}` : ''}`}
    >
      {isHovered ? (
        <span className="tag-detail">
          <span className="tag-name">{tagInfo.name}</span>
          <span className="tag-code">{tagInfo.originalCode}</span>
        </span>
      ) : (
        tagInfo.name
      )}
    </span>
  );
};

// 标签列表组件
const TagList = ({ items, type, maxDisplay = 3 }) => {
  const displayItems = items.slice(0, maxDisplay);
  const remainingCount = items.length - maxDisplay;
  
  return (
    <div className="tag-list">
      {displayItems.map((item, index) => (
        <CodeTag key={index} code={item} type={type} />
      ))}
      {remainingCount > 0 && (
        <span className="tag-more" title={`还有 ${remainingCount} 个`}>
          +{remainingCount}
        </span>
      )}
    </div>
  );
};

const ActionNode = ({ data, id, selected }) => {
  const { label, icon, color, formData = {}, nodeType } = data;

  // 获取显示的字段内容 - 使用标签化显示
  const getDisplayContent = () => {
    const content = [];
    
    switch (nodeType) {
      case 'action_setStage':
        content.push({ type: 'text', value: `场景: ${formData.stage || 'Apart'}` });
        content.push({ type: 'text', value: `${formData.daytime ? '☀️ 白天' : '🌙 夜晚'}` });
        break;
        
      case 'action_equipCosplay':
        let parts = [];
        if (Array.isArray(formData.parts)) {
          parts = formData.parts;
        } else if (typeof formData.parts === 'string') {
          parts = formData.parts.split(',').map(p => p.trim()).filter(Boolean);
        }
        if (parts.length > 0) {
          content.push({ type: 'tags', label: '服装部件:', items: parts, tagType: 'cosplay' });
        } else {
          content.push({ type: 'text', value: '服装: 未设置' });
        }
        break;
        
      case 'action_unequipCosplay':
        let unequipParts = [];
        if (Array.isArray(formData.parts)) {
          unequipParts = formData.parts;
        } else if (typeof formData.parts === 'string') {
          unequipParts = formData.parts.split(',').map(p => p.trim()).filter(Boolean);
        }
        if (unequipParts.length > 0) {
          content.push({ type: 'tags', label: '脱掉部件:', items: unequipParts, tagType: 'cosplay' });
        } else {
          content.push({ type: 'text', value: '脱掉: 未设置' });
        }
        break;
        
      case 'action_unequipAllCosplay':
        content.push({ type: 'text', value: '脱掉所有服装' });
        break;
        
      case 'action_dropItem':
        if (formData.itemtype) {
          content.push({ type: 'tags', label: '物品:', items: [formData.itemtype], tagType: 'item' });
        } else {
          content.push({ type: 'text', value: '物品: 未设置' });
        }
        content.push({ type: 'text', value: `位置: ${formData.stage || 'Apart'} (${formData.x || 0}, ${formData.y || 0}, ${formData.z || 0})` });
        break;
        
      case 'action_manageCosplay':
        const cosplayAction = formData.action === 'unequip' ? '脱下' : '穿上';
        if (formData.allParts && formData.action === 'unequip') {
          content.push({ type: 'text', value: `${cosplayAction}服装: 全部` });
        } else {
          let cosplayParts = [];
          if (Array.isArray(formData.parts)) {
            cosplayParts = formData.parts;
          } else if (typeof formData.parts === 'string') {
            cosplayParts = formData.parts.split(',').map(p => p.trim()).filter(Boolean);
          }
          if (cosplayParts.length > 0) {
            content.push({ type: 'tags', label: `${cosplayAction}服装:`, items: cosplayParts, tagType: 'cosplay' });
          } else {
            content.push({ type: 'text', value: `${cosplayAction}服装: 未设置` });
          }
        }
        break;
        
      case 'action_manageAdultToy':
        const toyAction = formData.action === 'unequip' ? '脱下' : '穿戴';
        if (formData.allParts && formData.action === 'unequip') {
          content.push({ type: 'text', value: `${toyAction}玩具: 全部` });
        } else {
          let toyParts = [];
          if (Array.isArray(formData.parts)) {
            toyParts = formData.parts;
          } else if (typeof formData.parts === 'string') {
            toyParts = formData.parts.split(',').map(p => p.trim()).filter(Boolean);
          }
          if (toyParts.length > 0) {
            content.push({ type: 'tags', label: `${toyAction}玩具:`, items: toyParts, tagType: 'toy' });
          } else {
            content.push({ type: 'text', value: `${toyAction}玩具: 未设置` });
          }
        }
        break;
        
      case 'action_manageHandcuffs':
        const handcuffAction = formData.action === 'unlock' ? '解锁' : '锁上';
        const handcuffType = formData.handcuffstype || 'KeyHandcuff';
        const handcuffTypeText = handcuffType === 'TimerHandcuff' ? '计时手铐' : '钥匙手铐';
        
        content.push({ type: 'text', value: `${handcuffAction}手铐` });
        
        if (formData.action !== 'unlock') {
          content.push({ type: 'text', value: `类型: ${handcuffTypeText}` });
          if (handcuffType === 'TimerHandcuff' && formData.duration) {
            content.push({ type: 'text', value: `时长: ${formData.duration}秒` });
          }
          if (formData.attachtoobject) {
            content.push({ type: 'text', value: `附着到物体: 是` });
          }
        }
        break;
        
      case 'action_lockHandcuffs':
        const lockHandcuffTypeText = formData.handcuffstype === 'TimerHandcuff' ? '计时手铐' : '钥匙手铐';
        content.push({ type: 'text', value: '锁上手铐 (Legacy)' });
        content.push({ type: 'text', value: `类型: ${lockHandcuffTypeText}` });
        if (formData.handcuffstype === 'TimerHandcuff' && formData.duration) {
          content.push({ type: 'text', value: `时长: ${formData.duration}秒` });
        }
        break;
        
      case 'action_unlockHandcuffs':
        content.push({ type: 'text', value: '解锁手铐 (Legacy)' });
        break;
        
      case 'action_teleportPlayer':
        content.push({ type: 'text', value: `传送至: ${formData.stage || 'Apart'}` });
        content.push({ type: 'text', value: `坐标: (${formData.x || 0}, ${formData.y || 0}, ${formData.z || 0})` });
        break;
        
      case 'action_setPlayerPosition':
        content.push({ type: 'text', value: `设置位置: (${formData.x || 0}, ${formData.y || 0}, ${formData.z || 0})` });
        if (formData.ry || formData.rw) {
          content.push({ type: 'text', value: `旋转: (${formData.ry || 0}, ${formData.rw || 1})` });
        }
        break;
        
      case 'action_addItem':
        if (formData.itemtype) {
          content.push({ type: 'tags', label: '物品:', items: [formData.itemtype], tagType: 'item' });
        } else {
          content.push({ type: 'text', value: '物品: 未设置' });
        }
        content.push({ type: 'text', value: `数量: ${formData.count || 1}` });
        break;
        
      case 'action_setVibrator':
        const vibratorLevel = formData.level || 'Off';
        const vibratorLevelText = {
          'Off': '关闭',
          'Low': '低强度',
          'Medium': '中强度',
          'High': '高强度',
          'Random': '随机'
        }[vibratorLevel] || vibratorLevel;
        content.push({ type: 'text', value: `振动器强度: ${vibratorLevelText}` });
        break;
        
      case 'action_setPiston':
        const pistonLevel = formData.level || 'Off';
        const pistonLevelText = {
          'Off': '关闭',
          'Low': '低强度',
          'Medium': '中强度',
          'High': '高强度',
          'Random': '随机'
        }[pistonLevel] || pistonLevel;
        content.push({ type: 'text', value: `活塞强度: ${pistonLevelText}` });
        break;
        
      case 'action_unequipAdultToy':
        let unequipToyParts = [];
        if (Array.isArray(formData.parts)) {
          unequipToyParts = formData.parts;
        } else if (typeof formData.parts === 'string') {
          unequipToyParts = formData.parts.split(',').map(p => p.trim()).filter(Boolean);
        }
        if (unequipToyParts.length > 0) {
          content.push({ type: 'tags', label: '脱掉玩具:', items: unequipToyParts, tagType: 'toy' });
        } else {
          content.push({ type: 'text', value: '脱掉玩具: 未设置' });
        }
        break;
        
      case 'action_setCoatState':
        let coatStates = [];
        if (Array.isArray(formData.states)) {
          coatStates = formData.states;
        } else if (typeof formData.states === 'string') {
          coatStates = formData.states.split(',').map(s => s.trim()).filter(Boolean);
        }
        if (coatStates.length > 0) {
          content.push({ type: 'tags', label: '外套状态:', items: coatStates, tagType: 'coat' });
        } else {
          content.push({ type: 'text', value: '外套状态: 未设置' });
        }
        break;
        
      default:
        content.push({ type: 'text', value: '动作节点' });
    }
    
    return content;
  };

  return (
    <div 
      className={`action-node ${selected ? 'selected' : ''}`} 
      style={{ borderColor: color }}
    >
      {/* 左侧输入句柄 - 标题下方 */}
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        className="node-handle node-handle-input"
        style={{ background: color, top: '60px' }}
      >
        <span className="handle-label handle-label-left">输入 (in)</span>
      </Handle>

      <div className="action-node-header" style={{ background: color }}>
        <span className="action-node-icon">{icon}</span>
        <span className="action-node-label">{label}</span>
      </div>

      <div className="action-node-content">
        {getDisplayContent().map((item, index) => (
          <div key={index} className="action-node-line">
            {item.type === 'tags' ? (
              <>
                <span className="tag-label">{item.label}</span>
                <TagList items={item.items} type={item.tagType} />
              </>
            ) : (
              item.value
            )}
          </div>
        ))}
        <div className="edit-hint">点击节点在右侧编辑 (Click to edit)</div>
      </div>

      {/* 右侧输出句柄 - 标题下方 */}
      <Handle
        type="source"
        position={Position.Right}
        id="next"
        className="node-handle node-handle-output"
        style={{ background: color, top: '50px' }}
      >
        <span className="handle-label handle-label-right">下一个 (next)</span>
      </Handle>
      <Handle
        type="source"
        position={Position.Right}
        id="nextcheckpoint"
        className="node-handle node-handle-output"
        style={{ background: '#FF9800', top: '80px' }}
      >
        <span className="handle-label handle-label-right">下一检查点 (nextcheckpoint)</span>
      </Handle>
    </div>
  );
};

export default memo(ActionNode);
