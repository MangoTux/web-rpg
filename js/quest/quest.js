quest_status = {
    new: "new",
    progress: "inprogress",
    complete: "complete",
    post: "post",
}

quest_text = {
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
            "Thank you! Please take this.",
        ],
        reward: [
            "I'll be sure to get you something as a reward.",
            "As compensation, you will get a reward.",
            "I'll reward you greatly for this.",
            "I will make this worth your while.",
        ],
        post: [
            "Thanks for doing that!",
            "How's it going?",
            "Hi there!",
            "Why would I want to talk to a murderer?",
            "You can go now.",
        ]
    },
}

class Quest {
  text = {};
  constructor() {
    this.generate();
  }

  generate() {
    this.type = randomChoice(["kill"]);
    const text_categories = ["start", "progress", "complete", "reward"];
    text_categories.forEach(item =>
      this.text[item] = randomChoice(quest_text[this.type][item])
    )
    this.details = {};
    this.details.status = quest_status.new;
    this.details.target = randomProperty(npc_list);
    this.details.progress = 0;
    this.details.count = getRandomInt(1, 10);
    this.details.reward = {
      gold: getRandomInt(0, 50) * this.details.count,
      items: [],
    };
    let item_count = randomChoice([...Array(16).fill(0), ...Array(8).fill(1), ...Array(4).fill(2), ...Array(2).fill(3), 4]);
    for (let i = 0; i<item_count; i++) {
      this.details.reward.items.push(ItemFactory.getRandomItem());
    }
  }

  get description() {
    let text = "";
    switch (this.details.status) {
      case quest_status.new:
        text = `${this.text.start}<br>${this.text.reward}`; break;
      case quest_status.progress:
        text = `${this.text.progress}`; break;
      case quest_status.complete:
        text = `${this.text.complete}`; break;
      case quest_status.post:
        text = `${this.text.post}`; break;
    }
    for (let key in this.details) {
      text = text.replace(`%${key}`, this.details[key]);
    }
    return text;
  }

  updateStatus() {
    if (this.details.status === quest_status.new) {
      this.details.status = quest_status.progress;
      return;
    }
    if (this.details.status === quest_status.progress && this.details.progress >= this.details.count) {
      this.details.stauts = quest_status.complete;
      return;
    }
    if (this.details.status === quest_status.complete) {
      player.receiveQuestReward(this.reward);
      this.details.status = quest_status.post;
      return;
    }
  }

  get status() {
    return this.details.status;
  }
}
