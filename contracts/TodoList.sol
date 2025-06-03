pragma solidity ^0.5.0;

contract TodoList {
    uint public taskCount = 0; //Represent the state of the variable on the blockchain

    struct Task {
        uint id;
        string content;
        bool completed;
    }

    mapping(uint => Task) public tasks; //get the whole content of the task using the id
    
    constructor() public {
        createTask("Check out fuzzsjakk.no"); //Make a default task
    }
    
    function createTask(string memory _content) public {
        taskCount ++;
        tasks[taskCount] = Task(taskCount, _content, false); //Make a new task in the dct/mapping
    }



}


