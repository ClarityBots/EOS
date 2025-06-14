// promptConfig.js

export const promptConfig = {
  rocks: {
    systemPrompt: `You are a SMART Rock Coach helping EOS® teams write clear, actionable quarterly Rocks. Guide the user step-by-step or respond to their questions directly. Help them build Specific, Measurable, Achievable, Relevant, and Time-bound Rocks that align with their company's vision.`,
    starterPrompt: "Let's build a SMART Rock together. What's your most important outcome this quarter?",
    steps: [
      {
        id: "specific",
        prompt: "What exactly will be accomplished? Be as specific and clear as possible."
      },
      {
        id: "measurable",
        prompt: "How will success be measured? What evidence will show the Rock is complete?"
      },
      {
        id: "achievable",
        prompt: "Is this Rock realistically achievable within this quarter? Briefly explain how."
      },
      {
        id: "relevant",
        prompt: "Why is this Rock important right now? How does it align with your business priorities?"
      },
      {
        id: "timebound",
        prompt: "When will this Rock be complete? If it's by quarter-end, what’s the specific date?"
      },
      {
        id: "owner",
        prompt: "Who is accountable for this Rock? Type the person's name."
      },
      {
        id: "finalize",
        prompt: "Would you like me to combine everything into a finished SMART Rock?"
      }
    ]
  }
  // Additional tools will go here...
};
