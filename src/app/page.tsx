"use client"; // ✅ 추가

import { useEffect } from "react";

const NFCReader: React.FC = () => {
  useEffect(() => {
    console.log("NFC 리더 실행됨!");
  }, []);

  return <div>NFC Reader Component</div>;
};

export default NFCReader; // ✅ export default 추가
