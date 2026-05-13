
const game ={
    // total rubber / currency
    // rubber per second
    // rubber per click
    // multipliers
    // timers
    state: { rubber: 0, rps: 0, rpc: 1, rmulti: 1, totalClicks: 0 },
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
    achievements: [
    // CLICK ACHIEVEMENTS
    {
        name: "First Click",
        description: "Click the wheel 1 time.",
        unlocked: false,
        condition() {
            return game.state.totalClicks >= 1;
        }
    },
    {
        name: "100 Clicks",
        description: "Click the wheel 100 times.",
        unlocked: false,
        condition() {
            return game.state.totalClicks >= 100;
        }
    },
    {
        name: "1,000 Clicks",
        description: "Click the wheel 1,000 times.",
        unlocked: false,
        condition() {
            return game.state.totalClicks >= 1000;
        }
    },
    {
        name: "10,000 Clicks",
        description: "Click the wheel 10,000 times.",
        unlocked: false,
        condition() {
            return game.state.totalClicks >= 10000;
        }
    },
    {
        name: "100,000 Clicks",
        description: "Click the wheel 100,000 times.",
        unlocked: false,
        condition() {
            return game.state.totalClicks >= 100000;
        }
    },
    {
        name: "1,000,000 Clicks",
        description: "Click the wheel 1,000,000 times.",
        unlocked: false,
        condition() {
            return game.state.totalClicks >= 1000000;
        }
    },

    // RUBBER ACHIEVEMENTS
    {
        name: "100 Rubber",
        description: "Reach 100 rubber.",
        unlocked: false,
        condition() {
            return game.state.rubber >= 100;
        }
    },
    {
        name: "1,000 Rubber",
        description: "Reach 1,000 rubber.",
        unlocked: false,
        condition() {
            return game.state.rubber >= 1000;
        }
    },
    {
        name: "10,000 Rubber",
        description: "Reach 10,000 rubber.",
        unlocked: false,
        condition() {
            return game.state.rubber >= 10000;
        }
    },
    {
        name: "100,000 Rubber",
        description: "Reach 100,000 rubber.",
        unlocked: false,
        condition() {
            return game.state.rubber >= 100000;
        }
    },
    {
        name: "1,000,000 Rubber",
        description: "Reach 1,000,000 rubber.",
        unlocked: false,
        condition() {
            return game.state.rubber >= 1000000;
        }
    },
    {
        name: "1 Billion Rubber",
        description: "Reach 1,000,000,000 rubber.",
        unlocked: false,
        condition() {
            return game.state.rubber >= 1000000000;
        }
    },
    {
        name: "1 Trillion Rubber",
        description: "Reach 1,000,000,000,000 rubber.",
        unlocked: false,
        condition() {
            return game.state.rubber >= 1000000000000;
        }
    },

    // BUILDING / UPGRADE ACHIEVEMENTS
    {
        name: "First Building",
        description: "Buy your first building.",
        unlocked: false,
        condition() {
            return game.buildings.some(b => b.count > 0);
        }
    },
    {
        name: "100 Buildings",
        description: "Own 100 total buildings.",
        unlocked: false,
        condition() {
            return game.buildings.reduce((sum, b) => sum + b.count, 0) >= 100;
        }
    },
    {
        name: "First Upgrade",
        description: "Buy your first upgrade.",
        unlocked: false,
        condition() {
            return game.upgrades.some(u => u.purchased);
        }
    },

    // EXTRA ACHIEVEMENTS
    {
        name: "Passive Income",
        description: "Reach 100 rubber per second.",
        unlocked: false,
        condition() {
            return game.calculateTotalRPS() >= 100;
        }
    },
    {
        name: "Industrial Power",
        description: "Reach 10,000 rubber per second.",
        unlocked: false,
        condition() {
            return game.calculateTotalRPS() >= 10000;
        }
    },
    {
        name: "Street Mechanic",
        description: "Own 10 Driveway Mechanics.",
        unlocked: false,
        condition() {
            return game.buildings[0].count >= 10;
        }
    },
    {
        name: "Full Garage",
        description: "Own 25 Garage Workshops.",
        unlocked: false,
        condition() {
            return game.buildings[1].count >= 25;
        }
    },
    {
        name: "Master Tuner",
        description: "Own 10 Tuners.",
        unlocked: false,
        condition() {
            return game.buildings[5].count >= 10;
        }
    },
    {
        name: "Big Spender",
        description: "Buy 3 upgrades.",
        unlocked: false,
        condition() {
            return game.upgrades.filter(u => u.purchased).length >= 3;
        }
    },
    {
        name: "Upgrade King",
        description: "Buy every upgrade.",
        unlocked: false,
        condition() {
            return game.upgrades.filter(u => u.purchased).length === game.upgrades.length;
            }
        }
    ],
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
        rmulti: 1,
        totalClicks: 0
    };

    this.load();
    this.render();
    this.startTickLoop();

    const wheel = document.getElementById("gameWheel");
    if (wheel) wheel.addEventListener("click", this.clickWheel.bind(this));

    setInterval(() => this.save(true), 30000);
    setInterval(() => renderPendingRequests(), 30000);
    setInterval(() => renderAcceptedRequests(), 30000);
    },
    // calculate total RPS from buildings and modifiers
    calculateTotalRPS(){
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
    this.checkAchievements();

    const el = document.getElementById('rubber-count');
    if (el) el.innerText = "Total Rubber: \n" + Math.floor(this.state.rubber);

    const el2 = document.getElementById('rps-count');
    if (el2) el2.innerText = "Rubber per second: " + Math.floor(this.calculateTotalRPS());

    const el3 = document.getElementById('rpc-count');
    if (el3) el3.innerText = "Rubber per click: " + Math.floor(this.calculateTotalRPC());
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
        // Only show each building after the previous one has been purchased.
        if (i > 0 && this.buildings[i - 1].count === 0) {
            continue;
        }
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
    renderAcceptedRequests();
    renderPendingRequests();
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
    
    checkAchievements() {
    for (const achievement of this.achievements) {
        if (!achievement.unlocked && achievement.condition()) {
            achievement.unlocked = true;
            this.showAchievementToast(achievement);
        }
    }
    },

    showAchievementToast(achievement) {
    const container = document.getElementById("achievement-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.classList.add("achievement-toast");
    toast.innerHTML = `
        <strong>Achievement Unlocked!</strong><br>
        ${achievement.name}
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("fade-out");
        setTimeout(() => {
            toast.remove();
        }, 400);
    }, 5000);
    },
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
    async save() {
        const data = {
            state: this.state,
            buildings: this.buildings.map(b => ({ count: b.count })),
            upgrades: this.upgrades.map(u => ({ purchased: u.purchased })),
            buffs: this.buffs
        };

        const res = await fetch("/session/save", {
            method: "POST",
            headers: { 'Content-Type':'application/json' },
            credentials: 'include',
            body: JSON.stringify({ save: data })
        });

        const json = await res.json();
        console.log("Session save:", json);
    },

    async load(req, res) {
            try {
                const res = await fetch("/session/save", {
                method: "GET",
                credentials: "include"
                });
                const s = await res.json();

                if (s) {
                    const obj = s;
                    if (obj.state) this.state = obj.state;
                    if (Array.isArray(obj.buildings)){
                        for (let i=0;i<this.buildings.length;i++){
                            if (obj.buildings[i] && typeof obj.buildings[i].count==='number'){
                                this.buildings[i].count = obj.buildings[i].count;
                            }
                        }
                    }
                    if (Array.isArray(obj.upgrades)){
                        for (let i=0;i<this.upgrades.length && i<obj.upgrades.length;i++){
                            if (obj.upgrades[i] && typeof obj.upgrades[i].purchased==='boolean'){
                                this.upgrades[i].purchased = obj.upgrades[i].purchased;
                            }
                        }
                    }
                    if (Array.isArray(obj.buffs)) this.buffs = obj.buffs;
                }
                
            
            } catch(e){
                console.error("No session",e);
                const res = await fetch("/users/save", {
                method: "GET",
                credentials: "include"
                });

                const s = await res.json();

                if (s) {
                    const obj = s.save;
                    if (obj.state) this.state = obj.state;
                    if (Array.isArray(obj.buildings)){
                        for (let i=0;i<this.buildings.length;i++){
                            if (obj.buildings[i] && typeof obj.buildings[i].count==='number'){
                                this.buildings[i].count = obj.buildings[i].count;
                            }
                        }
                    }
                    if (Array.isArray(obj.upgrades)){
                        for (let i=0;i<this.upgrades.length && i<obj.upgrades.length;i++){
                            if (obj.upgrades[i] && typeof obj.upgrades[i].purchased==='boolean'){
                                this.upgrades[i].purchased = obj.upgrades[i].purchased;
                            }
                        }
                    }
                    if (Array.isArray(obj.buffs)) this.buffs = obj.buffs;
                }}
            
    },
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

    wheel.style.transition = "transform 0.5s ease";
    wheel.style.transform += "rotate(360deg)";

    const smoke = document.createElement("div");
    smoke.classList.add("smoke");

    const wheelRect = wheel.getBoundingClientRect();
    smoke.style.position = "absolute";
    smoke.style.left = `${wheelRect.left + wheelRect.width / 3.5}px`;
    smoke.style.top = `${wheelRect.top + wheelRect.height / 2}px`;
    smoke.style.transform = "translate(-50%, -50%)";

    const smokeSpace = document.getElementById("smokeSpace");
    smokeSpace.appendChild(smoke);

    setTimeout(() => {
        smoke.remove();
    }, 2000);

    this.state.rubber += this.calculateTotalRPC();
    this.state.totalClicks++;
    this.update();
}
};
window.onload = async function(req,res) {
    game.init();
    // try to fetch server-side save for logged-in user
    try {
        const res = await fetch('/users/save');
        if (res.ok) {
            const data = await res.json();
            
            console.log(data);
            if (data.save) {
                const s = data.save;
                // merge state
                if (s.state) game.state = Object.assign({}, game.state, s.state);
                // buildings: set counts if present
                if (Array.isArray(s.buildings)){
                    for (let i=0;i<game.buildings.length;i++){
                        if (s.buildings[i] && typeof s.buildings[i].count === 'number'){
                            game.buildings[i].count = s.buildings[i].count;
                        }
                    }
                }
                // upgrades: set purchased flags if present
                if (Array.isArray(s.upgrades)){
                    for (let i=0;i<game.upgrades.length && i<s.upgrades.length;i++){
                        if (s.upgrades[i] && typeof s.upgrades[i].purchased === 'boolean'){
                            game.upgrades[i].purchased = s.upgrades[i].purchased;
                        }
                    }
                }
                // buffs
                if (Array.isArray(s.buffs)) game.buffs = s.buffs;
            }
        }
        game.render();
    } catch (err) {
        console.warn('Could not load server save:', err);
    }
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

//_-----------------------------------------------------------------
        // FRONT END COMPONENT PIECES
//--------------------------------------------------------------------
// --- Handler Attachment ---
function attachPendingHandlers() {
    document.querySelectorAll('.accept-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            await fetch('/users/acceptFriendship', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ friendId: id })
            });
            renderPendingRequests();
        });
    });

    document.querySelectorAll('.reject-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            await fetch('/users/rejectFriendship', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ friendId: id })
            });
            renderPendingRequests();
        });
    });
}
async function startPolling() {
    if (!activePeerId) return;

    const res = await fetch(`/chat/poll?since=${lastMessageId}`, {
        credentials: "include"
    });

    const data = await res.json();

    if (data.messages && data.messages.length > 0) {
        const filtered = data.messages.filter(m =>
            m.fromUserId == activePeerId || m.toUserId == activePeerId
        );

        if (filtered.length > 0) {
            renderMessages(filtered);
        }
    }

    setTimeout(startPolling, 200);
}

document.getElementById("chat-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const text = document.getElementById("chat-input").value.trim();
    const recipientId = document.getElementById("recipient-id").value;

    if (!text) return;

    document.getElementById("chat-input").value = "";

    await fetch("/chat/send", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            recipientId,
            text
        })
    });

});
let activePeerId = null;
let lastMessageId = 0;
function attachMessageHandlers() {
    document.querySelectorAll('.message-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.dataset.id;
            const name = btn.dataset.username || "Friend";

            activePeerId = id;
            lastMessageId = 0;

            // Fill popup UI
            document.getElementById("recipient-id").value = id;
            document.getElementById("friendName").textContent = name;

            // Show popup
            document.getElementById("chat-popup").style.display = "block";

            // Load messages
            await loadConversation();

            // Start live updates
            startPolling();
        });
    });
}
async function loadConversation() {
    const res = await fetch(`/chat/conversation?peerId=${activePeerId}`, {
        credentials: "include"
    });

    const data = await res.json();
    renderMessages(data.messages);
}
function renderMessages(messages) {
    const list = document.querySelector(".message-list");

    messages.forEach(msg => {
        const wrapper = document.createElement("div");
        wrapper.style.display = "flex";
        wrapper.style.flexDirection = "column";
        wrapper.style.margin = "6px 0";

        const isMe = msg.fromUserId === window.loggedInUserId;

        // Label
        const label = document.createElement("div");
        label.textContent = isMe ? "You" : msg.fromUsername;
        label.style.fontSize = "0.75rem";
        label.style.color = "#555";
        label.style.marginBottom = "2px";
        label.style.alignSelf = isMe ? "flex-end" : "flex-start";

        // Bubble
        const bubble = document.createElement("div");
        bubble.textContent = msg.text;
        bubble.style.padding = "8px 12px";
        bubble.style.borderRadius = "10px";
        bubble.style.maxWidth = "75%";
        bubble.style.alignSelf = isMe ? "flex-end" : "flex-start";
        bubble.style.background = isMe ? "#4caf50" : "#ddd";
        bubble.style.color = isMe ? "white" : "black";

        wrapper.appendChild(label);
        wrapper.appendChild(bubble);
        list.appendChild(wrapper);

        lastMessageId = Math.max(lastMessageId, msg.id);
    });

    list.scrollTop = list.scrollHeight;
}



// --- Data Loading ---
async function loadActiveFriendships() {
    const res = await fetch('/users/acceptedFriendships', {
        method: 'GET',
        credentials: 'include'
    });
    const json = await res.json();
    return json.accepted || []; 
}

async function loadPendingRequests() {
    const res = await fetch('/users/pendingFriendships', {
        method: 'GET',
        credentials: 'include'
    });
    const json = await res.json();
    return json.pending || [];
}

// --- Rendering ---
async function renderAcceptedRequests() {
    const list = await loadActiveFriendships();
    const container = document.getElementById('acceptedRequests');
    if (!container) return;
    console.log(list);
    container.innerHTML = '';
    list.forEach(friend => {
        const row = document.createElement('div');
        row.classList.add('accepted-row');
        row.innerHTML = `
            <span>${friend.name}</span>
            <button class="message-btn" data-username="${friend.name}" data-id="${friend.id}">Message</button>
        `;
        container.appendChild(row);
    });
    attachMessageHandlers();
}

async function renderPendingRequests() {
    const list = await loadPendingRequests();
    const container = document.getElementById('pendingRequests');
    if (!container) return;

    container.innerHTML = '';
    list.forEach(friend => {
        const row = document.createElement('div');
        row.classList.add('pending-row');
        row.innerHTML = `
            <span>${friend.name}</span>
            <button class="accept-btn" data-id="${friend.id}">Accept</button>
            <button class="reject-btn" data-id="${friend.id}">Reject</button>
        `;
        container.appendChild(row);
    });
    attachPendingHandlers();
}



    let friendList = document.getElementById("friendList");
    let friendsButton = document.getElementById("friendsButton");
    friendsButton.addEventListener("click",(e)=>{
        renderAcceptedRequests();
    })
    openClose(friendsButton,friendList);

    let friendForm = document.getElementById("friendForm");
    let addFriendButton = document.getElementById("addFriendButton");
    
    openClose(addFriendButton,friendForm);

    function openClose(button,form){
        button.addEventListener("click",(e)=>{
            console.log("Button clicked");
            if(form.style.display === "none"|| form.style.display === ""){
                form.style.display = "block";
            }else{
                form.style.display = "none";
            }
        });
    }
    const friendClickArea = document.getElementById("friendClickArea");
    const friendListClickArea = document.getElementById("friendListClickArea");
    dragWindow(friendListClickArea,friendList);
    dragWindow(friendClickArea,friendForm);
    const messageClickArea = document.getElementById("messageClickArea");
    let chatPop = document.getElementById("chat-popup");
    dragWindow(messageClickArea,chatPop);
    document.getElementById("chat-close").addEventListener("click", () => {
        document.getElementById("chat-popup").style.display = "none";
        activePeerId = null;
    });

    let activeDrag = null;
    function dragWindow(handleEl, winEl) {
        handleEl.addEventListener('mousedown', (e) => {
        
        // set the active drag target
        activeDrag = {
        win: winEl,
        offsetX: e.clientX - winEl.offsetLeft,
        offsetY: e.clientY - winEl.offsetTop
        };

    });
    }
     // one global move handler
    document.addEventListener('mousemove', (e) => {
    if (!activeDrag) return;

    const { win, offsetX, offsetY } = activeDrag;
    win.style.left = (e.clientX - offsetX) + 'px';
    win.style.top  = (e.clientY - offsetY) + 'px';
    });

    // one global mouseup handler
    document.addEventListener('mouseup', () => {
    activeDrag = null;
    document.body.style.userSelect = 'auto';
    });

    let userInfo = null;
    try {
        const res = await fetch('/users/userName', {
            method: 'GET',
            credentials: 'include'
        });

        if (!res.ok) {
            console.error("User not logged in");
        } else {
            userInfo = await res.json();
        }
    } catch (e) {
        console.error("Couldn't get user info", e);
    }

    const userName = document.getElementById("userName");

    if (userInfo && userInfo.userName) {
        userName.innerHTML = `${userInfo.userName}'s Garage`;
    } else {
        userName.innerHTML = "Unknown User";
    }

    document.getElementById('logoutButton').addEventListener('click', () => {
        window.location.href = '/logout';
    });
    let alertMessage = document.getElementById("alertMessage");

    document.getElementById('friendRequestButton').addEventListener('click', async (e) => {
        e.preventDefault();
        console.log("add friend clicked");
        try {
            const friendFormFields = document.getElementById('friendFormFields');
            const formdata = new FormData(friendFormFields);
            const data = Object.fromEntries(formdata.entries());

            const res = await fetch("users/addFriend", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const json = await res.json();

            if (!res.ok) {
                alertMessage.textContent = json.error || `Friend Request to ${data.username} failed`;
                alertMessage.classList.remove("successMessage");
                alertMessage.classList.add("failMessage");
            } else {
                alertMessage.textContent = json.message;
                alertMessage.classList.remove("failMessage");
                alertMessage.classList.add("successMessage");
            }

        } catch (error) {
            console.error("Couldn't Add friend", error);
            alertMessage.textContent = "Unexpected error occurred";
            alertMessage.classList.add("failMessage");
        }
    });
// Expose global game object for external modules (e.g., race overlay logic)
window.game = game;


