"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CompatibilityResult {
  user1: {
    nickname: string;
    bazi: string;
  };
  user2: {
    nickname: string;
    bazi: string;
  };
  score: number;
  analysis: string;
  strengths: string[];
  challenges: string[];
  advice: string;
}

export default function CompatibilityResultPage() {
  const router = useRouter();
  const [data, setData] = useState<CompatibilityResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("compatibilityResult");
    if (stored) {
      setData(JSON.parse(stored));
    } else {
      router.push("/compatibility");
    }
  }, [router]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-fortune-gold";
    if (score >= 40) return "text-yellow-500";
    return "text-orange-400";
  };

  const getScoreDescription = (score: number) => {
    if (score >= 90) return "天作之合";
    if (score >= 80) return "财运相旺";
    if (score >= 70) return "互利共赢";
    if (score >= 60) return "相辅相成";
    if (score >= 50) return "平稳发展";
    if (score >= 40) return "需要磨合";
    return "各有千秋";
  };

  if (!data) {
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
        <div className="text-fortune-gold text-sm mb-2">💰 合盘报告 💰</div>
        <h1 className="text-3xl font-bold text-white mb-2">
          合盘报告
        </h1>
      </div>

      {/* 两人信息 */}
      <div className="w-full max-w-md mb-6">
        <div className="flex items-center justify-center gap-4">
          <div className="text-center flex-1">
            <div className="w-16 h-16 mx-auto bg-fortune-gold/20 rounded-full flex items-center justify-center text-2xl mb-2">
              👤
            </div>
            <div className="text-fortune-gold font-bold">{data.user1.nickname}</div>
            <div className="text-white/50 text-xs mt-1">{data.user1.bazi}</div>
          </div>
          
          <div className="text-fortune-gold text-3xl">❤️</div>
          
          <div className="text-center flex-1">
            <div className="w-16 h-16 mx-auto bg-fortune-gold/20 rounded-full flex items-center justify-center text-2xl mb-2">
              👤
            </div>
            <div className="text-fortune-gold font-bold">{data.user2.nickname}</div>
            <div className="text-white/50 text-xs mt-1">{data.user2.bazi}</div>
          </div>
        </div>
      </div>

      {/* 合盘分数 */}
      <div className="w-full max-w-md fortune-card text-center mb-6">
        <div className="text-white/60 text-sm mb-2">财运契合度</div>
        <div className={`text-6xl font-bold ${getScoreColor(data.score)} mb-2`}>
          {data.score}
        </div>
        <div className="text-fortune-gold text-lg font-medium">
          {getScoreDescription(data.score)}
        </div>
        
        {/* 进度条 */}
        <div className="mt-4 bg-white/10 rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-fortune-red to-fortune-gold transition-all duration-1000"
            style={{ width: `${data.score}%` }}
          />
        </div>
      </div>

      {/* 详细分析 */}
      <div className="w-full max-w-md fortune-card mb-6">
        <h3 className="text-lg font-bold text-fortune-gold mb-3">合盘分析</h3>
        <p className="text-white/80 text-sm leading-relaxed">{data.analysis}</p>
      </div>

      {/* 优势与挑战 */}
      <div className="w-full max-w-md grid grid-cols-2 gap-4 mb-6">
        {/* 优势 */}
        <div className="fortune-card">
          <h4 className="text-fortune-gold font-bold mb-3 flex items-center gap-2">
            <span>✨</span> 优势
          </h4>
          <ul className="space-y-2">
            {data.strengths.map((item, index) => (
              <li key={index} className="text-white/70 text-sm flex items-start gap-2">
                <span className="text-green-400">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        
        {/* 挑战 */}
        <div className="fortune-card">
          <h4 className="text-fortune-gold font-bold mb-3 flex items-center gap-2">
            <span>⚡</span> 挑战
          </h4>
          <ul className="space-y-2">
            {data.challenges.map((item, index) => (
              <li key={index} className="text-white/70 text-sm flex items-start gap-2">
                <span className="text-yellow-400">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 建议 */}
      <div className="w-full max-w-md fortune-card mb-6">
        <h3 className="text-lg font-bold text-fortune-gold mb-3 flex items-center gap-2">
          <span>💡</span> 2026年合作建议
        </h3>
        <p className="text-white/80 text-sm leading-relaxed">{data.advice}</p>
      </div>

      {/* 操作按钮 */}
      <div className="w-full max-w-md space-y-3">
        <button
          onClick={() => router.push("/leaderboard")}
          className="w-full fortune-btn-red"
        >
          查看财运总榜
        </button>
        
        <button
          onClick={() => router.push("/")}
          className="w-full px-8 py-3 border-2 border-fortune-gold text-fortune-gold rounded-lg hover:bg-fortune-gold/10 transition-all"
        >
          生成新的报告
        </button>
      </div>

      {/* 说明 */}
      <p className="mt-6 text-white/40 text-xs text-center">
        仅供娱乐，理性看待
      </p>
    </main>
  );
}
