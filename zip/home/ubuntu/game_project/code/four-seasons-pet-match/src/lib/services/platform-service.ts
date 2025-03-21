import { PlatformInterface } from '../platforms/platform-interface';
import { PlatformFactory } from '../platforms/platform-factory';

// 平台服务类，提供游戏中使用的平台功能
export class PlatformService {
  private static instance: PlatformService;
  private platform: PlatformInterface;
  
  // 广告单元ID配置
  private adUnitIds = {
    wechat: {
      rewardedVideo: 'adunit-wechat-rewarded-video',
      interstitial: 'adunit-wechat-interstitial',
      banner: 'adunit-wechat-banner'
    },
    douyin: {
      rewardedVideo: 'adunit-douyin-rewarded-video',
      interstitial: 'adunit-douyin-interstitial',
      banner: 'adunit-douyin-banner'
    },
    mock: {
      rewardedVideo: 'adunit-mock-rewarded-video',
      interstitial: 'adunit-mock-interstitial',
      banner: 'adunit-mock-banner'
    }
  };

  private constructor() {
    // 获取当前平台实例
    this.platform = PlatformFactory.getPlatform();
    console.log(`Platform initialized: ${this.platform.getPlatformName()}`);
  }

  // 获取单例实例
  public static getInstance(): PlatformService {
    if (!PlatformService.instance) {
      PlatformService.instance = new PlatformService();
    }
    return PlatformService.instance;
  }

  // 获取平台名称
  public getPlatformName(): string {
    return this.platform.getPlatformName();
  }

  // 用户登录
  public async login(): Promise<{
    success: boolean;
    userId?: string;
    platformId?: string;
    username?: string;
    avatar?: string;
    error?: string;
  }> {
    try {
      const result = await this.platform.login();
      
      if (result.success) {
        // 登录成功后，可以在这里进行额外的处理
        console.log('User logged in:', result);
      }
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: `登录失败: ${(error as Error).message}`
      };
    }
  }

  // 分享游戏
  public async shareGame(options: {
    title?: string;
    desc?: string;
    imageUrl?: string;
    path?: string;
    query?: Record<string, string>;
  }): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      // 默认分享内容
      const defaultOptions = {
        title: '四季萌宠消消乐',
        desc: '一起来体验四季变化的消除游戏吧！',
        imageUrl: 'https://example.com/share-image.png',
        path: '/pages/index/index'
      };
      
      // 合并默认选项和用户选项
      const shareOptions = { ...defaultOptions, ...options };
      
      return await this.platform.share(shareOptions);
    } catch (error) {
      console.error('Share error:', error);
      return {
        success: false,
        error: `分享失败: ${(error as Error).message}`
      };
    }
  }

  // 支付
  public async pay(options: {
    orderId: string;
    amount: number;
    productName: string;
    productDesc?: string;
  }): Promise<{
    success: boolean;
    transactionId?: string;
    error?: string;
  }> {
    try {
      return await this.platform.pay(options);
    } catch (error) {
      console.error('Payment error:', error);
      return {
        success: false,
        error: `支付失败: ${(error as Error).message}`
      };
    }
  }

  // 显示激励视频广告
  public async showRewardedAd(onReward?: (reward: any) => void): Promise<{
    success: boolean;
    completed: boolean;
    error?: string;
  }> {
    try {
      const platformName = this.platform.getPlatformName();
      const adUnitId = this.adUnitIds[platformName as keyof typeof this.adUnitIds]?.rewardedVideo || '';
      
      return await this.platform.showRewardedAd({
        adUnitId,
        onReward
      });
    } catch (error) {
      console.error('Rewarded ad error:', error);
      return {
        success: false,
        completed: false,
        error: `显示激励视频广告失败: ${(error as Error).message}`
      };
    }
  }

  // 显示插屏广告
  public async showInterstitialAd(): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const platformName = this.platform.getPlatformName();
      const adUnitId = this.adUnitIds[platformName as keyof typeof this.adUnitIds]?.interstitial || '';
      
      return await this.platform.showInterstitialAd({
        adUnitId
      });
    } catch (error) {
      console.error('Interstitial ad error:', error);
      return {
        success: false,
        error: `显示插屏广告失败: ${(error as Error).message}`
      };
    }
  }

  // 显示Banner广告
  public async showBannerAd(position: 'top' | 'bottom' = 'bottom'): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      const platformName = this.platform.getPlatformName();
      const adUnitId = this.adUnitIds[platformName as keyof typeof this.adUnitIds]?.banner || '';
      
      return await this.platform.showBannerAd({
        adUnitId,
        position
      });
    } catch (error) {
      console.error('Banner ad error:', error);
      return {
        success: false,
        error: `显示Banner广告失败: ${(error as Error).message}`
      };
    }
  }

  // 隐藏Banner广告
  public async hideBannerAd(): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      return await this.platform.hideBannerAd();
    } catch (error) {
      console.error('Hide banner ad error:', error);
      return {
        success: false,
        error: `隐藏Banner广告失败: ${(error as Error).message}`
      };
    }
  }

  // 获取用户信息
  public async getUserInfo(): Promise<{
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
    try {
      return await this.platform.getUserInfo();
    } catch (error) {
      console.error('Get user info error:', error);
      return {
        success: false,
        error: `获取用户信息失败: ${(error as Error).message}`
      };
    }
  }

  // 振动反馈 - 短振动
  public async vibrateShort(): Promise<void> {
    try {
      await this.platform.vibrateShort();
    } catch (error) {
      console.error('Vibrate short error:', error);
    }
  }

  // 振动反馈 - 长振动
  public async vibrateLong(): Promise<void> {
    try {
      await this.platform.vibrateLong();
    } catch (error) {
      console.error('Vibrate long error:', error);
    }
  }

  // 检查更新
  public async checkForUpdates(): Promise<void> {
    try {
      const result = await this.platform.checkForUpdates();
      if (result.success && result.hasUpdate) {
        console.log('New version available');
        // 这里可以添加提示用户更新的逻辑
      }
    } catch (error) {
      console.error('Check for updates error:', error);
    }
  }

  // 获取系统信息
  public async getSystemInfo(): Promise<{
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
    try {
      return await this.platform.getSystemInfo();
    } catch (error) {
      console.error('Get system info error:', error);
      return {
        success: false,
        error: `获取系统信息失败: ${(error as Error).message}`
      };
    }
  }

  // 获取启动参数
  public async getLaunchOptions(): Promise<{
    success: boolean;
    options?: {
      path: string;
      query: Record<string, string>;
      scene: string;
      referrerInfo?: any;
    };
    error?: string;
  }> {
    try {
      return await this.platform.getLaunchOptions();
    } catch (error) {
      console.error('Get launch options error:', error);
      return {
        success: false,
        error: `获取启动参数失败: ${(error as Error).message}`
      };
    }
  }
}
