// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title PawToken
 * @dev ERC20 token with treasury management, minting, burning, and transfer controls.
 * Designed for learning and managing via a dashboard.
 */
contract PawToken {
    // --- ERC20 State ---
    string public name;
    string public symbol;
    uint8 public constant decimals = 18;
    uint256 public totalSupply;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    // --- Access Control ---
    address public owner;
    mapping(address => bool) public admins;
    bool public paused;

    // --- Treasury ---
    uint256 public treasuryBalance;

    // --- Transaction History ---
    struct Transaction {
        address from;
        address to;
        uint256 amount;
        uint256 timestamp;
        string txType; // "transfer", "mint", "burn", "deposit", "withdraw"
    }

    Transaction[] public transactions;

    // --- Events ---
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Mint(address indexed to, uint256 amount);
    event Burn(address indexed from, uint256 amount);
    event TreasuryDeposit(address indexed from, uint256 amount);
    event TreasuryWithdraw(address indexed to, uint256 amount);
    event AdminAdded(address indexed account);
    event AdminRemoved(address indexed account);
    event Paused(bool state);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    // --- Modifiers ---
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == owner || admins[msg.sender], "Not admin");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }

    // --- Constructor ---
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply
    ) {
        name = _name;
        symbol = _symbol;
        owner = msg.sender;
        admins[msg.sender] = true;

        uint256 supply = _initialSupply * 10 ** decimals;
        totalSupply = supply;
        balanceOf[msg.sender] = supply;

        emit Transfer(address(0), msg.sender, supply);
    }

    // --- ERC20 Functions ---
    function transfer(address to, uint256 amount) external whenNotPaused returns (bool) {
        require(to != address(0), "Transfer to zero address");
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");

        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;

        transactions.push(Transaction(msg.sender, to, amount, block.timestamp, "transfer"));
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external whenNotPaused returns (bool) {
        require(to != address(0), "Transfer to zero address");
        require(balanceOf[from] >= amount, "Insufficient balance");
        require(allowance[from][msg.sender] >= amount, "Insufficient allowance");

        allowance[from][msg.sender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;

        transactions.push(Transaction(from, to, amount, block.timestamp, "transfer"));
        emit Transfer(from, to, amount);
        return true;
    }

    // --- Admin Functions ---
    function mint(address to, uint256 amount) external onlyAdmin whenNotPaused {
        require(to != address(0), "Mint to zero address");

        totalSupply += amount;
        balanceOf[to] += amount;

        transactions.push(Transaction(address(0), to, amount, block.timestamp, "mint"));
        emit Mint(to, amount);
        emit Transfer(address(0), to, amount);
    }

    function burn(uint256 amount) external whenNotPaused {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");

        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;

        transactions.push(Transaction(msg.sender, address(0), amount, block.timestamp, "burn"));
        emit Burn(msg.sender, amount);
        emit Transfer(msg.sender, address(0), amount);
    }

    // --- Treasury ---
    function depositToTreasury(uint256 amount) external onlyAdmin whenNotPaused {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");

        balanceOf[msg.sender] -= amount;
        treasuryBalance += amount;

        transactions.push(Transaction(msg.sender, address(this), amount, block.timestamp, "deposit"));
        emit TreasuryDeposit(msg.sender, amount);
    }

    function withdrawFromTreasury(address to, uint256 amount) external onlyOwner whenNotPaused {
        require(treasuryBalance >= amount, "Insufficient treasury");
        require(to != address(0), "Withdraw to zero address");

        treasuryBalance -= amount;
        balanceOf[to] += amount;

        transactions.push(Transaction(address(this), to, amount, block.timestamp, "withdraw"));
        emit TreasuryWithdraw(to, amount);
    }

    // --- Access Control ---
    function addAdmin(address account) external onlyOwner {
        require(account != address(0), "Zero address");
        admins[account] = true;
        emit AdminAdded(account);
    }

    function removeAdmin(address account) external onlyOwner {
        admins[account] = false;
        emit AdminRemoved(account);
    }

    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "Zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
        admins[newOwner] = true;
    }

    function setPaused(bool _paused) external onlyOwner {
        paused = _paused;
        emit Paused(_paused);
    }

    // --- View Functions ---
    function getTransactionCount() external view returns (uint256) {
        return transactions.length;
    }

    function getTransactions(uint256 offset, uint256 limit)
        external
        view
        returns (Transaction[] memory)
    {
        uint256 total = transactions.length;
        if (offset >= total) {
            return new Transaction[](0);
        }

        uint256 end = offset + limit;
        if (end > total) end = total;
        uint256 count = end - offset;

        Transaction[] memory result = new Transaction[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = transactions[total - 1 - offset - i]; // newest first
        }
        return result;
    }

    // --- Receive ETH ---
    receive() external payable {}

    function getContractEthBalance() external view returns (uint256) {
        return address(this).balance;
    }
}
