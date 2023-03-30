let xp = 0;
let gold = 50;
let health = 100;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["stick"];

const locations = [{
	name: "Town Square",
	"button text": ["Go to store", "Go to cave", "Fight Dragon"],
	"button functions": [goStore, goCave, fightDragon],
	text: "You are in the town square. You see a sign which says \"store\". And another leading to a misterious cave..."
}, {
	name: "Store",
	"button text": ["Buy 10 Health (10 Gold)", "Buy weapon (30 Gold)", "Go to town square"],
	"button functions": [buyHealth, buyWeapon, goTown],
	text: "You entered the store."

}, {
	name: "Cave",
	"button text": ["Fight Slime", "Fight fanged beast", "Go to town square"],
	"button functions": [fightSlime, fightBeast, goTown],
	text: "You entered the cave and see some monsters. They seem aggressive."

}, {
	name: "Fight",
	"button text": ["Attack", "Dodge", "Run"],
	"button functions": [attack, dodge, goTown],
	text: "You are against a monster. What are you doing?"

}, {
	name: "Kill Monsters",
	"button text": ["Go back to town", "", ""],
	"button functions": [goTown, goTown, easterEgg],
	text: "You killed the monster and gained experience and gold. Wyd now?"

}, {
	name: "Lose",
	"button text": ["Replay?", "Quit", ""],
	"button functions": [restart, quit, restart],
	text: "You died. Lol 💀"

}, {
	name: "Win",
	"button text": ["Replay?", "Quit", ""],
	"button functions": [restart, quit, restart],
	text: "You win against the dragon and freed all the citizens. Congrats ☀️"

}, {
	name: "Easter Egg",
	"button text": ["2", "8", "Go to town"],
	"button functions": [pickTwo, pickEight, goTown],
	text: "You find a secret game ! If you guess the right number between 1 and 10, you win !"

}];

const weapons = [{
	name: "stick",
	power: 5,
}, {
	name: "dagger",
	power: 30,
}, {
	name: "claw hammer",
	power: 50,
}, {
	name: "sword",
	power: 100,
}, {
	name: "bazooka",
	power: 1000,
}
];

const monsters = [{
	name: "slime",
	level: 2,
	health: 15
}, {
	name: "fanged beast",
	level: 8,
	health: 60
}, {
	name: "dragon",
	level: 20,
	health: 300
}];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");

const MAX_WEAPON = weapons.length - 1;

// Initialize buttons
button1.onclick = goStore;
button2.onclick = goCave;
button3.onclick = fightDragon;

function update(location) {
	button1.innerText = location["button text"][0];
	button2.innerText = location["button text"][1];
	button3.innerText = location["button text"][2];
	button1.onclick = location["button functions"][0];
	button2.onclick = location["button functions"][1];
	button2.disabled = false;
	button3.onclick = location["button functions"][2];
	text.innerText = location.text;
}

function goTown() {
	update(locations[0]);
	button2.style.display = "inline-block";
	button3.style.display = "inline-block";
}

function goStore() {
	update(locations[1]);
}
function goCave() {
	update(locations[2]);
}

function buyHealth() {
	console.log("Buying health...");
	if (gold >= 10) {
		gold -= 10;
		health += 10;
		goldText.innerText = gold;
		healthText.innerText = health;
	} else {
		let missingGold = 10 - gold;
		text.innerText = "You do not have enough gold to buy health. Missing " + missingGold + " gold."
	}
}

function buyWeapon() {
	if (currentWeapon < MAX_WEAPON) {
		if (gold >= 30) {
			gold -= 30;
			currentWeapon += 1;
			goldText.innerText = gold;
			let newWeapon = weapons[currentWeapon].name;
			text.innerText = "You now have a new weapon: " + newWeapon + ". Congrats !\n";
			inventory.push(newWeapon);
			text.innerText += "In your inventory, you have: " + inventory;
			if (currentWeapon >= MAX_WEAPON) {
				button2.innerText = "Sell weapon for 15 gold";
				button2.onclick = sellWeapon;
			}
		} else {
			let missingGold = 30 - gold;
			text.innerText = "You can't afford a new weapon. You miss " + missingGold + " gold."
		}
	} else {
		text.innerText = "You already have the most powerful weapon !";
		button2.innerText = "Sell weapon for 15 gold";
		button2.onclick = sellWeapon;
	}
}

function sellWeapon() {
	if (inventory.length > 1) {
		gold += 15;
		goldText.innerText = gold;
		let currentWeapon = inventory.shift();
		text.innerText = "You sold a " + currentWeapon + "."
		text.innerText += "In your inventory you have: " + inventory
	} else {
		text.innerText = "Do not sell your only weapon !"
	}
}

function fightSlime() {
	fighting = 0
	goFight();
}

function fightBeast() {
	fighting = 1
	goFight();
}

function fightDragon() {
	fighting = 2
	goFight();
}

function goFight() {
	update(locations[3]);
	monsterHealth = monsters[fighting].health;
	monsterStats.style.display = "block";
	monsterNameText.innerText = monsters[fighting].name;
	monsterHealthText.innerText = monsterHealth;
}

function attack() {
	text.innerText = "The " + monsters[fighting].name + " attacks.\n";
	text.innerText += "You attack it with your " + weapons[currentWeapon].name + "\n";
	let damages = getMonsterAttackValue(monsters[fighting].level);
	health -= damages
	text.innerText += "You lost " + damages + " HP...\n"
	if (isMonsterHit()) {
		let attackDamages = weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
		monsterHealth -= attackDamages;
		text.innerText += "You have inflicted " + attackDamages + " HP damages to your opponent !\n"
	} else {
		text.innerText += "You missed your attack !\n"
	}
	healthText.innerText = health;
	monsterHealthText.innerText = monsterHealth;
	if (health <= 0) {
		lose()
	} else if (monsterHealth <= 0) {
		fighting === 2 ? winGame() : defeatMonster();
	}

	if (Math.random() <= 0.1 && inventory.length > 1) {
		text.innerText += "\n\nYour " + inventory.pop() + " breaks ! 😱";
		currentWeapon--;
	}
}

function getMonsterAttackValue(level) {
	let hit = (level * 5) - Math.floor(Math.random() * xp);
	return hit;
}

function isMonsterHit() {
	return Math.random() > 0.2 || health < 20;
}

function lose() {
	update(locations[5]);
	button3.style.display = "none";
	monsterStats.style.display = "none";
}

function defeatMonster() {
	gold += Math.floor(monsters[fighting].level * 6.7);
	xp += monsters[fighting].level;
	goldText.innerText = gold;
	xpText.innerText = xp;
	update(locations[4]);
	button2.style.display = "none";
	//button3.style.display = "none";
	monsterStats.style.display = "none";
}

function dodge() {
	text.innerText = "You dodged the attack of the " + monsters[fighting].name;
}

function winGame() {
	update(locations[6]);
	button3.style.display = "none";
	monsterStats.style.display = "none";
}

function restart() {
	document.location.reload();
}

function quit() {
	close();
}

function easterEgg() {
	button2.style.display = "inline-block";
	update(locations[7]);
}

function pickTwo() {
	pick(2);
}

function pickEight() {
	pick(8);
}

function pick(guess) {
	let numbers = [];
	while (numbers.length < 10) {
		numbers.push(Math.floor(Math.random() * 11));
	}
	text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
	for (let number = 0; number < numbers.length; number++) {
		text.innerText += numbers[number] + " - ";
	}

	if (numbers.indexOf(guess) !== -1) {
		text.innerText += "\n\nYou won 20 gold !";
		gold += 20;
		goldText.innerText = gold;
	} else {
		text.innerText += "You fell into the trap and lose 10 health ! 😈";
		health -= 10;
		healthText.innerText = health;
		if (health <= 0) {
			lose();
		}
	}
}