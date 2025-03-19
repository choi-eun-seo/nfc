export async function POST(req: Request) {
    try {
      const { serialNumber } = await req.json();
      console.log("📌 NFC Serial Number:", serialNumber);
      console.log("📡 Request Headers:", req.headers); // 클라이언트 정보 확인
  
      return NextResponse.json({ message: "NFC data received", serialNumber });
    } catch (error) {
      console.error("❌ NFC API Error:", error);
      return NextResponse.json({ message: "Error processing NFC data" }, { status: 500 });
    }
  }
  