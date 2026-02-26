import { spawn } from "child_process";
import { type NextRequest, NextResponse } from "next/server";
import path from "path";

export const POST = async (request: NextRequest): Promise<Response> => {
  try {
    const { id, text }: { id?: string; text?: string } = await request.json();

    if (!id || !text) {
      return NextResponse.json(
        { error: "Missing required fields: id and text" },
        { status: 400 },
      );
    }

    const scriptPath = path.join(process.cwd(), "scripts", "generate_audio.py");

    return await new Promise<Response>((resolve) => {
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
          resolve(
            NextResponse.json({
              success: true,
              url: `/${outputPath}`,
              id,
            }),
          );
        } else {
          console.error("Python script error:", errorOutput);
          resolve(
            NextResponse.json(
              {
                error: "Failed to generate audio",
                details: errorOutput,
              },
              { status: 500 },
            ),
          );
        }
      });
    });
  } catch (error) {
    console.error("API error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
};
