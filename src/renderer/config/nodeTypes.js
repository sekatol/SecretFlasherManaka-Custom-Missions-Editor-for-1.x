// 塞雷卡任务节点类型定义
export const NodeCategories = {
  BASIC: '基础设置',
  ZONE: '区域定义',
  CHECKPOINT: '检查点',
  DIALOGUE: '对话节点',
  CONDITION: '条件判断',
  ACTION: '动作执行',
  TELEPORT: '传送点',
  SPECIAL: '特殊节点'
};

// 节点句柄（锚点）类型
export const HandleTypes = {
  // 检查点句柄
  CHECKPOINT_IN: 'checkpoint_in',           // 检查点输入
  CHECKPOINT_NEXT: 'checkpoint_next',       // 下一检查点
  CHECKPOINT_ONCOMPLETE: 'oncomplete',      // 完成时动作
  CHECKPOINT_ONVIOLATE: 'onviolatecondition', // 违反条件动作
  
  // 动作句柄
  ACTION_IN: 'action_in',                   // 动作输入
  ACTION_OUT: 'action_out',                 // 动作输出（链式）
  
  // 区域句柄
  ZONE_OUT: 'zone_out',                     // 区域输出
  CHECKPOINT_ZONE: 'zone_ref'               // 检查点的区域引用
};

// 节点字段配置
export const NodeFieldTypes = {
  TEXT: 'text',
  NUMBER: 'number',
  BOOLEAN: 'boolean',
  SELECT: 'select',
  TEXTAREA: 'textarea',
  POSITION: 'position',
  HIDDEN: 'hidden',  // 隐藏字段，只保存数据不显示在UI中
  COLOR: 'color',
  ARRAY: 'array'
};

// 基础任务信息节点
export const MissionInfoNode = {
  type: 'missionInfo',
  category: NodeCategories.BASIC,
  label: '任务信息',
  description: '设置任务的基本信息',
  icon: '📋',
  color: '#4CAF50',
  fields: [
    { name: 'title', label: '任务标题', type: NodeFieldTypes.TEXT, required: true, default: '' },
    { name: 'listmission', label: '显示在任务列表', type: NodeFieldTypes.BOOLEAN, default: true },
    { name: 'addtitleinlist', label: '列表中添加标题', type: NodeFieldTypes.BOOLEAN, default: false },
    { name: 'addtitleinpanel', label: '面板中添加标题', type: NodeFieldTypes.BOOLEAN, default: false },
    { name: 'stage', label: '初始场景', type: NodeFieldTypes.SELECT, options: ['Apart', 'Residence', 'Convenience', 'Hella', 'Downtown', 'Park', 'Mall', 'Shop'], default: 'Apart' }
  ]
};

// 传送点节点
export const TeleportNode = {
  type: 'teleport',
  category: NodeCategories.TELEPORT,
  label: '传送点',
  description: '设置任务起始传送位置',
  icon: '🌀',
  color: '#9C27B0',
  fields: [
    { name: 'stage', label: '场景', type: NodeFieldTypes.SELECT, options: ['Apart', 'Residence', 'Convenience', 'Hella', 'Downtown', 'Park', 'Mall', 'Shop'], required: true, default: 'Apart' },
    { name: 'x', label: 'X坐标', type: NodeFieldTypes.NUMBER, required: true, default: 0 },
    { name: 'y', label: 'Y坐标', type: NodeFieldTypes.NUMBER, required: true, default: 0 },
    { name: 'z', label: 'Z坐标', type: NodeFieldTypes.NUMBER, required: true, default: 0 },
    { name: 'description', label: '描述', type: NodeFieldTypes.TEXT, default: '任务传送起点' }
  ]
};

// 区域节点
export const ZoneNode = {
  type: 'zone',
  category: NodeCategories.ZONE,
  label: '区域定义',
  description: '定义一个任务区域范围',
  icon: '🗺️',
  color: '#2196F3',
  fields: [
    { name: 'id', label: '区域ID', type: NodeFieldTypes.TEXT, required: true, default: '' },
    { name: 'areaType', label: '区域类型', type: NodeFieldTypes.SELECT, options: ['sphere', 'box', 'cylinder'], default: 'sphere' },
    { name: 'stage', label: '场景', type: NodeFieldTypes.SELECT, options: ['Apart', 'Residence', 'Convenience', 'Hella', 'Downtown', 'Park', 'Mall', 'Shop'], required: true, default: 'Apart' },
    { name: 'x', label: 'X坐标', type: NodeFieldTypes.NUMBER, required: true, default: 0 },
    { name: 'y', label: 'Y坐标', type: NodeFieldTypes.NUMBER, required: true, default: 0 },
    { name: 'z', label: 'Z坐标', type: NodeFieldTypes.NUMBER, required: true, default: 0 },
    { name: 'r', label: '半径', type: NodeFieldTypes.NUMBER, required: true, default: 0.5 },
    { name: 'outlinehidden', label: '隐藏轮廓', type: NodeFieldTypes.BOOLEAN, default: false },
    { name: 'compasshidden', label: '隐藏指南针', type: NodeFieldTypes.BOOLEAN, default: false },
    { name: 'ringEnabled', label: '启用光环', type: NodeFieldTypes.BOOLEAN, default: true },
    { name: 'ringColor', label: '光环颜色', type: NodeFieldTypes.COLOR, default: { r: 0, g: 1, b: 0, a: 0.8 } }
  ]
};

// 检查点节点（完整结构）
export const CheckpointNode = {
  type: 'checkpoint',
  category: NodeCategories.CHECKPOINT,
  label: '检查点',
  description: '任务检查点核心节点',
  icon: '📍',
  color: '#FF9800',
  fields: [
    { name: 'id', label: '检查点ID', type: NodeFieldTypes.TEXT, required: false, default: '' },
    { name: 'zone', label: '地点引用', type: NodeFieldTypes.TEXT, required: true, default: '', hint: '引用zones中的id' },
    
    // nextcheckpoint字段
    { name: 'nextcheckpoint', label: '下一检查点ID', type: NodeFieldTypes.TEXT, default: '', hint: '简单字符串或留空' },
    { name: 'nextSelectorType', label: '选择器类型', type: NodeFieldTypes.SELECT, options: ['', 'SpecificId', 'RandomId'], default: '', hint: 'nextcheckpoint对象时使用' },
    { name: 'nextSpecificId', label: '指定ID', type: NodeFieldTypes.TEXT, default: '', hint: 'selectortype=SpecificId时' },
    { name: 'nextRandomIds', label: '随机ID列表', type: NodeFieldTypes.TEXT, default: '', hint: 'selectortype=RandomId时，逗号分隔' }
  ],
  handles: {
    inputs: [
      { id: 'in', type: HandleTypes.FLOW, position: 'left', label: '流程输入' },
      { id: 'zone', type: HandleTypes.DATA, position: 'left', label: '地点' },
      { id: 'description', type: HandleTypes.DATA, position: 'left', label: '描述' }
    ],
    outputs: [
      { id: 'travelcondition', type: HandleTypes.FLOW, position: 'right', label: 'TravelCondition' },
      { id: 'condition', type: HandleTypes.FLOW, position: 'right', label: 'Condition' },
      { id: 'nextcheckpoint', type: HandleTypes.FLOW, position: 'right', label: '下一检查点' }
    ]
  }
};

// 对话节点
export const DialogueNode = {
  type: 'dialogue',
  category: NodeCategories.DIALOGUE,
  label: '对话节点',
  description: '添加剧情对话内容',
  icon: '💬',
  color: '#E91E63',
  fields: [
    { name: 'id', label: '节点ID', type: NodeFieldTypes.TEXT, required: true, default: '' },
    { name: 'lines', label: '对话内容', type: NodeFieldTypes.ARRAY, itemFields: [
      { name: 'content', label: '对话文本', type: NodeFieldTypes.TEXTAREA, required: true },
      { name: 'duration', label: '显示时长(秒)', type: NodeFieldTypes.NUMBER, default: 3 }
    ], default: [] },
    { name: 'nextcheckpoint', label: '下一检查点ID', type: NodeFieldTypes.TEXT, default: '' }
  ]
};

// 条件节点
export const ConditionNode = {
  type: 'condition',
  category: NodeCategories.CONDITION,
  label: '子条件',
  description: '定义可复用的条件',
  icon: '🔀',
  color: '#00BCD4',
  fields: [
    { name: 'id', label: '条件ID', type: NodeFieldTypes.TEXT, required: true, default: '' },
    { name: 'condition', label: '条件表达式', type: NodeFieldTypes.TEXT, required: true, default: '' },
    { name: 'description', label: '条件描述', type: NodeFieldTypes.TEXT, default: '' }
  ]
};

// ==================== 检查点模块节点 ====================

// Condition 模块 - 检查点的 condition 部分
export const ConditionModuleNode = {
  type: 'checkpoint_condition',
  category: NodeCategories.CHECKPOINT,
  label: 'Condition 模块',
  description: '检查点的条件模块',
  icon: '✓',
  color: '#4CAF50',
  fields: [
    { name: 'description', label: '描述文本', type: NodeFieldTypes.TEXTAREA, required: true, default: '' },
    { name: 'condition', label: '触发条件', type: NodeFieldTypes.TEXT, default: '', hint: '如 [FrontClosed,BackClosed]' },
    { name: 'duration', label: '持续时间(秒)', type: NodeFieldTypes.NUMBER, default: 1 },
    { name: 'rp', label: 'RP奖励', type: NodeFieldTypes.NUMBER, default: 0 },
    { name: 'reset', label: '可重置', type: NodeFieldTypes.BOOLEAN, default: true },
    { name: 'hidepanel', label: '隐藏面板', type: NodeFieldTypes.SELECT, options: ['', 'IfNotCondition', 'Always'], default: '' },
    { name: 'itemconditions', label: '物品条件', type: NodeFieldTypes.TEXTAREA, default: '', hint: 'JSON数组，如 [{"type":"Coat","zone":"Starting zone"}]' }
  ],
  handles: {
    inputs: [
      { id: 'checkpoint', type: HandleTypes.FLOW, position: 'left', label: '检查点' },
      { id: 'description', type: HandleTypes.DATA, position: 'left', label: '描述' }
    ],
    outputs: [
      { id: 'oncomplete', type: HandleTypes.FLOW, position: 'right', label: '完成时' },
      { id: 'onviolatecondition', type: HandleTypes.FLOW, position: 'right', label: '违反时' }
    ]
  }
};

// TravelCondition 模块 - 检查点的 travelcondition 部分
export const TravelConditionModuleNode = {
  type: 'checkpoint_travelcondition',
  category: NodeCategories.CHECKPOINT,
  label: 'TravelCondition 模块',
  description: '检查点的移动条件模块',
  icon: '🚶',
  color: '#2196F3',
  fields: [
    { name: 'description', label: '移动描述', type: NodeFieldTypes.TEXTAREA, default: '' },
    { name: 'condition', label: '移动条件', type: NodeFieldTypes.TEXT, default: '' },
    { name: 'hideprogress', label: '隐藏进度', type: NodeFieldTypes.BOOLEAN, default: false }
  ],
  handles: {
    inputs: [
      { id: 'checkpoint', type: HandleTypes.FLOW, position: 'left', label: '检查点' },
      { id: 'description', type: HandleTypes.DATA, position: 'left', label: '描述' }
    ],
    outputs: [
      { id: 'oncomplete', type: HandleTypes.FLOW, position: 'right', label: '完成时' },
      { id: 'onviolatecondition', type: HandleTypes.FLOW, position: 'right', label: '违反时' }
    ]
  }
};

// ==================== 动作节点定义 ====================

// SetStage 动作 - 切换场景
export const SetStageActionNode = {
  type: 'action_setStage',
  category: NodeCategories.ACTION,
  label: 'SetStage',
  description: '切换游戏场景和时间',
  icon: '🌆',
  color: '#FF6B6B',
  fields: [
    { name: 'stage', label: '目标场景', type: NodeFieldTypes.SELECT, options: ['Apart', 'Residence', 'Convenience', 'Hella', 'Downtown', 'Park', 'Mall', 'Shop'], required: true, default: 'Apart' },
    { name: 'daytime', label: '白天', type: NodeFieldTypes.BOOLEAN, default: true }
  ],
  handles: {
    inputs: [{ id: 'in', type: HandleTypes.ACTION_IN, position: 'left' }],
    outputs: [
      { id: 'next', type: HandleTypes.ACTION_OUT, position: 'right', label: '下一个动作' },
      { id: 'nextcheckpoint', type: HandleTypes.FLOW, position: 'right', label: '下一检查点' }
    ]
  }
};

// ManageCosplay 动作 - 管理服装 (合并equipCosplay和unequipCosplay)
export const ManageCosplayActionNode = {
  type: 'action_manageCosplay',
  category: NodeCategories.ACTION,
  label: 'ManageCosplay',
  description: '穿上或脱下指定的服装部件',
  icon: '👗',
  color: '#FFB6C1',
  fields: [
    { name: 'action', label: '动作类型', type: NodeFieldTypes.SELECT, options: ['equip', 'unequip'], required: true, default: 'equip', hint: 'equip=穿上, unequip=脱下' },
    { name: 'parts', label: '服装部件', type: NodeFieldTypes.TEXTAREA, default: '', hint: '逗号分隔，如: m_cosplay_school_gal_blazer' },
    { name: 'allParts', label: '全部部件', type: NodeFieldTypes.BOOLEAN, default: false, hint: '勾选后将脱下所有服装(仅unequip时有效)' }
  ],
  handles: {
    inputs: [{ id: 'in', type: HandleTypes.ACTION_IN, position: 'left' }],
    outputs: [
      { id: 'next', type: HandleTypes.ACTION_OUT, position: 'right', label: '下一个动作' },
      { id: 'nextcheckpoint', type: HandleTypes.FLOW, position: 'right', label: '下一检查点' }
    ]
  }
};

// 保留原有的EquipCosplay节点以兼容旧数据
export const EquipCosplayActionNode = {
  type: 'action_equipCosplay',
  category: NodeCategories.ACTION,
  label: 'EquipCosplay (Legacy)',
  description: '装备指定的服装部件 - 建议使用ManageCosplay',
  icon: '👗',
  color: '#FFB6C1',
  fields: [
    { name: 'parts', label: '服装部件', type: NodeFieldTypes.TEXTAREA, default: '', hint: '逗号分隔，如: Naked,Coat,Skirt' }
  ],
  handles: {
    inputs: [{ id: 'in', type: HandleTypes.ACTION_IN, position: 'left' }],
    outputs: [
      { id: 'next', type: HandleTypes.ACTION_OUT, position: 'right', label: '下一个动作' },
      { id: 'nextcheckpoint', type: HandleTypes.FLOW, position: 'right', label: '下一检查点' }
    ]
  }
};

// DropItem 动作 - 掉落物品
export const DropItemActionNode = {
  type: 'action_dropItem',
  category: NodeCategories.ACTION,
  label: 'DropItem',
  description: '在指定位置掉落物品',
  icon: '📦',
  color: '#FFA726',
  fields: [
    { name: 'itemtype', label: '物品类型', type: NodeFieldTypes.TEXT, required: true, default: '' },
    { name: 'stage', label: '场景', type: NodeFieldTypes.SELECT, options: ['Apart', 'Residence', 'Convenience', 'Hella', 'Downtown', 'Park', 'Mall', 'Shop'], required: true, default: 'Apart' },
    { name: 'x', label: 'X坐标', type: NodeFieldTypes.NUMBER, required: true, default: 0 },
    { name: 'y', label: 'Y坐标', type: NodeFieldTypes.NUMBER, required: true, default: 0 },
    { name: 'z', label: 'Z坐标', type: NodeFieldTypes.NUMBER, required: true, default: 0 }
  ],
  handles: {
    inputs: [{ id: 'in', type: HandleTypes.ACTION_IN, position: 'left' }],
    outputs: [
      { id: 'next', type: HandleTypes.ACTION_OUT, position: 'right', label: '下一个动作' },
      { id: 'nextcheckpoint', type: HandleTypes.FLOW, position: 'right', label: '下一检查点' }
    ]
  }
};

// TeleportPlayer 动作 - 传送玩家
export const TeleportPlayerActionNode = {
  type: 'action_teleportPlayer',
  category: NodeCategories.ACTION,
  label: 'TeleportPlayer',
  description: '传送玩家到指定位置',
  icon: '✈️',
  color: '#9C27B0',
  fields: [
    { name: 'stage', label: '目标场景', type: NodeFieldTypes.SELECT, options: ['Apart', 'Residence', 'Convenience', 'Hella', 'Downtown', 'Park', 'Mall', 'Shop'], required: true, default: 'Apart' },
    { name: 'x', label: 'X坐标', type: NodeFieldTypes.NUMBER, required: true, default: 0 },
    { name: 'y', label: 'Y坐标', type: NodeFieldTypes.NUMBER, required: true, default: 0 },
    { name: 'z', label: 'Z坐标', type: NodeFieldTypes.NUMBER, required: true, default: 0 }
  ],
  handles: {
    inputs: [{ id: 'in', type: HandleTypes.ACTION_IN, position: 'left' }],
    outputs: [
      { id: 'next', type: HandleTypes.ACTION_OUT, position: 'right', label: '下一个动作' },
      { id: 'nextcheckpoint', type: HandleTypes.FLOW, position: 'right', label: '下一检查点' }
    ]
  }
};

// AddItem 动作 - 添加物品到背包
export const AddItemActionNode = {
  type: 'action_addItem',
  category: NodeCategories.ACTION,
  label: 'AddItem',
  description: '添加物品到玩家背包',
  icon: '🎁',
  color: '#4CAF50',
  fields: [
    { name: 'itemtype', label: '物品类型', type: NodeFieldTypes.TEXT, required: true, default: '' },
    { name: 'count', label: '数量', type: NodeFieldTypes.NUMBER, default: 1 }
  ],
  handles: {
    inputs: [{ id: 'in', type: HandleTypes.ACTION_IN, position: 'left' }],
    outputs: [
      { id: 'next', type: HandleTypes.ACTION_OUT, position: 'right', label: '下一个动作' },
      { id: 'nextcheckpoint', type: HandleTypes.FLOW, position: 'right', label: '下一检查点' }
    ]
  }
};

// SetVibrator 动作 - 设置振动器强度
export const SetVibratorActionNode = {
  type: 'action_setVibrator',
  category: NodeCategories.ACTION,
  label: 'SetVibrator',
  description: '设置振动器的强度等级',
  icon: '📳',
  color: '#E91E63',
  fields: [
    { name: 'level', label: '强度等级', type: NodeFieldTypes.SELECT, options: ['Off', 'Low', 'Medium', 'High', 'Random'], required: true, default: 'Off' }
  ],
  handles: {
    inputs: [{ id: 'in', type: HandleTypes.ACTION_IN, position: 'left' }],
    outputs: [
      { id: 'next', type: HandleTypes.ACTION_OUT, position: 'right', label: '下一个动作' },
      { id: 'nextcheckpoint', type: HandleTypes.FLOW, position: 'right', label: '下一检查点' }
    ]
  }
};

// SetPiston 动作 - 设置活塞强度
export const SetPistonActionNode = {
  type: 'action_setPiston',
  category: NodeCategories.ACTION,
  label: 'SetPiston',
  description: '设置活塞的强度等级',
  icon: '🔧',
  color: '#673AB7',
  fields: [
    { name: 'level', label: '强度等级', type: NodeFieldTypes.SELECT, options: ['Off', 'Low', 'Medium', 'High', 'Random'], required: true, default: 'Off' }
  ],
  handles: {
    inputs: [{ id: 'in', type: HandleTypes.ACTION_IN, position: 'left' }],
    outputs: [
      { id: 'next', type: HandleTypes.ACTION_OUT, position: 'right', label: '下一个动作' },
      { id: 'nextcheckpoint', type: HandleTypes.FLOW, position: 'right', label: '下一检查点' }
    ]
  }
};

// ManageAdultToy 动作 - 管理成人玩具 (合并equipAdultToy和unequipAdultToy)
export const ManageAdultToyActionNode = {
  type: 'action_manageAdultToy',
  category: NodeCategories.ACTION,
  label: 'ManageAdultToy',
  description: '穿戴或脱下指定的成人玩具部件',
  icon: '🔓',
  color: '#FF6EC7',
  fields: [
    { name: 'action', label: '动作类型', type: NodeFieldTypes.SELECT, options: ['equip', 'unequip'], required: true, default: 'equip', hint: 'equip=穿戴, unequip=脱下' },
    { name: 'parts', label: '玩具部件', type: NodeFieldTypes.TEXTAREA, default: '', hint: 'Vibrator,TitRotor,KuriRotor,PistonAnal,PistonPussy,EyeMask' },
    { name: 'allParts', label: '全部部件', type: NodeFieldTypes.BOOLEAN, default: false, hint: '勾选后将脱下所有玩具(仅unequip时有效)' }
  ],
  handles: {
    inputs: [{ id: 'in', type: HandleTypes.ACTION_IN, position: 'left' }],
    outputs: [
      { id: 'next', type: HandleTypes.ACTION_OUT, position: 'right', label: '下一个动作' },
      { id: 'nextcheckpoint', type: HandleTypes.FLOW, position: 'right', label: '下一检查点' }
    ]
  }
};

// ManageHandcuffs 动作 - 管理手铐
export const ManageHandcuffsActionNode = {
  type: 'action_manageHandcuffs',
  category: NodeCategories.ACTION,
  label: 'ManageHandcuffs',
  description: '锁上或解锁手铐',
  icon: '🔗',
  color: '#795548',
  fields: [
    { name: 'action', label: '动作类型', type: NodeFieldTypes.SELECT, options: ['lock', 'unlock'], required: true, default: 'lock', hint: 'lock=锁上手铐, unlock=解锁手铐' },
    { name: 'handcuffstype', label: '手铐类型', type: NodeFieldTypes.SELECT, options: ['KeyHandcuff', 'TimerHandcuff'], default: 'KeyHandcuff', hint: 'KeyHandcuff=钥匙手铐, TimerHandcuff=计时手铐 (仅lock时需要)' },
    { name: 'attachtoobject', label: '附着到物体', type: NodeFieldTypes.BOOLEAN, default: false, hint: '是否附着到物体 (仅lock时有效)' },
    { name: 'duration', label: '持续时长', type: NodeFieldTypes.NUMBER, default: 0, hint: '计时手铐的持续时长(秒) (仅TimerHandcuff时有效)' }
  ],
  handles: {
    inputs: [{ id: 'in', type: HandleTypes.ACTION_IN, position: 'left' }],
    outputs: [
      { id: 'next', type: HandleTypes.ACTION_OUT, position: 'right', label: '下一个动作' },
      { id: 'nextcheckpoint', type: HandleTypes.FLOW, position: 'right', label: '下一检查点' }
    ]
  }
};

// 保留 UnequipAdultToy 节点以兼容旧数据
export const UnequipAdultToyActionNode = {
  type: 'action_unequipAdultToy',
  category: NodeCategories.ACTION,
  label: 'UnequipAdultToy (Legacy)',
  description: '脱掉指定的成人玩具部件 - 建议使用ManageAdultToy',
  icon: '🔓',
  color: '#FF6EC7',
  fields: [
    { name: 'parts', label: '玩具部件', type: NodeFieldTypes.TEXTAREA, default: '', hint: '如: Vibrator,TitRotor,KuriRotor,PistonAnal,PistonPussy,EyeMask' }
  ],
  handles: {
    inputs: [{ id: 'in', type: HandleTypes.ACTION_IN, position: 'left' }],
    outputs: [
      { id: 'next', type: HandleTypes.ACTION_OUT, position: 'right', label: '下一个动作' },
      { id: 'nextcheckpoint', type: HandleTypes.FLOW, position: 'right', label: '下一检查点' }
    ]
  }
};

// 添加 EquipAdultToy 节点以兼容旧数据 (之前遗漏的)
export const EquipAdultToyActionNode = {
  type: 'action_equipAdultToy',
  category: NodeCategories.ACTION,
  label: 'EquipAdultToy (Legacy)',
  description: '穿戴指定的成人玩具部件 - 建议使用ManageAdultToy',
  icon: '�',
  color: '#E91E63',
  fields: [
    { name: 'parts', label: '玩具部件', type: NodeFieldTypes.TEXTAREA, default: '', hint: '如: Vibrator,TitRotor,KuriRotor,PistonAnal,PistonPussy,EyeMask' }
  ],
  handles: {
    inputs: [{ id: 'in', type: HandleTypes.ACTION_IN, position: 'left' }],
    outputs: [
      { id: 'next', type: HandleTypes.ACTION_OUT, position: 'right', label: '下一个动作' },
      { id: 'nextcheckpoint', type: HandleTypes.FLOW, position: 'right', label: '下一检查点' }
    ]
  }
};

// UnequipCosplay 动作 - 脱掉指定服装 (保留兼容性)
export const UnequipCosplayActionNode = {
  type: 'action_unequipCosplay',
  category: NodeCategories.ACTION,
  label: 'UnequipCosplay (Legacy)',
  description: '脱掉指定的服装部件 - 建议使用ManageCosplay',
  icon: '🧥',
  color: '#795548',
  fields: [
    { name: 'parts', label: '服装部件', type: NodeFieldTypes.TEXTAREA, default: '', hint: '逗号分隔或数组' }
  ],
  handles: {
    inputs: [{ id: 'in', type: HandleTypes.ACTION_IN, position: 'left' }],
    outputs: [
      { id: 'next', type: HandleTypes.ACTION_OUT, position: 'right', label: '下一个动作' },
      { id: 'nextcheckpoint', type: HandleTypes.FLOW, position: 'right', label: '下一检查点' }
    ]
  }
};

// UnequipAllCosplay 动作 - 脱掉所有服装 (保留)
export const UnequipAllCosplayActionNode = {
  type: 'action_unequipAllCosplay',
  category: NodeCategories.ACTION,
  label: 'UnequipAllCosplay (Legacy)',
  description: '脱掉所有服装部件 - 建议使用ManageCosplay勾选"全部部件"',
  icon: '👔',
  color: '#9E9E9E',
  fields: [],
  handles: {
    inputs: [{ id: 'in', type: HandleTypes.ACTION_IN, position: 'left' }],
    outputs: [
      { id: 'next', type: HandleTypes.ACTION_OUT, position: 'right', label: '下一个动作' },
      { id: 'nextcheckpoint', type: HandleTypes.FLOW, position: 'right', label: '下一检查点' }
    ]
  }
};

// LockHandcuffs 动作 - 锁上手铐 (保留兼容性)
export const LockHandcuffsActionNode = {
  type: 'action_lockHandcuffs',
  category: NodeCategories.ACTION,
  label: 'LockHandcuffs (Legacy)',
  description: '锁上手铐 - 建议使用ManageHandcuffs',
  icon: '🔗',
  color: '#795548',
  fields: [
    { name: 'handcuffstype', label: '手铐类型', type: NodeFieldTypes.SELECT, options: ['KeyHandcuff', 'TimerHandcuff'], default: 'KeyHandcuff' },
    { name: 'attachtoobject', label: '附着到物体', type: NodeFieldTypes.BOOLEAN, default: false },
    { name: 'duration', label: '持续时长', type: NodeFieldTypes.NUMBER, default: 0 }
  ],
  handles: {
    inputs: [{ id: 'in', type: HandleTypes.ACTION_IN, position: 'left' }],
    outputs: [
      { id: 'next', type: HandleTypes.ACTION_OUT, position: 'right', label: '下一个动作' },
      { id: 'nextcheckpoint', type: HandleTypes.FLOW, position: 'right', label: '下一检查点' }
    ]
  }
};

// UnlockHandcuffs 动作 - 解锁手铐 (保留兼容性)
export const UnlockHandcuffsActionNode = {
  type: 'action_unlockHandcuffs',
  category: NodeCategories.ACTION,
  label: 'UnlockHandcuffs (Legacy)',
  description: '解锁手铐 - 建议使用ManageHandcuffs',
  icon: '🔓',
  color: '#8D6E63',
  fields: [],
  handles: {
    inputs: [{ id: 'in', type: HandleTypes.ACTION_IN, position: 'left' }],
    outputs: [
      { id: 'next', type: HandleTypes.ACTION_OUT, position: 'right', label: '下一个动作' },
      { id: 'nextcheckpoint', type: HandleTypes.FLOW, position: 'right', label: '下一检查点' }
    ]
  }
};

// SetPlayerPosition 动作 - 设置玩家位置和旋转
export const SetPlayerPositionActionNode = {
  type: 'action_setPlayerPosition',
  category: NodeCategories.ACTION,
  label: 'SetPlayerPosition',
  description: '设置玩家的位置和旋转',
  icon: '📍',
  color: '#00BCD4',
  fields: [
    { name: 'x', label: 'X坐标', type: NodeFieldTypes.NUMBER, required: true, default: 0 },
    { name: 'y', label: 'Y坐标', type: NodeFieldTypes.NUMBER, required: true, default: 0 },
    { name: 'z', label: 'Z坐标', type: NodeFieldTypes.NUMBER, required: true, default: 0 },
    { name: 'ry', label: 'RotationY', type: NodeFieldTypes.NUMBER, default: 0 },
    { name: 'rw', label: 'RotationW', type: NodeFieldTypes.NUMBER, default: 1 }
  ],
  handles: {
    inputs: [{ id: 'in', type: HandleTypes.ACTION_IN, position: 'left' }],
    outputs: [
      { id: 'next', type: HandleTypes.ACTION_OUT, position: 'right', label: '下一个动作' },
      { id: 'nextcheckpoint', type: HandleTypes.FLOW, position: 'right', label: '下一检查点' }
    ]
  }
};

// 外套状态控制动作节点
export const SetCoatStateActionNode = {
  type: 'action_setCoatState',
  category: NodeCategories.ACTION,
  label: 'SetCoatState',
  description: '设置外套的打开/关闭状态（支持多个状态组合）',
  icon: '🧥',
  color: '#9C27B0',
  fields: [
    { 
      name: 'states', 
      label: '外套状态', 
      type: NodeFieldTypes.ARRAY, 
      required: true,
      default: [],
      placeholder: '点击按钮选择外套状态'
    }
  ],
  handles: {
    inputs: [{ id: 'in', type: HandleTypes.ACTION_IN, position: 'left' }],
    outputs: [
      { id: 'next', type: HandleTypes.ACTION_OUT, position: 'right', label: '下一个动作' },
      { id: 'nextcheckpoint', type: HandleTypes.FLOW, position: 'right', label: '下一检查点' }
    ]
  }
};

// 结束节点
export const EndNode = {
  type: 'end',
  category: NodeCategories.SPECIAL,
  label: '任务结束',
  description: '标记任务流程结束',
  icon: '🏁',
  color: '#F44336',
  fields: [
    { name: 'id', label: '节点ID', type: NodeFieldTypes.TEXT, required: true, default: 'end_1' },
    { name: 'message', label: '结束提示', type: NodeFieldTypes.TEXT, default: '任务完成！' }
  ]
};

// Description文本节点
export const DescriptionNode = {
  type: 'description',
  category: NodeCategories.BASIC,
  label: '描述文本',
  description: '可连接到任何需要描述的节点',
  icon: '📝',
  color: '#9E9E9E',
  fields: [
    { name: 'text', label: '描述内容', type: NodeFieldTypes.TEXTAREA, required: true, default: '' }
  ],
  handles: {
    outputs: [
      { id: 'out', label: '输出', position: 'right', type: 'source', style: { background: '#757575' } }
    ]
  }
};

// 所有节点类型的集合 (仅包含推荐使用的节点)
export const AllNodeTypes = [
  MissionInfoNode,
  TeleportNode,
  ZoneNode,
  CheckpointNode,
  ConditionModuleNode,
  TravelConditionModuleNode,
  DialogueNode,
  ConditionNode,
  DescriptionNode,
  // 动作节点
  ManageCosplayActionNode,
  ManageAdultToyActionNode,
  ManageHandcuffsActionNode,
  SetStageActionNode,
  DropItemActionNode,
  TeleportPlayerActionNode,
  SetPlayerPositionActionNode,
  SetCoatStateActionNode,  // 外套状态控制
  AddItemActionNode,
  SetVibratorActionNode,
  SetPistonActionNode,
  EndNode
];

// 旧节点定义保留用于JSON导入兼容 (不在左侧面板显示)
export const LegacyNodeTypes = [
  EquipCosplayActionNode,
  UnequipCosplayActionNode,
  UnequipAllCosplayActionNode,
  EquipAdultToyActionNode,
  UnequipAdultToyActionNode,
  LockHandcuffsActionNode,
  UnlockHandcuffsActionNode
];

// 按类别分组
export const NodesByCategory = AllNodeTypes.reduce((acc, nodeType) => {
  const category = nodeType.category;
  if (!acc[category]) {
    acc[category] = [];
  }
  acc[category].push(nodeType);
  return acc;
}, {});

// 常用条件表达式
export const CommonConditions = [
  { value: 'Naked', label: '裸体状态' },
  { value: 'HandcuffsBack', label: '背后手铐' },
  { value: 'NPCArea', label: 'NPC区域' },
  { value: 'Day', label: '白天' },
  { value: 'Night', label: '夜晚' },
  { value: 'Outdoor', label: '室外' },
  { value: 'Indoor', label: '室内' }
];

// 场景选项
export const StageOptions = [
  { value: 'Apart', label: '公寓' },
  { value: 'Residence', label: '住宅区' },
  { value: 'Convenience', label: '便利店' },
  { value: 'Hella', label: '繁华街' },
  { value: 'Downtown', label: '市中心' },
  { value: 'Park', label: '公园' },
  { value: 'Mall', label: '购物中心' },
  { value: 'Shop', label: '服装店' }
];
