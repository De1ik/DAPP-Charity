import React from "react";
import { Frame } from "./Frame";
import { FrameWrapper } from "./FrameWrapper";
import { Header } from "./Header";
import { Name } from "../components/Name";
import { OverlapWrapper } from "./OverlapWrapper";
import chatgptImageMay232025015531PmRemovebgPreview12 from "./chatgpt-image-may-23-2025-01-55-31-PM-removebg-preview-1-2.png";
import "./style.css";

export const Desktop = () => {
  return (
    <div className="desktop">
      <div className="div-12">
        <div className="overlap-7">
          <div className="div-13" />

          <Frame />
          <OverlapWrapper />
        </div>

        <div className="overlap-8">
          <img
            className="chatgpt-image-may-2"
            alt="Chatgpt image may"
            src={chatgptImageMay232025015531PmRemovebgPreview12}
          />

          <Name />
          <div className="text-wrapper-18">With Crypto for Charity</div>

          <div className="frame-11">
            <div className="text-wrapper-19">DONATE</div>
          </div>

          <Header />
        </div>

        <FrameWrapper />
      </div>
    </div>
  );
};