import React from "react";
import chatgptImageMay232025015531PmRemovebgPreview1 from "./images/ChatGPT_Image_May_23__2025__01_55_31_PM-removebg-preview 1.png";
import "./css/register.css";

export const RegisterPage = () => {
  return (
    <div className="register-page">
      <div className="div">
        <div className="name">
          <div className="overlap-group">
            <div className="text-wrapper">JARity</div>

            <div className="text-wrapper-2">Crypto</div>
          </div>
        </div>

        <div className="connect-button">
          <div className="overlap">
            <div className="text-wrapper-3">Connect MetaMask wallet</div>
          </div>
        </div>

        <header className="header">
          <div className="frame">
            <div className="text-wrapper-4">Our</div>
          </div>

          <div className="div-wrapper">
            <div className="text-wrapper-5">HOME</div>
          </div>

          <div className="frame-2">
            <div className="text-wrapper-6">JARS</div>
          </div>

          <div className="frame-3">
            <div className="text-wrapper-7">CREATE JAR</div>
          </div>

          <div className="overlap-2">
            <div className="frame">
              <div className="text-wrapper-8">ABOUT</div>
            </div>

            <div className="frame-4">
              <div className="text-wrapper-9">PROFILE</div>
            </div>
          </div>
        </header>

        <div className="frame-5">
          <p className="p">Copyright © 2025, All rights reserved.</p>

          <div className="frame-6">
            <div className="text-wrapper-10">FOR DONORS</div>

            <div className="text-wrapper-11">Donate crypto</div>

            <div className="text-wrapper-12">Explore causes</div>
          </div>

          <div className="frame-7">
            <div className="text-wrapper-10">RESOURCES</div>

            <div className="text-wrapper-11">About us</div>

            <div className="text-wrapper-12">Terms of use</div>
          </div>

          <img
            className="chatgpt-image-may"
            alt="Chatgpt image may"
            src={chatgptImageMay232025015531PmRemovebgPreview1}
          />

          <div className="frame-8">
            <div className="text-wrapper-10">Home</div>
          </div>
        </div>
      </div>
    </div>
  );
};