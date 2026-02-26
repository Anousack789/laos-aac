import { NextRequest, NextResponse } from "next/server";
import { spawn } from "child_process";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const { id, text } = await request.json();

    if (!id || !text) {
      return NextResponse.json(
        { error: "Missing required fields: id and text" },
        { status: 400 }
      );
    }

    // Resolve the path to the Python script
    const scriptPath = path.join(process.cwd(), "scripts", "generate_audio.py");

    return new Promise((resolve) => {
      const python = spawn("python3", [scriptPath, id, text]);
      let outputPath = "";
      let errorOutput = "";

      python.stdout.on("data", (data) => {
        outputPath += data.toString().trim();
      });

      python.stderr.on("data", (data) => {
        errorOutput += data.toString();
      });

      python.on("close", (code) => {
        if (code === 0 && outputPath) {
          // Return the URL to the generated audio file
          const audioUrl = `/${outputPath}`;
          resolve(
            NextResponse.json({
              success: true,
              url: audioUrl,
              id,
            })
          );
        } else {
          console.error("Python script error:", errorOutput);
          resolve(
            NextResponse.json(
              { error: "Failed to generate audio", details: errorOutput },
              { status: 500 }
            )
          );
        }
      });
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
