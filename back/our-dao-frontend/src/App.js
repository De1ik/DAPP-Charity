import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "./hooks/useWeb3";
import CreateAndDonate from "./components/CreateAndDonate";
import CampaignList from "./components/CampaignList";

function App() {
    const { account, fundraisingContract, mockUSDTContract } = useWeb3();
    const [myUSDTBalance, setMyUSDTBalance] = useState("0");
    const [myUSDTDonations, setMyUSDTDonations] = useState("0");

    const fetchData = async () => {
        if (!fundraisingContract || !mockUSDTContract || !account) return;

        try {
            const balance = await mockUSDTContract.balanceOf(account);
            setMyUSDTBalance(ethers.utils.formatUnits(balance, 6));

            const donation = await fundraisingContract.donations(account);
            setMyUSDTDonations(ethers.utils.formatUnits(donation, 6));

        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [fundraisingContract, mockUSDTContract, account]);


    return (
        <div>
            <h1>Charity DAO — USDT donations</h1>
            {account ? (
                <>
                    <p>Connected as: {account}</p>
                    <p><strong>My USDT balance:</strong> {myUSDTBalance} USDT</p>
                    <p><strong>My USDT donation:</strong> {myUSDTDonations} USDT</p>
                    <br/>
                    <CampaignList />
                    <CreateAndDonate />


                </>
            ) : (
                <p>Please connect your wallet</p>
            )}
        </div>
    );

}

export default App;
