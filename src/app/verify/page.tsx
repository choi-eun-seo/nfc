
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("검증 중...");

  useEffect(() => {
    const verifyTag = async () => {
      try {
        const tagId = searchParams.get("id");
        if (!tagId) {
          setStatus("유효하지 않은 NFC 태그입니다.");
          return;
        }

        const response = await fetch("/api/verify-tag", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tagId,
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setStatus(data.error || "태그 검증 실패");
          return;
        }

        setStatus(`성공! ${data.usageCount}번째 사용`);
        // 성공 시 3초 후 스탬프 페이지로 이동
        setTimeout(() => {
          router.replace("/stamp");
        }, 3000);
      } catch (err) {
        console.error(err);
        setStatus("태그 검증 중 오류가 발생했습니다.");
      }
    };

    verifyTag();
  }, []);

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">NFC 태그 검증</h1>
      <p
        className={
          status.includes("오류") || status.includes("실패")
            ? "text-red-500"
            : "text-blue-500"
        }
      >
        {status}
      </p>
    </div>
  );
}
