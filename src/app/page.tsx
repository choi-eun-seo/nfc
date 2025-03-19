import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>🏠 홈 페이지</h1>
      <p>이곳은 Next.js 애플리케이션의 메인 페이지입니다.</p>
      <Link href="/nfc">📡 NFC 페이지로 이동</Link>
    </div>
  );
}
