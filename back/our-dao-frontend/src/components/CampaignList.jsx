import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "../hooks/useWeb3";

function CampaignList() {
    const { account, fundraisingContract, mockUSDTContract } = useWeb3();
    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        const loadCampaigns = async () => {
            if (!fundraisingContract) {
                console.log("⛔ fundraisingContract not ready");
                return;
            }

            try {
                const count = await fundraisingContract.campaignCount();
                console.log("✅ Found", count.toString(), "campaigns");

                const all = [];

                for (let i = 1; i <= count; i++) {
                    const [
                        creator,
                        category,
                        goalAmount,
                        collectedAmount,
                        deadline,
                        status
                    ] = await fundraisingContract.getCampaignBasic(i);

                    all.push({
                        id: i,
                        category,
                        goal: ethers.utils.formatUnits(goalAmount, 6),
                        raised: ethers.utils.formatUnits(collectedAmount, 6),
                        deadline: new Date(deadline.toNumber() * 1000).toLocaleString(),
                    });
                }

                setCampaigns(all);
            } catch (err) {
                console.error("❌ Failed to load campaigns", err);
            }
        };


        loadCampaigns();
    }, [fundraisingContract]);

    const handleDonate = async (campaignId) => {
        const amount = ethers.utils.parseUnits("10", 6);

        try {
            const tx1 = await mockUSDTContract.approve(fundraisingContract.address, amount);
            await tx1.wait();

            const tx2 = await fundraisingContract.donate(campaignId, amount);
            await tx2.wait();

            alert(`✅ Donated 10 USDT to campaign #${campaignId}`);
        } catch (err) {
            console.error(err);
            alert("❌ Donation failed");
        }
    };

    if (!account) return <p>Please connect your wallet</p>;

    return (
        <div style={{ marginTop: "2rem" }}>
            <h2>All Campaigns</h2>
            {campaigns.length === 0 ? (
                <p>No campaigns yet</p>
            ) : (
                campaigns.map(c => (
                    <div key={c.id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
                        <p><strong>Campaign #{c.id}</strong></p>
                        <p>Category: {c.category}</p>
                        <p>Goal: {c.goal} USDT</p>
                        <p>Raised: {c.raised} USDT</p>
                        <p>Deadline: {c.deadline}</p>
                        <button onClick={() => handleDonate(c.id)}>Donate 10 USDT</button>
                    </div>
                ))
            )}
        </div>
    );
}

export default CampaignList;
