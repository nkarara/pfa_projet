// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title RentalContract
 * @dev Smart contract for managing rental agreements between landlord and tenant
 */
contract RentalContract {
    
    // Contract states
    enum ContractStatus { Draft, PendingSignature, Active, Terminated }
    
    // Struct to store contract details
    struct ContractDetails {
        address payable landlord;
        address payable tenant;
        uint256 rentAmount;
        uint256 depositAmount;
        uint256 durationMonths;
        uint256 startDate;
        uint256 endDate;
        ContractStatus status;
        bool landlordSigned;
        bool tenantSigned;
        string propertyAddress;
        string terms;
    }
    
    ContractDetails public contractDetails;
    
    // Events
    event ContractCreated(address indexed landlord, uint256 rentAmount, uint256 depositAmount);
    event ContractSignedByLandlord(address indexed landlord, uint256 timestamp);
    event ContractSignedByTenant(address indexed tenant, uint256 depositPaid, uint256 timestamp);
    event ContractActivated(uint256 startDate, uint256 endDate);
    event ContractTerminated(address indexed by, uint256 timestamp, uint256 depositReturned);
    
    // Modifiers
    modifier onlyLandlord() {
        require(msg.sender == contractDetails.landlord, "Only landlord can perform this action");
        _;
    }
    
    modifier onlyTenant() {
        require(msg.sender == contractDetails.tenant, "Only tenant can perform this action");
        _;
    }
    
    modifier onlyParties() {
        require(
            msg.sender == contractDetails.landlord || msg.sender == contractDetails.tenant,
            "Only contract parties can perform this action"
        );
        _;
    }
    
    modifier contractActive() {
        require(contractDetails.status == ContractStatus.Active, "Contract is not active");
        _;
    }
    
    /**
     * @dev Constructor to initialize the rental contract
     * @param _tenant Address of the tenant
     * @param _rentAmount Monthly rent amount in wei
     * @param _depositAmount Security deposit amount in wei
     * @param _durationMonths Contract duration in months
     * @param _propertyAddress Physical address of the property
     * @param _terms Contract terms and conditions
     */
    constructor(
        address payable _tenant,
        uint256 _rentAmount,
        uint256 _depositAmount,
        uint256 _durationMonths,
        string memory _propertyAddress,
        string memory _terms
    ) {
        require(_tenant != address(0), "Invalid tenant address");
        require(_rentAmount > 0, "Rent amount must be greater than 0");
        require(_depositAmount > 0, "Deposit amount must be greater than 0");
        require(_durationMonths > 0, "Duration must be greater than 0");
        
        contractDetails = ContractDetails({
            landlord: payable(msg.sender),
            tenant: _tenant,
            rentAmount: _rentAmount,
            depositAmount: _depositAmount,
            durationMonths: _durationMonths,
            startDate: 0,
            endDate: 0,
            status: ContractStatus.Draft,
            landlordSigned: false,
            tenantSigned: false,
            propertyAddress: _propertyAddress,
            terms: _terms
        });
        
        emit ContractCreated(msg.sender, _rentAmount, _depositAmount);
    }
    
    /**
     * @dev Landlord signs the contract
     */
    function signByLandlord() external onlyLandlord {
        require(contractDetails.status == ContractStatus.Draft, "Contract already signed by landlord");
        require(!contractDetails.landlordSigned, "Landlord already signed");
        
        contractDetails.landlordSigned = true;
        contractDetails.status = ContractStatus.PendingSignature;
        
        emit ContractSignedByLandlord(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Tenant signs the contract and pays deposit
     */
    function signByTenant() external payable onlyTenant {
        require(contractDetails.landlordSigned, "Landlord must sign first");
        require(!contractDetails.tenantSigned, "Tenant already signed");
        require(msg.value == contractDetails.depositAmount, "Incorrect deposit amount");
        
        contractDetails.tenantSigned = true;
        contractDetails.status = ContractStatus.Active;
        contractDetails.startDate = block.timestamp;
        contractDetails.endDate = block.timestamp + (contractDetails.durationMonths * 30 days);
        
        emit ContractSignedByTenant(msg.sender, msg.value, block.timestamp);
        emit ContractActivated(contractDetails.startDate, contractDetails.endDate);
    }
    
    /**
     * @dev Terminate the contract
     * @param _returnDeposit Whether to return the deposit to tenant
     */
    function terminateContract(bool _returnDeposit) external onlyLandlord contractActive {
        contractDetails.status = ContractStatus.Terminated;
        
        uint256 depositReturned = 0;
        if (_returnDeposit && contractDetails.depositAmount > 0) {
            depositReturned = contractDetails.depositAmount;
            contractDetails.tenant.transfer(contractDetails.depositAmount);
        } else if (!_returnDeposit && contractDetails.depositAmount > 0) {
            // Keep deposit, transfer to landlord
            contractDetails.landlord.transfer(contractDetails.depositAmount);
        }
        
        emit ContractTerminated(msg.sender, block.timestamp, depositReturned);
    }
    
    /**
     * @dev Get contract details
     */
    function getContractDetails() external view returns (
        address landlord,
        address tenant,
        uint256 rentAmount,
        uint256 depositAmount,
        uint256 durationMonths,
        uint256 startDate,
        uint256 endDate,
        ContractStatus status,
        bool landlordSigned,
        bool tenantSigned
    ) {
        return (
            contractDetails.landlord,
            contractDetails.tenant,
            contractDetails.rentAmount,
            contractDetails.depositAmount,
            contractDetails.durationMonths,
            contractDetails.startDate,
            contractDetails.endDate,
            contractDetails.status,
            contractDetails.landlordSigned,
            contractDetails.tenantSigned
        );
    }
    
    /**
     * @dev Get property information
     */
    function getPropertyInfo() external view returns (string memory propertyAddress, string memory terms) {
        return (contractDetails.propertyAddress, contractDetails.terms);
    }
    
    /**
     * @dev Get contract balance (deposit held)
     */
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
