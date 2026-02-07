import { NextRequest, NextResponse } from "next/server";
import { NanoBananaPosterGenerator, type PosterData } from "@/lib/poster";

/**
 * Nano Banana海报生成API
 *
 * POST /api/generate-poster
 *
 * 请求体：
 * {
 *   nickname: string,
 *   fortuneAmount: number,
 *   peakMonth: number,
 *   peakDescription: string,
 *   bazi: { year, month, day, hour },
 *   rank: number,
 *   qrCodeUrl: string
 * }
 *
 * 响应：
 * {
 *   success: boolean,
 *   imageUrl?: string,
 *   error?: string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证必需字段
    const {
      nickname,
      fortuneAmount,
      peakMonth,
      peakDescription,
      bazi,
      rank,
      qrCodeUrl,
    } = body;

    if (
      !nickname ||
      fortuneAmount === undefined ||
      !peakMonth ||
      !peakDescription ||
      !bazi ||
      rank === undefined ||
      !qrCodeUrl
    ) {
      return NextResponse.json(
        { success: false, error: "缺少必需字段" },
        { status: 400 }
      );
    }

    const posterData: PosterData = {
      nickname,
      fortuneAmount,
      peakMonth,
      peakDescription,
      bazi,
      rank,
      qrCodeUrl,
    };

    // 检查Nano Banana API是否配置
    const apiKey = process.env.NANO_BANANA_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Nano Banana API尚未配置，请使用html2canvas方案",
          fallback: "html2canvas",
        },
        { status: 503 }
      );
    }

    // 使用Nano Banana生成海报
    const generator = new NanoBananaPosterGenerator();
    const imageUrl = await generator.generate(posterData);

    return NextResponse.json({
      success: true,
      imageUrl,
      generator: "nanoBanana",
    });
  } catch (error) {
    console.error("Nano Banana海报生成失败:", error);

    // 返回错误，建议使用html2canvas备用方案
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "海报生成失败",
        fallback: "html2canvas",
      },
      { status: 500 }
    );
  }
}

/**
 * 获取Nano Banana状态
 * GET /api/generate-poster
 */
export async function GET() {
  const apiKey = process.env.NANO_BANANA_API_KEY;
  const apiEndpoint = process.env.NANO_BANANA_API_ENDPOINT;

  return NextResponse.json({
    configured: !!apiKey && !!apiEndpoint,
    available: !!apiKey && !!apiEndpoint,
    fallback: "html2canvas",
    message: apiKey && apiEndpoint
      ? "Nano Banana API已配置并可用"
      : "Nano Banana API未配置，当前使用html2canvas方案",
  });
}
