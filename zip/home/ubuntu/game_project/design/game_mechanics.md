# 四季萌宠消消乐 - 游戏机制详细设计

## 1. 消除系统详细设计

### 基础消除机制
- **基本操作**：滑动交换相邻元素，形成三个或以上相同元素的连线进行消除
- **消除方向**：支持横向和纵向消除，不支持斜向消除
- **连锁反应**：一次消除后，上方元素下落可能触发新的消除，形成连锁反应
- **得分计算**：基础消除3分，连锁反应额外加分，连锁越多加分越高

### 特殊元素与道具
1. **行消除道具**（连接4个相同元素横向）
   - 外观：带有横向箭头的元素
   - 效果：消除整行元素
   - 触发方式：点击或与其他元素交换

2. **列消除道具**（连接4个相同元素纵向）
   - 外观：带有纵向箭头的元素
   - 效果：消除整列元素
   - 触发方式：点击或与其他元素交换

3. **爆炸道具**（连接5个相同元素）
   - 外观：带有闪光效果的元素
   - 效果：消除周围3×3范围内的所有元素
   - 触发方式：点击或与其他元素交换

4. **彩虹道具**（T或L形状连接）
   - 外观：彩色旋转的元素
   - 效果：消除场上所有与交换元素相同的元素
   - 触发方式：与任意元素交换

5. **季节特效道具**（特殊组合触发）
   - 春季花朵：生成随机3个强力道具
   - 夏季冰淇淋：冻结倒计时5步
   - 秋季丰收篮：随机增加5个目标元素的收集数
   - 冬季礼物盒：随机给予一种道具

### 特殊组合效果
1. **两个行/列消除道具组合**
   - 效果：十字消除，清除整行和整列
   
2. **爆炸道具+行/列消除道具**
   - 效果：增强型行/列消除，清除2行或2列

3. **彩虹道具+任意特殊道具**
   - 效果：将场上所有普通元素变为该特殊道具

4. **季节道具+任意道具**
   - 效果：触发季节特效的增强版本

### 障碍物系统
1. **基础障碍物**
   - 冰块：需要在旁边消除元素才能破坏
   - 石块：需要在旁边消除2次元素才能破坏
   - 藤蔓：覆盖在元素上，需要消除该元素才能清除

2. **季节特色障碍物**
   - 春季：花盆（需要特定元素才能消除）
   - 夏季：沙堡（随着步数减少逐渐坍塌）
   - 秋季：落叶堆（可以移动但不能消除）
   - 冬季：雪人（需要特定组合才能消除）

## 2. 合成系统详细设计

### 基础合成机制
- **合成操作**：在庄园界面中，拖拽两个相同元素进行合成
- **合成等级**：每种元素有5个等级，相同等级的两个元素合成为高一级元素
- **合成树**：每个季节有独立的合成树，展示元素升级路径

### 季节元素合成路径
1. **春季元素**
   - 基础：小花苞 → 盛开花朵 → 花束 → 花园 → 春日花海
   - 特殊：收集特定组合花朵可合成稀有花种

2. **夏季元素**
   - 基础：小水滴 → 水洼 → 小溪 → 湖泊 → 夏日海洋
   - 特殊：不同水域元素可合成特殊水生物

3. **秋季元素**
   - 基础：种子 → 果实 → 果篮 → 果园 → 秋日丰收
   - 特殊：不同果实可合成特殊美食

4. **冬季元素**
   - 基础：雪花 → 雪球 → 雪人 → 冰屋 → 冬日雪国
   - 特殊：不同雪元素可合成特殊冰雕

### 稀有元素合成
- **跨季节合成**：不同季节的高级元素可以合成稀有元素
- **限时元素**：活动期间限定的特殊元素，合成后有独特效果
- **合成概率**：部分高级合成有随机成功率，可通过道具提升

### 合成奖励系统
- **首次合成奖励**：首次合成新元素获得额外奖励
- **合成任务**：完成特定合成任务获得稀有资源
- **合成图鉴**：记录所有已合成元素，集齐特定系列获得奖励

## 3. 庄园系统详细设计

### 庄园布局
- **基础区域**：主屋区、花园区、萌宠区、装饰区
- **扩展区域**：通过等级解锁，最多可扩展到4倍初始面积
- **季节切换**：可随时切换庄园的季节主题，影响视觉效果和可用建筑

### 建筑系统
1. **主题建筑**（提供功能）
   - 主屋：玩家基地，可升级增加功能
   - 工坊：进行元素合成的场所
   - 萌宠屋：培养和管理萌宠
   - 仓库：存储资源和元素

2. **功能建筑**（提供buff）
   - 许愿池：提高稀有元素合成概率
   - 时钟塔：减少等待时间
   - 市场：解锁交易功能
   - 活动中心：解锁特殊活动

3. **装饰建筑**（提高庄园评分）
   - 季节性装饰：提高对应季节评分
   - 主题套装：集齐套装获得额外加成
   - 限定装饰：活动或节日限定

### 庄园等级系统
- **评分计算**：基于建筑数量、稀有度、搭配和美观度
- **等级提升**：评分达到阈值自动提升等级
- **等级奖励**：每提升一级获得资源和解锁新内容
- **庄园比赛**：定期举行庄园设计比赛，获胜者获得稀有奖励

## 4. 萌宠系统详细设计

### 萌宠获取
- **关卡奖励**：完成特定关卡获得基础萌宠
- **合成获得**：特定元素组合可以吸引稀有萌宠
- **活动限定**：特殊活动期间限定获取的萌宠
- **抽奖系统**：使用特殊代币参与萌宠抽奖

### 萌宠属性
- **亲密度**：影响萌宠技能效果，通过互动提升
- **等级**：影响萌宠基础能力，通过喂养提升
- **技能**：每个萌宠有1-3个独特技能
- **心情**：影响萌宠产出，需要定期互动维持

### 萌宠技能（消除关卡中使用）
1. **春季萌宠**
   - 小兔子：随机生成3个胡萝卜元素
   - 小鹿：交换任意两个元素位置
   - 花仙子：将选定区域的元素变为同一种类

2. **夏季萌宠**
   - 海豚：清除底部一行元素
   - 螃蟹：横向移动一行元素
   - 海星：生成一个随机特殊道具

3. **秋季萌宠**
   - 松鼠：收集场上5个指定元素
   - 小狐狸：消除所有角落元素
   - 小熊：生成一个爆炸道具

4. **冬季萌宠**
   - 北极熊：冻结倒计时5步
   - 企鹅：滑动清除一条直线上的所有元素
   - 雪狐：将一种元素全部变为另一种元素

### 萌宠互动系统
- **喂养**：使用食物提升萌宠等级
- **玩耍**：小游戏互动提升亲密度
- **装扮**：为萌宠更换装饰提高属性
- **任务**：完成萌宠指定的任务获得奖励

## 5. 关卡系统详细设计

### 关卡类型
1. **目标型关卡**
   - 收集特定数量的指定元素
   - 清除特定数量的障碍物
   - 将特定元素移动到指定位置

2. **分数型关卡**
   - 在限定步数内达到目标分数
   - 三星评级系统，根据最终分数评定

3. **时间型关卡**
   - 在限定时间内完成特定目标
   - 连续消除可以获得额外时间

4. **特殊关卡**
   - Boss关卡：对抗特殊机制的挑战
   - 解谜关卡：需要特定消除顺序
   - 季节特色关卡：使用季节特有机制

### 难度曲线设计
- **入门阶段**（1-10关）：简单目标，充分教学，高成功率
- **进阶阶段**（11-30关）：引入新机制，适中难度
- **挑战阶段**（31-60关）：复杂目标组合，需要策略思考
- **大师阶段**（61+关）：高难度挑战，需要熟练运用所有机制

### 关卡奖励系统
- **首次通关奖励**：金币、钻石和特殊物品
- **三星奖励**：额外资源和稀有物品
- **成就奖励**：完成特定关卡系列获得成就和奖励
- **每日挑战奖励**：完成每日关卡获得限定奖励

## 6. 社交系统详细设计

### 好友系统
- **添加方式**：ID搜索、平台好友导入、二维码添加
- **好友上限**：初始50人，可通过等级提升
- **好友互动**：赠送体力、参观庄园、协助建设

### 礼物系统
- **日常礼物**：每日可向好友赠送的免费礼物
- **特殊礼物**：使用钻石购买的高级礼物
- **节日礼物**：节日期间限定的特殊礼物
- **礼物回馈**：赠送礼物也能获得少量奖励

### 协作挑战
- **团队关卡**：需要多人协作完成的特殊关卡
- **公会系统**：创建或加入公会，参与公会活动
- **协作建设**：帮助好友加速建筑建造
- **资源共享**：公会成员间的资源交换系统

### 社区功能
- **庄园展示**：分享自己的庄园设计
- **攻略分享**：分享关卡通关技巧
- **成就炫耀**：展示个人游戏成就
- **活动投票**：参与社区活动投票

## 7. 商业化系统详细设计

### 虚拟货币
1. **金币**（软货币）
   - 获取方式：关卡通关、日常任务、庄园收益
   - 用途：购买普通道具、基础建筑、普通萌宠食物

2. **钻石**（硬货币）
   - 获取方式：成就奖励、活动奖励、充值
   - 用途：购买高级道具、稀有建筑、加速建造

3. **季节代币**（活动货币）
   - 获取方式：季节活动、特殊任务
   - 用途：兑换季节限定物品

### 内购商品
1. **资源包**
   - 小额金币包：¥6（600金币）
   - 中额金币包：¥30（3500金币）
   - 大额金币包：¥98（12000金币）
   - 钻石包：¥6/30/98/198/328（不同数量钻石）

2. **特权服务**
   - 月卡：¥30（每日领取100钻石，30天）
   - 季卡：¥68（每日领取120钻石，90天）
   - VIP服务：¥98起（永久特权，分级提升）

3. **限定套装**
   - 节日套装：¥68-198（节日限定装饰和萌宠）
   - 主题套装：¥98-298（特殊主题的庄园套装）
   - 萌宠礼包：¥68-168（稀有萌宠及相关道具）

### 广告系统
1. **激励广告**
   - 额外体力：观看广告获得5点体力
   - 双倍奖励：观看广告获得双倍关卡奖励
   - 免费抽奖：观看广告获得一次免费抽奖机会

2. **广告位置**
   - 关卡结束页面：通关后可选择观看
   - 体力耗尽页面：体力不足时推荐观看
   - 每日礼包：每日可观看限定次数广告获取奖励

3. **广告奖励策略**
   - 首日高奖励：新用户广告奖励更丰厚
   - 连续观看递增：连续观看广告奖励递增
   - 限时双倍：特定时段观看广告奖励翻倍

## 8. 活动系统详细设计

### 常规活动
1. **每日签到**
   - 奖励：金币、体力、道具
   - 连续签到额外奖励
   - 月度签到礼包

2. **每周挑战**
   - 特殊关卡系列，每周更新
   - 阶段性奖励和最终大奖
   - 排行榜竞争

3. **月度庄园大赛**
   - 提交庄园设计参赛
   - 玩家投票和系统评分
   - 获胜者获得限定装饰和大量资源

### 节日活动
1. **春节活动**
   - 主题：红包、灯笼、福字等中国传统元素
   - 特色：集福字、抢红包、新春庄园装饰

2. **中秋活动**
   - 主题：月饼、玉兔、月亮等
   - 特色：制作月饼、赏月活动、月兔萌宠

3. **圣诞活动**
   - 主题：圣诞树、礼物、雪人等
   - 特色：圣诞倒计时、礼物交换、圣诞老人萌宠

### 限时活动
1. **新萌宠发布**
   - 限时获取新萌宠的机会
   - 萌宠相关任务和挑战
   - 萌宠专属道具和装饰

2. **神秘季节**
   - 限时开放的特殊第五季
   - 独特元素和合成路径
   - 稀有建筑和装饰

3. **合作IP活动**
   - 与其他IP合作的联名活动
   - 联名角色和装饰
   - 特殊玩法和关卡

## 9. 技术实现细节

### 前端实现
- **游戏引擎**：使用Phaser.js或Cocos Creator
- **UI框架**：React组件管理界面
- **动画系统**：GSAP或Lottie处理复杂动画
- **资源加载**：分包加载，优化首次启动时间

### 后端实现
- **服务架构**：微服务架构，分离核心功能
- **数据存储**：用户数据、游戏进度、社交关系
- **实时系统**：WebSocket实现实时社交功能
- **安全机制**：防作弊系统，数据加密

### 平台适配
1. **抖音小游戏**
   - 接入抖音登录和支付API
   - 适配抖音分享和互动功能
   - 优化抖音平台性能表现

2. **微信小游戏**
   - 接入微信登录和支付API
   - 适配微信好友互动和群分享
   - 优化微信平台包体积限制

### 数据分析
- **用户行为分析**：关卡通过率、停留时间、付费转化
- **平衡性分析**：难度曲线、资源经济、道具使用
- **留存分析**：新用户留存、活跃用户变化、流失原因
- **AB测试系统**：新功能测试、界面优化、奖励调整

## 10. 上线和运营计划

### 上线准备
- **内测阶段**：邀请小规模用户测试，收集反馈
- **公测阶段**：开放更大规模测试，优化游戏体验
- **正式上线**：分平台逐步上线，控制用户增长速度

### 运营策略
- **新手引导优化**：根据数据持续优化新手体验
- **内容更新节奏**：每周小更新，每月中更新，每季度大更新
- **社区运营**：建立官方社区，举办线上活动，维护玩家关系
- **问题响应机制**：快速响应用户反馈，定期发布更新公告

### 长期规划
- **内容扩展**：新季节、新萌宠、新玩法持续更新
- **系统深化**：社交系统、公会系统、竞技系统等深化
- **IP拓展**：周边产品、衍生内容、跨媒体合作
- **全球化**：多语言支持，适配不同地区文化特色
