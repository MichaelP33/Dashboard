// Adobe Impact Dashboard - Data Generator
// Generates realistic PR data with timeline narratives (July 2024 - July 2025)

export interface PRData {
  id: string;
  title: string;
  description: string;
  developer: string;
  team: string;
  project: string;
  impactScore: 1 | 2 | 3 | 4 | 5;
  aiUsage: number; // 0-100%
  date: string; // ISO date
  explanation: string;
  linesChanged: number;
  filesModified: number;
  quarter: string;
  phase: 'pre-cursor' | 'cursor-rollout' | 'post-cursor';
}

export interface Developer {
  name: string;
  team: string;
  persona: 'early-adopter' | 'gradual-adopter' | 'conservative' | 'ai-dependent';
  baseSkill: 'junior' | 'mid' | 'senior';
}

export interface Team {
  name: string;
  project: string;
  focus: string;
  cursorAdoption: 'high' | 'medium' | 'low';
}

// Adobe Teams & Projects
const teams: Team[] = [
  {
    name: "Canvas Architecture Core",
    project: "Project Canvas",
    focus: "Real-time collaboration, state management, conflict resolution",
    cursorAdoption: 'high'
  },
  {
    name: "WebGL Performance Engine", 
    project: "Project Canvas",
    focus: "Graphics optimization, rendering pipeline, memory management",
    cursorAdoption: 'high'
  },
  {
    name: "Multi-User Synchronization",
    project: "Project Canvas", 
    focus: "Operational transforms, presence awareness, data sync",
    cursorAdoption: 'high'
  },
  {
    name: "Photoshop Core Engine",
    project: "Photoshop Web",
    focus: "C++ modernization, WebAssembly, AI features",
    cursorAdoption: 'medium'
  },
  {
    name: "Illustrator Web Platform", 
    project: "Illustrator Web",
    focus: "Browser vector rendering, collaborative editing",
    cursorAdoption: 'medium'
  },
  {
    name: "Document Cloud Infrastructure",
    project: "Acrobat Web",
    focus: "PDF processing, security, enterprise features", 
    cursorAdoption: 'low'
  },
  {
    name: "Creative SDK Platform",
    project: "Creative SDK",
    focus: "Cross-app integrations, developer tools",
    cursorAdoption: 'low'
  }
];

// Character Narratives - Different AI Adoption Patterns
const developers: Developer[] = [
  // Canvas Architecture Core Team (3 developers)
  { name: "Sarah Chen", team: "Canvas Architecture Core", persona: 'early-adopter', baseSkill: 'senior' },
  { name: "David Kim", team: "Canvas Architecture Core", persona: 'early-adopter', baseSkill: 'senior' },
  { name: "Priya Patel", team: "Canvas Architecture Core", persona: 'gradual-adopter', baseSkill: 'mid' },
  
  // WebGL Performance Engine Team (3 developers)
  { name: "Marcus Rodriguez", team: "WebGL Performance Engine", persona: 'early-adopter', baseSkill: 'senior' },
  { name: "Elena Vasquez", team: "WebGL Performance Engine", persona: 'early-adopter', baseSkill: 'mid' },
  { name: "James Wilson", team: "WebGL Performance Engine", persona: 'gradual-adopter', baseSkill: 'senior' },
  
  // Multi-User Synchronization Team (3 developers)
  { name: "Emma Thompson", team: "Multi-User Synchronization", persona: 'gradual-adopter', baseSkill: 'mid' },
  { name: "Raj Sharma", team: "Multi-User Synchronization", persona: 'early-adopter', baseSkill: 'senior' },
  { name: "Lisa Chen", team: "Multi-User Synchronization", persona: 'gradual-adopter', baseSkill: 'junior' },
  
  // Photoshop Team - Mixed Adoption
  { name: "Jordan Park", team: "Photoshop Core Engine", persona: 'early-adopter', baseSkill: 'senior' },
  { name: "Alex Kim", team: "Photoshop Core Engine", persona: 'gradual-adopter', baseSkill: 'mid' },
  { name: "Riley Zhang", team: "Photoshop Core Engine", persona: 'conservative', baseSkill: 'senior' },
  
  // Illustrator Team - Gradual Adoption
  { name: "Taylor Swift", team: "Illustrator Web Platform", persona: 'ai-dependent', baseSkill: 'junior' },
  { name: "Morgan Davis", team: "Illustrator Web Platform", persona: 'gradual-adopter', baseSkill: 'mid' },
  
  // Document Cloud - Conservative (Control Group)
  { name: "Casey Johnson", team: "Document Cloud Infrastructure", persona: 'conservative', baseSkill: 'senior' },
  { name: "Jamie Lee", team: "Document Cloud Infrastructure", persona: 'conservative', baseSkill: 'mid' },
  
  // Creative SDK - Conservative  
  { name: "Quinn Adams", team: "Creative SDK Platform", persona: 'conservative', baseSkill: 'senior' },
  { name: "Avery Brown", team: "Creative SDK Platform", persona: 'gradual-adopter', baseSkill: 'mid' }
];

// PR Title/Description Templates by Impact Level
const prTemplates = {
  5: [
    {
      titles: [
        "Implement real-time collaborative state management",
        "Complete WebAssembly-based image processing pipeline",
        "Redesign multi-user conflict resolution architecture", 
        "Build distributed consensus system for Canvas",
        "Implement zero-downtime deployment pipeline"
      ],
      descriptions: [
        "Complete architectural redesign enabling multi-user collaboration with advanced conflict resolution",
        "Revolutionary performance improvement using WebAssembly for 10x faster image processing",
        "Distributed system handling concurrent edits across thousands of simultaneous users",
        "Mission-critical infrastructure enabling real-time collaboration at enterprise scale",
        "Advanced deployment system ensuring zero-downtime releases for millions of users"
      ]
    }
  ],
  4: [
    {
      titles: [
        "Optimize WebGL memory management for large artboards",
        "Implement presence indicators for collaborative editing",
        "Add advanced caching layer for Canvas state",
        "Build real-time cursor synchronization",
        "Optimize rendering pipeline for 10+ concurrent users"
      ],
      descriptions: [
        "Memory pooling and garbage collection optimizations for handling 10K+ layer artboards",
        "Real-time cursor positions, selection highlights, and user avatars for collaboration UX",
        "Intelligent caching system reducing Canvas load times by 60% for complex documents",
        "Smooth cursor tracking and user presence visualization across collaborative sessions",
        "Performance optimizations enabling smooth collaboration for large design teams"
      ]
    }
  ],
  3: [
    {
      titles: [
        "Add user preference sync across devices",
        "Implement offline mode for Canvas editing",
        "Build notification system for collaborative changes",
        "Add keyboard shortcuts for power users",
        "Implement undo/redo for collaborative sessions"
      ],
      descriptions: [
        "Cross-device synchronization of user preferences and workspace settings",
        "Offline editing capabilities with intelligent sync when connection restored",
        "Real-time notifications when collaborators make changes to shared documents",
        "Comprehensive keyboard shortcut system for professional designers and power users",
        "Advanced undo/redo system that works seamlessly in multi-user environments"
      ]
    }
  ],
  2: [
    {
      titles: [
        "Fix tooltip positioning edge cases",
        "Update icon assets for new brand guidelines", 
        "Improve error messaging for network failures",
        "Add loading states for slow operations",
        "Fix responsive layout on mobile devices"
      ],
      descriptions: [
        "Corrected tooltip overflow behavior when elements are near viewport boundaries",
        "Updated all icon assets to align with new Adobe brand guidelines and design system",
        "Enhanced error messages providing clearer guidance when network operations fail",
        "Added progressive loading indicators for operations taking longer than 2 seconds",
        "Fixed layout responsiveness issues affecting mobile and tablet user experience"
      ]
    }
  ],
  1: [
    {
      titles: [
        "Update copyright year in footer",
        "Fix typo in help documentation",
        "Remove unused CSS classes",
        "Update package dependencies to latest versions",
        "Fix spelling error in user interface text"
      ],
      descriptions: [
        "Changed footer copyright from 2024 to 2025 across all application pages",
        "Corrected spelling error in the collaborative editing help documentation",
        "Cleaned up unused CSS classes reducing bundle size by 2KB",
        "Updated non-breaking package dependencies to their latest stable versions",
        "Fixed spelling error in tooltip text for the layer selection tool"
      ]
    }
  ]
};

// Impact reasoning templates
const impactReasons = {
  5: [
    "Critical infrastructure work enabling multi-user collaboration. Touches core architecture, introduces distributed consensus algorithms, and unblocks entire feature sets.",
    "Revolutionary performance improvement. Complex integration affecting entire workflow, enables new real-time capabilities previously impossible.",
    "Mission-critical scalability work. Handles enterprise-scale loads and unblocks major customer deployments.",
    "Foundational architecture enabling next-generation features. High complexity with broad system impact."
  ],
  4: [
    "Significant performance improvement addressing major user pain points. Required deep technical knowledge and complex optimization patterns.",
    "Important user experience enhancement affecting collaboration workflows. Moderate architectural complexity with measurable user impact.",
    "Performance optimization enabling better user experience at scale. Technical complexity with clear business value.",
    "User-facing feature with significant workflow improvements. Good technical execution solving real problems."
  ],
  3: [
    "User-visible feature improving collaboration UX. Moderate scope affecting UI layer and data streams, standard implementation complexity.",
    "Solid feature addition enhancing user workflow. Reasonable scope with good technical execution.",
    "Quality of life improvement for end users. Standard implementation with clear user benefit.",
    "Workflow enhancement addressing user feedback. Moderate complexity with positive user impact."
  ],
  2: [
    "Minor bug fix with limited scope. Affects UI polish but doesn't introduce new functionality or architectural changes.",
    "Small improvement in user experience. Limited scope with straightforward implementation.",
    "Bug fix addressing edge case scenarios. Minimal risk with targeted improvement.",
    "UI enhancement with limited scope. Simple implementation addressing specific user feedback."
  ],
  1: [
    "Trivial text change. Minimal effort required with no technical complexity.",
    "Simple maintenance task. No architectural impact, minimal effort required.",
    "Basic housekeeping update. Trivial change with no functional impact.",
    "Cosmetic update requiring minimal technical work. No business logic affected."
  ]
};

// Generate AI usage based on developer persona and time period
function generateAIUsage(developer: Developer, phase: string, impactScore: number): number {
  let baseUsage = 0;
  
  // Base usage by persona
  switch (developer.persona) {
    case 'early-adopter':
      baseUsage = phase === 'pre-cursor' ? 0 : 70;
      break;
    case 'gradual-adopter':
      baseUsage = phase === 'pre-cursor' ? 0 : phase === 'cursor-rollout' ? 35 : 55;
      break;
    case 'conservative':
      baseUsage = phase === 'pre-cursor' ? 0 : phase === 'cursor-rollout' ? 5 : 20;
      break;
    case 'ai-dependent':
      baseUsage = phase === 'pre-cursor' ? 0 : 85;
      break;
  }
  
  // Adjust by impact score (counterintuitive cases)
  if (developer.persona === 'ai-dependent' && impactScore <= 2) {
    baseUsage += 5; // High AI usage but low impact
  }
  
  // Add randomness
  const variance = Math.random() * 20 - 10; // ±10%
  return Math.max(0, Math.min(100, Math.round(baseUsage + variance)));
}

// Generate impact score based on developer and phase
function generateImpactScore(developer: Developer, phase: string): 1 | 2 | 3 | 4 | 5 {
  let weights: number[] = [];
  
  // Check if this is a Canvas team member (Cursor power users)
  const isCanvasTeam = [
    'Canvas Architecture Core',
    'WebGL Performance Engine', 
    'Multi-User Synchronization'
  ].includes(developer.team);
  
  if (phase === 'pre-cursor') {
    // Pre-Cursor: Canvas teams start slightly lower to show dramatic improvement
    if (isCanvasTeam) {
      switch (developer.baseSkill) {
        case 'senior':
          weights = [0.08, 0.20, 0.45, 0.22, 0.05]; // Lower starting impact
          break;
        case 'mid':
          weights = [0.15, 0.30, 0.35, 0.15, 0.05];
          break;
        case 'junior':
          weights = [0.30, 0.40, 0.20, 0.08, 0.02];
          break;
      }
    } else {
      // Non-Canvas teams: standard distribution
      switch (developer.baseSkill) {
        case 'senior':
          weights = [0.05, 0.15, 0.35, 0.35, 0.10];
          break;
        case 'mid':
          weights = [0.10, 0.25, 0.40, 0.20, 0.05];
          break;
        case 'junior':
          weights = [0.25, 0.35, 0.25, 0.10, 0.05];
          break;
      }
    }
  } else {
    // Post-Cursor: Canvas teams show dramatic improvement
    if (isCanvasTeam) {
      switch (developer.persona) {
        case 'early-adopter':
          weights = [0.01, 0.04, 0.15, 0.45, 0.35]; // Dramatic improvement to high impact
          break;
        case 'gradual-adopter':
          weights = [0.02, 0.08, 0.25, 0.45, 0.20]; // Strong improvement
          break;
        case 'conservative':
          weights = [0.05, 0.15, 0.35, 0.35, 0.10]; // Moderate improvement even for conservatives
          break;
        case 'ai-dependent':
          weights = [0.15, 0.25, 0.35, 0.20, 0.05]; // Some improvement but still inconsistent
          break;
      }
    } else {
      // Non-Canvas teams: standard AI amplification
      switch (developer.persona) {
        case 'early-adopter':
          weights = [0.03, 0.10, 0.25, 0.40, 0.22];
          break;
        case 'gradual-adopter':
          weights = [0.05, 0.15, 0.35, 0.35, 0.10];
          break;
        case 'conservative':
          weights = [0.08, 0.20, 0.40, 0.25, 0.07];
          break;
        case 'ai-dependent':
          weights = [0.20, 0.30, 0.30, 0.15, 0.05];
          break;
      }
    }
  }
  
  const random = Math.random();
  let cumulative = 0;
  for (let i = 0; i < weights.length; i++) {
    cumulative += weights[i];
    if (random < cumulative) {
      return (i + 1) as 1 | 2 | 3 | 4 | 5;
    }
  }
  return 3; // fallback
}

// Generate a single PR
function generatePR(
  developer: Developer, 
  date: Date, 
  phase: string,
  id: string
): PRData {
  const impactScore = generateImpactScore(developer, phase);
  const aiUsage = generateAIUsage(developer, phase, impactScore);
  
  const team = teams.find(t => t.name === developer.team)!;
  const templates = prTemplates[impactScore][0];
  const titleIndex = Math.floor(Math.random() * templates.titles.length);
  
  return {
    id,
    title: templates.titles[titleIndex],
    description: templates.descriptions[titleIndex],
    developer: developer.name,
    team: developer.team,
    project: team.project,
    impactScore,
    aiUsage,
    date: date.toISOString().split('T')[0],
    explanation: impactReasons[impactScore][Math.floor(Math.random() * impactReasons[impactScore].length)],
    linesChanged: Math.round(Math.random() * 1000 + 50) * impactScore,
    filesModified: Math.round(Math.random() * 20 + 1) * Math.max(1, impactScore - 1),
    quarter: getQuarter(date),
    phase: phase as 'pre-cursor' | 'cursor-rollout' | 'post-cursor'
  };
}

function getQuarter(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  if (month <= 3) return `Q1 ${year}`;
  if (month <= 6) return `Q2 ${year}`;
  if (month <= 9) return `Q3 ${year}`;
  return `Q4 ${year}`;
}

function getPhase(date: Date): string {
  if (date < new Date('2025-02-01')) return 'pre-cursor';
  if (date < new Date('2025-04-01')) return 'cursor-rollout';
  return 'post-cursor';
}

// Main data generation function
export function generateDataset(
  startDate = new Date('2024-07-01'),
  endDate = new Date('2025-07-31')
): PRData[] {
  const prs: PRData[] = [];
  let idCounter = 1;
  
  // Generate PRs for each week
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const phase = getPhase(currentDate);
    
    // Vary PR volume by phase
    let prsThisWeek = 8; // baseline
    if (phase === 'cursor-rollout') prsThisWeek = 12; // increased activity
    if (phase === 'post-cursor') prsThisWeek = 15; // sustained higher volume
    
    // Generate PRs for this week
    for (let i = 0; i < prsThisWeek; i++) {
      const developer = developers[Math.floor(Math.random() * developers.length)];
      
      // Add some randomness to the date within the week
      const prDate = new Date(currentDate);
      prDate.setDate(prDate.getDate() + Math.floor(Math.random() * 7));
      prDate.setHours(Math.floor(Math.random() * 24));
      prDate.setMinutes(Math.floor(Math.random() * 60));
      
      const pr = generatePR(developer, prDate, phase, `pr-${idCounter}`);
      prs.push(pr);
      idCounter++;
    }
    
    // Move to next week
    currentDate.setDate(currentDate.getDate() + 7);
  }
  
  // Sort by date descending (most recent first)
  return prs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Export team and developer data
export { teams, developers };

// Developer productivity data interface
export interface DeveloperProductivity {
  developer: string;
  team: string;
  prCount: number;
  avgImpactScore: number;
  totalImpactPoints: number;
  avgAiUsage: number;
  prs: PRData[];
  workSummary: string;
  topImpactPR: PRData | null;
  recentActivity: string; // "Active" | "Moderate" | "Low"
  rawDeveloper?: string; // Keep original name for filtering
  timePeriod?: string; // Time period key for sorting
  displayTimePeriod?: string; // Formatted time period for display
}

// Function to generate work summary from PR titles
function generateWorkSummary(prs: PRData[]): string {
  const keywords = new Map<string, number>();
  
  // Extract key terms from PR titles
  prs.forEach(pr => {
    const title = pr.title.toLowerCase();
    
    // Common engineering work patterns
    const patterns = [
      { pattern: /real-time|collaborative|sync/i, term: "real-time collaboration" },
      { pattern: /webgl|rendering|graphics/i, term: "graphics optimization" },
      { pattern: /performance|optimization|memory/i, term: "performance improvements" },
      { pattern: /architecture|system|infrastructure/i, term: "system architecture" },
      { pattern: /ui|interface|component/i, term: "UI components" },
      { pattern: /api|endpoint|service/i, term: "API development" },
      { pattern: /security|auth|permission/i, term: "security features" },
      { pattern: /test|unit|integration/i, term: "testing infrastructure" },
      { pattern: /deploy|build|pipeline/i, term: "deployment systems" },
      { pattern: /bug|fix|issue/i, term: "bug fixes" },
      { pattern: /webassembly|wasm/i, term: "WebAssembly integration" },
      { pattern: /cursor|presence|indicator/i, term: "collaborative features" }
    ];
    
    patterns.forEach(({ pattern, term }) => {
      if (pattern.test(title)) {
        keywords.set(term, (keywords.get(term) || 0) + 1);
      }
    });
  });
  
  // Get top 3 most common work areas
  const topAreas = Array.from(keywords.entries())
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([term]) => term);
  
  if (topAreas.length === 0) {
    return "General development work";
  }
  
  return topAreas.join(", ");
}

// Function to determine activity level
function getActivityLevel(prCount: number, timeSpanDaysOrGrouping: number | 'weekly' | 'monthly' = 365): string {
  if (typeof timeSpanDaysOrGrouping === 'string') {
    // Time grouping mode
    const grouping = timeSpanDaysOrGrouping;
    if (grouping === 'weekly') {
      if (prCount >= 8) return 'High';
      if (prCount >= 4) return 'Moderate';
      return 'Low';
    } else {
      if (prCount >= 20) return 'High';
      if (prCount >= 10) return 'Moderate';
      return 'Low';
    }
  } else {
    // Legacy mode with time span in days
    const timeSpanDays = timeSpanDaysOrGrouping;
    const prsPerMonth = (prCount / timeSpanDays) * 30;
    
    if (prsPerMonth >= 8) return "High";
    if (prsPerMonth >= 4) return "Moderate"; 
    return "Low";
  }
}

// Transform PR data into developer productivity data
export function transformToProductivityData(prs: PRData[]): DeveloperProductivity[] {
  // Group PRs by developer
  const developerGroups = new Map<string, PRData[]>();
  
  prs.forEach(pr => {
    if (!developerGroups.has(pr.developer)) {
      developerGroups.set(pr.developer, []);
    }
    developerGroups.get(pr.developer)!.push(pr);
  });
  
  // Transform each developer group
  const productivityData: DeveloperProductivity[] = [];
  
  developerGroups.forEach((developerPRs, developerName) => {
    const prCount = developerPRs.length;
    const avgImpactScore = developerPRs.reduce((sum, pr) => sum + pr.impactScore, 0) / prCount;
    const totalImpactPoints = developerPRs.reduce((sum, pr) => sum + pr.impactScore, 0);
    const avgAiUsage = developerPRs.reduce((sum, pr) => sum + pr.aiUsage, 0) / prCount;
    
    // Find team (should be consistent for all PRs)
    const team = developerPRs[0].team;
    
    // Find highest impact PR
    const topImpactPR = developerPRs.reduce((max, pr) => 
      pr.impactScore > max.impactScore ? pr : max
    );
    
    // Generate work summary
    const workSummary = generateWorkSummary(developerPRs);
    
    // Determine activity level
    const recentActivity = getActivityLevel(prCount);
    
    // Sort PRs by date (most recent first)
    const sortedPRs = [...developerPRs].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    productivityData.push({
      developer: developerName,
      team,
      prCount,
      avgImpactScore: Number(avgImpactScore.toFixed(2)),
      totalImpactPoints,
      avgAiUsage: Number(avgAiUsage.toFixed(1)),
      prs: sortedPRs,
      workSummary,
      topImpactPR,
      recentActivity
    });
  });
  
  // Sort by total impact points (highest first)
  return productivityData.sort((a, b) => b.totalImpactPoints - a.totalImpactPoints);
} 

// Transform PR data to productivity data with time grouping
export function transformToProductivityDataWithTimeGrouping(
  prs: PRData[], 
  grouping: 'weekly' | 'monthly' = 'monthly'
): DeveloperProductivity[] {
  // Group PRs by developer and time period
  const groupedData: { [key: string]: PRData[] } = {};
  
  prs.forEach(pr => {
    const date = new Date(pr.date);
    let timeKey: string;
    
    if (grouping === 'weekly') {
      // Get the Monday of the week for this PR
      const monday = new Date(date);
      monday.setDate(date.getDate() - date.getDay() + 1);
      timeKey = `${monday.getFullYear()}-W${Math.ceil(monday.getDate() / 7).toString().padStart(2, '0')}`;
    } else {
      // Monthly grouping
      timeKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    }
    
    const key = `${pr.developer}|${timeKey}`;
    if (!groupedData[key]) {
      groupedData[key] = [];
    }
    groupedData[key].push(pr);
  });

  // Convert grouped data to productivity entries
  const productivityData: DeveloperProductivity[] = [];
  
  Object.entries(groupedData).forEach(([key, devPRs]) => {
    const [developer, timeKey] = key.split('|');
    const devInfo = developers.find(d => d.name === developer);
    const team = devInfo?.team || 'Unknown Team';
    
    if (devPRs.length === 0) return;

    const prCount = devPRs.length;
    const totalImpactPoints = devPRs.reduce((sum, pr) => sum + pr.impactScore, 0);
    const avgImpactScore = Math.round((totalImpactPoints / prCount) * 10) / 10;
    const avgAiUsage = Math.round(devPRs.reduce((sum, pr) => sum + pr.aiUsage, 0) / prCount);
    
    const workSummary = generateWorkSummary(devPRs);
    const topImpactPR = devPRs.reduce((top, pr) => pr.impactScore > top.impactScore ? pr : top, devPRs[0]);
    const recentActivity = getActivityLevel(prCount, grouping);

    // Format time period for display
    let timePeriod: string;
    if (grouping === 'weekly') {
      const year = timeKey.split('-')[0];
      const week = timeKey.split('-W')[1];
      timePeriod = `Week ${week}, ${year}`;
    } else {
      const [year, month] = timeKey.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      timePeriod = `${monthNames[parseInt(month) - 1]} ${year}`;
    }

    productivityData.push({
      developer: `${developer} (${timePeriod})`,
      team,
      prCount,
      totalImpactPoints,
      avgImpactScore,
      avgAiUsage,
      workSummary,
      topImpactPR,
      recentActivity,
      prs: devPRs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      rawDeveloper: developer, // Keep original name for filtering
      timePeriod: timeKey,
      displayTimePeriod: timePeriod
    });
  });

  // Sort by time period (most recent first) then by total impact
  return productivityData.sort((a, b) => {
    const aTimePeriod = a.timePeriod || '';
    const bTimePeriod = b.timePeriod || '';
    const timeComparison = bTimePeriod.localeCompare(aTimePeriod);
    if (timeComparison !== 0) return timeComparison;
    return b.totalImpactPoints - a.totalImpactPoints;
  });
} 