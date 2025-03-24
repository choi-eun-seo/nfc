// import { NextResponse } from "next/server";

// // 태그 사용 기록을 저장할 인터페이스
// interface TagUsage {
//   lastUsed: number;
//   usageCount: number;
//   cooldown: number; // 재사용 대기 시간 (밀리초)
// }

// // 메모리에 태그 사용 기록 저장
// const tagUsages = new Map<string, TagUsage>();

// export async function POST(request: Request) {
//   try {
//     const { tagId, timestamp, userAgent } = await request.json();

//     // 태그 사용 기록 가져오기
//     let usage = tagUsages.get(tagId);
//     const now = Date.now();

//     if (!usage) {
//       // 새로운 태그인 경우
//       usage = {
//         lastUsed: now,
//         usageCount: 1,
//         cooldown: 1 * 60 * 1000, // 1분 쿨다운
//       };
//     } else {
//       // 재사용 시도하는 경우
//       const timeSinceLastUse = now - usage.lastUsed;

//       // 쿨다운 체크
//       if (timeSinceLastUse < usage.cooldown) {
//         return NextResponse.json(
//           {
//             error:
//               "태그를 너무 빨리 재사용했습니다. 잠시 후 다시 시도해주세요.",
//           },
//           { status: 429 }
//         );
//       }

//       // 사용 기록 업데이트
//       usage.lastUsed = now;
//       usage.usageCount += 1;
//     }

//     // 태그 사용 기록 저장
//     tagUsages.set(tagId, usage);

//     return NextResponse.json({
//       success: true,
//       usageCount: usage.usageCount,
//     });
//   } catch (error) {
//     console.error("Tag verification error:", error);
//     return NextResponse.json(
//       {
//         error: "서버 오류가 발생했습니다.",
//       },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import CryptoJS from "crypto-js";

// const SECRET_KEY = process.env.NEXT_PUBLIC_TAG_SECRET_KEY || "your-secret-key";
const SECRET_KEY = "your-secret-key-123";
// 사용된 토큰을 저장할 Set (실제로는 DB 사용)
const usedTokens = new Set<string>();

interface VerifyRequest {
  picc: string; // 태그 물리적 ID
  enc: string; // 암호화된 데이터
  cmac: string; // 검증용 MAC
}

export async function POST(request: Request) {
  try {
    const { picc, enc, cmac } = (await request.json()) as VerifyRequest;

    // 1. 이미 사용된 토큰인지 확인
    if (usedTokens.has(enc)) {
      return NextResponse.json(
        {
          error: "이미 사용된 태그입니다.",
        },
        { status: 400 }
      );
    }

    // 2. 타임스탬프 확인 (5분 제한)
    const timestamp = extractTimestamp(enc);
    if (Date.now() - timestamp > 5 * 60 * 1000) {
      return NextResponse.json(
        {
          error: "만료된 태그입니다.",
        },
        { status: 400 }
      );
    }

    // 3. MAC 검증
    const expectedMac = calculateMAC(picc + enc);
    if (expectedMac !== cmac) {
      return NextResponse.json(
        {
          error: "유효하지 않은 태그입니다.",
        },
        { status: 400 }
      );
    }

    // 4. 토큰 사용 처리
    usedTokens.add(enc);

    // 5. 데이터 복호화
    const decryptedData = decryptData(enc);

    return NextResponse.json({
      success: true,
      data: decryptedData,
    });
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      {
        error: "검증 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

// 유틸리티 함수들
function extractTimestamp(enc: string): number {
  // enc에서 타임스탬프 추출 (실제 구현 필요)
  const decrypted = decryptData(enc);
  return decrypted.timestamp;
}

function calculateMAC(data: string): string {
  return CryptoJS.HmacSHA256(data, SECRET_KEY).toString();
}

function decryptData(enc: string): any {
  const bytes = CryptoJS.AES.decrypt(enc, SECRET_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}