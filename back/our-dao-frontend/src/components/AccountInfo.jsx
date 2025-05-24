// src/components/AccountInfo.jsx
import React from "react";

const AccountInfo = ({ account, myUSDTBalance, myUSDTDonations }) => {
    return (
        <div>
            <h1>Charity DAO — USDT donations</h1>
            {account ? (
                <>
                    <p>Connected as: {account}</p>
                    <p><strong>My USDT balance:</strong> {myUSDTBalance} USDT</p>
                    <p><strong>My USDT donation:</strong> {myUSDTDonations} USDT</p>
                </>
            ) : (
                <p>Please connect your wallet</p>
            )}
        </div>
    );
};

export default AccountInfo;
