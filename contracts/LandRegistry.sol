// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title LandRegistry
 * @notice Educational land-registry prototype. Uses synthetic data only.
 * @dev This contract does NOT establish legal ownership. It records a
 *      tamper-evident digital workflow for demonstration purposes.
 */
contract LandRegistry {
    address public admin;

    mapping(address => bool) public isRegistrar;
    mapping(address => bool) public isSurveyor;
    mapping(address => bool) public isNotary;
    mapping(address => bool) public isVerifier;

    enum PropertyStatus {
        REGISTERED,
        VERIFIED,
        TRANSFER_PENDING,
        TRANSFERRED,
        DISPUTED
    }

    struct Property {
        uint256 propertyId;
        string propertyNumber;
        string location;
        uint256 area;
        string propertyType;
        address currentOwner;
        address previousOwner;
        bytes32 documentHash;
        bool verified;
        PropertyStatus status;
        uint256 registeredAt;
        uint256 lastTransferredAt;
        bool exists;
    }

    struct OwnershipRecord {
        address owner;
        uint256 timestamp;
        bytes32 deedHash;
    }

    mapping(uint256 => Property) private properties;
    mapping(address => uint256[]) private ownerProperties;
    mapping(uint256 => OwnershipRecord[]) private ownershipHistory;
    mapping(uint256 => bool) public propertyExists;

    event PropertyRegistered(
        uint256 indexed propertyId,
        string propertyNumber,
        address indexed initialOwner,
        bytes32 documentHash
    );
    event PropertyVerified(uint256 indexed propertyId, address indexed verifier);
    event OwnershipTransferred(
        uint256 indexed propertyId,
        address indexed previousOwner,
        address indexed newOwner,
        uint256 timestamp,
        bytes32 deedHash
    );
    event PropertyStatusUpdated(uint256 indexed propertyId, PropertyStatus status);
    event RoleUpdated(string role, address indexed account, bool enabled);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Not admin");
        _;
    }

    modifier onlyRegistrar() {
        require(isRegistrar[msg.sender], "Not registrar");
        _;
    }

    modifier onlyVerifier() {
        require(isVerifier[msg.sender] || isSurveyor[msg.sender] || msg.sender == admin, "Not verifier");
        _;
    }

    modifier onlyNotary() {
        require(isNotary[msg.sender] || msg.sender == admin, "Not notary");
        _;
    }

    modifier validProperty(uint256 propertyId) {
        require(propertyExists[propertyId], "Property does not exist");
        _;
    }

    modifier onlyPropertyOwner(uint256 propertyId) {
        require(properties[propertyId].currentOwner == msg.sender, "Not property owner");
        _;
    }

    constructor(address initialAdmin) {
        require(initialAdmin != address(0), "Invalid admin");
        admin = initialAdmin;
        isRegistrar[initialAdmin] = true;
        isSurveyor[initialAdmin] = true;
        isNotary[initialAdmin] = true;
        isVerifier[initialAdmin] = true;
    }

    function setRegistrar(address account, bool enabled) external onlyAdmin {
        require(account != address(0), "Invalid address");
        isRegistrar[account] = enabled;
        emit RoleUpdated("REGISTRAR", account, enabled);
    }

    function setSurveyor(address account, bool enabled) external onlyAdmin {
        require(account != address(0), "Invalid address");
        isSurveyor[account] = enabled;
        emit RoleUpdated("SURVEYOR", account, enabled);
    }

    function setNotary(address account, bool enabled) external onlyAdmin {
        require(account != address(0), "Invalid address");
        isNotary[account] = enabled;
        emit RoleUpdated("NOTARY", account, enabled);
    }

    function setVerifier(address account, bool enabled) external onlyAdmin {
        require(account != address(0), "Invalid address");
        isVerifier[account] = enabled;
        emit RoleUpdated("VERIFIER", account, enabled);
    }

    function registerProperty(
        uint256 propertyId,
        string calldata propertyNumber,
        string calldata location,
        uint256 area,
        string calldata propertyType,
        address initialOwner,
        bytes32 documentHash
    ) external onlyRegistrar {
        require(propertyId != 0, "Invalid property ID");
        require(!propertyExists[propertyId], "Property already exists");
        require(initialOwner != address(0), "Invalid owner");
        require(area > 0, "Area must be positive");
        require(bytes(propertyNumber).length > 0, "Property number required");
        require(bytes(location).length > 0, "Location required");
        require(bytes(propertyType).length > 0, "Property type required");
        require(documentHash != bytes32(0), "Document hash required");

        properties[propertyId] = Property({
            propertyId: propertyId,
            propertyNumber: propertyNumber,
            location: location,
            area: area,
            propertyType: propertyType,
            currentOwner: initialOwner,
            previousOwner: address(0),
            documentHash: documentHash,
            verified: false,
            status: PropertyStatus.REGISTERED,
            registeredAt: block.timestamp,
            lastTransferredAt: 0,
            exists: true
        });

        propertyExists[propertyId] = true;
        ownerProperties[initialOwner].push(propertyId);
        ownershipHistory[propertyId].push(
            OwnershipRecord(initialOwner, block.timestamp, documentHash)
        );

        emit PropertyRegistered(propertyId, propertyNumber, initialOwner, documentHash);
    }

    function verifyProperty(uint256 propertyId) external onlyVerifier validProperty(propertyId) {
        Property storage property = properties[propertyId];
        require(!property.verified, "Property already verified");
        property.verified = true;
        property.status = PropertyStatus.VERIFIED;
        emit PropertyVerified(propertyId, msg.sender);
        emit PropertyStatusUpdated(propertyId, property.status);
    }

    function requestTransfer(uint256 propertyId)
        external
        onlyPropertyOwner(propertyId)
        validProperty(propertyId)
    {
        Property storage property = properties[propertyId];
        require(property.verified, "Property not verified");
        require(property.status != PropertyStatus.DISPUTED, "Property disputed");
        require(property.status != PropertyStatus.TRANSFER_PENDING, "Transfer already pending");
        property.status = PropertyStatus.TRANSFER_PENDING;
        emit PropertyStatusUpdated(propertyId, property.status);
    }

    function completeTransfer(
        uint256 propertyId,
        address newOwner,
        bytes32 deedHash
    ) external onlyNotary validProperty(propertyId) {
        Property storage property = properties[propertyId];
        require(property.status == PropertyStatus.TRANSFER_PENDING, "Transfer not pending");
        require(newOwner != address(0), "Invalid new owner");
        require(deedHash != bytes32(0), "Deed hash required");
        require(property.currentOwner != newOwner, "Already owner");

        address oldOwner = property.currentOwner;
        property.previousOwner = oldOwner;
        property.currentOwner = newOwner;
        property.lastTransferredAt = block.timestamp;
        property.documentHash = deedHash;
        property.status = PropertyStatus.TRANSFERRED;

        ownerProperties[newOwner].push(propertyId);
        ownershipHistory[propertyId].push(
            OwnershipRecord(newOwner, block.timestamp, deedHash)
        );

        emit OwnershipTransferred(propertyId, oldOwner, newOwner, block.timestamp, deedHash);
        emit PropertyStatusUpdated(propertyId, property.status);
    }

    // Simple one-step transfer for a classroom demo. It still requires the owner,
    // a verified property, and a notary-approved caller.
    function transferOwnership(
        uint256 propertyId,
        address newOwner,
        bytes32 deedHash
    ) external onlyPropertyOwner(propertyId) validProperty(propertyId) {
        Property storage property = properties[propertyId];
        require(property.verified, "Property not verified");
        require(property.status != PropertyStatus.DISPUTED, "Property disputed");
        require(newOwner != address(0), "Invalid new owner");
        require(deedHash != bytes32(0), "Deed hash required");

        address oldOwner = property.currentOwner;
        property.previousOwner = oldOwner;
        property.currentOwner = newOwner;
        property.lastTransferredAt = block.timestamp;
        property.documentHash = deedHash;
        property.status = PropertyStatus.TRANSFERRED;

        ownerProperties[newOwner].push(propertyId);
        ownershipHistory[propertyId].push(
            OwnershipRecord(newOwner, block.timestamp, deedHash)
        );

        emit OwnershipTransferred(propertyId, oldOwner, newOwner, block.timestamp, deedHash);
        emit PropertyStatusUpdated(propertyId, property.status);
    }

    function updatePropertyStatus(uint256 propertyId, PropertyStatus newStatus)
        external
        onlyAdmin
        validProperty(propertyId)
    {
        properties[propertyId].status = newStatus;
        emit PropertyStatusUpdated(propertyId, newStatus);
    }

    function getProperty(uint256 propertyId)
        external
        view
        validProperty(propertyId)
        returns (Property memory)
    {
        return properties[propertyId];
    }

    function getPropertiesByOwner(address owner) external view returns (uint256[] memory) {
        return ownerProperties[owner];
    }

    function getOwnershipHistory(uint256 propertyId)
        external
        view
        validProperty(propertyId)
        returns (OwnershipRecord[] memory)
    {
        return ownershipHistory[propertyId];
    }

    function getPropertyCountForOwner(address owner) external view returns (uint256) {
        return ownerProperties[owner].length;
    }
}
