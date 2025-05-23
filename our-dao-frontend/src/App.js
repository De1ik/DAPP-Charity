import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useWeb3 } from "./hooks/useWeb3";

function App() {
    const { contract, account } = useWeb3();
    const [proposals, setProposals] = useState([]);
    const [myDonations, setMyDonations] = useState("0");
    const [votes, setVotes] = useState([]);

    const fetchData = async () => {
        if (!contract || !account) return;

        try {
            const props = await contract.getProposals();
            setProposals(props);

            const donation = await contract.donations(account);
            setMyDonations(ethers.utils.formatEther(donation));

            const votesArr = [];
            for (let i = 0; i < props.length; i++) {
                const v = await contract.votes(i);
                votesArr.push(v.toString());
            }
            setVotes(votesArr);
        } catch (err) {
            console.error("Error fetching data:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, [contract, account]);

    const handleDonate = async () => {
        try {
            const tx = await contract.donate({ value: ethers.utils.parseEther("0.01") });
            await tx.wait();
            alert("Thank you for your donation!");
            fetchData(); // refresh
        } catch (err) {
            console.error(err);
            alert("Error while donating");
        }
    };

    const handleCreateProposal = async () => {
        const proposalText = prompt("Enter proposal text:");
        if (!proposalText) return;

        try {
            const tx = await contract.createProposal(proposalText);
            await tx.wait();
            alert("Proposal created");
            fetchData(); // refresh
        } catch (err) {
            console.error(err);
            alert("Error creating proposal");
        }
    };

    const handleVote = async (proposalId) => {
        try {
            const tx = await contract.vote(proposalId);
            await tx.wait();
            alert("Your vote has been counted");
            fetchData(); // refresh
        } catch (err) {
            console.error(err);
            alert("Error while voting");
        }
    };

    return (
        <div>
            <h1>Charity DAO</h1>
            {account ? (
                <>
                    <p>Connected as: {account}</p>
                    <p>My donation: {myDonations} ETH</p>
                    <button onClick={handleDonate}>Donate 0.01 ETH</button>
                    <button onClick={handleCreateProposal}>Create Proposal</button>
                    <h2>Proposals</h2>
                    <ul>
                        {proposals.map((p, i) => (
                            <li key={i}>
                                {p} – {votes[i] || 0} votes
                                <button onClick={() => handleVote(i)}>Vote</button>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <p>Please connect your wallet</p>
            )}
        </div>
    );
}

export default App;
