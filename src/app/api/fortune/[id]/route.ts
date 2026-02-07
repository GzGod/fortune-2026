import { NextRequest, NextResponse } from "next/server";
import { getUserFortune, getUserRank, getTotalUsers } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const fortune = getUserFortune(id);

    if (!fortune) {
      return NextResponse.json(
        { error: "报告不存在" },
        { status: 404 }
      );
    }

    // 获取排名
    const rank = getUserRank(fortune.fortuneAmount);
    const totalUsers = getTotalUsers();

    // 解析八字结果
    let baziResult;
    try {
      baziResult = JSON.parse(fortune.baziResult);
    } catch {
      baziResult = null;
    }

    return NextResponse.json({
      id: fortune.id,
      nickname: fortune.nickname,
      birthYear: fortune.birthYear,
      birthMonth: fortune.birthMonth,
      birthDay: fortune.birthDay,
      birthHour: fortune.birthHour,
      birthMinute: fortune.birthMinute,
      fortuneAmount: fortune.fortuneAmount,
      peakMonth: fortune.peakMonth,
      peakDescription: fortune.peakDescription,
      rank,
      totalUsers,
      ...(baziResult || {}),
    });
  } catch (error) {
    console.error("Error fetching fortune:", error);
    return NextResponse.json(
      { error: "获取报告失败" },
      { status: 500 }
    );
  }
}
