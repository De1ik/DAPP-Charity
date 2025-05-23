import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { contractABI, contractAddress } from "../contracts/contract";

export const useWeb3 = () => {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);

    useEffect(() => {
        const connectWallet = async () => {
            try {
                if (window.ethereum) {
                    const _provider = new ethers.providers.Web3Provider(window.ethereum);
                    const _accounts = await _provider.send("eth_requestAccounts", []);
                    const _signer = _provider.getSigner();
                    const _contract = new ethers.Contract(contractAddress, contractABI, _signer);

                    setProvider(_provider);
                    setSigner(_signer);
                    setContract(_contract);
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


    return { provider, signer, contract, account };
};
