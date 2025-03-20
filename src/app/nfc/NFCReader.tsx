"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    NDEFReader?: any;
  }
}

const NFCReader: React.FC = () => {
  const [lastTag, setLastTag] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);

  const startScanning = async () => {
    if (!("NDEFReader" in window)) {
      setStatus("이 기기는 Web NFC를 지원하지 않습니다");
      return;
    }

    try {
      // 먼저 NFC 권한 요청
      const permissionStatus = await (navigator as any).permissions.query({
        name: "nfc",
      });

      if (permissionStatus.state === "denied") {
        setStatus(
          "NFC 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요."
        );
        return;
      }

      const ndef = new (window as any).NDEFReader();
      await ndef.scan();
      setIsScanning(true);
      setStatus("NFC 스캔이 시작되었습니다. 태그를 가까이 대주세요.");

      ndef.addEventListener("reading", (event: any) => {
        const serialNumber = event.serialNumber || "Unknown Serial";
        setLastTag(serialNumber);
        setStatus(`태그가 감지되었습니다: ${serialNumber}`);

        const records = event.message?.records || [];
        records.forEach((record: any, index: number) => {
          if (record.recordType === "text") {
            const decoder = new TextDecoder();
            console.log(`📜 텍스트 데이터: ${decoder.decode(record.data)}`);
          }
        });

        // API 호출
        fetch("/api/nfc", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ serialNumber }),
        })
          .then((response) => response.json())
          .then((data) => console.log("서버 응답:", data))
          .catch((error) => {
            console.error("서버 요청 오류:", error);
            setStatus("서버 요청 중 오류가 발생했습니다");
          });
      });

      ndef.addEventListener("error", (error: any) => {
        console.error("NFC 오류:", error);
        setStatus(`NFC 오류: ${error.message}`);
      });
    } catch (error: any) {
      console.error("NFC 초기화 오류:", error);
      setStatus(`NFC 초기화 오류: ${error.message}`);
      setIsScanning(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">NFC Reader</h1>

      <button
        onClick={startScanning}
        disabled={isScanning}
        className={`mb-4 px-4 py-2 rounded ${
          isScanning
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        {isScanning ? "スキャン中..." : "NFC スキャン開始"}
      </button>

      {status && (
        <div className="bg-blue-100 p-3 rounded-lg mb-4">
          <p className="text-blue-800">{status}</p>
        </div>
      )}

      {lastTag && (
        <div className="bg-green-100 p-3 rounded-lg">
          <h2 className="font-bold mb-2">最後に読み取ったタグ:</h2>
          <p className="text-green-800">{lastTag}</p>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p>※ NFC를 사용하기 위한 요구사항:</p>
        <ul className="list-disc ml-5">
          <li>Chrome for Android 89 이상</li>
          <li>HTTPS 환경</li>
          <li>NFC 하드웨어가 있는 Android 기기</li>
          <li>브라우저 NFC 권한 허용</li>
        </ul>
      </div>
    </div>
  );
};

export default NFCReader;
