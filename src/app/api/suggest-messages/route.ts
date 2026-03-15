import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY || "",
  baseURL: "https://integrate.api.nvidia.com/v1",
});

export async function POST() {
  try {
    const prompt = `
Create a list of three open-ended and engaging questions formatted as a single string. 
Each question should be separated by "|". These questions are for an anonymous social 
messaging platform, like Ooh.me, and should be suitable for a diverse audience. 
Avoid personal or sensitive topics, focusing instead on universal themes that 
encourage friendly interaction.

For example:
"What's a hobby you've recently started?|If you could have dinner with any historical figure, who would it be?|What's a simple thing that makes you happy?"

Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.
`;

    const completionParams = {
      model: "meta/llama-3.1-8b-instruct",
      messages: [{ "role": "user", "content": prompt }],
      temperature: 0.9,
      top_p: 0.95,
      max_tokens: 1024,
      stream: false, // Turn off streaming for the simple JSON response expected by the frontend
    };

    const completion = await openai.chat.completions.create(completionParams as any);

    return NextResponse.json({
      output: completion.choices[0]?.message?.content || "",
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("NVIDIA API Error Message:", error.message);
      console.error("NVIDIA API Error Stack:", error.stack);
    } else {
      console.error("NVIDIA API Unknown Error:", error);
    }
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}