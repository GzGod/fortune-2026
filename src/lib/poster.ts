/**
 * 海报生成抽象接口
 * 支持多种海报生成方式，方便未来扩展
 */

export interface PosterData {
  nickname: string;
  fortuneAmount: number;
  peakMonth: number;
  peakDescription: string;
  bazi: {
    year: string;
    month: string;
    day: string;
    hour: string;
  };
  rank: number;
  qrCodeUrl: string;
}

export interface PosterGenerator {
  /**
   * 生成海报
   * @param data 财运数据
   * @returns 海报图片URL或base64
   */
  generate(data: PosterData): Promise<string>;
}

/**
 * HTML2Canvas海报生成器（当前使用）
 * 在客户端通过DOM截图生成海报
 */
export class Html2CanvasPosterGenerator implements PosterGenerator {
  async generate(data: PosterData): Promise<string> {
    // 当前使用前端的html2canvas实现
    // 这个类主要作为接口示例，实际生成在前端完成
    throw new Error("HTML2Canvas海报生成应在客户端进行");
  }
}

/**
 * Nano Banana海报生成器（预留）
 * 通过Nano Banana API生成精美的AI海报
 */
export class NanoBananaPosterGenerator implements PosterGenerator {
  private apiKey: string;
  private apiEndpoint: string;

  constructor(apiKey?: string, apiEndpoint?: string) {
    this.apiKey = apiKey || process.env.NANO_BANANA_API_KEY || "";
    this.apiEndpoint = apiEndpoint || process.env.NANO_BANANA_API_ENDPOINT || "";
  }

  async generate(data: PosterData): Promise<string> {
    if (!this.apiKey) {
      throw new Error("Nano Banana API密钥未配置");
    }

    // 构建Nano Banana提示词
    const prompt = this.buildPrompt(data);

    try {
      // TODO: 调用Nano Banana API
      // const response = await fetch(this.apiEndpoint, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${this.apiKey}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     prompt: prompt,
      //     // 其他Nano Banana参数...
      //   }),
      // });
      //
      // const result = await response.json();
      // return result.imageUrl;

      // 当前返回占位符
      throw new Error("Nano Banana API尚未集成，请提供API端点和密钥");
    } catch (error) {
      console.error("Nano Banana生成失败:", error);
      throw error;
    }
  }

  /**
   * 构建Nano Banana提示词
   */
  private buildPrompt(data: PosterData): string {
    return `
创建一张精美的中国春节风格财运预测海报：

用户信息：
- 昵称：${data.nickname}
- 2026年财富预测：${data.fortuneAmount}万人民币
- 财运巅峰月份：2026年${data.peakMonth}月
- 巅峰描述：${data.peakDescription}
- 八字：${data.bazi.year} ${data.bazi.month} ${data.bazi.day} ${data.bazi.hour}
- 排名：第${data.rank}名

设计要求：
1. 使用中国春节红金配色，营造喜庆祥和的氛围
2. 包含灯笼、祥云、金币等春节元素
3. 财富数字需要醒目突出，使用金色闪光效果
4. 整体布局精美，适合社交媒体分享
5. 在底部合适位置预留二维码区域：${data.qrCodeUrl}
6. 标注"2026蛇年·新春特别版"
7. 画面精致，色彩饱满，符合中国审美

尺寸：1080x1920px（9:16竖版）
风格：中国传统+现代设计结合
    `.trim();
  }
}

/**
 * 获取海报生成器
 * @param type 生成器类型
 */
export function getPosterGenerator(type: "html2canvas" | "nanoBanana" = "html2canvas"): PosterGenerator {
  switch (type) {
    case "nanoBanana":
      return new NanoBananaPosterGenerator();
    case "html2canvas":
    default:
      return new Html2CanvasPosterGenerator();
  }
}
