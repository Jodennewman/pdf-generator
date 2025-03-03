const courseStructure = `
COURSE STRUCTURE (Use exact paths, separated by /):

Conversions/01 Taking People off Platform
Conversions/02 Lead Magnets
Conversions/03 Podcasting
Conversions/04 YouTube
Conversions/05 Speaking Engagements
Conversions/06 Outreach and Finding work/clients
Conversions/07 Newsletter
Conversions/08 How it builds your business

Delegation/01 Introduction to Delegation
Delegation/02 First Bottlenecks
Delegation/03 Creation of the Creative Team
Delegation/04 Videography Delegated
Delegation/05 How to make the content run itself
Delegation/06 Creating a Team Workflow

Editing/01 Editing Basics
Editing/02 Editing Team
Editing/03 Editing Advanced
Editing/04 Podcast Clipping

Monetisation/01 Monetisation Basics
Monetisation/02 Monetisation Pro
Monetisation/03 Monetisation Founder

Posting & Scheduling/01 P&S Individual
Posting & Scheduling/02 P&S Founder

Repurposing/01 Repurposing Normal
Repurposing/02 Repurposing from LinkedIn
Repurposing/03 Serialisation

Research/01 Research Basics
Research/02 Research Advanced Tasks

Theory Basics/01 The Big Picture on Short Form
Theory Basics/02 The Script of Sisyphus
Theory Basics/03 Helpful Formats 101
Theory Basics/04 Algorithmic Reality
Theory Basics/05 Engagement Metrics 101
Theory Basics/06 The Frame Itself
Theory Basics/07 Scriptwriting 101
Theory Basics/08 Hooking Fundamentals
Theory Basics/09 Strategy Pillars Topics Buckets
Theory Basics/10 The Cardinal Sins and Virtues
Theory Basics/11 Starting an Account for Success
Theory Basics/12 Platform Differences

Theory Advanced/01 Foundations of Manufacturing Authority
Theory Advanced/02 Authority and Brand Holism through Short Form Content
Theory Advanced/03 PR Shaping your Narrative
Theory Advanced/04 Basics on PR and Position
Theory Advanced/05 The Founders Paradox
Theory Advanced/06 Handling a Comment Section
Theory Advanced/07 The Importance of Lo-Fi
Theory Advanced/08 Introduction
Theory Advanced/09 Script Mastery Optimising for Engagement
Theory Advanced/10 Advanced Engagement Metrics
Theory Advanced/11 Data-Led Iteration

Example path: "Theory Basics/08 Hooking Fundamentals/Basic Hook Structure"
`;

const prompt = `You are generating JSON configurations for social media education sub-modules.

IMPORTANT: For each sub-module, you must construct its path using this format:
[Main Section]/[XX Module Name]/[Sub-Module Title]

CRITICAL PATH RULES:
1. [Main Section] must be exactly one of the sections from the course structure above
2. [XX Module Name] must match the exact module number and name from the structure
3. [Sub-Module Title] should be the specific topic from the transcript
4. No deviations or creative naming - use exact matches from structure

Example:
If analyzing a transcript about "False Assumption Hook" which is part of module "08 Hooking Fundamentals" in "Theory Basics", the path would be:
"Theory Basics/08 Hooking Fundamentals/False Assumption Hook"

JSON Structure (all fields required):
{
  "moduleInfo": {
    "moduleNumber": "3.2",
    "moduleTitle": "[Exact path from course structure]/[Sub-Module Title]"
  },
  "theme": {
    "mode": "dark" | "light",  // dark for technical content, light for creative
    "variant": "peach",
    "hueVariations": {
      "proTips": {
        "primary": 10,
        "secondary": -10
      }
    }
  },
  "overview": {
    "quote": "",      // Key quote specific to this sub-module
    "introText": ""   // Introduction specific to this sub-module
  },
  "keyTerms": [
    {
      "term": "",
      "definition": ""
    }
  ],
  "actionPlan": [
    "Action item 1",  // Specific to this sub-module
    "Action item 2"
  ],
  "takeaways": [
    {
      "mainContent": {
        "title": "",
        "text": ""
      },
      "summaryPoints": []
    }
  ],
  "proTips": [
    {
      "text": ""    // Specific to this sub-module
    }
  ],
  "finalWords": {
    "reminder": "Remember...",
    "emphasis": "",    // TWO WORDS IN CAPS
    "description": ""
  }
}

VALIDATION RULES:
1. Each sub-module gets its own complete configuration
2. moduleTitle MUST use an exact path from the course structure above
3. If you can't find an exact module match in the structure, throw an error
4. All fields are required and must be meaningful
5. Theme selection must match content type:
   - dark theme: technical, data-heavy, theoretical content
   - light theme: creative, strategic, engagement-focused content
6. No placeholder or generic content

${courseStructure}

IMPORTANT: Before generating the JSON, verify that:
1. The module exists in the course structure above
2. You're using the exact module number and name
3. You're placing the sub-module in the correct section

Generate the configuration for each submodule now, ensuring all content is specific to that sub-topic.

TRANSCRIPT:
[Your transcript here]
`;

module.exports = prompt; 