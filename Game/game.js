const game ={
    // total rubber / currency
    // rubber per second
    // rubber per click
    // multipliers
    // timers
    state: { rubber:0, rps:0, rpc:1, rmulti:1 },
    // array or dictionary of building objects
    // each building has:
    // - name
    // - base cost
    // - base production
    // - count owned
    // - optional special features
    buildings: [
        {
            name: "Driveway Mechanic",
            baseCost: 15,
            baseRPS: 0.1,
            count: 0,

        },
        {
            name: "Garage Workshop",
            baseCost: 100,
            baseRPS: 1,
            count: 0
        },
        {
            name: "Mechanics Shop",
            baseCost: 500,
            baseRPS: 10,
            count: 0
        },
        {
            name: "Specialty Tire Shop",
            baseCost: 1000,
            baseRPS: 100,
            count: 0
        },
        {
            name: "Body Shop",
            baseCost: 1500,
            baseRPS: 150,
            count: 0
        },
        {
            name: "Tuner",
            baseCost: 2500,
            baseRPS: 300,
            count: 0,
        }
    ],
    // list of upgrade objects
    // each upgrade has:
    // - name
    // - description
    // - cost
    // - icon
    // - unlock condition
    // - purchased flag
    // - effect function
    upgrades: [
        {
            name: "Tires",
            description: "Put on a set of new tires that double rubber production.",
            baseCost: 250,
            unlocked:false,
            purchased:false,
            rpsMultiplier: 2,
            unlockCondition(){
                return game.buildings[1].count >= 1;
            }, 
        },
        {
            name: "Suspension",
            description: "Dialed suspension ensures constant contact",
            baseCost: 500,
            unlocked: false,
            purchased:false,
            rpsMultiplier: 1.5,
            unlockCondition(){
                return game.buildings[1].count >=10;
            },
        },
        {
            name: "Drag Slicks",
            description: "These give you max grip making your clicks more powerful",
            baseCost: 1000,
            unlocked:false,
            purchased:false,
            rpcMultiplier:2,
            unlockCondition(){
                return game.buildings[3].count >= 5;
            },
        },
        {
            name: "Active Aero",
            description: "More aerodynamic body and active aero features a more powerful steady Rubber Per Second",
            baseCost: 1500,
            unlocked: false,
            purchased:false,
            rpsMultiplier:1.25,
            unlockCondition(){
                return game.buildings[4].count >= 3;
            },
        },
        {
            name: "Turbo",
            description: "A powerful turbo boosting both Rubber per second and Rubber per click",
            baseCost:2000,
            unlocked: false,
            purchased: false,
            rpcMultiplier:1.15,
            rpsMultiplier:1.20,
            unlockCondition(){
                return game.buildings[5].count >= 5;
            },
            
        }
    ],
    // list of achievement objects
    // each achievement has:
    // - name
    // - description
    // - condition function
    // - unlocked flag
    achievements: [],
    // list of active buffs
    // each buff has:
    // - name
    // - duration
    // - multiplier
    // - type (click, rps, global)
    buffs: [],
    // each building that supports a minigame gets:
    // building.minigame = { ... }
    // minigame contains:
    // - its own state
    // - its own UI
    // - its own tick function
    // - its own save/load
    minigames: {},
    // setup buildings
    // setup upgrades
    // bind UI
    // load save
    // start game loop
    init() {
        console.log("Initializing game state...");
        this.state = {
            rubber: 0,
            rps: 1,
            rpc: 1,
            rmulti: 1
        };
        this.render();
        this.startTickLoop();

        const wheel = document.getElementById("gameWheel");
        if(wheel) wheel.addEventListener("click", this.clickWheel.bind(this));
    },
    // calculate total RPS from buildings and modifiers
    calculateTotalRPS() {
        let total = 0;
        for (const b of this.buildings) {
            total += (b.baseRPS ) * (b.count );
        }

        // apply upgrade effects
        let multiplier = 1;
        for (const up of this.upgrades) {
            if (up.purchased && up.rpsMultiplier) multiplier += up.rpsMultiplier;
        }

        // apply active buffs
        for (const buff of this.buffs) {
            if (buff.type === 'rps') multiplier += buff.multiplier;
            if (buff.type === 'global') multiplier += buff.multiplier;
        }


        return total * multiplier;
    },
    // Calculate total RPC (Rubber Per Click) from base value, upgrades, and buffs
    calculateTotalRPC() {
        let totalRPC = this.state.rpc; // Base RPC

        // Apply upgrade effects
        for (const up of this.upgrades) {
            if (up.purchased && up.rpcMultiplier) {
                totalRPC *= up.rpcMultiplier;
            }
        }

        // Apply active buffs
        for (const buff of this.buffs) {
            if (buff.type === 'click' || buff.type === 'global') {
                totalRPC *= buff.multiplier;
            }
        }

        // Apply global state multiplier (e.g., prestige)
        totalRPC *= this.state.rmulti || 1;

        return totalRPC;
    },
    // tick loop using dt (call once in init)
    startTickLoop() {
        this._lastTick = Date.now();
        setInterval(() => {
            const now = Date.now();
            const dt = (now - this._lastTick) / 1000; // seconds
            this._lastTick = now;

            const totalRPS = this.calculateTotalRPS();
            this.state.rubber += totalRPS * dt;

            this.update();
        }, 100); // 100ms tick for smooth fractional accumulation
    },
    // runs every frame or tick
    // handles:
    // - production
    // - buffs
    // - minigame updates
    // - unlock checks
    update() {
        const el = document.getElementById('rubber-count');
        if (el) el.innerText = "Total Rubber: "+ Math.floor(this.state.rubber);
        const el2 = document.getElementById('rps-count');
        if(el2) el2.innerText = "Rubber per second: "+Math.floor(this.calculateTotalRPS());
        const el3 = document.getElementById('rpc-count');
        if(el3) el3.innerText = "Rubber per click: "+Math.floor(this.calculateTotalRPC());
    },
    // updates UI elements:
    // - cookie count
    // - building buttons
    // - upgrade buttons
    // - achievement popups
    render() {
    // Render Buildings
    const buildingsList = document.getElementById("buildings-list");
    buildingsList.innerHTML = ""; // Clear previous

    for (let i = 0; i < this.buildings.length; i++) {
        const building = this.buildings[i];
        const button = document.createElement("button");
        button.id = `building-${i}`;
        button.innerHTML = `
            <strong>${building.name}</strong><br>
            Cost: ${building.baseCost}<br>
            Production: ${building.baseRPS}/s<br>
            Owned: ${building.count}
        `;
        button.onclick = () => this.buyBuilding(i);
        button.classList.add("building-button");
        buildingsList.appendChild(button);
    }

    // Render Upgrades
    const upgradesList = document.getElementById("upgrades-list");
    upgradesList.innerHTML = ""; // Clear previous
    for (const upgrade of this.upgrades) {
            if (!upgrade.unlocked && upgrade.unlockCondition()) {
                upgrade.unlocked = true;
            }
        }
    for (let i = 0; i < this.upgrades.length; i++) {
        const upgrade = this.upgrades[i];
        if (upgrade.unlocked && !upgrade.purchased ) {
            const button = document.createElement("button");
            button.id = `upgrade-${i}`;
            button.innerHTML = `
                <strong>${upgrade.name}</strong><br>
                ${upgrade.description}<br>
                Cost: ${upgrade.baseCost}
            `;
            button.onclick = () => this.buyUpgrade(i);
            button.classList.add("upgrade-button");
            upgradesList.appendChild(button);
        }
    }
},
    // calculate building cost
    // calculate building production
    // buy building
    // update building-specific logic
    buildingFunctions: {},
    // unlock upgrades
    // purchase upgrades
    // apply upgrade effects
    upgradeFunctions: {},
    // check achievement conditions
    // unlock achievements
    achievementFunctions: {},
    // add buff
    // remove buff
    // update buff timers
    buffFunctions:{},
    // initialize minigames
    // update minigames
    // render minigames
    minigameFunctions:{},
    // serialize game state
    // save to localStorage
    // load from localStorage
    save() {},
    load() {},
    // formatting numbers
    // random helpers
    // math helpers
    utils: {},
    buyBuilding(index) {
    const building = this.buildings[index];
    if (this.state.rubber >= building.baseCost) {
        this.state.rubber -= building.baseCost;
        building.count++;
        this.render();
    } else {
        console.log("Not enough rubber!");
    }
    },
    buyUpgrade(index){
        const upgrade = this.upgrades[index];
        if(this.state.rubber >=upgrade.baseCost){
            this.state.rubber -= upgrade.baseCost;
            upgrade.purchased = true;
            this.render();
        }else{
            console.log("Not enough rubber!");
        }
    },
    clickWheel() {
        if (!this.state) {
        console.error("Game state is not initialized.");
        return;
    }
        const wheel = document.getElementById("gameWheel");

        // Spin the wheel
        wheel.style.transition = "transform 0.5s ease";
        wheel.style.transform += "rotate(360deg)";

        // Create smoke effect
        const smoke = document.createElement("div");
        smoke.classList.add("smoke");

        // Position the smoke behind the wheel
        const wheelRect = wheel.getBoundingClientRect();
        smoke.style.position = "absolute";
        smoke.style.left = `${wheelRect.left + wheelRect.width / 3.5}px`;
        smoke.style.top = `${wheelRect.top + wheelRect.height / 2}px`;
        smoke.style.transform = "translate(-50%, -50%)";

        // Append smoke to the smoke space
        const smokeSpace = document.getElementById("smokeSpace");
        smokeSpace.appendChild(smoke);

        // Remove smoke after animation
        setTimeout(() => {
            smoke.remove();
        }, 2000);

        // Increment rubber count
        this.state.rubber += this.calculateTotalRPC();
    }
};
window.onload = function() {

    game.init();
    const wheel = document.getElementById("gameWheel");
    wheel.addEventListener("mouseover",()=>{
            wheel.style.transition = "0.5s ease all",
            wheel.style.transform = "scale(1.2)"
    });
    wheel.addEventListener("mouseout",()=>{
        wheel.style.transition = "0.5s ease all",
        wheel.style.transform = "scale(1)"
    });
};