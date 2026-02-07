import fs from "fs";
import path from "path";
import { UserFortune } from "./types";

const dbPath = path.join(process.cwd(), "data", "fortunes.json");

// 确保数据目录存在
function ensureDataDir() {
  const dataDir = path.dirname(dbPath);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify([]), "utf-8");
  }
}

// 读取所有数据
function readData(): UserFortune[] {
  ensureDataDir();
  try {
    const data = fs.readFileSync(dbPath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// 写入数据
function writeData(data: UserFortune[]) {
  ensureDataDir();
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
}

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
  const fortunes = readData();
  
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
  
  fortunes.push(newFortune);
  writeData(fortunes);
}

export function getUserFortune(id: string): UserFortune | null {
  const fortunes = readData();
  return fortunes.find(f => f.id === id) || null;
}

export function getTopFortunes(limit: number = 100): UserFortune[] {
  const fortunes = readData();
  return fortunes
    .sort((a, b) => b.fortuneAmount - a.fortuneAmount)
    .slice(0, limit);
}

export function getUserRank(fortuneAmount: number): number {
  const fortunes = readData();
  const higherCount = fortunes.filter(f => f.fortuneAmount > fortuneAmount).length;
  return higherCount + 1;
}

export function getTotalUsers(): number {
  const fortunes = readData();
  return fortunes.length;
}
