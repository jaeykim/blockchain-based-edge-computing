//var libx = require('./libx.js');

class Token {
	constructor(address) {
		this.address = address;
	}

	transfer(receiver, amount) {

	}
}

class Crowdsale {
	/**
	 * Constructor function
	 *
	 * Setup the owner
	 */
	constructor(
		ifSuccessfulSendTo,
		fundingGoalInEthers,
		durationInMinutes,
		etherCostOfEachToken,
		addressOfTokenUsedAsReward
	) {
		this.beneficiary = ifSuccessfulSendTo;
		this.fundingGoal = fundingGoalInEthers * 1; // ether
		//this.deadline = libx.now + durationInMinutes * 1; // minutes;
		this.price = etherCostOfEachToken * 1; // ether
		this.tokenReward = new Token(addressOfTokenUsedAsReward);
		this.amountRaised = 0;
		this.tokenReward = new Token();
		this.balanceOf = new Object();
		this.fundingGoalReached = false;
		this.crowdsaleClosed = false;
	}

	/*
	event GoalReached(address recipient, uint totalAmountRaised);
	event FundTransfer(address backer, uint amount, bool isContribution);
	*/

	/**
	 * Fallback function
	 *
	 * The function without name is the default function that is called whenever anyone sends funds to a contract
	 */
	/*
	function () payable public {
		require(!crowdsaleClosed);
		uint amount = msg.value;
		balanceOf[msg.sender] += amount;
		amountRaised += amount;
		tokenReward.transfer(msg.sender, amount / price);
		emit FundTransfer(msg.sender, amount, true);
	}
	*/
	
	afterDeadline() {
		if (libx.now >= this.deadline) 
			process.exit(1);
	}

	/**
	 * Check if goal was reached
	 *
	 * Checks if the goal or time limit has been reached and ends the campaign
	 */
	checkGoalReached() {
		this.afterDeadline();
		if (amountRaised >= fundingGoal){
			fundingGoalReached = true;
			// emit GoalReached(beneficiary, amountRaised);
		}
		crowdsaleClosed = true;
	}

	/**
	 * Withdraw the funds
	 *
	 * Checks to see if goal or time limit has been reached, and if so, and the funding goal was reached,
	 * sends the entire amount to the beneficiary. If goal was not reached, each contributor can withdraw
	 * the amount they contributed.
	 */
	safeWithdrawal() {
		this.afterDeadline();
		if (!this.fundingGoalReached) {
			let amount = this.balanceOf[msg.sender];
			this.balanceOf[msg.sender] = 0;
			if (amount > 0) {
				if (msg.sender.send(amount)) {
					// emit FundTransfer(msg.sender, amount, false);
				} else {
					this.balanceOf[msg.sender] = amount;
				}
			}
		}

		if (this.fundingGoalReached && this.beneficiary == msg.sender) {
			if (this.beneficiary.send(this.amountRaised)) {
				// emit FundTransfer(beneficiary, amountRaised, false);
			} else {
				//If we fail to send the funds to beneficiary, unlock funders balance
				this.fundingGoalReached = false;
			}
		}
	}

	asyncFunc() {
		setTimeout(() => {
			console.log("asyncFunc");
			//console.log('a: ' + libx.a);
			//libx.end();
		}, 100);
	}

	testFunc() {
		return new Promise((resolve, error) => {
			setTimeout(() => {
				console.log("a: " + this.a);
				this.a = 200;
				resolve();
			}, 2000);
		});
	}
}

module.exports = Crowdsale;

/*
var crowdSale = new Crowdsale();

// initial
console.log('libx.a: ' + libx.a);
libx.a = 130;

crowdSale.asyncFunc();
*/
/*
console.log(Object.keys(crowdSale));
Object.keys(crowdSale).forEach((key) => {
	console.log(key + ": " + crowdSale[key]);
});
*/
