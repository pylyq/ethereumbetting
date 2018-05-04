let MultiNumberBettingV7 = artifacts.require("../contracts/MultiNumberBettingV7");

function dumpEvents(result) {
  for (let i=0; i < result.logs.length; i++) {
        console.log(result.logs[i].event,'>>', result.logs[i].args.addr,' ',result.logs[i].args.name,' ',result.logs[i].args.amount.toNumber());
  }
}

contract('MultiNumberBettingV7', accounts => {

  // fund contract address

  let my_address = accounts[0];
  let bills_address = accounts[1];
  let franks_address= accounts[2];
  let frankInitial;
  let billInitial;
  let myInitial;

  it("should assert true", done => {
    let multi_number_betting_v7 = MultiNumberBettingV7.deployed();
    assert.isTrue(true);
    done();
  });

  it("should emit 2 events : WinningBet, LosingBet", () => {
    let multi_number_betting_v7;
    return MultiNumberBettingV7.deployed().then(instance => {
      multi_number_betting_v7 = instance;
      // fund contract
      return web3.eth.sendTransaction({from:bills_address, to:multi_number_betting_v7.address, value:web3.toWei(20,'ether')});
    }).then(() => {
      // this is a losing bet
      return multi_number_betting_v7.guess(8, "Bill", {from:bills_address, value:web3.toWei(3,'ether')});
    }).then(result => {
      // result=tx reciept that has the log/events
      dumpEvents(result);
      //console.log(result);
      assert.equal('LosingBet',result.logs[0].event );
    }).then(() => {
      // this is a winning bet
      return multi_number_betting_v7.guess(3, "Frank", {from:franks_address, value:web3.toWei(3,'ether')});
    }).then(result => {
      // result=tx reciept that has the log/events
      dumpEvents(result);
      //console.log(result);
      assert.equal('WinningBet',result.logs[0].event );
    })
  });
  
});
