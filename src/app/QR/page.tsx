"use client";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

export default function QRPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  useEffect(() => {
    const referrer = document.referrer;

    // QR 코드에서 접속한 경우인지 확인 (예: 특정 도메인에서 온 경우만 허용)
    if (!referrer.includes("https://choi-eun-seo.github.io/") && referrer !== "") {
      setError("QR 스캔을 통해서만 접근 가능합니다.");
      return;
    }

    // QR에서 스캔한 경우, UUID 생성 후 리디렉트
    const uniqueToken = uuidv4();
    router.replace(`/stamp?token=${uniqueToken}`);
  }, []);

  return (
    <div>
      <h1>QR 코드 확인 중...</h1>
      {error ? <p style={{ color: "red" }}>{error}</p> : <p>잠시만 기다려 주세요.</p>}
    </div>
  );
}
