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

  useEffect(() => {
    const readNFC = async () => {
      if ("NDEFReader" in window) {
        try {
          const ndef = new (window as any).NDEFReader();
          await ndef.scan();
          setStatus("NFC 리더가 활성화되었습니다");
          console.log("✅ NFC 리더 시작됨");

          ndef.onreading = (event: any) => {
            console.log("📡 NFC 태그 감지됨!");

            const serialNumber = event.serialNumber || "Unknown Serial";
            console.log(`🔹 Serial Number: ${serialNumber}`);
            setLastTag(serialNumber); // 상태 업데이트
            setStatus(`태그가 감지되었습니다: ${serialNumber}`);

            const records = event.message.records;
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
              .catch((error) => {
                console.error("❌ 서버 요청 오류:", error);
                setStatus("서버 요청 중 오류가 발생했습니다");
              });
          };
        } catch (error) {
          console.error("❌ NFC 읽기 오류:", error);
          setStatus("NFC 읽기 오류가 발생했습니다");
        }
      } else {
        console.log("⚠️ Web NFC가 지원되지 않는 기기입니다.");
        setStatus("이 기기에서는 Web NFC가 지원되지 않습니다");
      }
    };

    readNFC();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">NFC Reader</h1>
      <p className="mb-4">📡 NFC 태그를 기기에 가까이 가져가세요.</p>

      {status && (
        <div className="bg-blue-100 p-3 rounded-lg mb-4">
          <p className="text-blue-800">{status}</p>
        </div>
      )}

      {lastTag && (
        <div className="bg-green-100 p-3 rounded-lg">
          <h2 className="font-bold mb-2">마지막으로 읽은 태그:</h2>
          <p className="text-green-800">{lastTag}</p>
        </div>
      )}
    </div>
  );
};

export default NFCReader;