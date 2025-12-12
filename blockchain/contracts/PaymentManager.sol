// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title PaymentManager
 * @dev Manages rent payments, penalties, and payment history for rental contracts
 */
contract PaymentManager {
    
    // Payment status
    enum PaymentStatus { Pending, Paid, Overdue }
    
    // Payment record structure
    struct Payment {
        uint256 id;
        uint256 dueDate;
        uint256 paidDate;
        uint256 amount;
        uint256 penalty;
        PaymentStatus status;
        address paidBy;
    }
    
    // Contract configuration
    address payable public landlord;
    address public tenant;
    uint256 public rentAmount;
    uint256 public paymentFrequencyDays; // Usually 30 days for monthly
    uint256 public contractStartDate;
    uint256 public penaltyRate; // Penalty percentage (e.g., 5 = 5%)
    uint256 public gracePeriodDays; // Days before penalty applies
    
    // Payment tracking
    mapping(uint256 => Payment) public payments;
    uint256 public paymentCount;
    uint256 public nextPaymentDue;
    
    // Events
    event RentPaid(
        uint256 indexed paymentId,
        address indexed paidBy,
        uint256 amount,
        uint256 penalty,
        uint256 timestamp
    );
    event PenaltyApplied(uint256 indexed paymentId, uint256 penaltyAmount);
    event PaymentScheduleGenerated(uint256 numberOfPayments);
    
    // Modifiers
    modifier onlyLandlord() {
        require(msg.sender == landlord, "Only landlord can perform this action");
        _;
    }
    
    modifier onlyTenant() {
        require(msg.sender == tenant, "Only tenant can perform this action");
        _;
    }
    
    /**
     * @dev Constructor to initialize payment manager
     * @param _tenant Address of the tenant
     * @param _rentAmount Monthly rent amount in wei
     * @param _contractStartDate Contract start timestamp
     * @param _durationMonths Contract duration in months
     * @param _penaltyRate Penalty percentage for late payments
     * @param _gracePeriodDays Grace period before penalties apply
     */
    constructor(
        address _tenant,
        uint256 _rentAmount,
        uint256 _contractStartDate,
        uint256 _durationMonths,
        uint256 _penaltyRate,
        uint256 _gracePeriodDays
    ) {
        require(_tenant != address(0), "Invalid tenant address");
        require(_rentAmount > 0, "Rent amount must be greater than 0");
        require(_durationMonths > 0, "Duration must be greater than 0");
        
        landlord = payable(msg.sender);
        tenant = _tenant;
        rentAmount = _rentAmount;
        paymentFrequencyDays = 30 days;
        contractStartDate = _contractStartDate;
        penaltyRate = _penaltyRate;
        gracePeriodDays = _gracePeriodDays;
        
        // Generate payment schedule
        _generatePaymentSchedule(_durationMonths);
    }
    
    /**
     * @dev Generate payment schedule for the contract duration
     * @param _durationMonths Number of months for the contract
     */
    function _generatePaymentSchedule(uint256 _durationMonths) private {
        for (uint256 i = 0; i < _durationMonths; i++) {
            uint256 dueDate = contractStartDate + (i * paymentFrequencyDays);
            
            payments[paymentCount] = Payment({
                id: paymentCount,
                dueDate: dueDate,
                paidDate: 0,
                amount: rentAmount,
                penalty: 0,
                status: PaymentStatus.Pending,
                paidBy: address(0)
            });
            
            paymentCount++;
        }
        
        nextPaymentDue = 0; // First payment index
        emit PaymentScheduleGenerated(_durationMonths);
    }
    
    /**
     * @dev Pay rent for the next due payment
     */
    function payRent() external payable onlyTenant {
        require(nextPaymentDue < paymentCount, "No more payments due");
        
        Payment storage payment = payments[nextPaymentDue];
        require(payment.status != PaymentStatus.Paid, "Payment already made");
        
        // Calculate penalty if payment is late
        uint256 penalty = 0;
        if (block.timestamp > payment.dueDate + (gracePeriodDays * 1 days)) {
            penalty = calculatePenalty(payment.amount, payment.dueDate);
            payment.penalty = penalty;
            emit PenaltyApplied(payment.id, penalty);
        }
        
        uint256 totalAmount = payment.amount + penalty;
        require(msg.value >= totalAmount, "Insufficient payment amount");
        
        // Update payment record
        payment.paidDate = block.timestamp;
        payment.status = PaymentStatus.Paid;
        payment.paidBy = msg.sender;
        
        // Transfer to landlord
        landlord.transfer(totalAmount);
        
        // Return excess if any
        if (msg.value > totalAmount) {
            payable(msg.sender).transfer(msg.value - totalAmount);
        }
        
        emit RentPaid(payment.id, msg.sender, payment.amount, penalty, block.timestamp);
        
        // Move to next payment
        nextPaymentDue++;
    }
    
    /**
     * @dev Calculate penalty for late payment
     * @param _amount Base rent amount
     * @param _dueDate Original due date
     * @return Penalty amount in wei
     */
    function calculatePenalty(uint256 _amount, uint256 _dueDate) public view returns (uint256) {
        if (block.timestamp <= _dueDate + (gracePeriodDays * 1 days)) {
            return 0;
        }
        
        // Calculate days late (after grace period)
        uint256 daysLate = (block.timestamp - _dueDate - (gracePeriodDays * 1 days)) / 1 days;
        
        // Penalty = base amount * penaltyRate% * days late / 30
        uint256 penalty = (_amount * penaltyRate * daysLate) / (100 * 30);
        
        return penalty;
    }
    
    /**
     * @dev Get details of next rent due
     */
    function getRentDueDate() external view returns (
        uint256 paymentId,
        uint256 dueDate,
        uint256 amount,
        uint256 estimatedPenalty,
        PaymentStatus status
    ) {
        if (nextPaymentDue >= paymentCount) {
            return (0, 0, 0, 0, PaymentStatus.Paid);
        }
        
        Payment storage payment = payments[nextPaymentDue];
        uint256 penalty = calculatePenalty(payment.amount, payment.dueDate);
        
        return (
            payment.id,
            payment.dueDate,
            payment.amount,
            penalty,
            payment.status
        );
    }
    
    // Get payment history
    function getPaymentHistory() external view returns (
        uint256[] memory ids,
        uint256[] memory dueDates,
        uint256[] memory paidDates,
        uint256[] memory amounts,
        uint256[] memory penalties,
        PaymentStatus[] memory statuses
    ) {
        ids = new uint256[](paymentCount);
        dueDates = new uint256[](paymentCount);
        paidDates = new uint256[](paymentCount);
        amounts = new uint256[](paymentCount);
        penalties = new uint256[](paymentCount);
        statuses = new PaymentStatus[](paymentCount);
        
        for (uint256 i = 0; i < paymentCount; i++) {
            Payment storage payment = payments[i];
            ids[i] = payment.id;
            dueDates[i] = payment.dueDate;
            paidDates[i] = payment.paidDate;
            amounts[i] = payment.amount;
            penalties[i] = payment.penalty;
            statuses[i] = payment.status;
        }
        
        return (ids, dueDates, paidDates, amounts, penalties, statuses);
    }
    
    /**
     * @dev Get specific payment details
     * @param _paymentId Payment ID to query
     */
    function getPayment(uint256 _paymentId) external view returns (
        uint256 dueDate,
        uint256 paidDate,
        uint256 amount,
        uint256 penalty,
        PaymentStatus status,
        address paidBy
    ) {
        require(_paymentId < paymentCount, "Invalid payment ID");
        Payment storage payment = payments[_paymentId];
        
        return (
            payment.dueDate,
            payment.paidDate,
            payment.amount,
            payment.penalty,
            payment.status,
            payment.paidBy
        );
    }
    
    /**
     * @dev Check for overdue payments and update status
     */
    function updateOverdueStatus() external {
        for (uint256 i = nextPaymentDue; i < paymentCount; i++) {
            Payment storage payment = payments[i];
            if (payment.status == PaymentStatus.Pending && block.timestamp > payment.dueDate) {
                payment.status = PaymentStatus.Overdue;
            }
        }
    }
    
    /**
     * @dev Get count of overdue payments
     */
    function getOverdueCount() external view returns (uint256) {
        uint256 count = 0;
        for (uint256 i = 0; i < paymentCount; i++) {
            if (payments[i].status == PaymentStatus.Overdue || 
                (payments[i].status == PaymentStatus.Pending && block.timestamp > payments[i].dueDate)) {
                count++;
            }
        }
        return count;
    }
}
