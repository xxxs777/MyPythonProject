import { PlatformInterface } from './platform-interface';
import { WechatPlatform } from './wechat-platform';
import { DouyinPlatform } from './douyin-platform';

// 平台工厂类，用于创建适合当前环境的平台实例
export class PlatformFactory {
  // 获取当前平台实例
  static getPlatform(): PlatformInterface {
    // 检测当前运行环境
    if (typeof window !== 'undefined') {
      // 检查是否在微信环境
      if ((window as any).wx) {
        return new WechatPlatform();
      }
      
      // 检查是否在抖音环境
      if ((window as any).tt) {
        return new DouyinPlatform();
      }
    }
    
    // 默认返回模拟平台（用于开发环境）
    return new MockPlatform();
  }
}

// 模拟平台实现（用于开发环境）
class MockPlatform implements PlatformInterface {
  // 用户认证
  async login(): Promise<{
    success: boolean;
    userId?: string;
    platformId?: string;
    username?: string;
    avatar?: string;
    error?: string;
  }> {
    console.log('MockPlatform: login');
    return {
      success: true,
      userId: 'mock-user-id',
      platformId: 'mock-platform-id',
      username: '测试用户',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=test-user'
    };
  }

  // 分享功能
  async share(options: {
    title: string;
    desc: string;
    imageUrl: string;
    path?: string;
    query?: Record<string, string>;
  }): Promise<{
    success: boolean;
    error?: string;
  }> {
    console.log('MockPlatform: share', options);
    return { success: true };
  }

  // 支付功能
  async pay(options: {
    orderId: string;
    amount: number;
    productName: string;
    productDesc?: string;
  }): Promise<{
    success: boolean;
    transactionId?: string;
    error?: string;
  }> {
    console.log('MockPlatform: pay', options);
    return {
      success: true,
      transactionId: `mock-transaction-${Date.now()}`
    };
  }

  // 广告功能 - 激励视频
  async showRewardedAd(options: {
    adUnitId: string;
    onReward?: (reward: any) => void;
  }): Promise<{
    success: boolean;
    completed: boolean;
    error?: string;
  }> {
    console.log('MockPlatform: showRewardedAd', options);
    
    // 模拟用户观看完成广告
    if (options.onReward) {
      setTimeout(() => {
        options.onReward?.({ isEnded: true });
      }, 1000);
    }
    
    return {
      success: true,
      completed: true
    };
  }

  // 广告功能 - 插屏广告
  async showInterstitialAd(options: {
    adUnitId: string;
  }): Promise<{
    success: boolean;
    error?: string;
  }> {
    console.log('MockPlatform: showInterstitialAd', options);
    return { success: true };
  }

  // 广告功能 - Banner广告
  async showBannerAd(options: {
    adUnitId: string;
    position: 'top' | 'bottom';
  }): Promise<{
    success: boolean;
    error?: string;
  }> {
    console.log('MockPlatform: showBannerAd', options);
    return { success: true };
  }

  // 广告功能 - 隐藏Banner广告
  async hideBannerAd(): Promise<{
    success: boolean;
    error?: string;
  }> {
    console.log('MockPlatform: hideBannerAd');
    return { success: true };
  }

  // 获取用户信息
  async getUserInfo(): Promise<{
    success: boolean;
    userInfo?: {
      platformId: string;
      username: string;
      avatar: string;
      gender?: string;
      country?: string;
      province?: string;
      city?: string;
    };
    error?: string;
  }> {
    console.log('MockPlatform: getUserInfo');
    return {
      success: true,
      userInfo: {
        platformId: 'mock-platform-id',
        username: '测试用户',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=test-user',
        gender: '男',
        country: '中国',
        province: '北京',
        city: '北京'
      }
    };
  }

  // 获取好友列表
  async getFriendList(): Promise<{
    success: boolean;
    friends?: Array<{
      platformId: string;
      username: string;
      avatar: string;
    }>;
    error?: string;
  }> {
    console.log('MockPlatform: getFriendList');
    return {
      success: true,
      friends: [
        {
          platformId: 'mock-friend-1',
          username: '好友1',
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=friend1'
        },
        {
          platformId: 'mock-friend-2',
          username: '好友2',
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=friend2'
        }
      ]
    };
  }

  // 保存图片到相册
  async saveImageToAlbum(options: {
    filePath: string;
  }): Promise<{
    success: boolean;
    error?: string;
  }> {
    console.log('MockPlatform: saveImageToAlbum', options);
    return { success: true };
  }

  // 振动反馈
  async vibrateShort(): Promise<{
    success: boolean;
    error?: string;
  }> {
    console.log('MockPlatform: vibrateShort');
    return { success: true };
  }

  // 长振动反馈
  async vibrateLong(): Promise<{
    success: boolean;
    error?: string;
  }> {
    console.log('MockPlatform: vibrateLong');
    return { success: true };
  }

  // 检查更新
  async checkForUpdates(): Promise<{
    success: boolean;
    hasUpdate: boolean;
    error?: string;
  }> {
    console.log('MockPlatform: checkForUpdates');
    return {
      success: true,
      hasUpdate: false
    };
  }

  // 获取系统信息
  async getSystemInfo(): Promise<{
    success: boolean;
    systemInfo?: {
      platform: string;
      brand: string;
      model: string;
      pixelRatio: number;
      screenWidth: number;
      screenHeight: number;
      windowWidth: number;
      windowHeight: number;
      language: string;
      version: string;
      system: string;
    };
    error?: string;
  }> {
    console.log('MockPlatform: getSystemInfo');
    return {
      success: true,
      systemInfo: {
        platform: 'devtools',
        brand: 'devtools',
        model: 'devtools',
        pixelRatio: 2,
        screenWidth: 375,
        screenHeight: 667,
        windowWidth: 375,
        windowHeight: 667,
        language: 'zh_CN',
        version: '1.0.0',
        system: 'iOS 10.0.1'
      }
    };
  }

  // 获取网络状态
  async getNetworkType(): Promise<{
    success: boolean;
    networkType?: 'wifi' | '2g' | '3g' | '4g' | '5g' | 'unknown' | 'none';
    error?: string;
  }> {
    console.log('MockPlatform: getNetworkType');
    return {
      success: true,
      networkType: 'wifi'
    };
  }

  // 监听网络状态变化
  onNetworkStatusChange(callback: (res: {
    isConnected: boolean;
    networkType: 'wifi' | '2g' | '3g' | '4g' | '5g' | 'unknown' | 'none';
  }) => void): void {
    console.log('MockPlatform: onNetworkStatusChange');
    // 模拟网络状态变化
    setTimeout(() => {
      callback({
        isConnected: true,
        networkType: 'wifi'
      });
    }, 5000);
  }

  // 获取启动参数
  async getLaunchOptions(): Promise<{
    success: boolean;
    options?: {
      path: string;
      query: Record<string, string>;
      scene: string;
      referrerInfo?: any;
    };
    error?: string;
  }> {
    console.log('MockPlatform: getLaunchOptions');
    return {
      success: true,
      options: {
        path: 'pages/index/index',
        query: {},
        scene: '1001'
      }
    };
  }

  // 跳转到其他小程序
  async navigateToMiniProgram(options: {
    appId: string;
    path?: string;
    extraData?: Record<string, any>;
  }): Promise<{
    success: boolean;
    error?: string;
  }> {
    console.log('MockPlatform: navigateToMiniProgram', options);
    return { success: true };
  }

  // 获取平台名称
  getPlatformName(): string {
    return 'mock';
  }

  // 检查API是否可用
  canIUse(api: string): boolean {
    console.log('MockPlatform: canIUse', api);
    return true;
  }
}
