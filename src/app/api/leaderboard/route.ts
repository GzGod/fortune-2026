import { NextRequest, NextResponse } from "next/server";
import { getTopFortunes, getTotalUsers } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "100");

    const fortunes = getTopFortunes(Math.min(limit, 100));
    const totalUsers = getTotalUsers();

    const leaderboard = fortunes.map((fortune, index) => ({
      rank: index + 1,
      id: fortune.id,
      nickname: fortune.nickname,
      fortuneAmount: fortune.fortuneAmount,
      peakMonth: fortune.peakMonth,
    }));

    return NextResponse.json({
      leaderboard,
      totalUsers,
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "获取排行榜失败" },
      { status: 500 }
    );
  }
}
