pragma solidity ^0.5.0;

contract TodoList {
    uint256 public taskCount = 0; //Represent the state of the variable on the blockchain

    struct Task {
        uint256 id;
        string content;
        bool completed;
    }

    mapping(uint256 => Task) public tasks; //get the whole content of the task using the id

    event TaskCreated(uint id, string content, bool completed);
    event TaskToggled(uint id, bool completed);

    constructor() public {
        createTask("Check out fuzzsjakk.com"); //Make a default task
    }

    function createTask(string memory _content) public {
        taskCount++;
        tasks[taskCount] = Task(taskCount, _content, false); //Make a new task in the dct/mapping
        emit TaskCreated(taskCount, _content, false);
    }

    function toggleCompleted(uint _id) public {
        Task memory _task = tasks[_id];
        _task.completed = !_task.completed;
        tasks[_id] = _task;
        emit TaskToggled(_id, _task.completed);
    }
}
