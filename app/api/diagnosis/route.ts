import { NextResponse } from "next/server";

// 这里仅作演示，真正场景里可能需要用 busboy/multer/formidable 等解析 multipart/form-data
export async function POST(request: Request) {
  try {
    // 如果用 FormData，需要：
    // const formData = await request.formData();
    // const age = formData.get("Patient-Age");
    // const fileLeft = formData.get("Left-Fundus") as File | null;
    // ...
    // 后端做相应处理，比如调用模型推理、数据库存储等
    
    // 假装后端计算出了 8 个概率
    const fakeProbabilities = [0.1, 0.3, 0.05, 0.2, 0.15, 0.05, 0.1, 0.05];

    return NextResponse.json({ probabilities: fakeProbabilities });
  } catch (error) {
    console.error(error);
    return new Response("Error in diagnosis API", { status: 500 });
  }
}