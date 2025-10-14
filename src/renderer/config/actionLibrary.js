// 动作指令库配置
// 用于提供输入框的智能提示和多选功能

// 服装部件完整列表
export const CosplayParts = [
  // 头部
  { id: 'm_cosplay_general_head_kuchikase', name: '口球', category: '头部' },
  { id: 'm_cosplay_general_head_houtai', name: '绷带/眼罩', category: '头部' },
  
  // 上衣
  { id: 'm_cosplay_sweater_tops', name: '毛衣上衣', category: '上衣' },
  { id: 'm_cosplay_sweater_arm', name: '毛衣袖子', category: '上衣' },
  { id: 'm_cosplay_school_gal_blazer', name: '女学生西装外套', category: '上衣' },
  { id: 'm_cosplay_school_gal_shirt_winter', name: '女学生衬衫(冬)', category: '上衣' },
  { id: 'm_cosplay_school_hoodie_hoodie', name: '连帽衫', category: '上衣' },
  { id: 'm_cosplay_suit_chic_jacket', name: '职业套装外套', category: '上衣' },
  { id: 'm_cosplay_suit_chic_shirt', name: '职业套装衬衫', category: '上衣' },
  { id: 'm_cosplay_succubus_cosplay_tops', name: '魅魔上衣', category: '上衣' },
  { id: 'm_cosplay_general_upper_nip_piasu', name: '乳环', category: '上衣' },
  
  // 下装
  { id: 'm_cosplay_sweater_pants', name: '毛衣裤子', category: '下装' },
  { id: 'm_cosplay_school_gal_skirt', name: '女学生裙子', category: '下装' },
  { id: 'm_cosplay_school_hoodie_skirt', name: '连帽衫裙子', category: '下装' },
  { id: 'm_cosplay_suit_chic_skirt', name: '职业套装裙子', category: '下装' },
  { id: 'm_cosplay_suit_chic_panty', name: '职业套装内裤', category: '下装' },
  { id: 'm_cosplay_succubus_cosplay_skirt', name: '魅魔裙子', category: '下装' },
  { id: 'm_cosplay_succubus_cosplay_pants', name: '魅魔裤子', category: '下装' },
  
  // 腿部/袜子
  { id: 'm_cosplay_school_gal_sockes', name: '女学生袜子', category: '腿部' },
  { id: 'm_cosplay_suit_chic_stocking', name: '职业丝袜', category: '腿部' },
  { id: 'm_cosplay_general_leg_stocking_nieso', name: '过膝袜', category: '腿部' },
  
  // 鞋子
  { id: 'm_cosplay_sister_shoes', name: '修女鞋', category: '鞋子' },
  { id: 'm_cosplay_suit_chic_shoes', name: '职业高跟鞋', category: '鞋子' },
  { id: 'm_cosplay_general_leg_high_heel_boots', name: '高跟靴', category: '鞋子' },
  { id: 'm_cosplay_glossy_boots', name: '光泽靴', category: '鞋子' },
  
  // 饰品
  { id: 'm_cosplay_school_gal_earing', name: '女学生耳环', category: '饰品' },
  { id: 'm_cosplay_school_gal_necklace', name: '女学生项链', category: '饰品' },
  { id: 'm_cosplay_school_gal_bracelet', name: '女学生手镯', category: '饰品' },
  { id: 'm_cosplay_school_gal_ribbon', name: '女学生蝴蝶结', category: '饰品' },
  { id: 'm_cosplay_school_gal_bag', name: '女学生书包', category: '饰品' },
  
  // 特殊
  { id: 'm_cosplay_succubus_cosplay_wing', name: '魅魔翅膀', category: '特殊' },
  { id: 'm_cosplay_succubus_cosplay_tail', name: '魅魔尾巴', category: '特殊' },
  { id: 'm_cosplay_general_genital_beads', name: '阴道珠', category: '特殊' },
  
  // 特殊状态
  { id: 'Naked', name: '裸体', category: '状态', exclusive: true },
  { id: 'Coat', name: '外套', category: '物品' }
];

// 成人玩具部件列表
export const AdultToyParts = [
  { id: 'Vibrator', name: '跳蛋', category: '振动类' },
  { id: 'TitRotor', name: '乳头震动器', category: '振动类' },
  { id: 'KuriRotor', name: '阴蒂震动器', category: '振动类' },
  { id: 'PistonAnal', name: '肛门活塞', category: '活塞类' },
  { id: 'PistonPussy', name: '阴道活塞', category: '活塞类' },
  { id: 'EyeMask', name: '眼罩', category: '束缚类' }
];

// 物品类型列表
export const ItemTypes = [
  { id: 'Coat', name: '外套', category: '衣物' },
  { id: 'VibeRemocon', name: '震动器遥控器', category: '成人玩具' },
  { id: 'HandcuffKey', name: '手铐钥匙', category: '束缚工具' },
  { id: 'DildoFloor', name: '地板假阳具', category: '成人玩具' }
];

// 场景列表
export const Stages = [
  { id: 'Apart', name: '公寓', daytimeSupport: true },
  { id: 'Residence', name: '住宅区', daytimeSupport: true },
  { id: 'Convenience', name: '便利店', daytimeSupport: true },
  { id: 'Hella', name: '繁华街', daytimeSupport: true },
  { id: 'Downtown', name: '市中心', daytimeSupport: false },
  { id: 'Park', name: '公园', daytimeSupport: true },
  { id: 'Mall', name: '购物中心', daytimeSupport: false },
  { id: 'Shop', name: '服装店', daytimeSupport: false },
  { id: 'FashionShop', name: '时装店', daytimeSupport: true },
  { id: 'ShoppingMall', name: '商场', daytimeSupport: false },
  { id: 'Mansion', name: '豪宅', daytimeSupport: true },
  { id: 'StationFront', name: '车站前', daytimeSupport: true }
];

// 强度等级
export const IntensityLevels = [
  { id: 'Off', name: '关闭', color: '#999999' },
  { id: 'Low', name: '低强度', color: '#4CAF50' },
  { id: 'Medium', name: '中强度', color: '#FF9800' },
  { id: 'High', name: '高强度', color: '#F44336' },
  { id: 'Random', name: '随机', color: '#9C27B0' }
];

// 手铐类型
export const HandcuffTypes = [
  { id: 'KeyHandcuff', name: '钥匙手铐', requiresKey: true },
  { id: 'TimeHandcuff', name: '定时手铐', requiresKey: false }
];

// 条件表达式库
export const ConditionExpressions = [
  // ===== 状态类 =====
  { id: 'Naked', name: '裸体状态', category: '状态', conflictsWith: ['Clothed'] },
  { id: 'Clothed', name: '穿衣状态', category: '状态', conflictsWith: ['Naked'] },
  { id: 'Orgasm', name: '高潮状态', category: '状态' },
  { id: 'Peeing', name: '排尿状态', category: '状态' },
  { id: 'Sitting', name: '坐下状态', category: '状态' },
  { id: 'Crouching', name: '蹲下状态', category: '状态' },
  { id: 'Dashing', name: '奔跑状态', category: '状态' },
  { id: 'Watched', name: '被观察状态', category: '状态' },
  { id: 'ShowingOff', name: '炫耀状态', category: '状态' },
  { id: 'Blindfolded', name: '蒙眼状态', category: '状态' },
  { id: 'Futanari', name: '扶她状态', category: '状态' },
  { id: 'Bodypaint', name: '人体彩绘', category: '状态' },
  { id: 'Invisible', name: '隐形状态', category: '状态' },
  
  // ===== 束缚类 =====
  { id: 'HandcuffsBack', name: '背后手铐', category: '束缚' },
  { id: 'HandcuffsFront', name: '前方手铐', category: '束缚' },
  { id: 'HandcuffsObject', name: '手铐物体', category: '束缚' },
  { id: 'NoHandcuffs', name: '无手铐', category: '束缚' },
  { id: 'TimedHandcuffs', name: '计时手铐', category: '束缚' },
  { id: 'KeyedHandcuffs', name: '钥匙手铐', category: '束缚' },
  { id: 'NormalHandcuffs', name: '普通手铐', category: '束缚' },
  
  // ===== 时间类 =====
  { id: 'Day', name: '白天', category: '时间', conflictsWith: ['Night'] },
  { id: 'Night', name: '夜晚', category: '时间', conflictsWith: ['Day'] },
  { id: 'IsDayTime', name: '白天时间', category: '时间' },
  { id: 'isDayTime', name: '白天时间(小写)', category: '时间' },
  
  // ===== 位置类 =====
  { id: 'Outdoor', name: '室外', category: '位置', conflictsWith: ['Indoor'] },
  { id: 'Indoor', name: '室内', category: '位置', conflictsWith: ['Outdoor'] },
  { id: 'NPCArea', name: 'NPC区域', category: '位置' },
  { id: 'NearNPC', name: '靠近NPC', category: '位置' },
  { id: 'InLight', name: '在灯光下', category: '位置' },
  { id: 'InOpenToilet', name: '在开放厕所', category: '位置' },
  
  // ===== 摄像机类 =====
  { id: 'FPCamera', name: '第一人称摄像机', category: '摄像机' },
  
  // ===== 曝露类 =====
  { id: 'Exposed_All', name: '全部曝露', category: '曝露' },
  { id: 'Exposed_Front', name: '前方曝露', category: '曝露' },
  { id: 'Exposed_Hip', name: '臀部曝露', category: '曝露' },
  
  // ===== 振动器强度 =====
  { id: 'VibrationOff', name: '振动器关闭', category: '振动器' },
  { id: 'VibrationLow', name: '振动器低强度', category: '振动器' },
  { id: 'VibrationHigh', name: '振动器高强度', category: '振动器' },
  { id: 'VibrationRandom', name: '振动器随机', category: '振动器' },
  
  // ===== 活塞强度 =====
  { id: 'PistonOff', name: '活塞关闭', category: '活塞' },
  { id: 'PistonMedium', name: '活塞中强度', category: '活塞' },
  { id: 'PistonHigh', name: '活塞高强度', category: '活塞' },
  
  // ===== 兴奋度/陶醉度条件 =====
  { id: 'Ecstasy==0', name: '陶醉度等于0', category: '陶醉度' },
  { id: 'Ecstasy==1', name: '陶醉度等于1', category: '陶醉度' },
  { id: 'Ecstasy!=1', name: '陶醉度不等于1', category: '陶醉度' },
  { id: 'Ecstasy<0.2', name: '陶醉度小于0.2', category: '陶醉度' },
  { id: 'Ecstasy<0.3', name: '陶醉度小于0.3', category: '陶醉度' },
  { id: 'Ecstasy<0.5', name: '陶醉度小于0.5', category: '陶醉度' },
  { id: 'Ecstasy<0.7', name: '陶醉度小于0.7', category: '陶醉度' },
  { id: 'Ecstasy<0.95', name: '陶醉度小于0.95', category: '陶醉度' },
  
  // ===== 侦测度条件 =====
  { id: 'Detection>=0', name: '侦测度大于等于0', category: '侦测度' },
  { id: 'Detection>0.85', name: '侦测度大于0.85', category: '侦测度' },
  
  // ===== 等级条件 =====
  { id: 'Rank>6', name: '等级大于6', category: '等级' },
  { id: 'Rank==7', name: '等级等于7', category: '等级' },
  
  // ===== 任务完成条件 =====
  { id: 'MissionCurrCompleted_100018', name: '任务100018已完成', category: '任务' },
  { id: 'MissionCurrCompleted_60014', name: '任务60014已完成', category: '任务' },
  
  // ===== 拥有物品条件 =====
  { id: 'OwnsAdultToy_Vibrator', name: '拥有振动器', category: '拥有玩具' },
  { id: 'OwnsAdultToy_TitRotor', name: '拥有乳夹', category: '拥有玩具' },
  { id: 'OwnsAdultToy_KuriRotor', name: '拥有阴蒂夹', category: '拥有玩具' },
  { id: 'OwnsAdultToy_EyeMask', name: '拥有眼罩', category: '拥有玩具' },
  { id: 'OwnsAdultToy_TimerHandcuff', name: '拥有计时手铐', category: '拥有玩具' },
  { id: 'OwnsAdultToy_KeyHandcuff', name: '拥有钥匙手铐', category: '拥有玩具' },
  
  // 拥有服装
  { id: 'OwnsCosplay_m_cosplay_general_upper_sling_shot', name: '拥有吊带装', category: '拥有服装' },
  { id: 'OwnsCosplay_m_cosplay_general_upper_condom', name: '拥有避孕套装', category: '拥有服装' },
  { id: 'OwnsCosplay_m_cosplay_general_upper_race_pants', name: '拥有竞赛短裤', category: '拥有服装' },
  { id: 'OwnsCosplay_m_cosplay_general_leg_stocking', name: '拥有丝袜', category: '拥有服装' },
  { id: 'OwnsCosplay_m_cosplay_general_genital_tail_plug', name: '拥有尾巴塞', category: '拥有服装' },
  { id: 'OwnsCosplay_m_cosplay_kemono_hand', name: '拥有兽耳手套', category: '拥有服装' },
  { id: 'OwnsCosplay_m_cosplay_kemono_foot', name: '拥有兽耳鞋子', category: '拥有服装' },
  { id: 'OwnsCosplay_m_cosplay_suit_luxe_tops', name: '拥有奢华西装上衣', category: '拥有服装' },
  { id: 'OwnsCosplay_m_cosplay_suit_luxe_pants', name: '拥有奢华西装裤', category: '拥有服装' },
  { id: 'OwnsCosplay_m_cosplay_suit_luxe_chorker', name: '拥有奢华项圈', category: '拥有服装' },
  { id: 'OwnsCosplay_m_cosplay_suit_luxe_shoes', name: '拥有奢华高跟鞋', category: '拥有服装' },
  { id: 'OwnsCosplay_m_cosplay_succubus_cosplay_tops', name: '拥有魅魔上衣', category: '拥有服装' },
  { id: 'OwnsCosplay_m_cosplay_succubus_cosplay_pants', name: '拥有魅魔下装', category: '拥有服装' },
  
  // ===== 技能类 (以Skill_开头) =====
  { id: 'Skill_AutoSlow', name: '自动慢动作', category: '技能' },
  { id: 'Skill_Perspective', name: '透视', category: '技能' },
  { id: 'Skill_DisableHideCostume', name: '随处穿私服', category: '技能' },
  { id: 'Skill_TimeStop', name: '时间停止', category: '技能' },
  { id: 'Skill_Exhibitionism', name: '想被看见欲望', category: '技能' },
  { id: 'Skill_Sex', name: '诱惑', category: '技能' },
  { id: 'Skill_NoReinforceEffect', name: '装备与强化效果无效', category: '技能' },
  { id: 'Skill_NpcDirect', name: 'NPC指令', category: '技能' },
  { id: 'Skill_FixFps', name: '固定FPS', category: '技能' },
  { id: 'Skill_HideStrangeUi', name: '隐藏奇怪UI', category: '技能' },
  { id: 'Skill_ContinueMission', name: '继续任务', category: '技能' },
  
  // ===== 动作条件 (以Action_开头) =====
  { id: 'Action_None', name: '无动作', category: '动作' },
  { id: 'Action_OnaniNormal', name: '普通自慰', category: '动作' },
  { id: 'Action_OnaniArmKuri', name: '手臂栗自慰', category: '动作' },
  { id: 'Action_OnaniYotuashi', name: '四肢自慰', category: '动作' },
  { id: 'Action_OnaniNeGanimata', name: '躺地自慰', category: '动作' },
  { id: 'Action_OnaniSikoru', name: '抖动自慰', category: '动作' },
  { id: 'Action_MituasiOnani', name: '蜜穴自慰', category: '动作' },
  { id: 'Action_PeeStand', name: '站立排尿', category: '动作' },
  { id: 'Action_PeeKaikyaku', name: '开脚排尿', category: '动作' },
  { id: 'Action_PeeDog', name: '狗姿排尿', category: '动作' },
  { id: 'Action_SitDildo', name: '坐假阳具', category: '动作' },
  { id: 'Action_SitDildoPut', name: '放置坐假阳具', category: '动作' },
  { id: 'Action_PutDildoFloor', name: '放置地面假阳具', category: '动作' },
  { id: 'Action_PutDildoWall', name: '放置墙壁假阳具', category: '动作' },
  { id: 'Action_UseDildoFloorPussy1', name: '使用地面假阳具(阴道)', category: '动作' },
  { id: 'Action_UseDildoFloorAnal1', name: '使用地面假阳具(肛门)', category: '动作' },
  { id: 'Action_UseDildoWallPussy1', name: '使用墙壁假阳具(阴道)', category: '动作' },
  { id: 'Action_UseDildoWallAnal1', name: '使用墙壁假阳具(肛门)', category: '动作' },
  { id: 'Action_UseDildoWallFella1', name: '使用墙壁假阳具(口交)', category: '动作' },
  { id: 'Action_UseBuyMachine', name: '使用自动售货机', category: '动作' },
  { id: 'Action_DrinkWater', name: '喝水', category: '动作' },
  { id: 'Action_HipShake', name: '摇晃臀部', category: '动作' },
  { id: 'Action_IBalance', name: '平衡姿势', category: '动作' },
  { id: 'Action_Dogeza', name: '土下座', category: '动作' },
  { id: 'Action_DogTintin', name: '丁丁姿势', category: '动作' },
  { id: 'Action_HandcuffsAtMap', name: '地图手铐', category: '动作' },
  { id: 'Action_AttachHandcuffs', name: '戴上手铐', category: '动作' },
  { id: 'Action_PickUpItem', name: '捡起物品', category: '动作' },
  { id: 'Action_PickDildo', name: '捡起假阳具', category: '动作' },
  { id: 'Action_SitDown', name: '坐下', category: '动作' },
  { id: 'Action_DroppingClothes', name: '脱衣服', category: '动作' },
  { id: 'Action_GanimataWalk', name: '张腿走', category: '动作' },
  { id: 'Action_GanimataHip', name: '张腿摇臀', category: '动作' },
  { id: 'Action_GanimataKoshiHeko', name: '张腿腰后', category: '动作' },
  { id: 'Action_AhegaoDoublePiece', name: '阿黑颜双片', category: '动作' },
  { id: 'Action_KaikyakuFella', name: '开脚口交', category: '动作' },
  { id: 'Action_WakimiseCrouch', name: '腋见蹲', category: '动作' },
  { id: 'Action_ConbiniTakeGoods', name: '便利店拿货', category: '动作' },
  { id: 'Action_ChikubiRotate', name: '旋转乳头', category: '动作' },
  { id: 'Action_HandOver', name: '交出', category: '动作' },
  { id: 'Action_IntoWasher', name: '进入洗衣机', category: '动作' },
  { id: 'Action_Pinpon', name: '按门铃', category: '动作' },
  { id: 'Action_Tebura', name: '手无寸铁', category: '动作' },
  
  // ===== 物品条件 (以Item_开头) =====
  { id: 'Item_Water', name: '水', category: '物品' },
  { id: 'Item_Dildo', name: '假阳具', category: '物品' },
  { id: 'Item_Dildo>0', name: '假阳具数量>0', category: '物品' },
  { id: 'Item_Dildo>5', name: '假阳具数量>5', category: '物品' },
  { id: 'Item_HandcuffKey', name: '手铐钥匙', category: '物品' },
  { id: 'Item_VibeRemocon', name: '振动器遥控', category: '物品' },
  { id: 'Item_VibeRemocon==0', name: '振动器遥控数量为0', category: '物品' },
];

// 外套状态列表（用于外套控制动作）
export const CoatStates = [
  // 可组合状态
  { id: 'FrontOpen1', name: '前面微开', category: '前面', group: 'front' },
  { id: 'FrontOpen2', name: '前面全开', category: '前面', group: 'front' },
  { id: 'BackOpen', name: '后面打开', category: '后面', group: 'back' },
  { id: 'FrontClosed', name: '前面关闭', category: '前面', group: 'front' },
  { id: 'BackClosed', name: '后面关闭', category: '后面', group: 'back' },
  // 快捷状态（与所有其他状态互斥）
  { id: 'AllOpen', name: '全部打开', category: '快捷', exclusive: true, group: 'all' },
  { id: 'AllClosed', name: '全部关闭', category: '快捷', exclusive: true, group: 'all' }
];

// 检查点选择器类型
export const CheckpointSelectorTypes = [
  { id: 'NextIndex', name: '下一个检查点(按索引)', description: '跳转到数组中的下一个检查点' },
  { id: 'SpecificId', name: '指定ID检查点', description: '跳转到特定ID的检查点', requiresId: true },
  { id: 'Random', name: '随机检查点', description: '随机选择一个检查点' }
];

// 指令互斥规则
export const ActionConflictRules = {
  // Naked状态与所有服装互斥
  cosplayConflicts: {
    'Naked': CosplayParts.filter(p => p.category !== '状态' && p.category !== '物品').map(p => p.id)
  },
  
  // 振动器设置与活塞设置可以共存
  intensityConflicts: {
    // 同一类型的不同强度互斥
    'setVibrator': ['setVibrator'], // 自身互斥,不能同时设置两个不同的振动强度
    'setPiston': ['setPiston']
  },
  
  // 穿戴类动作互斥
  equipConflicts: {
    'equipCosplay': ['unequipCosplay', 'unequipAllCosplay'],
    'unequipCosplay': ['equipCosplay'],
    'unequipAllCosplay': ['equipCosplay', 'unequipCosplay'],
    'equipAdultToy': ['unequipAdultToy'],
    'unequipAdultToy': ['equipAdultToy']
  }
};

// 字段类型与指令库的映射关系
export const FieldLibraryMapping = {
  // 服装部件字段
  'parts_cosplay': {
    library: CosplayParts,
    supportsAll: true,
    allKeyword: 'unequipAllCosplay',
    multiSelect: true,
    searchable: true
  },
  
  // 成人玩具部件字段
  'parts_adulttoy': {
    library: AdultToyParts,
    supportsAll: false,
    multiSelect: true,
    searchable: true
  },
  
  // 物品类型字段
  'itemtype': {
    library: ItemTypes,
    multiSelect: true,  // 修改为支持多选，用于itemconditions
    searchable: true
  },
  
  // 场景字段
  'stage': {
    library: Stages,
    multiSelect: false,
    searchable: true
  },
  
  // 强度等级字段
  'level': {
    library: IntensityLevels,
    multiSelect: false,
    searchable: false
  },
  
  // 手铐类型字段
  'handcuffstype': {
    library: HandcuffTypes,
    multiSelect: false,
    searchable: false
  },
  
  // 外套状态字段
  'states_coat': {
    library: CoatStates,
    supportsAll: false,
    multiSelect: true,
    searchable: false,
    conflictDetection: true  // 启用冲突检测
  },
  
  // 条件表达式字段
  'condition': {
    library: ConditionExpressions,
    multiSelect: true,
    searchable: true,
    conflictDetection: true
  },
  
  // 条件表达式字段（完整版 - 包含所有可选项，用于 checkpoint_condition 和 checkpoint_travelcondition）
  'condition_full': {
    library: [
      ...ConditionExpressions,  // 所有条件表达式
      ...CosplayParts.filter(p => p.category !== '状态' && p.category !== '物品'),  // 所有服装部件
      ...AdultToyParts,  // 所有玩具
      ...CoatStates  // 所有外套状态
    ],
    multiSelect: true,
    searchable: true,
    conflictDetection: false  // 不检测冲突，因为这是条件检查不是设置
  },
  
  // 外套状态字段
  'states_coat': {
    library: CoatStates,
    multiSelect: true,
    searchable: false,
    conflictDetection: true
  },
  
  // 检查点选择器类型
  'selectortype': {
    library: CheckpointSelectorTypes,
    multiSelect: false,
    searchable: false
  }
};

// 工具函数: 检测冲突
export function detectConflicts(selectedItems, library) {
  const conflicts = [];
  
  for (let i = 0; i < selectedItems.length; i++) {
    const item1 = library.find(lib => lib.id === selectedItems[i]);
    if (!item1 || !item1.conflictsWith) continue;
    
    for (let j = i + 1; j < selectedItems.length; j++) {
      if (item1.conflictsWith.includes(selectedItems[j])) {
        conflicts.push({
          item1: selectedItems[i],
          item2: selectedItems[j],
          reason: `${item1.name} 与 ${library.find(l => l.id === selectedItems[j])?.name} 互斥`
        });
      }
    }
  }
  
  return conflicts;
}

// 工具函数: 检测外套状态冲突
export function detectCoatStateConflicts(selectedStates) {
  const conflicts = [];
  const hasAllOpen = selectedStates.includes('AllOpen');
  const hasAllClosed = selectedStates.includes('AllClosed');
  const hasFrontOpen1 = selectedStates.includes('FrontOpen1');
  const hasFrontOpen2 = selectedStates.includes('FrontOpen2');
  const hasFrontClosed = selectedStates.includes('FrontClosed');
  const hasBackOpen = selectedStates.includes('BackOpen');
  const hasBackClosed = selectedStates.includes('BackClosed');
  
  // AllOpen 与 AllClosed 互斥
  if (hasAllOpen && hasAllClosed) {
    conflicts.push({
      items: ['AllOpen', 'AllClosed'],
      reason: '全部打开 和 全部关闭 不能同时选择'
    });
  }
  
  // AllOpen 与其他状态互斥
  if (hasAllOpen && (hasFrontOpen1 || hasFrontOpen2 || hasFrontClosed || hasBackOpen || hasBackClosed)) {
    conflicts.push({
      items: ['AllOpen', ...selectedStates.filter(s => s !== 'AllOpen')],
      reason: '全部打开 不能与其他状态组合（它等于 FrontOpen2 + BackOpen）'
    });
  }
  
  // AllClosed 与其他状态互斥
  if (hasAllClosed && (hasFrontOpen1 || hasFrontOpen2 || hasFrontClosed || hasBackOpen || hasBackClosed)) {
    conflicts.push({
      items: ['AllClosed', ...selectedStates.filter(s => s !== 'AllClosed')],
      reason: '全部关闭 不能与其他状态组合（它等于 FrontClosed + BackClosed）'
    });
  }
  
  // 前面状态冲突检测：FrontOpen1/FrontOpen2 与 FrontClosed 互斥
  const frontOpenStates = [hasFrontOpen1 && 'FrontOpen1', hasFrontOpen2 && 'FrontOpen2'].filter(Boolean);
  if (frontOpenStates.length > 0 && hasFrontClosed) {
    conflicts.push({
      items: [...frontOpenStates, 'FrontClosed'],
      reason: '前面打开状态 和 前面关闭 不能同时选择'
    });
  }
  
  // 后面状态冲突检测：BackOpen 与 BackClosed 互斥
  if (hasBackOpen && hasBackClosed) {
    conflicts.push({
      items: ['BackOpen', 'BackClosed'],
      reason: '后面打开 和 后面关闭 不能同时选择'
    });
  }
  
  return conflicts;
}

// 工具函数: 按分类分组
export function groupByCategory(items) {
  return items.reduce((acc, item) => {
    const category = item.category || '其他';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});
}

// 工具函数: 搜索过滤
export function filterItems(items, searchTerm) {
  if (!searchTerm) return items;
  
  const lowerSearch = searchTerm.toLowerCase();
  return items.filter(item => 
    item.id.toLowerCase().includes(lowerSearch) ||
    item.name.toLowerCase().includes(lowerSearch) ||
    (item.category && item.category.toLowerCase().includes(lowerSearch))
  );
}
