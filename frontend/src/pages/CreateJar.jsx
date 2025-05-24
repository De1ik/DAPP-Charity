import React from "react";
import SVG from "./SVG.svg";
import bxCalendar from "./bx-calendar.svg";
import chatgptImageMay232025015531PmRemovebgPreview1 from "./chatgpt-image-may-23-2025-01-55-31-PM-removebg-preview-1.png";
import donateButton from "./donate-button.png";
import materialSymbolsLightAddPhotoAlternateOutline from "./material-symbols-light-add-photo-alternate-outline.svg";
import "./style.css";
import vector from "./vector.svg";

export const CreateJarPage = () => {
  return (
    <div className="create-jar-page">
      <div className="div">
        <header className="header">
          <div className="frame">
            <div className="text-wrapper">Our</div>
          </div>

          <div className="div-wrapper">
            <div className="text-wrapper-2">HOME</div>
          </div>

          <div className="frame-2">
            <div className="text-wrapper-3">JARS</div>
          </div>

          <div className="frame-3">
            <div className="text-wrapper-4">CREATE A JAR</div>
          </div>

          <div className="overlap-group">
            <div className="frame">
              <div className="text-wrapper-5">ABOUT</div>
            </div>

            <div className="frame-4">
              <div className="text-wrapper-6">PROFILE</div>
            </div>
          </div>
        </header>

        <div className="overlap">
          <div className="frame-5">
            <p className="p">Copyright © 2025, All rights reserved.</p>

            <div className="frame-6">
              <div className="text-wrapper-7">FOR DONORS</div>

              <div className="text-wrapper-8">Donate crypto</div>

              <div className="text-wrapper-9">Explore causes</div>
            </div>

            <div className="frame-7">
              <div className="text-wrapper-7">RESOURCES</div>

              <div className="text-wrapper-8">About us</div>

              <div className="text-wrapper-9">Terms of use</div>
            </div>

            <img
              className="chatgpt-image-may"
              alt="Chatgpt image may"
              src={chatgptImageMay232025015531PmRemovebgPreview1}
            />

            <div className="frame-8">
              <div className="text-wrapper-7">Home</div>
            </div>
          </div>

          <img
            className="donate-button"
            alt="Donate button"
            src={donateButton}
          />
        </div>

        <div className="text-wrapper-10">Let’s get started</div>

        <div className="text-wrapper-11">Fundraiser category</div>

        <div className="overlap-2">
          <div className="text-wrapper-12">Fundraiser deadline</div>

          <div className="container">
            <div className="overlap-3">
              <div className="background">
                <div className="button-open">
                  <img className="SVG" alt="Svg" src={SVG} />
                </div>
              </div>

              <div className="label">
                <div className="text-wrapper-13">Please select</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-wrapper-14">Your fundraiser story</div>

        <div className="text-wrapper-15">Upload fundraiser photos</div>

        <div className="text-wrapper-16">Your video URL</div>

        <div className="overlap-4">
          <div className="text-wrapper-17">Fundraiser title</div>

          <div className="input-wrapper">
            <div className="input">
              <input
                className="label-2"
                placeholder="Add the title of your page"
                type="number"
              />
            </div>
          </div>
        </div>

        <div className="background-2">
          <div className="input">
            <div className="label-3">
              <div className="text-wrapper-18">http://</div>
            </div>
          </div>
        </div>

        <div className="background-3">
          <div className="label-wrapper">
            <div className="label-3">
              <div className="text-wrapper-18">Deadline</div>
            </div>
          </div>

          <img className="bx-calendar" alt="Bx calendar" src={bxCalendar} />
        </div>

        <div className="background-4">
          <div className="input-2">
            <div className="label-3">
              <div className="text-wrapper-18">Needed amount</div>
            </div>
          </div>

          <img className="vector" alt="Vector" src={vector} />
        </div>

        <div className="fieldset-wrapper">
          <div className="fieldset">
            <div className="explain-why-you-re-wrapper">
              <p className="explain-why-you-re">
                Explain why you&#39;re raising money, what the funds will be
                used for, and how much you value the support
              </p>
            </div>
          </div>
        </div>

        <div className="overlap-5">
          <div className="background-5">
            <div className="fieldset-2">
              <div className="text-wrapper-19">Add image</div>

              <img
                className="material-symbols"
                alt="Material symbols"
                src={materialSymbolsLightAddPhotoAlternateOutline}
              />
            </div>
          </div>

          <div className="label-4">
            <p className="text-wrapper-20">
              You can select and upload several in one go
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};