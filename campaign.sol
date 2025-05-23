// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transferFrom(address from, address to, uint amount) external returns (bool);
    function transfer(address to, uint amount) external returns (bool);
    function decimals() external view returns (uint8);
}

contract FundraisingBank {
    IERC20 public usdt;

    enum Status {
        Active,
        Cancelled,
        Completed,
        Expired,
        FinalizedEarly,
        AwaitingDecision,
        Confirmed,
        Rejected,
        FundsTransferred,
        ReportSubmitted,
        Verified,
        VoteExpired
    }

    struct Validator {
        bool active;
        int reputation;
        uint lastVoted;
    }

    struct Campaign {
        address creator;
        string category;
        uint goalAmount;
        uint collectedAmount;
        uint deadline;
        uint confirmDeadline;
        uint reportDeadline;
        uint voteDeadline;
        string reportCID;
        Status status;
        mapping(address => uint) donations;
        address[] donors;
        mapping(address => bool) daoVotes;
        mapping(address => string) voteComments;
        mapping(address => bool) voteRecord;
        uint votesFor;
        uint votesAgainst;
        uint totalVotes;
        bool voteFinalized;
    }

    uint public campaignCount;
    mapping(uint => Campaign) private campaigns;
    mapping(address => Validator) public validators;
    uint public requiredVotes = 3;
    uint public quorum = 3;
    int public maxReputation = 100;
    int public minReputation = 0;

    event CampaignCreated(uint indexed id, address creator, uint goalAmount, uint deadline, string category);
    event DonationReceived(uint indexed id, address donor, uint amount);
    event CampaignStatusChanged(uint indexed id, Status newStatus);
    event RefundIssued(uint indexed id, address donor, uint amount);
    event FundsWithdrawn(uint indexed id, address recipient, uint amount);
    event ReportSubmitted(uint indexed id, string cid);
    event DaoVoted(uint indexed id, address voter, bool approved, string commentCID);
    event ValidatorAdded(address validator);
    event ReputationUpdated(address validator, int reputation);

    modifier onlyCreator(uint id) {
        require(msg.sender == campaigns[id].creator, "Not campaign creator");
        _;
    }

    modifier isActive(uint id) {
        Campaign storage c = campaigns[id];
        require(c.status == Status.Active, "Campaign not active");
        require(block.timestamp <= c.deadline, "Deadline passed");
        _;
    }

    modifier onlyValidator() {
        require(validators[msg.sender].active, "Not DAO validator");
        _;
    }

    constructor(address _usdt) {
        usdt = IERC20(_usdt);
        validators[msg.sender] = Validator(true, 0, 0);
    }

    function addValidator(address validator) external onlyValidator {
        validators[validator] = Validator(true, 0, 0);
        emit ValidatorAdded(validator);
    }

    function createCampaign(string memory category, uint goalAmount, uint durationInSeconds) external {
        require(goalAmount > 0, "Goal must be > 0");
        // require(durationInSeconds >= 1 days && durationInSeconds <= 30 days, "Duration must be 1-30 days");

        campaignCount++;
        Campaign storage c = campaigns[campaignCount];
        c.creator = msg.sender;
        c.category = category;
        c.goalAmount = goalAmount;
        c.deadline = block.timestamp + durationInSeconds;
        c.confirmDeadline = c.deadline + 3 days;
        c.status = Status.Active;

        emit CampaignCreated(campaignCount, msg.sender, goalAmount, c.deadline, category);
    }

    function donate(uint id, uint amount) external isActive(id) {
        require(amount > 0, "Amount must be > 0");
        Campaign storage c = campaigns[id];
        require(c.collectedAmount + amount <= c.goalAmount, "Donation exceeds goal");

        if (c.donations[msg.sender] == 0) {
            c.donors.push(msg.sender);
        }

        bool success = usdt.transferFrom(msg.sender, address(this), amount);
        require(success, "Transfer failed");

        c.donations[msg.sender] += amount;
        c.collectedAmount += amount;

        emit DonationReceived(id, msg.sender, amount);

        if (c.collectedAmount >= c.goalAmount) {
            c.status = Status.Completed;
            emit CampaignStatusChanged(id, Status.Completed);
        }
    }

    function checkStatus(uint id) external {
        Campaign storage c = campaigns[id];
        if (c.status == Status.Active && block.timestamp > c.deadline) {
            c.status = Status.Expired;
            emit CampaignStatusChanged(id, Status.Expired);
        }
        if (c.status == Status.Completed && block.timestamp > c.confirmDeadline) {
            rejectCampaign(id);
        }
        if (c.status == Status.Confirmed && block.timestamp > c.reportDeadline) {
            c.status = Status.Rejected;
            emit CampaignStatusChanged(id, Status.Rejected);
        }
        if (c.status == Status.ReportSubmitted && block.timestamp > c.voteDeadline) {
            if (c.totalVotes < quorum) {
                c.status = Status.VoteExpired;
                emit CampaignStatusChanged(id, Status.VoteExpired);
            }
        }
    }

    function confirmCampaign(uint id) external onlyCreator(id) {
        Campaign storage c = campaigns[id];
        require(c.status == Status.Completed, "Not completed yet");

        c.status = Status.Confirmed;
        c.reportDeadline = block.timestamp + 10 days;

        bool success = usdt.transfer(c.creator, c.collectedAmount);
        require(success, "Transfer to creator failed");

        emit CampaignStatusChanged(id, Status.Confirmed);
        emit FundsWithdrawn(id, c.creator, c.collectedAmount);
    }

    function rejectCampaign(uint id) public {
        Campaign storage c = campaigns[id];
        require(c.status == Status.Completed, "Can only reject completed");

        c.status = Status.Rejected;
        emit CampaignStatusChanged(id, Status.Rejected);

        for (uint i = 0; i < c.donors.length; i++) {
            address donor = c.donors[i];
            uint donated = c.donations[donor];
            if (donated > 0) {
                c.donations[donor] = 0;
                bool success = usdt.transfer(donor, donated);
                require(success, "Refund failed");
                emit RefundIssued(id, donor, donated);
            }
        }
    }

    function submitReport(uint id, string calldata cid) external onlyCreator(id) {
        Campaign storage c = campaigns[id];
        require(c.status == Status.Confirmed, "Must be confirmed");
        require(block.timestamp <= c.reportDeadline, "Report deadline passed");

        c.reportCID = cid;
        c.voteDeadline = block.timestamp + 2 days;
        c.status = Status.ReportSubmitted;

        emit ReportSubmitted(id, cid);
    }

    function voteOnReport(uint id, bool approve, string calldata commentCID) external onlyValidator {
        Campaign storage c = campaigns[id];
        require(c.status == Status.ReportSubmitted, "No report submitted");
        require(!c.daoVotes[msg.sender], "Already voted");

        c.daoVotes[msg.sender] = true;
        c.voteComments[msg.sender] = commentCID;
        c.totalVotes++;
        validators[msg.sender].lastVoted = block.timestamp;

        if (approve) {
            c.votesFor++;
        } else {
            c.votesAgainst++;
        }

        emit DaoVoted(id, msg.sender, approve, commentCID);

        if (c.votesFor >= requiredVotes) {
            c.status = Status.Verified;
            emit CampaignStatusChanged(id, Status.Verified);
        }
    }

    function finalizeVote(uint id) external {
        Campaign storage c = campaigns[id];
        require(c.status == Status.ReportSubmitted || c.status == Status.VoteExpired, "Not votable");
        require(!c.voteFinalized, "Already finalized");
        c.voteFinalized = true;

        bool passed = c.votesFor >= c.votesAgainst;

        for (uint i = 0; i < c.donors.length; i++) {
            address voter = c.donors[i];
            if (c.daoVotes[voter]) {
                if (passed) {
                    if (validators[voter].reputation < maxReputation) {
                        validators[voter].reputation++;
                    }
                } else {
                    if (validators[voter].reputation > minReputation) {
                        validators[voter].reputation--;
                    }
                }
                emit ReputationUpdated(voter, validators[voter].reputation);
            }
        }
    }

    function getCampaignBasic(uint id) external view returns (
        address creator,
        string memory category,
        uint goalAmount,
        uint collectedAmount,
        uint deadline,
        Status status
    ) {
        Campaign storage c = campaigns[id];
        return (c.creator, c.category, c.goalAmount, c.collectedAmount, c.deadline, c.status);
    }

    function getCampaignDeadlines(uint id) external view returns (
        uint confirmDeadline,
        uint reportDeadline,
        uint voteDeadline,
        bool voteFinalized
    ) {
        Campaign storage c = campaigns[id];
        return (c.confirmDeadline, c.reportDeadline, c.voteDeadline, c.voteFinalized);
    }

    function getCampaignVotes(uint id) external view returns (
        uint votesFor,
        uint votesAgainst,
        uint totalVotes,
        string memory reportCID
    ) {
        Campaign storage c = campaigns[id];
        return (c.votesFor, c.votesAgainst, c.totalVotes, c.reportCID);
    }

    function getValidator(address addr) external view returns (bool active, int reputation, uint lastVoted) {
        Validator storage v = validators[addr];
        return (v.active, v.reputation, v.lastVoted);
    }

    function getVoteComment(uint campaignId, address voter) external view returns (string memory) {
        return campaigns[campaignId].voteComments[voter];
    }
}
