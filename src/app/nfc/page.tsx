"use client";  // ✅ 클라이언트 컴포넌트 선언

import { useEffect } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    NDEFReader?: any;
  }
}

const NFCReader: React.FC = () => {
  useEffect(() => {
    const readNFC = async () => {
      if ("NDEFReader" in window) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const ndef = new (window as any).NDEFReader();
          await ndef.scan();
          console.log("✅ NFC 리더 시작됨");

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ndef.onreading = (event: any) => {
            console.log("📡 NFC 태그 감지됨!");

            const serialNumber = event.serialNumber || "Unknown Serial";
            console.log(`🔹 Serial Number: ${serialNumber}`);

            const records = event.message.records;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            records.forEach((record: any, index: number) => {
              console.log(`📌 Record ${index + 1}:`, record);
              if (record.recordType === "text") {
                const decoder = new TextDecoder();
                console.log(`📜 텍스트 데이터: ${decoder.decode(record.data)}`);
              }
            });

            fetch("/api/nfc", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ serialNumber }),
            })
              .then((response) => response.json())
              .then((data) => console.log("🖥️ 서버 응답:", data))
              .catch((error) => console.error("❌ 서버 요청 오류:", error));
          };
        } catch (error) {
          console.error("❌ NFC 읽기 오류:", error);
        }
      } else {
        console.log("⚠️ Web NFC가 지원되지 않는 기기입니다.");
      }
    };

    readNFC();
  }, []);

  return (
    <div>
      <h1>NFC Reader</h1>
      <p>📡 NFC 태그를 기기에 가까이 가져가세요.</p>
    </div>
  );
};

// ✅ 반드시 `export default NFCReader;` 추가
export default NFCReader;
