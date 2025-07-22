"use client";

import { useState, useMemo } from 'react';
import { DeveloperProductivity, PRData, teams, developers, transformToProductivityDataWithTimeGrouping } from '@/lib/dataGenerator';

interface DeveloperProductivityTableProps {
  data: DeveloperProductivity[];
  allPRs: PRData[]; // Add this to pass in the raw PR data
  colors: {
    background: { primary: string; secondary: string; tertiary: string };
    text: { primary: string; secondary: string; accent: string; muted: string };
    border: { primary: string; secondary: string };
    impact: { 1: string; 2: string; 3: string; 4: string; 5: string };
  };
}

export default function DeveloperProductivityTable({ 
  data, 
  allPRs,
  colors 
}: DeveloperProductivityTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [sortColumn, setSortColumn] = useState<keyof DeveloperProductivity>('totalImpactPoints');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // New filter states
  const [selectedTeam, setSelectedTeam] = useState<string>('All Teams');
  const [selectedProject, setSelectedProject] = useState<string>('All Projects');
  const [selectedDevelopers, setSelectedDevelopers] = useState<string[]>([]);
  const [timeGrouping, setTimeGrouping] = useState<'weekly' | 'monthly'>('monthly');
  
  // Time navigation state
  const [currentTimePeriod, setCurrentTimePeriod] = useState<string>('');

  // Get current date and generate time period options
  const timeNavigation = useMemo(() => {
    const now = new Date();
    const periods: string[] = [];
    
    if (timeGrouping === 'weekly') {
      // Generate last 12 weeks
      for (let i = 0; i < 12; i++) {
        const weekDate = new Date(now);
        weekDate.setDate(now.getDate() - (i * 7));
        const monday = new Date(weekDate);
        monday.setDate(weekDate.getDate() - weekDate.getDay() + 1);
        const weekNum = Math.ceil(monday.getDate() / 7);
        const timeKey = `${monday.getFullYear()}-W${weekNum.toString().padStart(2, '0')}`;
        periods.push(timeKey);
      }
    } else {
      // Generate last 12 months
      for (let i = 0; i < 12; i++) {
        const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const timeKey = `${monthDate.getFullYear()}-${(monthDate.getMonth() + 1).toString().padStart(2, '0')}`;
        periods.push(timeKey);
      }
    }
    
    return periods;
  }, [timeGrouping]);

  // Set current period to most recent when timeGrouping changes
  useMemo(() => {
    if (timeNavigation.length > 0) {
      setCurrentTimePeriod(timeNavigation[0]);
    }
  }, [timeNavigation]);

  // Generate time-grouped data based on current timeGrouping selection
  const timeGroupedData = useMemo(() => {
    return transformToProductivityDataWithTimeGrouping(allPRs, timeGrouping);
  }, [allPRs, timeGrouping]);

  // Filter data by selected time period
  const timeFilteredData = useMemo(() => {
    if (!currentTimePeriod) return timeGroupedData;
    return timeGroupedData.filter(d => d.timePeriod === currentTimePeriod);
  }, [timeGroupedData, currentTimePeriod]);

  // Filter data
  const filteredData = useMemo(() => {
    let filtered = [...timeFilteredData];
    
    if (selectedTeam !== 'All Teams') {
      filtered = filtered.filter(d => d.team === selectedTeam);
    }
    
    if (selectedProject !== 'All Projects') {
      const projectTeams = teams.filter(t => t.project === selectedProject).map(t => t.name);
      filtered = filtered.filter(d => projectTeams.includes(d.team));
    }
    
    if (selectedDevelopers.length > 0) {
      filtered = filtered.filter(d => selectedDevelopers.includes(d.rawDeveloper || d.developer));
    }
    
    return filtered;
  }, [timeFilteredData, selectedTeam, selectedProject, selectedDevelopers]);

  // Toggle row expansion
  const toggleExpansion = (developer: string, rawDeveloper?: string) => {
    const key = rawDeveloper || developer.split(' (')[0];
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(key)) {
      newExpanded.delete(key);
    } else {
      newExpanded.add(key);
    }
    setExpandedRows(newExpanded);
  };

  // Handle sorting
  const handleSort = (column: keyof DeveloperProductivity) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  // Sort data
  const sortedData = [...filteredData].sort((a, b) => {
    let aValue = a[sortColumn];
    let bValue = b[sortColumn];
    
    // Handle null/undefined values
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return sortDirection === 'asc' ? -1 : 1;
    if (bValue == null) return sortDirection === 'asc' ? 1 : -1;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Get sort indicator
  const getSortIndicator = (column: keyof DeveloperProductivity) => {
    if (sortColumn !== column) return '⇅';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  // Get impact badge with color coding
  const getImpactBadge = (score: number, size: 'small' | 'normal' = 'normal') => {
    let config;
    if (score < 2.5) {
      config = { bg: 'rgba(248, 81, 73, 0.15)', text: '#f85149', border: 'rgba(248, 81, 73, 0.3)' };
    } else if (score <= 3.75) {
      config = { bg: 'rgba(255, 193, 7, 0.15)', text: '#ffc107', border: 'rgba(255, 193, 7, 0.3)' };
    } else {
      config = { bg: 'rgba(63, 185, 80, 0.15)', text: '#3fb950', border: 'rgba(63, 185, 80, 0.3)' };
    }

    const padding = size === 'small' ? '2px 6px' : '4px 8px';
    const fontSize = size === 'small' ? '11px' : '12px';

    return (
      <span 
        style={{
          backgroundColor: config.bg,
          color: config.text,
          border: `1px solid ${config.border}`,
          padding,
          borderRadius: '4px',
          fontSize,
          fontWeight: '600',
          display: 'inline-block'
        }}
      >
        {score}
      </span>
    );
  };

  // Get PR Impact Scores badges
  const getPRScoresBadges = (prs: PRData[]) => {
    const maxDisplay = 15;
    const displayPRs = prs.slice(0, maxDisplay);
    const remainingCount = prs.length - maxDisplay;

    return (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
        {displayPRs.map((pr, index) => (
          <span key={`${pr.id}-${index}`}>
            {getImpactBadge(pr.impactScore, 'small')}
          </span>
        ))}
        {remainingCount > 0 && (
          <span style={{
            fontSize: '11px',
            color: colors.text.muted,
            fontStyle: 'italic',
            marginLeft: '4px'
          }}>
            +{remainingCount} more
          </span>
        )}
      </div>
    );
  };

  // Toggle developer selection
  const toggleDeveloper = (developer: string) => {
    setSelectedDevelopers(prev => 
      prev.includes(developer) 
        ? prev.filter(d => d !== developer)
        : [...prev, developer]
    );
  };

  // Format time period for display
  const formatTimePeriod = (timeKey: string) => {
    if (timeGrouping === 'weekly') {
      const [year, weekPart] = timeKey.split('-W');
      return `Week ${weekPart}, ${year}`;
    } else {
      const [year, month] = timeKey.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${monthNames[parseInt(month) - 1]} ${year}`;
    }
  };

  // Navigation functions
  const goToPreviousPeriod = () => {
    const currentIndex = timeNavigation.indexOf(currentTimePeriod);
    if (currentIndex < timeNavigation.length - 1) {
      setCurrentTimePeriod(timeNavigation[currentIndex + 1]);
    }
  };

  const goToNextPeriod = () => {
    const currentIndex = timeNavigation.indexOf(currentTimePeriod);
    if (currentIndex > 0) {
      setCurrentTimePeriod(timeNavigation[currentIndex - 1]);
    }
  };

  const canGoNext = timeNavigation.indexOf(currentTimePeriod) > 0;
  const canGoPrevious = timeNavigation.indexOf(currentTimePeriod) < timeNavigation.length - 1;

  // Get filter options
  const teamNames = ['All Teams', ...Array.from(new Set(teams.map(t => t.name)))];
  const projectNames = ['All Projects', ...Array.from(new Set(teams.map(t => t.project)))];
  const developerNames = Array.from(new Set(data.map(d => d.rawDeveloper || d.developer))).sort();

  return (
    <div style={{
      backgroundColor: colors.background.secondary,
      border: `1px solid ${colors.border.primary}`,
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)'
    }}>
      {/* Header with Filters */}
      <div style={{
        padding: '24px 28px',
        borderBottom: `1px solid ${colors.border.primary}`,
        backgroundColor: colors.background.tertiary
      }}>
        <h2 style={{
          margin: '0 0 16px 0',
          fontSize: '20px',
          fontWeight: '600',
          color: colors.text.accent
        }}>
          Developer Productivity Overview
        </h2>
        
        {/* Filter Controls */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '16px'
        }}>
          {/* Team Filter */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: colors.text.secondary,
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Team
            </label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '14px',
                backgroundColor: colors.background.primary,
                border: `1px solid ${colors.border.primary}`,
                borderRadius: '6px',
                color: colors.text.primary,
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
              }}
            >
              {teamNames.map(team => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>
          
          {/* Project Filter */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: colors.text.secondary,
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Project
            </label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '14px',
                backgroundColor: colors.background.primary,
                border: `1px solid ${colors.border.primary}`,
                borderRadius: '6px',
                color: colors.text.primary,
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
              }}
            >
              {projectNames.map(project => (
                <option key={project} value={project}>{project}</option>
              ))}
            </select>
          </div>
          
          {/* Time Grouping and Navigation */}
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: colors.text.secondary,
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Time Period
            </label>
            
            {/* Grouping Toggle */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              {['weekly', 'monthly'].map(period => (
                <button
                  key={period}
                  onClick={() => setTimeGrouping(period as 'weekly' | 'monthly')}
                  style={{
                    padding: '8px 12px',
                    fontSize: '13px',
                    fontWeight: '500',
                    borderRadius: '6px',
                    border: `1px solid ${colors.border.primary}`,
                    backgroundColor: timeGrouping === period ? colors.impact[4] : colors.background.primary,
                    color: timeGrouping === period ? 'white' : colors.text.primary,
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {period}
                </button>
              ))}
            </div>

            {/* Time Navigation */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              backgroundColor: colors.background.primary,
              border: `1px solid ${colors.border.primary}`,
              borderRadius: '6px'
            }}>
              <button
                onClick={goToPreviousPeriod}
                disabled={!canGoPrevious}
                style={{
                  padding: '4px 8px',
                  fontSize: '12px',
                  fontWeight: '500',
                  borderRadius: '4px',
                  border: `1px solid ${colors.border.primary}`,
                  backgroundColor: canGoPrevious ? colors.background.secondary : colors.background.tertiary,
                  color: canGoPrevious ? colors.text.primary : colors.text.muted,
                  cursor: canGoPrevious ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease'
                }}
              >
                ← Previous
              </button>
              
              <div style={{
                flex: 1,
                textAlign: 'center',
                fontSize: '13px',
                fontWeight: '600',
                color: colors.text.accent,
                padding: '4px 8px'
              }}>
                {currentTimePeriod ? formatTimePeriod(currentTimePeriod) : 'Loading...'}
              </div>
              
              <button
                onClick={goToNextPeriod}
                disabled={!canGoNext}
                style={{
                  padding: '4px 8px',
                  fontSize: '12px',
                  fontWeight: '500',
                  borderRadius: '4px',
                  border: `1px solid ${colors.border.primary}`,
                  backgroundColor: canGoNext ? colors.background.secondary : colors.background.tertiary,
                  color: canGoNext ? colors.text.primary : colors.text.muted,
                  cursor: canGoNext ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s ease'
                }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
        
        {/* Developer Multi-Select */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: '500',
            color: colors.text.secondary,
            marginBottom: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Developers ({selectedDevelopers.length > 0 ? `${selectedDevelopers.length} selected` : 'All'})
          </label>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            maxHeight: '120px',
            overflowY: 'auto',
            padding: '8px',
            backgroundColor: colors.background.primary,
            border: `1px solid ${colors.border.primary}`,
            borderRadius: '6px'
          }}>
            {developerNames.map(developer => (
              <button
                key={developer}
                onClick={() => toggleDeveloper(developer)}
                style={{
                  padding: '4px 8px',
                  fontSize: '12px',
                  fontWeight: '500',
                  borderRadius: '4px',
                  border: `1px solid ${colors.border.primary}`,
                  backgroundColor: selectedDevelopers.includes(developer) 
                    ? colors.impact[4] 
                    : colors.background.secondary,
                  color: selectedDevelopers.includes(developer) 
                    ? 'white' 
                    : colors.text.primary,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {developer.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
        
        {/* Results Summary */}
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          backgroundColor: colors.background.primary,
          border: `1px solid ${colors.border.primary}`,
          borderRadius: '6px',
          fontSize: '13px',
          color: colors.text.secondary
        }}>
          <strong style={{ color: colors.text.accent }}>
            {currentTimePeriod ? formatTimePeriod(currentTimePeriod) : 'All Time'}
          </strong>
          {' '}· Showing {sortedData.length} developers
          {selectedTeam !== 'All Teams' && ` from ${selectedTeam}`}
          {selectedProject !== 'All Projects' && ` on ${selectedProject}`}
          {selectedDevelopers.length > 0 && ` (${selectedDevelopers.length} selected)`}
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          fontSize: '14px'
        }}>
          <thead>
            <tr style={{ backgroundColor: colors.background.tertiary }}>
              <th style={{ width: '40px', padding: '16px 20px' }}></th>
              <th 
                onClick={() => handleSort('developer')}
                style={{ 
                  textAlign: 'left', 
                  padding: '16px 20px', 
                  color: colors.text.secondary,
                  fontWeight: '600',
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                Developer {getSortIndicator('developer')}
              </th>
              <th 
                onClick={() => handleSort('team')}
                style={{ 
                  textAlign: 'left', 
                  padding: '16px 20px', 
                  color: colors.text.secondary,
                  fontWeight: '600',
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                Team {getSortIndicator('team')}
              </th>
              <th 
                onClick={() => handleSort('prCount')}
                style={{ 
                  textAlign: 'center', 
                  padding: '16px 20px', 
                  color: colors.text.secondary,
                  fontWeight: '600',
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                PRs {getSortIndicator('prCount')}
              </th>
              <th 
                onClick={() => handleSort('totalImpactPoints')}
                style={{ 
                  textAlign: 'center', 
                  padding: '16px 20px', 
                  color: colors.text.secondary,
                  fontWeight: '600',
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                Total Impact {getSortIndicator('totalImpactPoints')}
              </th>
              <th 
                onClick={() => handleSort('avgImpactScore')}
                style={{ 
                  textAlign: 'center', 
                  padding: '16px 20px', 
                  color: colors.text.secondary,
                  fontWeight: '600',
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                Avg Impact {getSortIndicator('avgImpactScore')}
              </th>
              <th 
                onClick={() => handleSort('avgAiUsage')}
                style={{ 
                  textAlign: 'center', 
                  padding: '16px 20px', 
                  color: colors.text.secondary,
                  fontWeight: '600',
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                AI Usage {getSortIndicator('avgAiUsage')}
              </th>
              <th style={{ 
                textAlign: 'left', 
                padding: '16px 20px', 
                color: colors.text.secondary,
                fontWeight: '600',
                fontSize: '13px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                minWidth: '200px'
              }}>
                PR Impact Scores
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((dev) => (
              <>
                {/* Main developer row */}
                <tr 
                  key={dev.developer}
                  onClick={() => toggleExpansion(dev.developer, dev.rawDeveloper)}
                  style={{
                    borderBottom: `1px solid ${colors.border.primary}`,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.background.tertiary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <td style={{ padding: '20px', textAlign: 'center' }}>
                    <span style={{ 
                      color: colors.text.secondary, 
                      fontSize: '16px',
                      transform: expandedRows.has(dev.rawDeveloper || dev.developer.split(' (')[0]) ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      display: 'inline-block'
                    }}>
                      ▶
                    </span>
                  </td>
                  <td style={{ padding: '20px', verticalAlign: 'top' }}>
                    <div style={{ 
                      fontWeight: '600', 
                      color: colors.text.accent,
                      fontSize: '15px'
                    }}>
                      {dev.rawDeveloper || dev.developer.split(' (')[0]}
                    </div>
                  </td>
                  <td style={{ padding: '20px', verticalAlign: 'top' }}>
                    <span style={{ color: colors.text.secondary, fontSize: '13px' }}>
                      {dev.team}
                    </span>
                  </td>
                  <td style={{ padding: '20px', textAlign: 'center', verticalAlign: 'top' }}>
                    <span style={{ 
                      fontWeight: '600', 
                      color: colors.text.accent,
                      fontSize: '16px'
                    }}>
                      {dev.prCount}
                    </span>
                  </td>
                  <td style={{ padding: '20px', textAlign: 'center', verticalAlign: 'top' }}>
                    <span style={{ 
                      fontWeight: '600', 
                      color: colors.text.accent,
                      fontSize: '16px'
                    }}>
                      {dev.totalImpactPoints}
                    </span>
                  </td>
                  <td style={{ padding: '20px', textAlign: 'center', verticalAlign: 'top' }}>
                    {getImpactBadge(dev.avgImpactScore)}
                  </td>
                  <td style={{ padding: '20px', textAlign: 'center', verticalAlign: 'top' }}>
                    <span style={{ 
                      fontWeight: '600', 
                      color: colors.text.accent
                    }}>
                      {dev.avgAiUsage}%
                    </span>
                  </td>
                  <td style={{ padding: '20px', verticalAlign: 'top' }}>
                    {getPRScoresBadges(dev.prs)}
                  </td>
                </tr>

                {/* Expanded PR details */}
                {expandedRows.has(dev.rawDeveloper || dev.developer.split(' (')[0]) && (
                  <tr style={{ backgroundColor: colors.background.primary }}>
                    <td colSpan={8} style={{ padding: '0' }}>
                      <div style={{ 
                        padding: '20px 40px',
                        borderTop: `1px solid ${colors.border.primary}`
                      }}>
                        <h4 style={{
                          margin: '0 0 16px 0',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: colors.text.accent,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          Individual Pull Requests ({dev.prCount} total)
                        </h4>
                        
                        <div style={{ 
                          display: 'grid', 
                          gap: '12px',
                          maxHeight: '400px',
                          overflowY: 'auto'
                        }}>
                          {dev.prs.slice(0, 20).map((pr) => (
                            <div 
                              key={pr.id}
                              style={{
                                padding: '16px',
                                backgroundColor: colors.background.secondary,
                                border: `1px solid ${colors.border.primary}`,
                                borderRadius: '8px'
                              }}
                            >
                              <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'flex-start',
                                marginBottom: '8px'
                              }}>
                                <div style={{ flex: 1 }}>
                                  <div style={{ 
                                    fontWeight: '600', 
                                    color: colors.text.accent,
                                    marginBottom: '4px',
                                    fontSize: '14px'
                                  }}>
                                    {pr.title}
                                  </div>
                                  <div style={{ 
                                    color: colors.text.secondary, 
                                    fontSize: '12px',
                                    lineHeight: '1.4',
                                    marginBottom: '8px'
                                  }}>
                                    {pr.description}
                                  </div>
                                  <div style={{
                                    backgroundColor: colors.background.primary,
                                    border: `1px solid ${colors.border.primary}`,
                                    borderRadius: '4px',
                                    padding: '6px 10px',
                                    fontSize: '11px',
                                    color: colors.text.secondary,
                                    lineHeight: '1.3'
                                  }}>
                                    <strong style={{ color: colors.text.primary }}>Impact Reasoning:</strong> {pr.explanation}
                                  </div>
                                </div>
                                <div style={{ 
                                  display: 'flex', 
                                  gap: '8px', 
                                  alignItems: 'center',
                                  marginLeft: '16px',
                                  flexDirection: 'column'
                                }}>
                                  {getImpactBadge(pr.impactScore)}
                                  <span style={{ 
                                    fontSize: '11px', 
                                    color: colors.text.muted
                                  }}>
                                    {pr.aiUsage}% AI
                                  </span>
                                  <span style={{ 
                                    fontSize: '11px', 
                                    color: colors.text.muted
                                  }}>
                                    {new Date(pr.date).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {dev.prs.length > 20 && (
                            <div style={{
                              padding: '12px',
                              textAlign: 'center',
                              color: colors.text.muted,
                              fontSize: '12px',
                              fontStyle: 'italic'
                            }}>
                              ... and {dev.prs.length - 20} more PRs
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 