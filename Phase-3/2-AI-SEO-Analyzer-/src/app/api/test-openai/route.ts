// import { NextResponse } from "next/server";

// export async function GET() {
//   const hasKey = !!process.env.OPENAI_API_KEY;
//   const keyPreview = process.env.OPENAI_API_KEY 
//     ? process.env.OPENAI_API_KEY.slice(0, 10) + "..." 
//     : "Not set";

//   // Test OpenAI connection
//   let status = "Not tested";
//   let error = null;

//   if (hasKey) {
//     try {
//       const response = await fetch("https://api.openai.com/v1/models", {
//         headers: {
//           "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
//         },
//       });
      
//       if (response.ok) {
//         status = "✅ Connected successfully";
//       } else {
//         status = "❌ Failed to connect";
//         error = await response.text();
//       }
//     } catch (err) {
//       status = "❌ Error";
//       error = String(err);
//     }
//   }

//   return NextResponse.json({
//     hasKey,
//     keyPreview,
//     status,
//     error,
//     envVarsSet: {
//       redis: !!process.env.UPSTASH_REDIS_REST_URL,
//       openai: !!process.env.OPENAI_API_KEY,
//     }
//   });
// }

import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: "No API key found" }, { status: 400 });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    
    return NextResponse.json({
      hasKey: true,
      keyPreview: apiKey.substring(0, 15) + "...",
      status: response.ok ? "✅ Connected" : "❌ Failed",
      statusCode: response.status,
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}