"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface LeaderboardItem {
  rank: number;
  id: string;
  nickname: string;
  fortuneAmount: number;
  peakMonth: number;
}

export default function LeaderboardPage() {
  const router = useRouter();
  const [data, setData] = useState<{
    leaderboard: LeaderboardItem[];
    totalUsers: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/leaderboard");
        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleShareToBinance = () => {
    // 分享到币安广场的按钮（暂时只是按钮，不需要实际作用）
    alert("分享功能即将上线，敬请期待！");
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `#${rank}`;
    }
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500/30 to-yellow-600/30 border-yellow-500";
      case 2:
        return "bg-gradient-to-r from-gray-400/30 to-gray-500/30 border-gray-400";
      case 3:
        return "bg-gradient-to-r from-amber-600/30 to-amber-700/30 border-amber-600";
      default:
        return "bg-white/5 border-fortune-gold/20";
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-fortune-gold text-xl">加载中...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-4 py-8">
      {/* 标题 */}
      <div className="text-center mb-6">
        <button
          onClick={() => router.back()}
          className="text-white/50 hover:text-white text-sm mb-4 block"
        >
          ← 返回
        </button>
        <div className="text-fortune-gold text-sm mb-2">🏆 财运排行榜 🏆</div>
        <h1 className="text-3xl font-bold text-white mb-2">
          2026财运总榜
        </h1>
        <p className="text-white/60 text-sm">
          共 {data?.totalUsers || 0} 人参与
        </p>
      </div>

      {/* 排行榜 */}
      <div className="w-full max-w-md fortune-card">
        {/* 表头 */}
        <div className="flex items-center justify-between p-3 border-b border-fortune-gold/30 text-white/60 text-sm">
          <div className="w-16">名次</div>
          <div className="flex-1">昵称</div>
          <div className="w-24 text-right">财富数量</div>
          <div className="w-16 text-right">排名</div>
        </div>

        {/* 排行列表 */}
        <div className="max-h-96 overflow-y-auto">
          {data?.leaderboard && data.leaderboard.length > 0 ? (
            data.leaderboard.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-3 border-b border-fortune-gold/10 hover:bg-white/5 transition-colors cursor-pointer ${getRankStyle(item.rank)}`}
                onClick={() => router.push(`/result/${item.id}`)}
              >
                <div className="w-16 text-lg">
                  {item.rank <= 3 ? (
                    <span className="text-2xl">{getRankIcon(item.rank)}</span>
                  ) : (
                    <span className="text-white/50">#{item.rank}</span>
                  )}
                </div>
                <div className="flex-1 text-white font-medium truncate pr-2">
                  {item.nickname}
                </div>
                <div className="w-24 text-right">
                  <span className="text-fortune-gold font-bold">{item.fortuneAmount}</span>
                  <span className="text-white/50 text-xs ml-1">万</span>
                </div>
                <div className="w-16 text-right text-white/50 text-sm">
                  {item.peakMonth}月
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-white/50">
              暂无数据，快来成为第一个！
            </div>
          )}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="w-full max-w-md mt-6 space-y-3">
        <button
          onClick={handleShareToBinance}
          className="w-full fortune-btn flex items-center justify-center gap-2"
        >
          <span>📢</span>
          分享到币安广场
        </button>
        
        <button
          onClick={() => router.push("/")}
          className="w-full px-8 py-3 border-2 border-fortune-gold text-fortune-gold rounded-lg hover:bg-fortune-gold/10 transition-all"
        >
          生成我的报告
        </button>
      </div>

      {/* 说明 */}
      <div className="w-full max-w-md mt-6 text-center text-white/40 text-xs">
        <p>排名根据 Gemini AI 计算的2026年财富预测值排序</p>
        <p className="mt-1">仅供娱乐，理性看待</p>
      </div>
    </main>
  );
}
