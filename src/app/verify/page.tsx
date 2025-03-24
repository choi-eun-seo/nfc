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

        // 리퍼러 체크
        const referrer = document.referrer;
        const isDirectAccess =
          !referrer || !referrer.includes("nfc") || referrer.includes("verify");

        // 비정상 접근 체크
        if (isDirectAccess) {
          router.replace("/error?message=비정상적인_접근입니다");
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
