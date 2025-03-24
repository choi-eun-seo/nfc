"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyTag = async () => {
      try {
        const picc = searchParams.get("picc_data");
        const enc = searchParams.get("enc");
        const cmac = searchParams.get("cmac");

        // 1. 리퍼러(Referrer) 체크
        const referrer = document.referrer;
        const isDirectAccess =
          !referrer || !referrer.includes("nfc") || referrer.includes("verify");

        // 2. 페이지 로드 시간 체크 (NFC 태그는 보통 빠르게 로드됨)
        const loadTime = performance.now();
        const isSuspiciousLoadTime = loadTime > 3000; // 3초 이상 걸리면 의심

        // 3. 네비게이션 타입 체크
        const navType = performance.getEntriesByType(
          "navigation"
        )[0] as PerformanceNavigationTiming;
        const isReloadOrBack =
          navType.type === "reload" || navType.type === "back_forward";

        // 의심스러운 접근 체크
        if (isDirectAccess || isSuspiciousLoadTime || isReloadOrBack) {
          router.replace("/error?message=비정상적인_접근입니다");
          return;
        }

        // 정상적인 파라미터 체크
        if (!picc || !enc || !cmac) {
          router.replace("/error?message=유효하지_않은_태그입니다");
          return;
        }

        // API 호출 및 검증
        const response = await fetch("/api/verify-tag", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            picc,
            enc,
            cmac,
            loadTime,
            referrer,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          router.replace(
            `/error?message=${encodeURIComponent(data.error || "태그_검증_실패")}`
          );
          return;
        }

        router.replace("/stamp");
      } catch (err) {
        console.error(err);
        router.replace("/error?message=시스템_오류가_발생했습니다");
      }
    };

    verifyTag();
  }, [router, searchParams]);

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">NFC 태그 검증 중...</h1>
    </div>
  );
}
