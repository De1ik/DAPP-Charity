import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "./hooks/useWeb3";
import CreateAndDonate from "./components/CreateAndDonate";
import CampaignList from "./components/CampaignList";
import DonationPage from "./components/JarDescription";
import AccountInfo from "./components/AccountInfo";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

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
        <Router>
            <div>
                <nav>
                    <Link to="/">Home</Link> |{" "}
                    <Link to="/donate">Go to Donation Page</Link> |{" "}
                    <Link to="/account">Account Info</Link>
                </nav>

                <Routes>
                    <Route path="/" element={
                        <>
                            <CampaignList />
                            <CreateAndDonate />
                        </>
                    } />
                    <Route path="/donate" element={<DonationPage />} />
                    <Route path="/account" element={
                        <AccountInfo
                            account={account}
                            myUSDTBalance={myUSDTBalance}
                            myUSDTDonations={myUSDTDonations}
                        />
                    } />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
