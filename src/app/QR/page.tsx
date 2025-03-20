"use client";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

export default function QRPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    const referrer = document.referrer;
    const currentURL = window.location.href;

    // GitHub Pages의 baseURL 확인
    const isGitHubPages = currentURL.includes("choi-eun-seo.github.io");

    // QR 코드 접근 확인
    const isValidAccess =
      referrer.includes("choi-eun-seo.github.io") ||
      referrer === "" || // QR 스캔으로 직접 접근한 경우
      isGitHubPages;

    if (!isValidAccess) {
      setError("QR 스캔을 통해서만 접근 가능합니다.");
      return;
    }

    try {
      const uniqueToken = uuidv4();
      // GitHub Pages의 baseURL을 고려한 라우팅
      const basePath = isGitHubPages ? "/nfc" : "";
      router.replace(`${basePath}/stamp?token=${uniqueToken}`);
    } catch (err) {
      setError("페이지 이동 중 오류가 발생했습니다.");
      console.error(err);
    }
  }, []);

  return (
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">QR 코드 확인 중...</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p>잠시만 기다려 주세요.</p>
      )}
    </div>
  );
}
