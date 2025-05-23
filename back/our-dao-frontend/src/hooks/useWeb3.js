import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { FundraisingBank_ADDRESS, MockUSDT_ADDRESS } from "../contracts/contract";
import FundraisingBank from "../contracts/FundraisingBank.json";
import MockUSDT from "../contracts/MockUSDT.json";

export const useWeb3 = () => {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [fundraisingContract, setFundraisingContract] = useState(null);
    const [mockUSDTContract, setMockUSDTContract] = useState(null);
    const [account, setAccount] = useState(null);

    useEffect(() => {
        const connectWallet = async () => {
            try {
                if (window.ethereum) {
                    const _provider = new ethers.providers.Web3Provider(window.ethereum);
                    const _accounts = await _provider.send("eth_requestAccounts", []);
                    const _signer = _provider.getSigner();

                    const _fundraising = new ethers.Contract(
                        FundraisingBank_ADDRESS,
                        FundraisingBank.abi,
                        _signer
                    );

                    const _mockUSDT = new ethers.Contract(
                        MockUSDT_ADDRESS,
                        MockUSDT.abi,
                        _signer
                    );

                    setProvider(_provider);
                    setSigner(_signer);
                    setFundraisingContract(_fundraising);
                    setMockUSDTContract(_mockUSDT);
                    setAccount(_accounts[0]);
                } else {
                    alert("Please install MetaMask!");
                }
            } catch (err) {
                console.error("Failed to connect wallet:", err);
                alert("Failed to connect wallet. Check console for details.");
            }
        };

        connectWallet();
    }, []);

    return {
        provider,
        signer,
        fundraisingContract,
        mockUSDTContract,
        account,
    };
};
