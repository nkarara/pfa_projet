// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title DisputeManager
 * @dev Manages dispute creation, resolution, and tracking for rental contracts
 */
contract DisputeManager {
    
    // Dispute status
    enum DisputeStatus { Open, InReview, Resolved, Rejected }
    
    // Dispute structure
    struct Dispute {
        uint256 id;
        address filedBy;
        address against;
        string description;
        string resolution;
        DisputeStatus status;
        uint256 createdAt;
        uint256 resolvedAt;
        address resolvedBy;
    }
    
    // Contract parties
    address public landlord;
    address public tenant;
    address public arbitrator; // Optional third-party arbitrator
    
    // Dispute tracking
    mapping(uint256 => Dispute) public disputes;
    uint256 public disputeCount;
    
    // Events
    event DisputeCreated(
        uint256 indexed disputeId,
        address indexed filedBy,
        address indexed against,
        string description,
        uint256 timestamp
    );
    
    event DisputeStatusUpdated(
        uint256 indexed disputeId,
        DisputeStatus newStatus,
        address updatedBy,
        uint256 timestamp
    );
    
    event DisputeResolved(
        uint256 indexed disputeId,
        address indexed resolvedBy,
        string resolution,
        uint256 timestamp
    );
    
    // Modifiers
    modifier onlyLandlord() {
        require(msg.sender == landlord, "Only landlord can perform this action");
        _;
    }
    
    modifier onlyTenant() {
        require(msg.sender == tenant, "Only tenant can perform this action");
        _;
    }
    
    modifier onlyParties() {
        require(
            msg.sender == landlord || msg.sender == tenant,
            "Only contract parties can perform this action"
        );
        _;
    }
    
    modifier onlyArbitrator() {
        require(msg.sender == arbitrator, "Only arbitrator can perform this action");
        _;
    }
    
    modifier onlyAuthorized() {
        require(
            msg.sender == landlord || msg.sender == tenant || msg.sender == arbitrator,
            "Not authorized"
        );
        _;
    }
    
    /**
     * @dev Constructor to initialize dispute manager
     * @param _tenant Address of the tenant
     * @param _arbitrator Optional arbitrator address (can be address(0))
     */
    constructor(address _tenant, address _arbitrator) {
        require(_tenant != address(0), "Invalid tenant address");
        
        landlord = msg.sender;
        tenant = _tenant;
        arbitrator = _arbitrator;
        disputeCount = 0;
    }
    
    /**
     * @dev Create a new dispute
     * @param _description Description of the dispute issue
     */
    function createDispute(string memory _description) external onlyParties returns (uint256) {
        require(bytes(_description).length > 0, "Description cannot be empty");
        
        address against = (msg.sender == landlord) ? tenant : landlord;
        
        disputes[disputeCount] = Dispute({
            id: disputeCount,
            filedBy: msg.sender,
            against: against,
            description: _description,
            resolution: "",
            status: DisputeStatus.Open,
            createdAt: block.timestamp,
            resolvedAt: 0,
            resolvedBy: address(0)
        });
        
        emit DisputeCreated(disputeCount, msg.sender, against, _description, block.timestamp);
        
        disputeCount++;
        return disputeCount - 1;
    }
    
    /**
     * @dev Update dispute status
     * @param _disputeId Dispute ID to update
     * @param _newStatus New status to set
     */
    function updateDisputeStatus(uint256 _disputeId, DisputeStatus _newStatus) external onlyAuthorized {
        require(_disputeId < disputeCount, "Invalid dispute ID");
        
        Dispute storage dispute = disputes[_disputeId];
        require(dispute.status != DisputeStatus.Resolved, "Dispute already resolved");
        
        dispute.status = _newStatus;
        
        emit DisputeStatusUpdated(_disputeId, _newStatus, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Resolve a dispute
     * @param _disputeId Dispute ID to resolve
     * @param _resolution Resolution description or outcome
     */
    function resolveDispute(uint256 _disputeId, string memory _resolution) external onlyAuthorized {
        require(_disputeId < disputeCount, "Invalid dispute ID");
        require(bytes(_resolution).length > 0, "Resolution cannot be empty");
        
        Dispute storage dispute = disputes[_disputeId];
        require(dispute.status != DisputeStatus.Resolved, "Dispute already resolved");
        
        // Only arbitrator or the party against whom dispute was filed can resolve
        require(
            msg.sender == arbitrator || msg.sender == dispute.against,
            "Not authorized to resolve this dispute"
        );
        
        dispute.resolution = _resolution;
        dispute.status = DisputeStatus.Resolved;
        dispute.resolvedAt = block.timestamp;
        dispute.resolvedBy = msg.sender;
        
        emit DisputeResolved(_disputeId, msg.sender, _resolution, block.timestamp);
    }
    
    /**
     * @dev Get dispute details
     * @param _disputeId Dispute ID to query
     */
    function getDispute(uint256 _disputeId) external view returns (
        address filedBy,
        address against,
        string memory description,
        string memory resolution,
        DisputeStatus status,
        uint256 createdAt,
        uint256 resolvedAt,
        address resolvedBy
    ) {
        require(_disputeId < disputeCount, "Invalid dispute ID");
        
        Dispute storage dispute = disputes[_disputeId];
        
        return (
            dispute.filedBy,
            dispute.against,
            dispute.description,
            dispute.resolution,
            dispute.status,
            dispute.createdAt,
            dispute.resolvedAt,
            dispute.resolvedBy
        );
    }
    
    /**
     * @dev Get all disputes for the contract
     */
    function getAllDisputes() external view returns (
        uint256[] memory ids,
        address[] memory filedBy,
        string[] memory descriptions,
        DisputeStatus[] memory statuses,
        uint256[] memory createdAt
    ) {
        ids = new uint256[](disputeCount);
        filedBy = new address[](disputeCount);
        descriptions = new string[](disputeCount);
        statuses = new DisputeStatus[](disputeCount);
        createdAt = new uint256[](disputeCount);
        
        for (uint256 i = 0; i < disputeCount; i++) {
            Dispute storage dispute = disputes[i];
            ids[i] = dispute.id;
            filedBy[i] = dispute.filedBy;
            descriptions[i] = dispute.description;
            statuses[i] = dispute.status;
            createdAt[i] = dispute.createdAt;
        }
        
        return (ids, filedBy, descriptions, statuses, createdAt);
    }
    
    /**
     * @dev Get disputes filed by a specific party
     * @param _party Address of the party (landlord or tenant)
     */
    function getDisputesByParty(address _party) external view returns (uint256[] memory) {
        uint256 count = 0;
        
        // Count disputes filed by party
        for (uint256 i = 0; i < disputeCount; i++) {
            if (disputes[i].filedBy == _party) {
                count++;
            }
        }
        
        // Populate array
        uint256[] memory disputeIds = new uint256[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < disputeCount; i++) {
            if (disputes[i].filedBy == _party) {
                disputeIds[index] = i;
                index++;
            }
        }
        
        return disputeIds;
    }
    
    /**
     * @dev Get count of open disputes
     */
    function getOpenDisputeCount() external view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < disputeCount; i++) {
            if (disputes[i].status == DisputeStatus.Open || disputes[i].status == DisputeStatus.InReview) {
                count++;
            }
        }
        return count;
    }
    
    /**
     * @dev Set arbitrator (only landlord can set)
     * @param _newArbitrator Address of the new arbitrator
     */
    function setArbitrator(address _newArbitrator) external onlyLandlord {
        arbitrator = _newArbitrator;
    }
}
