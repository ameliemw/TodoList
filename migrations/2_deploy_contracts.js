var TodoList = artifacts.require("./TodoList.sol");

module.exports = function(deployer) {
  deployer.deploy(TodoList);
};


/*When you're deploying a new smart contract to the 
blockchain you change the state of the blockchain. You need mightartions to do that*/
