const game ={
    // total rubber / currency
    // rubber per second
    // rubber per click
    // multipliers
    // timers
    state: { rubber: 0, rps: 0, rpc: 1, rmulti:1 },
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
            unlockCondition(){
                return buildings[1].count >= 1;
            }, 
            effect(){
                game.state.rps *= 2;
            }
        },
        {
            name: "Suspension",
            description: "Dialed suspension ensures constant contact",
            baseCost: 500,
            unlocked: false,
            purchased:false,
            unlockCondition(){
                return buildings[1].count >=10;
            },
            effect(){
                game.state.rps += game.state.rps *.10;
            }
        },
        {
            name: "Drag Slicks",
            description: "These give you max grip making your clicks more powerful",
            baseCost: 1000,
            unlocked:false,
            purchased:false,
            unlockCondition(){
                return buildings[3].count >= 5;
            },
            effect(){
                game.state.rpc += game.state.rpc * .25;
            }
        },
        {
            name: "Active Aero",
            description: "More aerodynamic body and active aero features a more powerful steady Rubber Per Second",
            baseCost: 1500,
            unlocked: false,
            purchased:false,
            unlockCondition(){
                return buildings[4].count >= 3;
            },
            effect(){
                game.state.rps += game.state.rps *.25;
            }
        },
        {
            name: "Turbo",
            description: "A powerful turbo boosting both Rubber per second and Rubber per click",
            baseCost:2000,
            unlocked: false,
            purchased: false,
            unlockCondition(){
                return buildings[5].count >= 5;
            },
            effect(){
                game.state.rps += game.state.rps *.20;
                game.state.rpc += game.state.rpc *.15;
            }
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
  this.state.rubber = 0;
  this.state.rps = 0;
  this.state.rpc = 1;
  this.state.rmulti = 1;

  this.startTickLoop();
  const wheel = document.getElementById("gameWheel");
  if (wheel) wheel.addEventListener("click", clickWheel);


    setInterval(function(){
            game.state.rubber += game.state.rps;
            document.getElementById("rubber-count").innerText=Math.floor(game.state.rubber);
        },1000);

        function clickWheel(){
            game.state.rubber += game.state.rpc;
            document.getElementById("rubber-count").innerText = Math.floor(game.state.rubber);
        }
    },
    calculateTotalRPS() {
  let total = 0;
  for (const b of this.buildings) {
    total += (b.baseRPS || 0) * (b.count || 0);
  }

  let multiplier = 1;
  for (const up of this.upgrades) {
    if (up.purchased && up.rpsMultiplier) multiplier *= up.rpsMultiplier;
  }
  for (const buff of this.buffs) {
    if (buff.type === 'rps' || buff.type === 'global') multiplier *= buff.multiplier;
  }
  multiplier *= (this.state.rmulti || 1);

  return total * multiplier;
},

startTickLoop() {
  this._lastTick = Date.now();
  this._tickInterval = setInterval(() => {
    const now = Date.now();
    const dt = (now - this._lastTick) / 1000; // seconds
    this._lastTick = now;

    const rps = this.calculateTotalRPS();
    this.state.rubber += rps * dt;

    const el = document.getElementById('rubber-count');
    if (el) el.innerText = Math.floor(this.state.rubber);
  }, 100); // 100ms tick for smooth updates
},
    // runs every frame or tick
    // handles:
    // - production
    // - buffs
    // - minigame updates
    // - unlock checks
    update() {
        for (const upgrade of Game.upgrades) {
            if (!upgrade.unlocked && upgrade.unlockCondition()) {
                upgrade.unlocked = true;
            }
        }

    },
    // updates UI elements:
    // - cookie count
    // - building buttons
    // - upgrade buttons
    // - achievement popups
    render() {},
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
    utils: {}
};

function clickWheel() {
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
    game.state.rubber += game.state.rpc;
    document.getElementById("rubber-count").innerText = Math.floor(game.state.rubber);
}

// Bind the click event to the wheel
window.onload = function() {
    const wheel = document.getElementById("gameWheel");
    if (wheel) {
        wheel.addEventListener("click", clickWheel);
    }
};

//game.init();