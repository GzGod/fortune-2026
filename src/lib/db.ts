import { UserFortune } from "./types";

// 内存存储版本 - Vercel serverless 兼容
// 注意：数据在服务重启后会丢失

const fortunesStore: UserFortune[] = [];

export function createUserFortune(data: {
  id: string;
  nickname: string;
  birthYear: number;
  birthMonth: number;
  birthDay: number;
  birthHour: number;
  birthMinute: number;
  baziResult: string;
  fortuneAmount: number;
  peakMonth: number;
  peakDescription: string;
}): void {
  const newFortune: UserFortune = {
    id: data.id,
    nickname: data.nickname,
    birthYear: data.birthYear,
    birthMonth: data.birthMonth,
    birthDay: data.birthDay,
    birthHour: data.birthHour,
    birthMinute: data.birthMinute,
    baziResult: data.baziResult,
    fortuneAmount: data.fortuneAmount,
    peakMonth: data.peakMonth,
    peakDescription: data.peakDescription,
    createdAt: new Date().toISOString(),
  };

  fortunesStore.push(newFortune);
  console.log(`Created fortune for ${data.nickname}, total records: ${fortunesStore.length}`);
}

export function getUserFortune(id: string): UserFortune | null {
  return fortunesStore.find(f => f.id === id) || null;
}

export function getTopFortunes(limit: number = 100): UserFortune[] {
  return [...fortunesStore]
    .sort((a, b) => b.fortuneAmount - a.fortuneAmount)
    .slice(0, limit);
}

export function getUserRank(fortuneAmount: number): number {
  const higherCount = fortunesStore.filter(f => f.fortuneAmount > fortuneAmount).length;
  return higherCount + 1;
}

export function getTotalUsers(): number {
  return fortunesStore.length;
}
