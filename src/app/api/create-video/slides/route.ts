import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs/promises';
import os from 'os'; // For temporary directory
import { bundle } from '@remotion/bundler';
import { COMPOSITION_ID } from '../../../../types/constants';
import { calculateSlidesDuration } from '../../../../types/slides';

// Define the schema for the request body
const CreateSlidesVideoPayloadSchema = z.object({
  images: z.array(z.string().url({ message: "Invalid image URL" })).min(1, { message: "At least one image URL is required" }),
  texts: z.array(z.string().min(1, { message: "Text cannot be empty" })).min(1, { message: "At least one text is required" }),
  song: z.string().url({ message: "Invalid song URL or path" }),
}).refine(
  (data) => data.images.length === data.texts.length,
  {
    message: "Images and texts arrays must have the same length",
    path: ["images", "texts"],
  }
);

const RENDER_OUTPUT_DIR = path.join(process.cwd(), 'public', 'videos', 'renders', 'slides');
const ENTRY_POINT = path.join(process.cwd(), 'src', 'index.ts'); 

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
    const validationResult = CreateSlidesVideoPayloadSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({ error: "Invalid request body", details: validationResult.error.flatten() }, { status: 400 });
    }

    const { images, texts, song } = validationResult.data;
    const inputProps = { images, texts, song };

    console.log("Starting slides video render process...", { 
      compositionId: COMPOSITION_ID.Slides,
      slideCount: images.length 
    });

    tempBundleDir = await fs.mkdtemp(path.join(os.tmpdir(), 'remotion-bundle-'));
    console.log(`Bundling Remotion project from ${ENTRY_POINT} to ${tempBundleDir}`);
    const bundleManifest = await bundle({
      entryPoint: ENTRY_POINT,
      outDir: tempBundleDir,
    });
    const serveUrl = tempBundleDir; 
    console.log(`Remotion project bundled at: ${serveUrl}. Manifest:`, bundleManifest);

    // Calculate dynamic duration based on number of slides
    const durationInFrames = calculateSlidesDuration(images.length);
    console.log(`Calculated duration: ${durationInFrames} frames for ${images.length} slides`);

    // 2. Select the composition using the bundle
    console.log(`Selecting composition: ${COMPOSITION_ID.Slides}`);
    const composition = await selectComposition({
      serveUrl,
      id: COMPOSITION_ID.Slides,
      inputProps,
    });
    console.log(`Selected composition: ${composition.id} with duration ${composition.durationInFrames} frames.`);

    // 3. Render the media
    const outputFileName = `video-${COMPOSITION_ID.Slides.toLowerCase()}-${Date.now()}.mp4`;
    const outputPath = path.join(RENDER_OUTPUT_DIR, outputFileName);
    const publicPath = `/videos/renders/slides/${outputFileName}`;
    console.log(`Rendering media to: ${outputPath}`);

    await renderMedia({
      composition,
      serveUrl,
      outputLocation: outputPath,
      inputProps,
      codec: "h264",
      onProgress: ({ progress }) => console.log(`Render Progress: ${(progress * 100).toFixed(2)}%`),
    });

    console.log(`Slides video rendered successfully: ${publicPath}`);
    return NextResponse.json({
      message: "Slides video rendered successfully!",
      videoPath: outputPath,
      publicUrl: publicPath,
      slideCount: images.length,
      durationInFrames,
    }, { status: 200 });

  } catch (error) {
    console.error("Error rendering slides video:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error during slides render";
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