import React, { useState } from "react";
import "../css/createJar.css";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

import { ethers } from "ethers";
import usdtAbi from "../abi/MockUSDT.json";
import bankAbi from "../abi/FundraisingBank.json";
import { BrowserProvider, parseUnits } from "ethers";


const initialFormState = {
  fundraiserCategory: "",
  fundraiserDeadline: "",
  fundraiserTitle: "",
  neededAmount: "",
  fundraiserStory: "",
  fundraiserPhotos: null, // FileList
  videoUrl: "",
};

export const CreateJarPage = () => {
  const [form, setForm] = useState(initialFormState);
  const [submittedData, setSubmittedData] = useState(null);
  const [errors, setErrors] = useState({});

  const USDT_ADDRESS = "0xBDf506f7182e54D0564930e4Ea9E2ed5e564b989";
  const FUNDRAISING_BANK_ADDRESS = "0xc3FaC5B2BFCdDa849e0140bbe93a1CDac6DC8b9e";

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setForm((prev) => ({
        ...prev,
        [name]: files,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const isValidAmount = (value) => {
    const regex = /^\d+(\.\d{1,6})?$/;
    return regex.test(value);
  };

  const validate = () => {
    const errs = {};
    if (!form.fundraiserCategory) errs.fundraiserCategory = "Required";
    if (!form.fundraiserDeadline) errs.fundraiserDeadline = "Required";
    if (!form.fundraiserTitle) errs.fundraiserTitle = "Required";
    if (!form.neededAmount) errs.neededAmount = "Required";
    if (!form.fundraiserStory) errs.fundraiserStory = "Required";
    if (!form.neededAmount || !isValidAmount(form.neededAmount)) errs.neededAmount = "Enter a valid amount (max 6 decimals)";


    // if (!form.fundraiserPhotos || form.fundraiserPhotos.length === 0) errs.fundraiserPhotos = "Required";
    // videoUrl is optional
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    try {
      // 1. Подключение к MetaMask
      if (!window.ethereum) throw new Error("MetaMask not found");
      await window.ethereum.request({ method: "eth_requestAccounts" });

      if (!window.ethereum) {
        throw new Error("MetaMask is not installed");
      }

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // 2. Загрузка в IPFS через backend
      // const ipfsResponse = await fetch("https://your-backend.com/api/ipfs/upload", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     title: form.fundraiserTitle,
      //     description: form.fundraiserStory,
      //     category: form.fundraiserCategory,
      //     videoUrl: form.videoUrl,
      //     deadline: form.fundraiserDeadline,
      //     status: "active",
      //     images: [] // или base64, или обрабатывай на сервере
      //   })
      // });
      // const { cid } = await ipfsResponse.json();

      // 3. Получить контракт и подписанта
      const bankContract = new ethers.Contract(FUNDRAISING_BANK_ADDRESS, bankAbi, signer);

      // 4. Преобразовать сумму и дедлайн
      const decimals = 6; // USDT как правило 6 знаков после запятой
      const goalAmount = parseUnits(form.neededAmount, decimals);


      const now = Math.floor(Date.now() / 1000);
      const deadlineTimestamp = Math.floor(new Date(form.fundraiserDeadline).getTime() / 1000);
      const durationInSeconds = deadlineTimestamp - now;
      if (durationInSeconds <= 0) throw new Error("Invalid deadline");

      // 5. Вызов функции createCampaign
      const tx = await bankContract.createCampaign(
        form.fundraiserCategory,
        goalAmount,
        durationInSeconds
      );

      await tx.wait();
      alert("Campaign created!");
      // setSubmittedData({ ...form, cid });
      setSubmittedData(form);

    } catch (err) {
      console.error("Error creating campaign:", err);
      alert("Failed to create campaign. Check console for details.");
    }
  };

  // Render submitted data as JSON
  if (submittedData) {
    return (
      <div className="create-jar-page">
        <Header />
        <div className="create-jar-form" style={{wordBreak: "break-word"}}>
          <h2>Submitted Data:</h2>
          <pre style={{
            background: "#111a",
            color: "#d1d1d1",
            borderRadius: "1rem",
            padding: "1rem",
            fontFamily: "Menlo, Monaco, Consolas, monospace",
            fontSize: "0.97rem"
          }}>
            {JSON.stringify(submittedData, null, 2)}
          </pre>
          <button
            className="submit-btn"
            onClick={() => {
              setSubmittedData(null);
              setForm(initialFormState);
              setErrors({});
            }}
          >
            Fill another form
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="create-jar-page">
        <form className="create-jar-form" onSubmit={handleSubmit} noValidate>
          <h1 className="page-title">Let’s get started</h1>

          {/* Fundraiser Category */}
          <label className="form-label" htmlFor="fundraiser-category">
            Fundraiser category *
          </label>
          <select
            id="fundraiser-category"
            name="fundraiserCategory"
            className="form-input"
            value={form.fundraiserCategory}
            onChange={handleInputChange}
            required
          >
            <option value="">Please select</option>
            <option value="health">Health</option>
            <option value="animals">Animals</option>
            <option value="environment">Environment</option>
          </select>
          {errors.fundraiserCategory && (
            <span className="form-helper" style={{ color: "red" }}>
              {errors.fundraiserCategory}
            </span>
          )}

          {/* Fundraiser Deadline */}
          <label className="form-label" htmlFor="fundraiser-deadline">
            Fundraiser deadline *
          </label>
          <input
            id="fundraiser-deadline"
            name="fundraiserDeadline"
            type="date"
            className="form-input"
            value={form.fundraiserDeadline}
            onChange={handleInputChange}
            required
          />
          {errors.fundraiserDeadline && (
            <span className="form-helper" style={{ color: "red" }}>
              {errors.fundraiserDeadline}
            </span>
          )}

          {/* Fundraiser Title */}
          <label className="form-label" htmlFor="fundraiser-title">
            Fundraiser title *
          </label>
          <input
            id="fundraiser-title"
            name="fundraiserTitle"
            type="text"
            className="form-input"
            value={form.fundraiserTitle}
            onChange={handleInputChange}
            placeholder="Add the title of your page"
            required
          />
          {errors.fundraiserTitle && (
            <span className="form-helper" style={{ color: "red" }}>
              {errors.fundraiserTitle}
            </span>
          )}

          {/* Needed Amount */}
          <label className="form-label" htmlFor="needed-amount">
            Needed amount *
          </label>
          <input
            id="needed-amount"
            name="neededAmount"
            type="number"
            min="1"
            className="form-input"
            value={form.neededAmount}
            onChange={handleInputChange}
            placeholder="Enter amount needed"
            required
          />
          {errors.neededAmount && (
            <span className="form-helper" style={{ color: "red" }}>
              {errors.neededAmount}
            </span>
          )}

          {/* Fundraiser Story */}
          <label className="form-label" htmlFor="fundraiser-story">
            Your fundraiser story *
          </label>
          <textarea
            id="fundraiser-story"
            name="fundraiserStory"
            className="form-input"
            value={form.fundraiserStory}
            onChange={handleInputChange}
            placeholder="Explain why you're raising money, what the funds will be used for, and how much you value the support"
            required
          />
          {errors.fundraiserStory && (
            <span className="form-helper" style={{ color: "red" }}>
              {errors.fundraiserStory}
            </span>
          )}

          {/* Fundraiser Photos */}
          <label className="form-label" htmlFor="fundraiser-photos">
            Upload fundraiser photos *
          </label>
          <input
            id="fundraiser-photos"
            name="fundraiserPhotos"
            type="file"
            className="form-input"
            accept="image/*"
            multiple
            onChange={handleInputChange}
            required
          />
          <small className="form-helper">
            You can select and upload several in one go
          </small>
          {errors.fundraiserPhotos && (
            <span className="form-helper" style={{ color: "red" }}>
              {errors.fundraiserPhotos}
            </span>
          )}

          {/* Video URL (optional) */}
          <label className="form-label" htmlFor="video-url">
            Your video URL (YouTube, optional)
          </label>
          <input
            id="video-url"
            name="videoUrl"
            type="url"
            className="form-input"
            value={form.videoUrl}
            onChange={handleInputChange}
            placeholder="http://youtube.com/..."
          />

          <button type="submit" className="submit-btn">
            Create fundraiser
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};