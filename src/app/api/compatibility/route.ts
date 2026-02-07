import { NextRequest, NextResponse } from "next/server";
import { generateCompatibilityReport } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user1, user2 } = body;

    // 验证输入
    if (!user1 || !user2) {
      return NextResponse.json(
        { error: "请填写完整的信息" },
        { status: 400 }
      );
    }

    const requiredFields = ["nickname", "birthYear", "birthMonth", "birthDay", "birthHour", "birthMinute"];
    
    for (const field of requiredFields) {
      if (user1[field] === undefined || user2[field] === undefined) {
        return NextResponse.json(
          { error: `缺少必要字段: ${field}` },
          { status: 400 }
        );
      }
    }

    // 调用 Gemini 生成合盘报告
    const result = await generateCompatibilityReport(user1, user2);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error generating compatibility:", error);
    return NextResponse.json(
      { error: "生成合盘报告失败，请重试" },
      { status: 500 }
    );
  }
}
