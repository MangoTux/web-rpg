class Quest_Handler {
  quest_list = [];

  constructor() {}

  // Add a quest observer
  // Currently, each NPC is tied to a quest, so the accept assumes an NPC on player's tile
  accept(quest) {
    this.quest_list.push(quest);
  }

  // Notify relevants quests of a status change
  updateProgress(event, target) {
    this.quest_list.forEach(quest => {
      quest.type == event &&
      quest.details.target == target &&
      quest.details.status == quest_status.progress &&
      quest.details.progress++;
    })
  }
}
