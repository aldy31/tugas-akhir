// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Genesis {
    address public owner;
    uint public projectTax;
    uint public projectCount;
    uint public balance;
    statsStruct public stats;
    projectStruct[] projects;

    mapping(address => projectStruct[]) projectsOf;
    mapping(uint => backerStruct[]) backersOf;
    mapping(uint => bool) public projectExist;
    mapping(address => bool) public validators;
    mapping(address => string) public validatorNames;

    enum statusEnum {
        PENDING,
        OPEN,
        APPROVED,
        REVERTED,
        DELETED,
        PAIDOUT
    }

    struct statsStruct {
        uint totalProjects;
        uint totalBacking;
        uint totalDonations;
        uint validatedProjects;
        uint nonValidatedProjects;
    }

    struct backerStruct {
        address owner;
        uint contribution;
        uint timestamp;
        bool refunded;
    }

    struct projectStruct {
        uint id;
        address owner;
        string title;
        string description;
        string imageURL;
        uint cost;
        uint raised;
        uint timestamp;
        uint expiresAt;
        uint backers;
        statusEnum status;
        string Syarat;
        bool validated;
        string validationMessage;
    }

    modifier ownerOnly() {
        require(msg.sender == owner, "Owner reserved only");
        _;
    }

    modifier validatorOnly() {
        require(
            validators[msg.sender],
            "Only validators can access this function"
        );
        _;
    }

    event Action(
        uint256 id,
        string actionType,
        address indexed executor,
        uint256 timestamp
    );

    constructor(uint _projectTax) {
        owner = msg.sender;
        projectTax = _projectTax;
    }

    function registerValidator(address _validator, string memory _name)
        public
    {
        require(_validator != address(0), "Validator address cannot be empty");
        require(bytes(_name).length > 0, "Validator Name cannot be empty");

        validators[_validator] = true;
        validatorNames[_validator] = _name;
    }

    function createProject(
        string memory title,
        string memory description,
        string memory imageURL,
        uint cost,
        uint expiresAt,
        string memory Syarat
    ) public returns (bool) {
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        require(bytes(imageURL).length > 0, "ImageURL cannot be empty");
        require(cost > 0 ether, "Cost cannot be zero");
        require(bytes(Syarat).length > 0, "Syarat URL cannot be empty");

        projectStruct memory project;
        project.id = projectCount;
        project.owner = msg.sender;
        project.title = title;
        project.description = description;
        project.imageURL = imageURL;
        project.cost = cost;
        project.timestamp = block.timestamp;
        project.expiresAt = expiresAt;
        project.Syarat = Syarat;
        project.status = statusEnum.PENDING;
        project.validated = false;
        project.validationMessage = "This Projected is not Validated Yet";

        projects.push(project);
        projectExist[projectCount] = true;
        projectsOf[msg.sender].push(project);
        stats.totalProjects += 1;
        stats.nonValidatedProjects += 1;

        emit Action(
            projectCount++,
            "PROJECT CREATED",
            msg.sender,
            block.timestamp
        );
        return true;
    }

    function validateProject(
        uint _id,
        string memory _validationMessage
    ) public validatorOnly returns (bool) {
        require(projectExist[_id], "Project not found");
        require(!projects[_id].validated, "Project is Already Validated");
        require(
            bytes(_validationMessage).length > 0,
            "Validation Message Cannot Be Empty"
        );

        projects[_id].status = statusEnum.OPEN;
        projects[_id].validated = true;
        projects[_id].validationMessage = _validationMessage;
        stats.nonValidatedProjects -= 1;
        stats.validatedProjects += 1;

        emit Action(_id, "PROJECT VALIDATED", msg.sender, block.timestamp);

        return true;
    }

    function updateProject(
        uint id,
        string memory title,
        string memory description,
        string memory imageURL,
        uint expiresAt,
        string memory Syarat
    ) public returns (bool) {
        require(msg.sender == projects[id].owner, "Unauthorized Entity");
        require(bytes(title).length > 0, "Title cannot be empty");
        require(bytes(description).length > 0, "Description cannot be empty");
        require(bytes(imageURL).length > 0, "ImageURL cannot be empty");
        require(bytes(Syarat).length > 0, "Syarat cannot be empty");

        projects[id].title = title;
        projects[id].description = description;
        projects[id].imageURL = imageURL;
        projects[id].expiresAt = expiresAt;
        projects[id].Syarat = Syarat;

        emit Action(id, "PROJECT UPDATED", msg.sender, block.timestamp);

        return true;
    }

    function deleteProject(uint id) public returns (bool) {
        require(
            projects[id].status == statusEnum.OPEN,
            "Project no longer opened"
        );
        require(msg.sender == projects[id].owner, "Unauthorized Entity");

        projects[id].status = statusEnum.DELETED;
        performRefund(id);

        emit Action(id, "PROJECT DELETED", msg.sender, block.timestamp);

        return true;
    }

    function performRefund(uint id) internal {
        for (uint i = 0; i < backersOf[id].length; i++) {
            address _owner = backersOf[id][i].owner;
            uint _contribution = backersOf[id][i].contribution;

            backersOf[id][i].refunded = true;
            backersOf[id][i].timestamp = block.timestamp;
            payTo(_owner, _contribution);

            stats.totalBacking -= 1;
            stats.totalDonations -= _contribution;
        }
    }

    function backProject(uint id) public payable returns (bool) {
        require(msg.value > 0 ether, "Ether must be greater than zero");
        require(projectExist[id], "Project with the given ID does not exist");
        require(
            projects[id].validated == true,
            "This Projected is not Validated Yet"
        );
        require(
            projects[id].status == statusEnum.OPEN,
            "Project no longer opened"
        );

        projects[id].backers += 1;
        stats.totalBacking += 1;
        projects[id].raised += msg.value;
        stats.totalDonations += msg.value;

        backersOf[id].push(
            backerStruct(msg.sender, msg.value, block.timestamp, false)
        );

        emit Action(id, "PROJECT BACKED", msg.sender, block.timestamp);

        if (projects[id].raised >= projects[id].cost) {
            projects[id].status = statusEnum.APPROVED;
            balance += projects[id].raised;
            performPayout(id);
            return true;
        }

        if (block.timestamp >= projects[id].expiresAt) {
            projects[id].status = statusEnum.REVERTED;
            performRefund(id);
            return true;
        }

        return true;
    }

    function performPayout(uint id) internal {
        uint raised = projects[id].raised;
        uint tax = (raised * projectTax) / 100;

        projects[id].status = statusEnum.PAIDOUT;

        payTo(projects[id].owner, (raised - tax));
        payTo(owner, tax);

        balance -= projects[id].raised;

        emit Action(id, "PROJECT PAID OUT", msg.sender, block.timestamp);
    }

    function requestRefund(uint id) public returns (bool) {
        require(
            projects[id].status != statusEnum.REVERTED ||
                projects[id].status != statusEnum.DELETED,
            "Project not marked as revert or delete"
        );

        projects[id].status = statusEnum.REVERTED;
        performRefund(id);
        return true;
    }

    function payOutProject(uint id) public returns (bool) {
        require(
            projects[id].status == statusEnum.APPROVED,
            "Project not APPROVED"
        );
        require(
            msg.sender == projects[id].owner || msg.sender == owner,
            "Unauthorized Entity"
        );

        performPayout(id);
        return true;
    }

    function changeTax(uint _taxPct) public ownerOnly {
        projectTax = _taxPct;
    }

    function getProject(uint id) public view returns (projectStruct memory) {
        require(projectExist[id], "Project not found");

        return projects[id];
    }

    function getProjects() public view returns (projectStruct[] memory) {
        return projects;
    }

    function getBackers(uint id) public view returns (backerStruct[] memory) {
        return backersOf[id];
    }

    function payTo(address to, uint256 amount) internal {
        (bool success, ) = payable(to).call{value: amount}("");
        require(success);
    }
}
