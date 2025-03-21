# 四季萌宠消消乐 - 部署指南

本文档提供了"四季萌宠消消乐"游戏在微信小程序和抖音小程序平台上的部署指南。

## 1. 部署准备

### 1.1 开发者账号准备

#### 微信小程序
- 注册微信小程序开发者账号 (https://mp.weixin.qq.com/)
- 完成开发者资质认证
- 创建小游戏项目，获取AppID

#### 抖音小程序
- 注册抖音小程序开发者账号 (https://developer.open-douyin.com/)
- 完成开发者资质认证
- 创建小游戏项目，获取AppID

### 1.2 服务器环境准备

- 准备云服务器或云函数环境
- 配置HTTPS证书
- 设置数据库环境
- 配置域名并完成备案（国内服务器需要）

### 1.3 配置文件准备

- 更新项目中的AppID配置
- 配置服务器API地址
- 设置广告单元ID
- 配置支付相关参数

## 2. 构建流程

### 2.1 安装依赖

```bash
cd /path/to/four-seasons-pet-match
npm install
```

### 2.2 环境配置

创建或修改`.env.production`文件，设置生产环境变量：

```
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_WECHAT_APPID=your_wechat_appid
NEXT_PUBLIC_DOUYIN_APPID=your_douyin_appid
NEXT_PUBLIC_AD_UNIT_REWARDED=your_rewarded_ad_unit_id
NEXT_PUBLIC_AD_UNIT_INTERSTITIAL=your_interstitial_ad_unit_id
NEXT_PUBLIC_AD_UNIT_BANNER=your_banner_ad_unit_id
```

### 2.3 构建项目

```bash
npm run build
```

### 2.4 生成部署包

#### 微信小程序

```bash
# 安装微信小程序CI工具
npm install -g miniprogram-ci

# 生成微信小程序部署包
npm run build:wechat
```

#### 抖音小程序

```bash
# 安装抖音小程序CI工具
npm install -g tt-miniprogram-ci

# 生成抖音小程序部署包
npm run build:douyin
```

## 3. 部署流程

### 3.1 后端API部署

1. 将数据库迁移脚本应用到生产数据库：

```bash
cd /path/to/four-seasons-pet-match
wrangler d1 execute DB --file=migrations/0001_initial.sql
```

2. 部署Cloudflare Workers后端：

```bash
wrangler publish
```

### 3.2 微信小程序部署

1. 打开微信开发者工具
2. 导入项目（选择`dist/wechat`目录）
3. 预览和测试
4. 上传代码
5. 在微信小程序后台提交审核

### 3.3 抖音小程序部署

1. 打开抖音开发者工具
2. 导入项目（选择`dist/douyin`目录）
3. 预览和测试
4. 上传代码
5. 在抖音小程序后台提交审核

## 4. 配置说明

### 4.1 游戏配置

游戏的主要配置文件位于`src/lib/config`目录下：

- `game-config.ts`: 游戏核心配置
- `level-config.ts`: 关卡配置
- `item-config.ts`: 物品配置
- `pet-config.ts`: 萌宠配置

修改这些文件可以调整游戏的难度、关卡设计、物品属性等。

### 4.2 平台配置

平台特定的配置位于`src/lib/platforms`目录下：

- `wechat-platform.ts`: 微信平台配置
- `douyin-platform.ts`: 抖音平台配置

### 4.3 广告配置

广告单元ID配置位于`src/lib/services/platform-service.ts`文件中的`adUnitIds`对象。

## 5. 上线后运维

### 5.1 监控

- 设置服务器监控，关注API响应时间和错误率
- 配置数据库监控，关注查询性能和连接数
- 使用平台提供的性能监控工具，关注小程序性能指标

### 5.2 数据备份

- 配置数据库定期备份
- 设置重要用户数据的额外备份策略

### 5.3 版本更新

1. 开发新功能或修复问题
2. 在测试环境验证
3. 构建新版本
4. 上传并提交审核
5. 审核通过后发布

### 5.4 常见问题处理

#### 审核被拒
- 仔细阅读拒绝原因
- 根据平台规范修改内容
- 重新提交审核

#### 性能问题
- 分析性能瓶颈
- 优化资源加载
- 减少不必要的网络请求
- 优化渲染性能

#### 支付问题
- 检查支付参数配置
- 验证商户号状态
- 检查支付回调处理

## 6. 安全注意事项

### 6.1 API安全
- 使用HTTPS协议
- 实现请求签名验证
- 设置适当的CORS策略
- 实现API访问频率限制

### 6.2 数据安全
- 敏感数据加密存储
- 实现最小权限原则
- 定期安全审计
- 用户数据脱敏处理

### 6.3 支付安全
- 严格验证支付回调
- 实现幂等性处理
- 记录详细的支付日志
- 实现交易异常监控

## 7. 合规要求

### 7.1 用户隐私
- 提供清晰的隐私政策
- 获取必要的用户授权
- 遵循数据保护法规

### 7.2 内容合规
- 确保游戏内容符合平台规范
- 避免敏感或违规内容
- 适当标注游戏分级

### 7.3 支付合规
- 遵循平台支付规则
- 明确标示商品价格和内容
- 提供必要的退款机制

## 8. 联系与支持

如有部署问题，请联系技术支持团队：

- 邮箱：support@example.com
- 技术支持群：123456789

## 9. 附录

### 9.1 常用命令

```bash
# 启动开发服务器
npm run dev

# 构建项目
npm run build

# 运行测试
npm run test

# 部署到生产环境
npm run deploy
```

### 9.2 重要文件路径

- 主配置文件: `/src/lib/config/game-config.ts`
- 数据库迁移: `/migrations/0001_initial.sql`
- 平台适配器: `/src/lib/platforms/`
- API接口: `/src/app/api/`
