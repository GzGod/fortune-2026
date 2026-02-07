"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nickname: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    birthHour: "",
    birthMinute: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    // 验证生日输入
    const { birthYear, birthMonth, birthDay, birthHour, birthMinute } = formData;
    if (!birthYear || !birthMonth || !birthDay || !birthHour || birthMinute === "") {
      setError("请填写完整的出生时间");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmit = async () => {
    if (!formData.nickname.trim()) {
      setError("请输入昵称");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 移除超时限制，让请求自然完成（AI分析需要30-60秒）
      const response = await fetch("/api/fortune", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nickname: formData.nickname.trim(),
          birthYear: parseInt(formData.birthYear),
          birthMonth: parseInt(formData.birthMonth),
          birthDay: parseInt(formData.birthDay),
          birthHour: parseInt(formData.birthHour),
          birthMinute: parseInt(formData.birthMinute),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "生成报告失败");
      }

      // 跳转到结果页面
      router.push(`/result/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成报告失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  // 生成年份选项
  const years = Array.from({ length: 100 }, (_, i) => 2010 - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      {/* 春节装饰背景 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-32 h-32 bg-fortune-red/20 rounded-full blur-3xl" />
        <div className="absolute top-20 right-10 w-24 h-24 bg-fortune-gold/20 rounded-full blur-2xl" />
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-fortune-red/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* 标题 */}
        <div className="text-center mb-8">
          <div className="text-fortune-gold text-sm mb-2">🧧 2026蛇年 · 新春特别版 🧧</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            2026我的财运报告
          </h1>
          <p className="text-white/60 text-sm">
            基于八字命理，预测你的财运巅峰时刻
          </p>
        </div>

        {/* 表单卡片 */}
        <div className="fortune-card">
          {step === 1 ? (
            <>
              <h2 className="text-xl font-bold text-fortune-gold mb-6 text-center">
                输入出生时间
              </h2>
              
              {/* 年月日选择 */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <label className="block text-white/70 text-sm mb-1">年</label>
                  <select
                    name="birthYear"
                    value={formData.birthYear}
                    onChange={handleInputChange}
                    className="fortune-input text-sm"
                  >
                    <option value="">选择年</option>
                    {years.map(year => (
                      <option key={year} value={year} className="text-black">{year}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1">月</label>
                  <select
                    name="birthMonth"
                    value={formData.birthMonth}
                    onChange={handleInputChange}
                    className="fortune-input text-sm"
                  >
                    <option value="">选择月</option>
                    {months.map(month => (
                      <option key={month} value={month} className="text-black">{month}月</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1">日</label>
                  <select
                    name="birthDay"
                    value={formData.birthDay}
                    onChange={handleInputChange}
                    className="fortune-input text-sm"
                  >
                    <option value="">选择日</option>
                    {days.map(day => (
                      <option key={day} value={day} className="text-black">{day}日</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 时分选择 */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div>
                  <label className="block text-white/70 text-sm mb-1">时</label>
                  <select
                    name="birthHour"
                    value={formData.birthHour}
                    onChange={handleInputChange}
                    className="fortune-input text-sm"
                  >
                    <option value="">选择时</option>
                    {hours.map(hour => (
                      <option key={hour} value={hour} className="text-black">{hour}时</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-1">分</label>
                  <select
                    name="birthMinute"
                    value={formData.birthMinute}
                    onChange={handleInputChange}
                    className="fortune-input text-sm"
                  >
                    <option value="">选择分</option>
                    {minutes.map(minute => (
                      <option key={minute} value={minute} className="text-black">{minute}分</option>
                    ))}
                  </select>
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center mb-4">{error}</p>
              )}

              <button
                onClick={handleNextStep}
                className="fortune-btn w-full"
              >
                下一步
              </button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-fortune-gold mb-6 text-center">
                输入你的昵称
              </h2>
              
              <div className="mb-6">
                <input
                  type="text"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleInputChange}
                  placeholder="请输入昵称"
                  maxLength={20}
                  className="fortune-input text-center text-lg"
                />
              </div>

              {error && (
                <p className="text-red-400 text-sm text-center mb-4">{error}</p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-4 py-3 border-2 border-fortune-gold/50 text-fortune-gold rounded-lg hover:bg-fortune-gold/10 transition-all"
                >
                  上一步
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 fortune-btn disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "AI正在分析中，请耐心等待30-60秒..." : "生成报告"}
                </button>
              </div>
            </>
          )}
        </div>

        {/* 底部提示 */}
        <p className="text-center text-white/40 text-xs mt-6">
          仅供娱乐，理性看待
        </p>
      </div>
    </main>
  );
}
