import { NextResponse } from "next/server";

// 태그 사용 기록을 저장할 인터페이스
interface TagUsage {
  lastUsed: number;
  usageCount: number;
  cooldown: number; // 재사용 대기 시간 (밀리초)
}

// 메모리에 태그 사용 기록 저장
const tagUsages = new Map<string, TagUsage>();

export async function POST(request: Request) {
  try {
    const { tagId, timestamp, userAgent } = await request.json();

    // 태그 사용 기록 가져오기
    let usage = tagUsages.get(tagId);
    const now = Date.now();

    if (!usage) {
      // 새로운 태그인 경우
      usage = {
        lastUsed: now,
        usageCount: 1,
        cooldown: 1 * 60 * 1000, // 1분 쿨다운
      };
    } else {
      // 재사용 시도하는 경우
      const timeSinceLastUse = now - usage.lastUsed;

      // 쿨다운 체크
      if (timeSinceLastUse < usage.cooldown) {
        return NextResponse.json(
          {
            error:
              "태그를 너무 빨리 재사용했습니다. 잠시 후 다시 시도해주세요.",
          },
          { status: 429 }
        );
      }

      // 사용 기록 업데이트
      usage.lastUsed = now;
      usage.usageCount += 1;
    }

    // 태그 사용 기록 저장
    tagUsages.set(tagId, usage);

    return NextResponse.json({
      success: true,
      usageCount: usage.usageCount,
    });
  } catch (error) {
    console.error("Tag verification error:", error);
    return NextResponse.json(
      {
        error: "서버 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
