export interface UserFortune {
  id: string;
  nickname: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  birthMinute: number;
  baziResult: string; // 八字结果 JSON
  fortuneAmount: number; // 2026年财富总量（用于排行）
  peakMonth: number; // 财运巅峰月份
  peakDescription: string; // 巅峰描述
  createdAt: string;
}

export interface FortuneResult {
  nickname: string;
  bazi: {
    year: string;
    month: string;
    day: string;
    hour: string;
  };
  baziDetails?: {
    dayMaster: string;           // 日主
    dayMasterElement: string;    // 日主五行
    elements: {                  // 五行统计
      金: number;
      木: number;
      水: number;
      火: number;
      土: number;
    };
    favorableElement: string;    // 用神
    strongElements: string[];    // 旺相五行
    weakElements: string[];      // 衰弱五行
  };
  fortuneAmount: number;
  peakMonth: number;
  peakDescription: string;
  analysis: string;
  luckyElements: string[];
  advice: string;
}

export interface CompatibilityResult {
  user1: {
    nickname: string;
    bazi: string;
  };
  user2: {
    nickname: string;
    bazi: string;
  };
  score: number; // 合盘分数 0-100
  analysis: string;
  strengths: string[];
  challenges: string[];
  advice: string;
}
