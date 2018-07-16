questStatus = {
    new: "new",
    progress: "inprogress",
    complete: "complete",
    post: "post",
}

questText = {
    kill: {
        start: [
            "A %target killed my family and I demand vengeance.<br>Please kill %count of them and report back to me.",
            "I've heard that it's impossible to kill a %target.<br>To see if that's true, could you kill %count and let me know?",
            "Kill %count %target.",
        ],
        progress: [
            "You've killed %progress out of %count %target, keep it up!",
            "How's it going, killer?",
        ],
        complete: [
            "Thanks! Here's your reward.",
            "Good job! Take this for your efforts.",
            "Thank you! Please take this."
        ],
        reward: [
            "As compensation for doing this, I will give you a reward.",
            "I'll reward you greatly for this.",
            "I will make this worth your while."
        ],
        post: [
            "Thanks for doing that!",
            "How's it going?",
            "Hi there!"
        ]
    },
    donate: {
        start: [
            ""
        ],
        progress: [
            ""
        ],
        complete: [
            ""
        ],
        reward: [
            ""
        ]
    }
}

// Returns a text string of reward contents, adds all items to inventory
function giveReward() {
    if (currentNpcIndex == null) { return; }
    var rewardList = "";
    var rewards = npcList[currentNpcIndex].npc.quest.details.reward;
    
    rewardList += rewards.gold + " gold";
    player.gold += rewards.gold;
    for (var i in rewards.items) {
        rewardList += ", " + i.name;
        player.inventory.push(i);
    }
    Terminal.print("You receive:");
    Terminal.print(rewardList);
}

// Depending on a quest's state, update the text here
function getQuestText() {
    var quest = npcList[currentNpcIndex].npc.quest;
    var text;
    switch (quest.status) {
        case questStatus.new: 
            text = quest.text.start + "\n" + quest.text.reward;
            break;
        case questStatus.progress: 
            text = quest.text.progress;
            break;
        case questStatus.complete: 
            text = quest.text.complete;
            break;
        case questStatus.post:
            text = quest.text.post;
            break;
    }
    for (var key in quest.details) {
        text = text.replace("%"+key, quest.details[key]); // TODO "kill 10 skeleton"
    }
    var header = "<br>" + npcList[currentNpcIndex].npc.name_mod + " says:<br><br>";
    return header + text;
}

function updateQuest(npc) {
    if (currentNpcIndex != null && player.quests[currentNpcIndex].status == questStatus.new) {
        player.quests[currentNpcIndex].status = questStatus.progress;
    }
    if (currentNpcIndex != null && player.quests[currentNpcIndex].status == questStatus.complete) {
        giveReward();
        player.quests[currentNpcIndex].status = questStatus.post;
    }
    
    if (npc != undefined) {
         for (var quest in player.quests) {
            if (player.quests[quest].type=="kill") {
                if (npc.name == player.quests[quest].details.target) {
                    player.quests[quest].details.progress++;
                }
                if (player.quests[quest].details.progress >= player.quests[quest].details.count) {
                    player.quests[quest].status = questStatus.complete;
                }
            }
        }   
    }
}

function getQuest()
{
    var quest = {};
    quest.type = randomChoice(["kill"]);
    quest.status = "new";
    
    quest.text = {};
    // Or maybe quest.text is an object with start, progress, complete, reward and just one randomChoice?
    quest.text.start = randomChoice(questText[quest.type].start);
    quest.text.progress = randomChoice(questText[quest.type].progress);
    quest.text.complete = randomChoice(questText[quest.type].complete);
    quest.text.reward = randomChoice(questText[quest.type].reward);
    quest.details = {};
    quest.details.target = getName();
    quest.details.progress = 0;
    quest.details.count = getRandomInt(1, 10);
    quest.details.reward = {gold: getRandomInt(0, 100), items: []}
    numItems = randomChoice([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3, 3, 3, 4]);
    for (var i=0; i<numItems; i++) {
        quest.details.reward.items.push(new Item());
    }
    
    return quest;
}