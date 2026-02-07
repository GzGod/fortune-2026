"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface UserData {
  nickname: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  birthMinute: number;
}

function CompatibilityContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const [user1Data, setUser1Data] = useState<UserData | null>(null);
  const [user2Form, setUser2Form] = useState({
    nickname: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    birthHour: "",
    birthMinute: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 获取用户1的数据
  useEffect(() => {
    const fetchUser1 = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`/api/fortune/${userId}`);
        if (response.ok) {
          const data = await response.json();
          setUser1Data({
            nickname: data.nickname,
            birthYear: data.birthYear,
            birthMonth: data.birthMonth,
            birthDay: data.birthDay,
            birthHour: data.birthHour,
            birthMinute: data.birthMinute,
          });
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      }
    };

    fetchUser1();
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUser2Form(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    // 验证输入
    const { nickname, birthYear, birthMonth, birthDay, birthHour, birthMinute } = user2Form;
    if (!nickname || !birthYear || !birthMonth || !birthDay || !birthHour || birthMinute === "") {
      setError("请填写完整的好友信息");
      return;
    }

    if (!user1Data) {
      setError("缺少您的数据，请先生成报告");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/compatibility", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user1: user1Data,
          user2: {
            nickname: nickname.trim(),
            birthYear: parseInt(birthYear),
            birthMonth: parseInt(birthMonth),
            birthDay: parseInt(birthDay),
            birthHour: parseInt(birthHour),
            birthMinute: parseInt(birthMinute),
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "生成报告失败");
      }

      // 将结果保存到 sessionStorage 并跳转
      sessionStorage.setItem("compatibilityResult", JSON.stringify(data));
      router.push("/compatibility/result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成报告失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  const years = Array.from({ length: 100 }, (_, i) => 2010 - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

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
        <div className="text-fortune-gold text-sm mb-2">💰 财运合盘 💰</div>
        <h1 className="text-3xl font-bold text-white mb-2">
          财运合盘
        </h1>
        <p className="text-white/60 text-sm">
          查看与朋友的财运契合度
        </p>
      </div>

      {/* 用户1信息 */}
      {user1Data && (
        <div className="w-full max-w-md mb-4">
          <div className="fortune-card text-center">
            <div className="text-white/60 text-sm mb-1">你的信息</div>
            <div className="text-fortune-gold font-bold text-lg">{user1Data.nickname}</div>
            <div className="text-white/50 text-xs mt-1">
              {user1Data.birthYear}年{user1Data.birthMonth}月{user1Data.birthDay}日 {user1Data.birthHour}时{user1Data.birthMinute}分
            </div>
          </div>
        </div>
      )}

      {!user1Data && !userId && (
        <div className="w-full max-w-md mb-4 fortune-card text-center">
          <p className="text-white/60">请先生成你的财运报告</p>
          <button
            onClick={() => router.push("/")}
            className="fortune-btn mt-4"
          >
            去生成报告
          </button>
        </div>
      )}

      {/* 用户2输入表单 */}
      {user1Data && (
        <div className="w-full max-w-md fortune-card">
          <h2 className="text-xl font-bold text-fortune-gold mb-6 text-center">
            输入好友信息
          </h2>

          {/* 昵称 */}
          <div className="mb-4">
            <label className="block text-white/70 text-sm mb-1">好友昵称</label>
            <input
              type="text"
              name="nickname"
              value={user2Form.nickname}
              onChange={handleInputChange}
              placeholder="请输入好友昵称"
              maxLength={20}
              className="fortune-input"
            />
          </div>
          
          {/* 年月日选择 */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-white/70 text-sm mb-1">年</label>
              <select
                name="birthYear"
                value={user2Form.birthYear}
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
                value={user2Form.birthMonth}
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
                value={user2Form.birthDay}
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
                value={user2Form.birthHour}
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
                value={user2Form.birthMinute}
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
            onClick={handleSubmit}
            disabled={loading}
            className="w-full fortune-btn disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "计算中..." : "生成合盘报告"}
          </button>
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

export default function CompatibilityPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-white/60">加载中...</div>
      </main>
    }>
      <CompatibilityContent />
    </Suspense>
  );
}
