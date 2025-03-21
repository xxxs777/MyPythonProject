// 平台接口抽象类
export abstract class PlatformInterface {
  // 用户认证
  abstract login(): Promise<{
    success: boolean;
    userId?: string;
    platformId?: string;
    username?: string;
    avatar?: string;
    error?: string;
  }>;

  // 分享功能
  abstract share(options: {
    title: string;
    desc: string;
    imageUrl: string;
    path?: string;
    query?: Record<string, string>;
  }): Promise<{
    success: boolean;
    error?: string;
  }>;

  // 支付功能
  abstract pay(options: {
    orderId: string;
    amount: number;
    productName: string;
    productDesc?: string;
  }): Promise<{
    success: boolean;
    transactionId?: string;
    error?: string;
  }>;

  // 广告功能 - 激励视频
  abstract showRewardedAd(options: {
    adUnitId: string;
    onReward?: (reward: any) => void;
  }): Promise<{
    success: boolean;
    completed: boolean;
    error?: string;
  }>;

  // 广告功能 - 插屏广告
  abstract showInterstitialAd(options: {
    adUnitId: string;
  }): Promise<{
    success: boolean;
    error?: string;
  }>;

  // 广告功能 - Banner广告
  abstract showBannerAd(options: {
    adUnitId: string;
    position: 'top' | 'bottom';
  }): Promise<{
    success: boolean;
    error?: string;
  }>;

  // 广告功能 - 隐藏Banner广告
  abstract hideBannerAd(): Promise<{
    success: boolean;
    error?: string;
  }>;

  // 获取用户信息
  abstract getUserInfo(): Promise<{
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
  }>;

  // 获取好友列表
  abstract getFriendList(): Promise<{
    success: boolean;
    friends?: Array<{
      platformId: string;
      username: string;
      avatar: string;
    }>;
    error?: string;
  }>;

  // 保存图片到相册
  abstract saveImageToAlbum(options: {
    filePath: string;
  }): Promise<{
    success: boolean;
    error?: string;
  }>;

  // 振动反馈
  abstract vibrateShort(): Promise<{
    success: boolean;
    error?: string;
  }>;

  // 长振动反馈
  abstract vibrateLong(): Promise<{
    success: boolean;
    error?: string;
  }>;

  // 检查更新
  abstract checkForUpdates(): Promise<{
    success: boolean;
    hasUpdate: boolean;
    error?: string;
  }>;

  // 获取系统信息
  abstract getSystemInfo(): Promise<{
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
  }>;

  // 获取网络状态
  abstract getNetworkType(): Promise<{
    success: boolean;
    networkType?: 'wifi' | '2g' | '3g' | '4g' | '5g' | 'unknown' | 'none';
    error?: string;
  }>;

  // 监听网络状态变化
  abstract onNetworkStatusChange(callback: (res: {
    isConnected: boolean;
    networkType: 'wifi' | '2g' | '3g' | '4g' | '5g' | 'unknown' | 'none';
  }) => void): void;

  // 获取启动参数
  abstract getLaunchOptions(): Promise<{
    success: boolean;
    options?: {
      path: string;
      query: Record<string, string>;
      scene: string;
      referrerInfo?: any;
    };
    error?: string;
  }>;

  // 跳转到其他小程序
  abstract navigateToMiniProgram(options: {
    appId: string;
    path?: string;
    extraData?: Record<string, any>;
  }): Promise<{
    success: boolean;
    error?: string;
  }>;

  // 获取平台名称
  abstract getPlatformName(): string;

  // 检查API是否可用
  abstract canIUse(api: string): boolean;
}
