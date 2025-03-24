"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("검증 중...");

  useEffect(() => {
    const verifyTag = async () => {
      try {
        const picc = searchParams.get("picc_data");
        const enc = searchParams.get("enc");
        const cmac = searchParams.get("cmac");

        // 1. 네비게이션 타입 체크
        const navEntry = performance.getEntriesByType(
          "navigation"
        )[0] as PerformanceNavigationTiming;

        // 2. 접근 방식 검증
        const isNFCAccess =
          navEntry.type === "navigate" && // 직접 네비게이션
          //   navEntry.loadEventTime < 2000 && // 빠른 로드 시간
          !document.referrer && // 리퍼러 없음 (NFC는 보통 리퍼러가 없음)
          window.history.length === 1; // 첫 페이지 방문

        // 3. 비정상 접근 체크
        if (!isNFCAccess) {
          console.log("Access Type:", {
            type: navEntry.type,
            // loadTime: navEntry.loadEventTime,
            referrer: document.referrer,
            historyLength: window.history.length,
          });
          alert(navEntry.type + " " + document.referrer + " " + window.history.length);
          router.replace("/error?message=NFC_태그를_통해_접근해주세요");
          return;
        }

        if (!picc || !enc || !cmac) {
          router.replace("/error?message=유효하지_않은_태그입니다");
          return;
        }

        const response = await fetch("/api/verify-tag", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            picc,
            enc,
            cmac,
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
      <h1 className="text-2xl font-bold mb-4">NFC 태그 검증</h1>
      <p>{status}</p>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="p-4 text-center">
          <h1 className="text-2xl font-bold mb-4">로딩 중...</h1>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
