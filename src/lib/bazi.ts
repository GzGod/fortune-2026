import { Lunar, Solar } from "lunar-typescript";

// 天干
const HEAVENLY_STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];

// 地支
const EARTHLY_BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

// 五行
export const FIVE_ELEMENTS = {
  "金": ["庚", "辛", "申", "酉"],
  "木": ["甲", "乙", "寅", "卯"],
  "水": ["壬", "癸", "子", "亥"],
  "火": ["丙", "丁", "巳", "午"],
  "土": ["戊", "己", "辰", "戌", "丑", "未"],
};

// 五行属性映射
const ELEMENT_MAP: { [key: string]: string } = {
  "甲": "木", "乙": "木",
  "丙": "火", "丁": "火",
  "戊": "土", "己": "土",
  "庚": "金", "辛": "金",
  "壬": "水", "癸": "水",
  "子": "水", "丑": "土", "寅": "木", "卯": "木",
  "辰": "土", "巳": "火", "午": "火", "未": "土",
  "申": "金", "酉": "金", "戌": "土", "亥": "水"
};

export interface BaziPillar {
  stem: string;        // 天干
  branch: string;      // 地支
  combined: string;    // 组合（如"甲子"）
  element: string;     // 五行
}

export interface BaziInfo {
  year: BaziPillar;
  month: BaziPillar;
  day: BaziPillar;
  hour: BaziPillar;
  yearString: string;  // 年柱字符串
  monthString: string; // 月柱字符串
  dayString: string;   // 日柱字符串
  hourString: string;  // 时柱字符串
  elements: {          // 五行统计
    金: number;
    木: number;
    水: number;
    火: number;
    土: number;
  };
  dayMaster: string;   // 日主（天干）
  dayMasterElement: string; // 日主五行
  strongElements: string[]; // 旺相五行
  weakElements: string[];   // 衰弱五行
  favorableElement: string; // 用神（简化推导）
}

/**
 * 计算八字
 */
export function calculateBazi(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number = 0
): BaziInfo {
  // 使用 lunar-typescript 转换为农历
  const solar = Solar.fromYmd(year, month, day);
  const lunar = solar.getLunar();

  // 获取八字
  const eightChar = lunar.getEightChar();

  // 年柱
  const yearGan = eightChar.getYearGan();
  const yearZhi = eightChar.getYearZhi();
  const yearPillar: BaziPillar = {
    stem: yearGan,
    branch: yearZhi,
    combined: `${yearGan}${yearZhi}`,
    element: ELEMENT_MAP[yearGan] || "未知"
  };

  // 月柱
  const monthGan = eightChar.getMonthGan();
  const monthZhi = eightChar.getMonthZhi();
  const monthPillar: BaziPillar = {
    stem: monthGan,
    branch: monthZhi,
    combined: `${monthGan}${monthZhi}`,
    element: ELEMENT_MAP[monthGan] || "未知"
  };

  // 日柱
  const dayGan = eightChar.getDayGan();
  const dayZhi = eightChar.getDayZhi();
  const dayPillar: BaziPillar = {
    stem: dayGan,
    branch: dayZhi,
    combined: `${dayGan}${dayZhi}`,
    element: ELEMENT_MAP[dayGan] || "未知"
  };

  // 时柱
  const hourGan = eightChar.getTimeGan();
  const hourZhi = eightChar.getTimeZhi();
  const hourPillar: BaziPillar = {
    stem: hourGan,
    branch: hourZhi,
    combined: `${hourGan}${hourZhi}`,
    element: ELEMENT_MAP[hourGan] || "未知"
  };

  // 统计五行
  const elements = {
    金: 0,
    木: 0,
    水: 0,
    火: 0,
    土: 0
  };

  // 计算各柱的五行
  [yearPillar, monthPillar, dayPillar, hourPillar].forEach(pillar => {
    const stemElement = ELEMENT_MAP[pillar.stem];
    const branchElement = ELEMENT_MAP[pillar.branch];
    if (stemElement && stemElement in elements) {
      elements[stemElement as keyof typeof elements]++;
    }
    if (branchElement && branchElement in elements) {
      elements[branchElement as keyof typeof elements]++;
    }
  });

  // 确定旺相和衰弱五行
  const elementEntries = Object.entries(elements).sort((a, b) => b[1] - a[1]);
  const strongElements = elementEntries.filter(([_, count]) => count >= 2).map(([el]) => el);
  const weakElements = elementEntries.filter(([_, count]) => count === 0).map(([el]) => el);

  // 日主五行
  const dayMasterElement = ELEMENT_MAP[dayGan] || "未知";

  // 简化的用神推导：如果日主太旺，取克制之五行；如果日主太弱，取生扶之五行
  const dayMasterCount = elements[dayMasterElement as keyof typeof elements] || 0;
  let favorableElement = "金"; // 默认值

  if (dayMasterCount >= 3) {
    // 日主旺，需要克制
    const keZhi = {
      "金": "火",
      "木": "金",
      "水": "土",
      "火": "水",
      "土": "木"
    };
    favorableElement = keZhi[dayMasterElement as keyof typeof keZhi] || "金";
  } else if (dayMasterCount <= 1) {
    // 日主弱，需要生扶
    const shengFu = {
      "金": "土",
      "木": "水",
      "水": "金",
      "火": "木",
      "土": "火"
    };
    favorableElement = shengFu[dayMasterElement as keyof typeof shengFu] || "金";
  } else {
    // 日主中和，根据月令判断
    favorableElement = monthPillar.element;
  }

  return {
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
    yearString: yearPillar.combined,
    monthString: monthPillar.combined,
    dayString: dayPillar.combined,
    hourString: hourPillar.combined,
    elements,
    dayMaster: dayGan,
    dayMasterElement,
    strongElements,
    weakElements,
    favorableElement
  };
}

/**
 * 获取五行生克关系描述
 */
export function getElementRelation(element1: string, element2: string): string {
  const xiangSheng = {
    "金": "水", "水": "木", "木": "火", "火": "土", "土": "金"
  };
  const xiangKe = {
    "金": "木", "木": "土", "土": "水", "水": "火", "火": "金"
  };

  if (xiangSheng[element1 as keyof typeof xiangSheng] === element2) {
    return "相生";
  } else if (xiangKe[element1 as keyof typeof xiangKe] === element2) {
    return "相克";
  } else if (element1 === element2) {
    return "同类";
  } else {
    return "中和";
  }
}

/**
 * 获取八字强弱评分（用于财运计算）
 * 返回0-100的分数
 */
export function getBaziStrengthScore(bazi: BaziInfo): number {
  let score = 50; // 基础分

  // 五行平衡度（越平衡越高）
  const elementValues = Object.values(bazi.elements);
  const maxElement = Math.max(...elementValues);
  const minElement = Math.min(...elementValues);
  const balance = maxElement - minElement;
  score += (5 - balance) * 5; // 平衡度加分

  // 日主强度
  const dayMasterCount = bazi.elements[bazi.dayMasterElement as keyof typeof bazi.elements] || 0;
  if (dayMasterCount >= 2 && dayMasterCount <= 3) {
    score += 15; // 日主适中，加分
  } else if (dayMasterCount === 1 || dayMasterCount === 4) {
    score += 5;
  }

  // 用神在八字中的数量
  const favorableCount = bazi.elements[bazi.favorableElement as keyof typeof bazi.elements] || 0;
  score += favorableCount * 8;

  // 确保分数在0-100范围内
  return Math.max(0, Math.min(100, score));
}
