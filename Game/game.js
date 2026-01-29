const game ={
    // total rubber / currency
    // rubber per second
    // rubber per click
    // multipliers
    // timers
    state: [ rubber, rps, rpc, rmulti ],
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
            Effect(){
                game.state.rps *= 2;
            }
        },
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
    // - type (click, cps, global)
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
    init() {},
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

//game.init();