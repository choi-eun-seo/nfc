"use client";

import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function GenerateTagPage() {
  const [generatedUrl, setGeneratedUrl] = useState("");

  const generateNFCUrl = () => {
    // 고정된 태그 ID 생성 (한 번만 생성하여 NFC 태그에 씀)
    const tagId = uuidv4();

    // 기본 URL (이 URL이 NFC 태그에 저장됨)
    const url = `https://choi-eun-seo.github.io/nfc/verify?id=${tagId}`;
    setGeneratedUrl(url);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">NFC 태그 URL 생성</h1>
      <button
        onClick={generateNFCUrl}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        URL 생성
      </button>
      {generatedUrl && (
        <div className="mt-4">
          <p className="font-bold mb-2">생성된 URL:</p>
          <code className="block p-4 bg-gray-100 rounded break-all">
            {generatedUrl}
          </code>
        </div>
      )}
    </div>
  );
}
