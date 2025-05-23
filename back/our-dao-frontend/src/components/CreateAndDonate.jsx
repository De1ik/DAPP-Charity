import React, { useState } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "../hooks/useWeb3";

function CreateAndDonate() {
    const { account, fundraisingContract, mockUSDTContract } = useWeb3();
    const [creating, setCreating] = useState(false);
    const [goal, setGoal] = useState("1000"); // USDT
    const [category, setCategory] = useState("Health");
    const [duration, setDuration] = useState("3"); // days

    const handleCreateAndDonate = async () => {
        if (!fundraisingContract || !mockUSDTContract || !account) return;

        const goalAmount = ethers.utils.parseUnits(goal, 6); // 6 decimals for USDT
        const durationInSeconds = parseInt(duration) * 24 * 60 * 60;
        const donationAmount = ethers.utils.parseUnits("10", 6); // 10 USDT

        try {
            setCreating(true);

            // Step 1: Create campaign
            const tx1 = await fundraisingContract.createCampaign(category, goalAmount, durationInSeconds);
            await tx1.wait();

            const campaignId = await fundraisingContract.campaignCount(); // last created campaign

            // Step 2: Approve and donate
            const tx2 = await mockUSDTContract.approve(fundraisingContract.address, donationAmount);
            await tx2.wait();

            const tx3 = await fundraisingContract.donate(campaignId, donationAmount);
            await tx3.wait();

            alert(`✅ Created campaign #${campaignId} and donated 10 USDT`);
        } catch (err) {
            console.error(err);
            alert("❌ Failed to create or donate");
        } finally {
            setCreating(false);
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Create Campaign & Donate</h2>

            {account ? (
                <>
                    <p>Connected as: <strong>{account}</strong></p>

                    <label>
                        Category:{" "}
                        <input value={category} onChange={(e) => setCategory(e.target.value)} />
                    </label>
                    <br />

                    <label>
                        Goal (USDT):{" "}
                        <input type="number" value={goal} onChange={(e) => setGoal(e.target.value)} />
                    </label>
                    <br />

                    <label>
                        Duration (days):{" "}
                        <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
                    </label>
                    <br /><br />

                    <button onClick={handleCreateAndDonate} disabled={creating}>
                        {creating ? "Processing..." : "Create Campaign & Donate 10 USDT"}
                    </button>
                </>
            ) : (
                <p>Please connect your wallet</p>
            )}
        </div>
    );
}

export default CreateAndDonate;
