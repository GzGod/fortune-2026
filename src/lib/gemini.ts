import { FortuneResult, CompatibilityResult } from "./types";
import { calculateBazi, getBaziStrengthScore, BaziInfo } from "./bazi";

// 第三方Gemini API配置（硬编码）
const GEMINI_API_KEY = "sk-MsTCp4N9Zy0kfrpnMSY9WXzickYVqEAeM0Ks8ei4I7Eqz2ze";
const GEMINI_API_ENDPOINT = "https://max.openai365.top/v1";
const GEMINI_MODEL = "gemini-3-pro-preview";

/**
 * 调用第三方Gemini API（OpenAI兼容格式）
 */
async function callGeminiAPI(prompt: string): Promise<string> {
  console.log("Calling Gemini API:", GEMINI_API_ENDPOINT);
  console.log("Model:", GEMINI_MODEL);

  const response = await fetch(`${GEMINI_API_ENDPOINT}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GEMINI_API_KEY}`,
    },
    body: JSON.stringify({
      model: GEMINI_MODEL,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    }),
  });

  console.log("API Response status:", response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("API Error Response:", errorText);
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  console.log("API Response data:", JSON.stringify(data).substring(0, 200));

  if (!data.choices || !data.choices[0] || !data.choices[0].message) {
    console.error("Unexpected API response structure:", data);
    throw new Error("Invalid API response structure");
  }

  return data.choices[0].message.content || "";
}

export async function generateFortuneReport(
  nickname: string,
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  birthHour: number,
  birthMinute: number
): Promise<FortuneResult> {
  // 使用专业的八字计算
  const baziInfo = calculateBazi(birthYear, birthMonth, birthDay, birthHour, birthMinute);
  const baziString = `${baziInfo.yearString} ${baziInfo.monthString} ${baziInfo.dayString} ${baziInfo.hourString}`;

  // 计算八字强度分数，用于财运基础值
  const strengthScore = getBaziStrengthScore(baziInfo);

  // 五行统计信息
  const elementsInfo = Object.entries(baziInfo.elements)
    .map(([el, count]) => `${el}:${count}`)
    .join(", ");

  const prompt = `你是一位精通中国传统命理学的大师，特别擅长八字财运分析。请根据以下详细八字信息，为用户预测2026年（丙午蛇年）的财运。

用户信息：
- 昵称: ${nickname}
- 出生时间: ${birthYear}年${birthMonth}月${birthDay}日${birthHour}时${birthMinute}分
- 八字: ${baziString}
- 日主: ${baziInfo.dayMaster}（${baziInfo.dayMasterElement}）
- 五行分布: ${elementsInfo}
- 用神: ${baziInfo.favorableElement}
- 旺相五行: ${baziInfo.strongElements.join("、") || "无"}
- 衰弱五行: ${baziInfo.weakElements.join("、") || "无"}

请以JSON格式返回以下信息（只返回JSON，不要有其他文字）：
{
  "fortuneAmount": <number, 2026年预测可获得的财富总量，单位万元人民币，范围${Math.max(50, strengthScore * 30)}-${strengthScore * 50}，根据日主强弱、用神得力、五行平衡度来综合判断>,
  "peakMonth": <number, 1-12, 财运最旺的月份，优先考虑与用神相关的月份>,
  "peakDescription": "<string, 对巅峰月份的简短描述，20字以内，需结合五行特点>",
  "analysis": "<string, 详细的财运分析，150-200字，包含：1)日主${baziInfo.dayMaster}(${baziInfo.dayMasterElement})在2026年的状态 2)用神${baziInfo.favorableElement}的作用 3)五行平衡对财运的影响 4)具体的财运走势>",
  "luckyElements": ["<string, 与用神${baziInfo.favorableElement}相关的开运要素1>", "<string, 开运要素2>", "<string, 开运要素3>"],
  "advice": "<string, 2026年招财建议，60字以内，结合五行特点给出实用建议>"
}

注意：
1. 财富数量要基于八字强弱合理计算，体现个性化差异
2. 分析要专业，融合五行生克理论和春节元素
3. 保持积极正面但客观的语气
4. 建议要实用，与用户的五行特点相关`;

  try {
    const text = await callGeminiAPI(prompt);

    // 提取JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse Gemini response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    return {
      nickname,
      bazi: {
        year: baziInfo.yearString,
        month: baziInfo.monthString,
        day: baziInfo.dayString,
        hour: baziInfo.hourString,
      },
      baziDetails: {
        dayMaster: baziInfo.dayMaster,
        dayMasterElement: baziInfo.dayMasterElement,
        elements: baziInfo.elements,
        favorableElement: baziInfo.favorableElement,
        strongElements: baziInfo.strongElements,
        weakElements: baziInfo.weakElements,
      },
      fortuneAmount: parsed.fortuneAmount || Math.floor(strengthScore * 10),
      peakMonth: parsed.peakMonth || 6,
      peakDescription: parsed.peakDescription || "财运亨通",
      analysis: parsed.analysis || `您的日主为${baziInfo.dayMaster}（${baziInfo.dayMasterElement}），2026年财运平稳发展。`,
      luckyElements: parsed.luckyElements || [baziInfo.favorableElement + "色", "吉方位", "幸运数字"],
      advice: parsed.advice || "2026年宜顺应五行，把握机遇。",
    };
  } catch (error) {
    console.error("Gemini API error:", error);
    // 返回默认值
    const defaultAmount = Math.floor(50 + strengthScore * 8);
    const defaultMonth = Math.floor(Math.random() * 12) + 1;

    return {
      nickname,
      bazi: {
        year: baziInfo.yearString,
        month: baziInfo.monthString,
        day: baziInfo.dayString,
        hour: baziInfo.hourString,
      },
      baziDetails: {
        dayMaster: baziInfo.dayMaster,
        dayMasterElement: baziInfo.dayMasterElement,
        elements: baziInfo.elements,
        favorableElement: baziInfo.favorableElement,
        strongElements: baziInfo.strongElements,
        weakElements: baziInfo.weakElements,
      },
      fortuneAmount: defaultAmount,
      peakMonth: defaultMonth,
      peakDescription: `${defaultMonth}月${baziInfo.favorableElement}旺财星高照`,
      analysis: `您的日主为${baziInfo.dayMaster}（${baziInfo.dayMasterElement}），八字${baziString}。2026蛇年您的财运整体呈现上升趋势。命盘显示用神为${baziInfo.favorableElement}，在流年中得力，有望在事业和投资方面获得可观收益。建议多在${baziInfo.favorableElement}相关领域发展。`,
      luckyElements: [baziInfo.favorableElement + "色饰品", "五行" + baziInfo.favorableElement + "方位", "幸运数字"],
      advice: `2026年宜顺应${baziInfo.favorableElement}之气，把握上半年的投资机会，注重五行平衡。`,
    };
  }
}

export async function generateCompatibilityReport(
  user1: {
    nickname: string;
    birthYear: number;
    birthMonth: number;
    birthDay: number;
    birthHour: number;
    birthMinute: number;
  },
  user2: {
    nickname: string;
    birthYear: number;
    birthMonth: number;
    birthDay: number;
    birthHour: number;
    birthMinute: number;
  }
): Promise<CompatibilityResult> {
  // 使用专业的八字计算
  const baziInfo1 = calculateBazi(user1.birthYear, user1.birthMonth, user1.birthDay, user1.birthHour, user1.birthMinute);
  const baziInfo2 = calculateBazi(user2.birthYear, user2.birthMonth, user2.birthDay, user2.birthHour, user2.birthMinute);

  const baziString1 = `${baziInfo1.yearString} ${baziInfo1.monthString} ${baziInfo1.dayString} ${baziInfo1.hourString}`;
  const baziString2 = `${baziInfo2.yearString} ${baziInfo2.monthString} ${baziInfo2.dayString} ${baziInfo2.hourString}`;

  // 五行信息
  const elements1 = Object.entries(baziInfo1.elements).map(([el, count]) => `${el}:${count}`).join(", ");
  const elements2 = Object.entries(baziInfo2.elements).map(([el, count]) => `${el}:${count}`).join(", ");

  const prompt = `你是一位精通中国传统命理学的大师，特别擅长八字合盘分析。请分析以下两人的财运合盘：

用户1信息：
- 昵称: ${user1.nickname}
- 八字: ${baziString1}
- 日主: ${baziInfo1.dayMaster}（${baziInfo1.dayMasterElement}）
- 五行分布: ${elements1}
- 用神: ${baziInfo1.favorableElement}

用户2信息：
- 昵称: ${user2.nickname}
- 八字: ${baziString2}
- 日主: ${baziInfo2.dayMaster}（${baziInfo2.dayMasterElement}）
- 五行分布: ${elements2}
- 用神: ${baziInfo2.favorableElement}

请以JSON格式返回两人在2026年（丙午蛇年）的财运合盘分析（只返回JSON，不要有其他文字）：
{
  "score": <number, 0-100, 财运合盘分数，基于：1)两人日主五行的生克关系 2)用神是否互补 3)五行平衡度的配合>,
  "analysis": "<string, 详细的合盘分析，180-250字，说明：1)两人日主的相互作用 2)五行互补情况 3)用神配合度 4)2026年的财运走势>",
  "strengths": ["<string, 基于五行相生的优势1>", "<string, 优势2>", "<string, 优势3>"],
  "challenges": ["<string, 基于五行相克的挑战1>", "<string, 挑战2>"],
  "advice": "<string, 2026年合作/共同理财建议，80字以内，结合两人五行特点>"
}

注意：
1. 分析要专业，融入五行生克理论
2. 结合两人的日主、用神特点给出个性化建议
3. 保持积极正面但客观的语气
4. 合盘分数要合理反映五行配合度`;

  try {
    const text = await callGeminiAPI(prompt);
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Failed to parse Gemini response");
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    return {
      user1: { nickname: user1.nickname, bazi: baziString1 },
      user2: { nickname: user2.nickname, bazi: baziString2 },
      score: parsed.score || 75,
      analysis: parsed.analysis || "两人财运相辅相成",
      strengths: parsed.strengths || ["互补性强", "共同目标明确", "沟通顺畅"],
      challenges: parsed.challenges || ["需注意投资节奏", "避免冲动决策"],
      advice: parsed.advice || "2026年适合共同规划长期投资计划",
    };
  } catch (error) {
    console.error("Gemini API error:", error);

    // 根据五行相生相克计算基础分数
    let defaultScore = 60;
    if (baziInfo1.dayMasterElement === baziInfo2.dayMasterElement) {
      defaultScore += 10; // 同类加分
    }
    if (baziInfo1.favorableElement === baziInfo2.favorableElement) {
      defaultScore += 15; // 用神相同加分
    }
    defaultScore += Math.floor(Math.random() * 15);

    return {
      user1: { nickname: user1.nickname, bazi: baziString1 },
      user2: { nickname: user2.nickname, bazi: baziString2 },
      score: defaultScore,
      analysis: `根据${user1.nickname}（日主${baziInfo1.dayMaster}·${baziInfo1.dayMasterElement}）和${user2.nickname}（日主${baziInfo2.dayMaster}·${baziInfo2.dayMasterElement}）的八字分析，两人在2026年的财运有良好的互补性。用神分别为${baziInfo1.favorableElement}和${baziInfo2.favorableElement}，五行配置合理。在流年丙午的影响下，两人若能发挥各自优势，有望在合作中获得意想不到的收益。`,
      strengths: [
        `${baziInfo1.dayMasterElement}${baziInfo2.dayMasterElement}相配和谐`,
        `用神${baziInfo1.favorableElement}${baziInfo2.favorableElement}互补`,
        "五行平衡利于财运"
      ],
      challenges: ["需协调投资节奏", "注意五行平衡"],
      advice: `建议在2026年发挥各自五行优势，${user1.nickname}可侧重${baziInfo1.favorableElement}相关领域，${user2.nickname}可侧重${baziInfo2.favorableElement}相关领域，互补共赢。`,
    };
  }
}
