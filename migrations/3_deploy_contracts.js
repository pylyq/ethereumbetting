var MultiNumberBettingV7 = artifacts.require("../contracts/MultiNumberBettingV7.sol");

module.exports = function(deployer) {
  deployer.deploy(MultiNumberBettingV7,2,3,4);
};
