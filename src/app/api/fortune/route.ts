import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { createUserFortune } from "@/lib/db";
import { generateFortuneReport } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nickname, birthYear, birthMonth, birthDay, birthHour, birthMinute } = body;

    // 验证输入
    if (!nickname || !birthYear || !birthMonth || !birthDay || birthHour === undefined || birthMinute === undefined) {
      return NextResponse.json(
        { error: "请填写完整的信息" },
        { status: 400 }
      );
    }

    // 生成唯一ID
    const id = uuidv4();

    // 调用 Gemini 生成财运报告
    const fortuneResult = await generateFortuneReport(
      nickname,
      birthYear,
      birthMonth,
      birthDay,
      birthHour,
      birthMinute
    );

    // 保存到数据库
    createUserFortune({
      id,
      nickname,
      birthYear,
      birthMonth,
      birthDay,
      birthHour,
      birthMinute,
      baziResult: JSON.stringify(fortuneResult),
      fortuneAmount: fortuneResult.fortuneAmount,
      peakMonth: fortuneResult.peakMonth,
      peakDescription: fortuneResult.peakDescription,
    });

    return NextResponse.json({
      id,
      ...fortuneResult,
    });
  } catch (error) {
    console.error("Error generating fortune:", error);
    return NextResponse.json(
      { error: "生成报告失败，请重试" },
      { status: 500 }
    );
  }
}
