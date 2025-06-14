export const prompts = {
  rocks: {
    intro: "Let's build a SMART Rock together. What's your most important outcome this quarter?",
    steps: [
      {
        prompt: "How will success be measured? What evidence will show the Rock is complete?",
        key: "measurable"
      },
      {
        prompt: "What's the due date for this Rock? (e.g., June 30, 2025)",
        key: "dueDate"
      },
      {
        prompt: "Who owns this Rock?",
        key: "owner"
      },
      {
        prompt: "Any notes or details to include?",
        key: "notes"
      }
    ],
    summaryTemplate: ({ goal, measurable, dueDate, owner, notes }) =>
      `📍 SMART Rock Summary:\n\n🎯 **Goal:** ${goal}\n📏 **Measurable:** ${measurable}\n📅 **Due Date:** ${dueDate}\n👤 **Owner:** ${owner}\n📝 **Notes:** ${notes}`
  }
};