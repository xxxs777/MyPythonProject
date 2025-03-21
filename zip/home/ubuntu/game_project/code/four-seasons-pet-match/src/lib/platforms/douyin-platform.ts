import { PlatformInterface } from './platform-interface';

// 抖音小程序平台适配器
export class DouyinPlatform implements PlatformInterface {
  private tt: any;

  constructor() {
    // 在抖音小程序环境中，tt对象是全局可用的
    if (typeof window !== 'undefined' && (window as any).tt) {
      this.tt = (window as any).tt;
    } else {
      console.error('DouyinPlatform: tt对象不可用，可能不在抖音小程序环境中');
    }
  }

  // 用户认证
  async login(): Promise<{
    success: boolean;
    userId?: string;
    platformId?: string;
    username?: string;
    avatar?: string;
    error?: string;
  }> {
    try {
      if (!this.tt) {
        return { success: false, error: '抖音环境不可用' };
      }

      // 调用抖音登录接口
      const loginResult = await this.promisify(this.tt.login)();
      if (!loginResult.code) {
        return { success: false, error: '抖音登录失败' };
      }

      // 获取用户信息
      const userInfoResult = await this.getUserInfo();
      if (!userInfoResult.success) {
        return { success: false, error: userInfoResult.error };
      }

      return {
        success: true,
        platformId: loginResult.code, // 使用code作为平台ID
        username: userInfoResult.userInfo?.username || '抖音用户',
        avatar: userInfoResult.userInfo?.avatar || '',
      };
    } catch (error) {
      console.error('抖音登录失败:', error);
      return { success: false, error: '抖音登录失败: ' + (error as Error).message };
    }
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
    try {
      if (!this.tt) {
        return { success: false, error: '抖音环境不可用' };
      }

      // 构建分享路径
      let sharePath = options.path || '/pages/index/index';
      if (options.query) {
        const queryString = Object.entries(options.query)
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join('&');
        sharePath += `?${queryString}`;
      }

      // 设置分享信息
      this.tt.showShareMenu({
        withShareTicket: true
      });

      // 设置分享内容
      this.tt.onShareAppMessage(() => ({
        title: options.title,
        desc: options.desc,
        imageUrl: options.imageUrl,
        path: sharePath
      }));

      return { success: true };
    } catch (error) {
      console.error('抖音分享设置失败:', error);
      return { success: false, error: '抖音分享设置失败: ' + (error as Error).message };
    }
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
    try {
      if (!this.tt) {
        return { success: false, error: '抖音环境不可用' };
      }

      // 注意：抖音小程序支付需要先从服务器获取支付参数
      // 这里假设已经从服务器获取了支付参数
      const payParams = await this.getPayParams(options);
      if (!payParams.success) {
        return { success: false, error: payParams.error };
      }

      // 调用抖音支付接口
      const payResult = await this.promisify(this.tt.pay)(payParams.params);
      
      return {
        success: true,
        transactionId: payResult.transactionId || options.orderId
      };
    } catch (error) {
      console.error('抖音支付失败:', error);
      return { success: false, error: '抖音支付失败: ' + (error as Error).message };
    }
  }

  // 获取支付参数（从服务器）
  private async getPayParams(options: {
    orderId: string;
    amount: number;
    productName: string;
    productDesc?: string;
  }): Promise<{
    success: boolean;
    params?: any;
    error?: string;
  }> {
    try {
      // 实际项目中，这里应该调用服务器API获取支付参数
      // 这里仅作为示例
      const response = await fetch('/api/douyin/pay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(options)
      });

      const data = await response.json();
      if (!data.success) {
        return { success: false, error: data.error || '获取支付参数失败' };
      }

      return {
        success: true,
        params: data.payParams
      };
    } catch (error) {
      console.error('获取支付参数失败:', error);
      return { success: false, error: '获取支付参数失败: ' + (error as Error).message };
    }
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
    try {
      if (!this.tt) {
        return { success: false, completed: false, error: '抖音环境不可用' };
      }

      // 创建激励视频广告实例
      const rewardedAd = this.tt.createRewardedVideoAd({
        adUnitId: options.adUnitId
      });

      // 监听加载事件
      rewardedAd.onLoad(() => {
        console.log('激励视频广告加载成功');
      });

      // 监听错误事件
      rewardedAd.onError((err: any) => {
        console.error('激励视频广告加载失败:', err);
      });

      // 监听关闭事件
      let completed = false;
      rewardedAd.onClose((res: any) => {
        if (res && res.isEnded) {
          completed = true;
          if (options.onReward) {
            options.onReward(res);
          }
        }
      });

      // 显示广告
      await rewardedAd.show();

      return {
        success: true,
        completed
      };
    } catch (error) {
      console.error('显示激励视频广告失败:', error);
      return { 
        success: false, 
        completed: false, 
        error: '显示激励视频广告失败: ' + (error as Error).message 
      };
    }
  }

  // 广告功能 - 插屏广告
  async showInterstitialAd(options: {
    adUnitId: string;
  }): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      if (!this.tt) {
        return { success: false, error: '抖音环境不可用' };
      }

      // 创建插屏广告实例
      const interstitialAd = this.tt.createInterstitialAd({
        adUnitId: options.adUnitId
      });

      // 监听加载事件
      interstitialAd.onLoad(() => {
        console.log('插屏广告加载成功');
      });

      // 监听错误事件
      interstitialAd.onError((err: any) => {
        console.error('插屏广告加载失败:', err);
      });

      // 显示广告
      await interstitialAd.show();

      return { success: true };
    } catch (error) {
      console.error('显示插屏广告失败:', error);
      return { success: false, error: '显示插屏广告失败: ' + (error as Error).message };
    }
  }

  // 广告功能 - Banner广告
  async showBannerAd(options: {
    adUnitId: string;
    position: 'top' | 'bottom';
  }): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      if (!this.tt) {
        return { success: false, error: '抖音环境不可用' };
      }

      // 获取系统信息
      const systemInfo = await this.promisify(this.tt.getSystemInfo)();
      
      // 创建Banner广告实例
      const bannerAd = this.tt.createBannerAd({
        adUnitId: options.adUnitId,
        style: {
          left: 0,
          top: options.position === 'top' ? 0 : systemInfo.windowHeight - 100,
          width: systemInfo.windowWidth
        }
      });

      // 监听加载事件
      bannerAd.onLoad(() => {
        console.log('Banner广告加载成功');
      });

      // 监听错误事件
      bannerAd.onError((err: any) => {
        console.error('Banner广告加载失败:', err);
      });

      // 监听尺寸变化事件
      bannerAd.onResize((size: any) => {
        if (options.position === 'top') {
          bannerAd.style.top = 0;
        } else {
          bannerAd.style.top = systemInfo.windowHeight - size.height;
        }
      });

      // 显示广告
      await bannerAd.show();

      // 保存广告实例，以便后续隐藏
      (this as any).bannerAd = bannerAd;

      return { success: true };
    } catch (error) {
      console.error('显示Banner广告失败:', error);
      return { success: false, error: '显示Banner广告失败: ' + (error as Error).message };
    }
  }

  // 广告功能 - 隐藏Banner广告
  async hideBannerAd(): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      if (!this.tt) {
        return { success: false, error: '抖音环境不可用' };
      }

      const bannerAd = (this as any).bannerAd;
      if (!bannerAd) {
        return { success: false, error: 'Banner广告实例不存在' };
      }

      // 隐藏广告
      await bannerAd.hide();

      return { success: true };
    } catch (error) {
      console.error('隐藏Banner广告失败:', error);
      return { success: false, error: '隐藏Banner广告失败: ' + (error as Error).message };
    }
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
    try {
      if (!this.tt) {
        return { success: false, error: '抖音环境不可用' };
      }

      // 检查用户是否授权
      const setting = await this.promisify(this.tt.getSetting)();
      if (!setting.authSetting['scope.userInfo']) {
        // 用户未授权，需要引导用户授权
        return { 
          success: false, 
          error: '用户未授权获取信息，请使用 <button open-type="getUserInfo"> 引导用户授权' 
        };
      }

      // 获取用户信息
      const userInfo = await this.promisify(this.tt.getUserInfo)();
      
      return {
        success: true,
        userInfo: {
          platformId: '', // 需要通过login接口获取
          username: userInfo.userInfo.nickName,
          avatar: userInfo.userInfo.avatarUrl,
          gender: userInfo.userInfo.gender === 1 ? '男' : userInfo.userInfo.gender === 2 ? '女' : '未知',
          country: userInfo.userInfo.country,
          province: userInfo.userInfo.province,
          city: userInfo.userInfo.city
        }
      };
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return { success: false, error: '获取用户信息失败: ' + (error as Error).message };
    }
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
    // 抖音小程序不直接提供获取好友列表的API
    return {
      success: false,
      error: '抖音小程序不直接支持获取好友列表'
    };
  }

  // 保存图片到相册
  async saveImageToAlbum(options: {
    filePath: string;
  }): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      if (!this.tt) {
        return { success: false, error: '抖音环境不可用' };
      }

      // 检查用户是否授权
      const setting = await this.promisify(this.tt.getSetting)();
      if (!setting.authSetting['scope.writePhotosAlbum']) {
        // 用户未授权，请求授权
        await this.promisify(this.tt.authorize)({
          scope: 'scope.writePhotosAlbum'
        });
      }

      // 保存图片
      await this.promisify(this.tt.saveImageToPhotosAlbum)({
        filePath: options.filePath
      });

      return { success: true };
    } catch (error) {
      console.error('保存图片到相册失败:', error);
      return { success: false, error: '保存图片到相册失败: ' + (error as Error).message };
    }
  }

  // 振动反馈
  async vibrateShort(): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      if (!this.tt) {
        return { success: false, error: '抖音环境不可用' };
      }

      await this.promisify(this.tt.vibrateShort)();
      return { success: true };
    } catch (error) {
      console.error('短振动失败:', error);
      return { success: false, error: '短振动失败: ' + (error as Error).message };
    }
  }

  // 长振动反馈
  async vibrateLong(): Promise<{
    success: boolean;
    error?: string;
  }> {
    try {
      if (!this.tt) {
        return { success: false, error: '抖音环境不可用' };
      }

      await this.promisify(this.tt.vibrateLong)();
      return { success: true };
    } catch (error) {
      console.error('长振动失败:', error);
      return { success: false, error: '长振动失败: ' + (error as Error).message };
    }
  }

  // 检查更新
  async checkForUpdates(): Promise<{
    success: boolean;
    hasUpdate: boolean;
    error?: string;
  }> {
    try {
      if (!this.tt) {
        return { success: false, hasUpdate: false, error: '抖音环境不可用' };
      }

      const updateManager = this.tt.getUpdateManager();
      
      return new Promise((resolve) => {
        updateManager.onCheckForUpdate((res: any) => {
          resolve({
            success: true,
            hasUpdate: res.hasUpdate
          });
        });
        
        updateManager.onUpdateFailed(() => {
          resolve({
            success: false,
            hasUpdate: false,
            error: '检查更新失败'
          });
        });
      });
    } catch (error) {
      console.error('检查更新失败:', error);
      return { 
        success: false, 
        hasUpdate: false, 
        error: '检查更新失败: ' + (error as Error).message 
      };
    }
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
    try {
      if (!this.tt) {
        return { success: false, error: '抖音环境不可用' };
      }

      const info = await this.promisify(this.tt.getSystemInfo)();
      
      return {
        success: true,
        systemInfo: {
          platform: info.platform,
          brand: info.brand,
          model: info.model,
          pixelRatio: info.pixelRatio,
          screenWidth: info.screenWidth,
          screenHeight: info.screenHeight,
          windowWidth: info.windowWidth,
          windowHeight: info.windowHeight,
          language: info.language,
          version: info.version,
          system: info.system
        }
      };
    } catch (error) {
      console.error('获取系统信息失败:', error);
      return { success: false, error: '获取系统信息失败: ' + (error as Error).message };
    }
  }

  // 获取网络状态
  async getNetworkType(): Promise<{
    success: boolean;
    networkType?: 'wifi' | '2g' | '3g' | '4g' | '5g' | 'unknown' | 'none';
    error?: string;
  }> {
    try {
      if (!this.tt) {
        return { success: false, error: '抖音环境不可用' };
      }

      const res = await this.promisify(this.tt.getNetworkType)();
      
      return {
        success: true,
        networkType: res.networkType as any
      };
    } catch (error) {
      console.error('获取网络状态失败:', error);
      return { success: false, error: '获取网络状态失败: ' + (error as Error).message };
    }
  }

  // 监听网络状态变化
  onNetworkStatusChange(callback: (res: {
    isConnected: boolean;
    networkType: 'wifi' | '2g' | '3g' | '4g' | '5g' | 'unknown' | 'none';
  }) => void): void {
    if (!this.tt) {
      console.error('抖音环境不可用');
      return;
    }

    this.tt.onNetworkStatusChange(callback);
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
    try {
      if (!this.tt) {
        return { success: false, error: '抖音环境不可用' };
      }

      const options = this.tt.getLaunchOptionsSync();
      
      return {
        success: true,
        options: {
          path: options.path,
          query: options.query,
          scene: options.scene,
          referrerInfo: options.referrerInfo
        }
      };
    } catch (error) {
      console.error('获取启动参数失败:', error);
      return { success: false, error: '获取启动参数失败: ' + (error as Error).message };
    }
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
    try {
      if (!this.tt) {
        return { success: false, error: '抖音环境不可用' };
      }

      await this.promisify(this.tt.navigateToMiniProgram)(options);
      
      return { success: true };
    } catch (error) {
      console.error('跳转到其他小程序失败:', error);
      return { success: false, error: '跳转到其他小程序失败: ' + (error as Error).message };
    }
  }

  // 获取平台名称
  getPlatformName(): string {
    return 'douyin';
  }

  // 检查API是否可用
  canIUse(api: string): boolean {
    if (!this.tt) {
      return false;
    }
   <response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>