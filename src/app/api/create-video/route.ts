import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs/promises';
import os from 'os'; // For temporary directory
import { bundle } from '@remotion/bundler';

// Define the schema for the request body
const CreateVideoPayloadSchema = z.object({
  imageUrl: z.string().url({ message: "Invalid image URL" }),
  template: z.enum(["ImageSlideshow", "ImageSlideshowTest"], {
    errorMap: () => ({ message: "Template must be either ImageSlideshow or ImageSlideshowTest" }),
  }),
  song: z.string().url({ message: "Invalid song URL or path" }),
});

const RENDER_OUTPUT_DIR = path.join(process.cwd(), 'public', 'videos', 'renders');
const ENTRY_POINT = path.join(process.cwd(), 'src', 'index.ts'); // Adjusted to your src/index.ts

async function ensureRenderDirExists() {
  try {
    await fs.mkdir(RENDER_OUTPUT_DIR, { recursive: true });
  } catch (error) {
    console.error("Failed to create render output directory:", error);
    throw new Error("Could not create directory for rendered videos.");
  }
}

export async function POST(request: NextRequest) {
  let tempBundleDir: string | null = null;
  try {
    await ensureRenderDirExists();
    const body = await request.json();
    const validationResult = CreateVideoPayloadSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: "Invalid request body", details: validationResult.error.flatten() }, { status: 400 });
    }

    const { imageUrl, template, song } = validationResult.data;
    const compositionId = template === "ImageSlideshow" ? "ImageSlideshowComposition" : "ImageSlideshowTestComposition";
    const inputProps = { images: [imageUrl], song };

    console.log("Starting local video render process...", { compositionId });

    tempBundleDir = await fs.mkdtemp(path.join(os.tmpdir(), 'remotion-bundle-'));
    console.log(`Bundling Remotion project from ${ENTRY_POINT} to ${tempBundleDir}`);
    const bundleManifest = await bundle({
      entryPoint: ENTRY_POINT,
      outDir: tempBundleDir,
    });
    const serveUrl = tempBundleDir; // The directory where the bundle (manifest) is located
    console.log(`Remotion project bundled at: ${serveUrl}. Manifest:`, bundleManifest);

    // 2. Select the composition using the bundle
    console.log(`Selecting composition: ${compositionId}`);
    const composition = await selectComposition({
      serveUrl,
      id: compositionId,
      inputProps,
    });
    console.log(`Selected composition: ${composition.id} with duration ${composition.durationInFrames} frames.`);

    // 3. Render the media
    const outputFileName = `video-${template.toLowerCase()}-${Date.now()}.mp4`;
    const outputPath = path.join(RENDER_OUTPUT_DIR, outputFileName);
    const publicPath = `/videos/renders/${outputFileName}`;
    console.log(`Rendering media to: ${outputPath}`);

    await renderMedia({
      composition,
      serveUrl,
      outputLocation: outputPath,
      inputProps,
      codec: "h264",
      // onProgress: ({ progress }) => console.log(`Render Progress: ${(progress * 100).toFixed(2)}%`),
    });

    console.log(`Video rendered successfully: ${publicPath}`);
    return NextResponse.json({
      message: "Video rendered successfully locally!",
      videoPath: outputPath,
      publicUrl: publicPath,
    }, { status: 200 });

  } catch (error) {
    console.error("Error rendering video locally:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error during local render";
    return NextResponse.json({ error: errorMessage, details: error instanceof Error ? error.stack : undefined }, { status: 500 });
  } finally {
    // 4. Cleanup the temporary bundle directory
    if (tempBundleDir) {
      try {
        await fs.rm(tempBundleDir, { recursive: true, force: true });
        console.log(`Cleaned up temporary bundle directory: ${tempBundleDir}`);
      } catch (cleanupError) {
        console.error(`Failed to cleanup temporary bundle directory ${tempBundleDir}:`, cleanupError);
      }
    }
  }
} 