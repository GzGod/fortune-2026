"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";

interface FortuneData {
  id: string;
  nickname: string;
  fortuneAmount: number;
  peakMonth: number;
  peakDescription: string;
  rank: number;
  totalUsers: number;
  bazi?: {
    year: string;
    month: string;
    day: string;
    hour: string;
  };
  analysis?: string;
  luckyElements?: string[];
  advice?: string;
}

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const [data, setData] = useState<FortuneData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const posterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/fortune/${params.id}`);
        if (!response.ok) {
          throw new Error("报告不存在");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "加载失败");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchData();
    }
  }, [params.id]);

  const handleDownload = async () => {
    if (!posterRef.current) return;

    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(posterRef.current, {
        scale: 3, // 提高清晰度
        backgroundColor: null,
        useCORS: true,
        logging: false,
        windowWidth: posterRef.current.scrollWidth,
        windowHeight: posterRef.current.scrollHeight,
      });

      const link = document.createElement("a");
      link.download = `${data?.nickname || "财运"}-2026财运报告.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("下载失败:", err);
      alert("下载失败，请重试");
    }
  };

  const siteUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/result/${params.id}` 
    : "";

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-fortune-gold text-xl">加载中...</div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-red-400 text-xl mb-4">{error || "报告不存在"}</div>
        <button onClick={() => router.push("/")} className="fortune-btn">
          返回首页
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-4 py-8">
      {/* 海报区域 */}
      <div
        ref={posterRef}
        className="relative w-full max-w-sm bg-gradient-to-b from-red-900 via-red-800 to-red-900 rounded-2xl overflow-hidden shadow-2xl border-4 border-fortune-gold/50"
      >
        {/* 顶部装饰 */}
        <div className="bg-gradient-to-r from-fortune-gold via-yellow-400 to-fortune-gold p-4 text-center relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl lantern-swing">🏮</div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl lantern-swing" style={{ animationDelay: '1s' }}>🏮</div>
          <div className="text-red-900 text-sm font-bold">🧧 2026蛇年 · 新春特别版 🧧</div>
        </div>

        {/* 祥云装饰背景 */}
        <div className="absolute top-20 left-0 text-6xl opacity-10">☁️</div>
        <div className="absolute top-40 right-0 text-5xl opacity-10">☁️</div>
        <div className="absolute bottom-32 left-0 text-5xl opacity-10">☁️</div>

        {/* 主体内容 */}
        <div className="relative p-6 text-center">
          <h1 className="text-3xl font-bold text-fortune-gold mb-3">
            财运巅峰预测
          </h1>

          <div className="text-white/80 text-base mb-6">
            {data.nickname} 的2026年财运报告
          </div>

          {/* 财富数量 - 增强版 */}
          <div className="bg-gradient-to-br from-black/40 to-black/20 rounded-2xl p-8 mb-6 border-2 border-fortune-gold/30 relative overflow-hidden">
            {/* 闪光装饰 */}
            <div className="absolute top-2 right-2 text-2xl sparkle">✨</div>
            <div className="absolute bottom-2 left-2 text-2xl sparkle" style={{ animationDelay: '0.5s' }}>✨</div>

            <div className="text-white/70 text-sm mb-3 font-medium">💰 财富最高可达 💰</div>
            <div className="text-5xl md:text-6xl font-bold text-fortune-gold mb-2 gold-glow">
              {data.fortuneAmount}
            </div>
            <div className="text-fortune-gold text-xl font-semibold">万人民币</div>

            {/* 金币装饰 */}
            <div className="flex justify-center gap-1 mt-3 opacity-60">
              <span className="text-xl float-animation">💰</span>
              <span className="text-xl float-animation" style={{ animationDelay: '0.3s' }}>💰</span>
              <span className="text-xl float-animation" style={{ animationDelay: '0.6s' }}>💰</span>
            </div>
          </div>

          {/* 巅峰时期 */}
          <div className="bg-gradient-to-br from-black/30 to-black/10 rounded-xl p-5 mb-6 border border-fortune-gold/20">
            <div className="text-white/70 text-sm mb-2 font-medium">🚀 巅峰时期</div>
            <div className="text-3xl font-bold text-white mb-1">
              2026年{data.peakMonth}月
            </div>
            <div className="text-fortune-gold text-base mt-2 font-medium">
              {data.peakDescription}
            </div>
          </div>

          {/* 排名 */}
          <div className="text-white/80 text-base mb-5 bg-black/20 py-3 px-4 rounded-lg inline-block">
            在 CT 榜单中排名第 <span className="text-fortune-gold font-bold text-2xl pulse-animation">{data.rank}</span> 名
          </div>

          {/* 八字信息 */}
          {data.bazi && (
            <div className="flex justify-center gap-2 mb-6">
              {Object.values(data.bazi).map((pillar, index) => (
                <div key={index} className="bg-gradient-to-br from-fortune-gold/30 to-fortune-gold/10 px-4 py-2 rounded-lg text-fortune-gold text-base font-semibold border border-fortune-gold/30">
                  {pillar}
                </div>
              ))}
            </div>
          )}

          {/* 二维码 - 增强版 */}
          <div className="flex flex-col items-center">
            <div className="qr-decoration">
              <QRCodeSVG value={siteUrl} size={100} />
            </div>
            <div className="text-white/60 text-sm mt-3 font-medium">📱 扫码查看你的财运报告</div>
          </div>

          {/* 底部装饰 */}
          <div className="flex justify-center gap-2 mt-4 text-xl opacity-70">
            <span>🎊</span>
            <span>🧧</span>
            <span>🎉</span>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="w-full max-w-sm mt-6 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => router.push("/leaderboard")}
            className="fortune-btn-red text-sm py-3"
          >
            看财运总榜
          </button>
          <button
            onClick={() => router.push(`/compatibility?userId=${params.id}`)}
            className="fortune-btn-red text-sm py-3"
          >
            看财运合盘
          </button>
        </div>
        
        <button
          onClick={() => setShowShareModal(true)}
          className="w-full fortune-btn"
        >
          分享海报
        </button>
        
        <button
          onClick={handleDownload}
          className="w-full px-8 py-3 border-2 border-fortune-gold text-fortune-gold rounded-lg hover:bg-fortune-gold/10 transition-all"
        >
          下载海报
        </button>
      </div>

      {/* 详细分析（可选显示） */}
      {data.analysis && (
        <div className="w-full max-w-sm mt-6 fortune-card">
          <h3 className="text-lg font-bold text-fortune-gold mb-3">详细分析</h3>
          <p className="text-white/80 text-sm leading-relaxed">{data.analysis}</p>
          
          {data.luckyElements && data.luckyElements.length > 0 && (
            <div className="mt-4">
              <div className="text-fortune-gold text-sm mb-2">开运要素</div>
              <div className="flex flex-wrap gap-2">
                {data.luckyElements.map((element, index) => (
                  <span key={index} className="bg-fortune-gold/20 px-3 py-1 rounded-full text-fortune-gold text-xs">
                    {element}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {data.advice && (
            <div className="mt-4 p-3 bg-fortune-gold/10 rounded-lg">
              <div className="text-fortune-gold text-sm mb-1">💡 建议</div>
              <p className="text-white/70 text-sm">{data.advice}</p>
            </div>
          )}
        </div>
      )}

      {/* 分享弹窗 */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-fortune-dark rounded-2xl p-6 w-full max-w-sm border border-fortune-gold/30">
            <h3 className="text-xl font-bold text-fortune-gold mb-4 text-center">分享海报</h3>
            
            <div className="space-y-3">
              <div className="flex justify-center mb-4">
                <div className="bg-white p-4 rounded-xl">
                  <QRCodeSVG value={siteUrl} size={150} />
                </div>
              </div>
              
              <p className="text-white/60 text-center text-sm mb-4">
                扫描二维码或复制链接分享给朋友
              </p>
              
              <button
                onClick={() => {
                  navigator.clipboard.writeText(siteUrl);
                  alert("链接已复制");
                }}
                className="w-full fortune-btn"
              >
                复制链接
              </button>
              
              <button
                onClick={handleDownload}
                className="w-full px-4 py-3 border-2 border-fortune-gold text-fortune-gold rounded-lg hover:bg-fortune-gold/10 transition-all"
              >
                下载海报图片
              </button>
            </div>
            
            <button
              onClick={() => setShowShareModal(false)}
              className="w-full mt-4 text-white/50 hover:text-white transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {/* 返回首页 */}
      <button
        onClick={() => router.push("/")}
        className="mt-6 text-white/50 hover:text-white transition-colors text-sm"
      >
        ← 返回首页
      </button>
    </main>
  );
}
