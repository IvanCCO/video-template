"use client";

import { Player } from "@remotion/player";
import type { NextPage } from "next";
import React, { useMemo, useState } from "react";
import { Slideshow as ImageSlideshow } from "../remotion/ImageSlideshow/Slideshow";
import { PhylosoficalEdit as ImageSlideshowTest } from "../remotion/PhylosoficalMessage/PhylosoficalEdit";

import {
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../types/constants";
import { z } from "zod";
import { RenderControls } from "../components/RenderControls";
import { Tips } from "../components/Tips/Tips";
import { Spacing } from "../components/Spacing";
import { 
  SlideshowProps, 
  defaultSlideshowProps, 
  defaultSlideshowPropsTest,
  SLIDESHOW_DURATION_IN_FRAMES,
  SLIDESHOW_DURATION_IN_FRAMES_TEST
} from "../types/slideshowTypes";

const container: React.CSSProperties = {
  maxWidth: 768,
  margin: "auto",
  marginBottom: 20,
};

const outer: React.CSSProperties = {
  borderRadius: "var(--geist-border-radius)",
  overflow: "hidden",
  boxShadow: "0 0 200px rgba(0, 0, 0, 0.15)",
  marginBottom: 40,
  marginTop: 60,
};

const player: React.CSSProperties = {
  width: "100%",
};

const templateToggle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: "10px",
  marginBottom: "20px",
};

const templateButton: React.CSSProperties = {
  padding: "8px 16px",
  backgroundColor: "#f0f0f0",
  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "#ccc",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "normal",
};

const activeButton: React.CSSProperties = {
  ...templateButton,
  backgroundColor: "#0070f3",
  color: "white",
  borderColor: "#0070f3",
  fontWeight: "bold",
};

type TemplateType = "ImageSlideshow" | "ImageSlideshowTest";

const Home: NextPage = () => {
  const [text, setText] = useState<string>(defaultSlideshowProps.title || "");
  const [template, setTemplate] = useState<TemplateType>("ImageSlideshow");

  const inputProps: z.infer<typeof SlideshowProps> = useMemo(() => {
    if (template === "ImageSlideshow") {
      return {
        ...defaultSlideshowProps,
        title: text,
      };
    } else {
      return {
        ...defaultSlideshowPropsTest,
        title: text,
      };
    }
  }, [text, template]);

  const SelectedComponent = template === "ImageSlideshow" 
    ? ImageSlideshow 
    : ImageSlideshowTest;
    
  // Calculate duration based on selected component
  const componentDuration = useMemo(() => {
    return template === "ImageSlideshow" 
      ? 20 * VIDEO_FPS // 20 seconds for ImageSlideshow
      : 10 * VIDEO_FPS; // 10 seconds for ImageSlideshowTest
  }, [template]);

  return (
    <div>
      <div style={container}>
        <div style={templateToggle}>
          <button 
            style={template === "ImageSlideshow" ? activeButton : templateButton}
            onClick={() => setTemplate("ImageSlideshow")}
          >
            Image Slideshow (20s)
          </button>
          <button 
            style={template === "ImageSlideshowTest" ? activeButton : templateButton}
            onClick={() => setTemplate("ImageSlideshowTest")}
          >
            Image Slideshow Test (10s)
          </button>
        </div>
        <div className="cinematics" style={outer}>
          <Player
            component={SelectedComponent}
            inputProps={inputProps}
            durationInFrames={componentDuration}
            fps={VIDEO_FPS}
            compositionHeight={VIDEO_HEIGHT}
            compositionWidth={VIDEO_WIDTH}
            style={player}
            controls
            autoPlay
            loop
            acknowledgeRemotionLicense
          />
        </div>
        <RenderControls
          text={text}
          setText={setText}
          inputProps={{ title: text }}
        ></RenderControls>
        <Spacing></Spacing>
        <Spacing></Spacing>
        <Spacing></Spacing>
        <Spacing></Spacing>
        <Tips></Tips>
      </div>
    </div>
  );
};

export default Home;
