const inquirer = require("inquirer");
const chalk = require("chalk");
const figlet = require("figlet");
const shell = require("shelljs");

//var Blockchain = require('./BLockchain.js');
const { mining_reward_address } = require('./config.js');

const init = () => {
    console.log(
        chalk.green(
            figlet.textSync("echo : Blockchain-based Edge Computing Platform", {
                font: "",
                horizontalLayout: "default",
                verticalLayout: "default"
            })
        )
    );
};

const questions = [
    {
        name: "command",
        type: "input",
        message: "echo:"
    },
];

var daemon = async () => {
    let answer = await inquirer.prompt(questions);
    console.log(answer);
    switch(answer.command) {
        case 'createAccount':
            console.log("create account");

        case 'setAccount':
            console.log("set account");
            let ans = await inquirer.prompt({
                name: "newAccount",
                type: "input",
                message: "new account: "
            });
            console.log(ans);
            break;
        case 'mining':
            console.log("start mining");
            break;
        default:
            console.log("wrong command");
    }
    daemon();
};

// show script introduction
init();
// run the daemon
daemon();

//var blockchain = new Blockchain(mining_reward_address);
