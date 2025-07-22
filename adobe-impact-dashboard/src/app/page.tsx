"use client";

import { generateDataset, type PRData, teams, developers, transformToProductivityData } from '@/lib/dataGenerator';
import { useState, useMemo, useEffect } from 'react';
import ImpactTrendsChart from '@/components/ImpactTrendsChart';
import DeveloperProductivityTable from '@/components/DeveloperProductivityTable';

export default function Home() {
  // Cursor-inspired color palette
  const colors = {
    background: {
      primary: '#0d1117',
      secondary: '#21262d', 
      tertiary: '#30363d',
    },
    text: {
      primary: '#e6edf3',
      secondary: '#7d8590',
      accent: '#f0f6fc',
      muted: '#656d76',
    },
    border: {
      primary: '#30363d',
      secondary: '#21262d',
    },
    impact: {
      1: '#f85149',
      2: '#fd7e14',
      3: '#ffc107',
      4: '#3fb950',
      5: '#58a6ff',
    },
    ai: {
      low: '#6e7681',
      medium: '#8b949e',
      high: '#a5a5a5',
    }
  };

  // Generate comprehensive dataset on client only
  const [allPRs, setAllPRs] = useState<PRData[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  useEffect(() => {
    // Generate data only on client side to prevent hydration mismatch
    const data = generateDataset();
    setAllPRs(data);
    setIsDataLoaded(true);
  }, []);
  
  // Filter state
  const [selectedTeam, setSelectedTeam] = useState<string>('All Teams');
  const [selectedProject, setSelectedProject] = useState<string>('All Projects');
  const [selectedDateRange, setSelectedDateRange] = useState<string>('All Time');
  const [displayCount, setDisplayCount] = useState<number>(10);
  
  // Sorting state
  const [sortColumn, setSortColumn] = useState<keyof PRData>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Chart state
  const [chartGroupBy, setChartGroupBy] = useState<'developer' | 'team'>('team');
  const [selectedEntities, setSelectedEntities] = useState<string[]>([
    'Canvas Architecture Core', 'WebGL Performance Engine', 'Multi-User Synchronization', 'Photoshop Core Engine'
  ]);
  
  // Table view state
  const [tableView, setTableView] = useState<'prs' | 'productivity'>('productivity');
  
  // Get available entities for chart
  const availableEntities = chartGroupBy === 'developer' 
    ? developers.map(d => d.name)
    : teams.map(t => t.name);
  
  // Toggle entity selection
  const toggleEntity = (entity: string) => {
    setSelectedEntities(prev => 
      prev.includes(entity) 
        ? prev.filter(e => e !== entity)
        : [...prev, entity]
    );
  };
  
  // Handle sorting
  const handleSort = (column: keyof PRData) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc'); // Default to descending for new columns
    }
  };
  
  // Get sort indicator
  const getSortIndicator = (column: keyof PRData) => {
    if (sortColumn !== column) return '⇅';
    return sortDirection === 'asc' ? '↑' : '↓';
  };
  
  // Get unique projects
  const projects = ['All Projects', ...Array.from(new Set(teams.map(t => t.project)))];
  const teamNames = ['All Teams', ...teams.map(t => t.name)];
  
  // Filtered and sorted PRs
  const filteredPRs = useMemo(() => {
    let filtered = [...allPRs];
    
    if (selectedTeam !== 'All Teams') {
      filtered = filtered.filter(pr => pr.team === selectedTeam);
    }
    
    if (selectedProject !== 'All Projects') {
      filtered = filtered.filter(pr => pr.project === selectedProject);
    }
    
    if (selectedDateRange !== 'All Time') {
      const now = new Date();
      let cutoffDate = new Date();
      
      switch (selectedDateRange) {
        case 'Last 30 Days':
          cutoffDate.setDate(now.getDate() - 30);
          break;
        case 'Last 3 Months':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case 'Last 6 Months':
          cutoffDate.setMonth(now.getMonth() - 6);
          break;
        case 'Post-Cursor Only':
          cutoffDate = new Date('2025-04-01');
          break;
        case 'Pre-Cursor Only':
          filtered = filtered.filter(pr => pr.phase === 'pre-cursor');
          break;
      }
      
      if (selectedDateRange !== 'Pre-Cursor Only') {
        filtered = filtered.filter(pr => new Date(pr.date) >= cutoffDate);
      }
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number = a[sortColumn];
      let bValue: string | number = b[sortColumn];
      
      // Handle different data types
      if (sortColumn === 'date') {
        aValue = new Date(aValue as string).getTime();
        bValue = new Date(bValue as string).getTime();
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    return filtered;
  }, [allPRs, selectedTeam, selectedProject, selectedDateRange, sortColumn, sortDirection]);
  
  const displayedPRs = filteredPRs.slice(0, displayCount);
  
  // Transform data for productivity view
  const productivityData = useMemo(() => {
    return transformToProductivityData(filteredPRs);
  }, [filteredPRs]);
  
  // Calculate metrics from filtered data
  const totalPRs = allPRs.length;
  const filteredTotal = filteredPRs.length;
  const avgImpactScore = filteredPRs.length > 0 ? 
    (filteredPRs.reduce((sum, pr) => sum + pr.impactScore, 0) / filteredPRs.length).toFixed(2) : '0.00';
  const aiAssistedPRs = filteredPRs.length > 0 ? 
    Math.round((filteredPRs.filter(pr => pr.aiUsage > 30).length / filteredPRs.length) * 100) : 0;
  const highImpactPRs = filteredPRs.filter(pr => pr.impactScore >= 4).length;
  
  // Pre vs Post Cursor comparison
  const preCursorPRs = allPRs.filter(pr => pr.phase === 'pre-cursor');
  const postCursorPRs = allPRs.filter(pr => pr.phase === 'post-cursor');
  const volumeIncrease = Math.round(((totalPRs - preCursorPRs.length) / preCursorPRs.length) * 100);

  // Show loading state until data is ready
  if (!isDataLoaded) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: colors.background.primary,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ color: colors.text.primary, fontSize: '18px' }}>
          Loading dashboard...
        </div>
      </div>
    );
  }

  const getImpactBadge = (score: number) => {
    const config = {
      1: { bg: 'rgba(248, 81, 73, 0.15)', text: '#f85149', border: 'rgba(248, 81, 73, 0.3)' },
      2: { bg: 'rgba(253, 126, 20, 0.15)', text: '#fd7e14', border: 'rgba(253, 126, 20, 0.3)' },
      3: { bg: 'rgba(255, 193, 7, 0.15)', text: '#ffc107', border: 'rgba(255, 193, 7, 0.3)' },
      4: { bg: 'rgba(63, 185, 80, 0.15)', text: '#3fb950', border: 'rgba(63, 185, 80, 0.3)' },
      5: { bg: 'rgba(88, 166, 255, 0.15)', text: '#58a6ff', border: 'rgba(88, 166, 255, 0.3)' }
    }[score] || { bg: 'rgba(248, 81, 73, 0.15)', text: '#f85149', border: 'rgba(248, 81, 73, 0.3)' };

    return (
      <span 
        style={{
          backgroundColor: config.bg,
          color: config.text,
          border: `1px solid ${config.border}`,
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: '600',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
        }}
      >
        {score}
      </span>
    );
  };

  const getAIUsageBar = (percentage: number) => {
    const getColor = () => {
      if (percentage < 30) return '#6e7681';
      if (percentage < 70) return '#8b949e'; 
      return '#a5a5a5';
    };

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%' }}>
        <div 
          style={{
            width: '60px',
            height: '6px',
            backgroundColor: colors.background.tertiary,
            borderRadius: '3px',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              width: `${percentage}%`,
              height: '100%',
              backgroundColor: getColor(),
              borderRadius: '3px',
              transition: 'width 0.3s ease'
            }}
          />
        </div>
        <span 
          style={{ 
            fontSize: '13px', 
            color: colors.text.secondary,
            fontWeight: '500',
            minWidth: '35px',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
          }}
        >
          {percentage}%
        </span>
      </div>
    );
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: colors.background.primary,
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      lineHeight: '1.5'
    }}>
      {/* Header */}
      <header style={{
        borderBottom: `1px solid ${colors.border.primary}`,
        backgroundColor: colors.background.secondary,
        padding: '0',
        position: 'sticky',
        top: '0',
        zIndex: '50',
        backdropFilter: 'blur(8px)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '72px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #58a6ff 0%, #a5a5a5 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: '0'
            }}>
              Adobe Impact Dashboard
            </h1>
            <div style={{
              padding: '6px 12px',
              backgroundColor: colors.background.tertiary,
              borderRadius: '6px',
              border: `1px solid ${colors.border.primary}`
            }}>
              <span style={{ 
                color: colors.text.secondary, 
                fontSize: '13px', 
                fontWeight: '500'
              }}>
                Project Canvas · AI-Augmented Engineering Metrics
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: colors.text.muted, fontSize: '14px' }}>
              July 2025 · Live Dashboard
            </span>
            <div style={{
              width: '8px',
              height: '8px',
              backgroundColor: '#3fb950',
              borderRadius: '50%'
            }} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ 
        maxWidth: '1400px', 
        margin: '0 auto', 
        padding: '40px 32px'
      }}>
        {/* Key Metrics */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '24px', 
          marginBottom: '48px' 
        }}>
          {[
            { 
              label: selectedTeam === 'All Teams' && selectedProject === 'All Projects' && selectedDateRange === 'All Time' 
                ? 'Total PRs' 
                : 'Filtered PRs', 
              value: filteredTotal.toLocaleString(), 
              change: selectedTeam === 'All Teams' && selectedProject === 'All Projects' && selectedDateRange === 'All Time'
                ? `${volumeIncrease}% vs pre-Cursor` 
                : `${filteredTotal} of ${totalPRs.toLocaleString()} total`, 
              positive: true 
            },
            { 
              label: 'Avg Impact Score', 
              value: avgImpactScore, 
              change: filteredPRs.length > 0 ? 'From filtered results' : 'No results', 
              neutral: true 
            },
            { 
              label: 'AI-Assisted PRs', 
              value: `${aiAssistedPRs}%`, 
              change: filteredPRs.length > 0 ? 'From filtered results' : 'No results', 
              positive: true 
            },
            { 
              label: 'High-Impact PRs', 
              value: highImpactPRs.toLocaleString(), 
              change: `Score 4-5 (${filteredPRs.length > 0 ? Math.round((highImpactPRs / filteredTotal) * 100) : 0}%)`, 
              positive: true 
            }
          ].map((metric, i) => (
            <div key={i} style={{
              backgroundColor: colors.background.secondary,
              border: `1px solid ${colors.border.primary}`,
              borderRadius: '12px',
              padding: '28px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'default'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)';
            }}>
              <div style={{ 
                color: colors.text.secondary, 
                fontSize: '14px', 
                fontWeight: '500',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {metric.label}
              </div>
              <div style={{ 
                color: colors.text.accent, 
                fontSize: '32px', 
                fontWeight: '700',
                marginBottom: '8px' 
              }}>
                {metric.value}
              </div>
              <div style={{ 
                color: metric.positive ? '#3fb950' : metric.neutral ? colors.text.secondary : '#f85149', 
                fontSize: '13px',
                fontWeight: '500' 
              }}>
                {metric.change}
              </div>
            </div>
          ))}
        </div>

        {/* Impact Trends Chart */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{
            backgroundColor: colors.background.secondary,
            border: `1px solid ${colors.border.primary}`,
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)'
          }}>
            {/* Chart Controls */}
            <div style={{
              padding: '24px 28px',
              borderBottom: `1px solid ${colors.border.primary}`,
              backgroundColor: colors.background.tertiary
            }}>
              <h2 style={{
                margin: '0',
                fontSize: '20px',
                fontWeight: '600',
                color: colors.text.accent
              }}>
                Impact Trends Analysis
              </h2>
              <p style={{
                margin: '4px 0 16px 0',
                fontSize: '14px',
                color: colors.text.secondary
              }}>
                Track impact scores over time to see the &quot;Cursor Effect&quot;
              </p>
              
              {/* Chart Type Toggle */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: colors.text.secondary,
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Group By
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['developer', 'team'].map(type => (
                    <button
                      key={type}
                      onClick={() => {
                        setChartGroupBy(type as 'developer' | 'team');
                        setSelectedEntities([]); // Reset selection
                      }}
                      style={{
                        padding: '6px 12px',
                        fontSize: '13px',
                        fontWeight: '500',
                        borderRadius: '6px',
                        border: `1px solid ${colors.border.primary}`,
                        backgroundColor: chartGroupBy === type ? colors.impact[5] : colors.background.primary,
                        color: chartGroupBy === type ? 'white' : colors.text.primary,
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Entity Selection */}
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
                  Select {chartGroupBy === 'developer' ? 'Developers' : 'Teams'} (Max 6)
                </label>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  maxHeight: '120px',
                  overflowY: 'auto'
                }}>
                  {availableEntities.map(entity => (
                    <button
                      key={entity}
                      onClick={() => toggleEntity(entity)}
                      disabled={!selectedEntities.includes(entity) && selectedEntities.length >= 6}
                      style={{
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        borderRadius: '6px',
                        border: `1px solid ${colors.border.primary}`,
                        backgroundColor: selectedEntities.includes(entity) 
                          ? colors.impact[4] 
                          : colors.background.primary,
                        color: selectedEntities.includes(entity) 
                          ? 'white' 
                          : colors.text.primary,
                        cursor: (!selectedEntities.includes(entity) && selectedEntities.length >= 6) 
                          ? 'not-allowed' 
                          : 'pointer',
                        opacity: (!selectedEntities.includes(entity) && selectedEntities.length >= 6) 
                          ? 0.5 
                          : 1,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {chartGroupBy === 'developer' ? entity.split(' ')[0] : entity}
                    </button>
                  ))}
                </div>
                {selectedEntities.length === 0 && (
                  <p style={{
                    margin: '8px 0 0 0',
                    fontSize: '12px',
                    color: colors.text.muted,
                    fontStyle: 'italic'
                  }}>
                    Select at least one {chartGroupBy} to display trends
                  </p>
                )}
              </div>
            </div>
            
            {/* Chart Component */}
            {selectedEntities.length > 0 && (
              <ImpactTrendsChart
                data={allPRs}
                groupBy={chartGroupBy}
                selectedEntities={selectedEntities}
                colors={colors}
              />
            )}
          </div>
        </div>

        {/* Table Section */}
        <div style={{
          backgroundColor: colors.background.secondary,
          border: `1px solid ${colors.border.primary}`,
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)'
        }}>
          {/* Table Header with View Toggle */}
          <div style={{
            padding: '24px 28px',
            borderBottom: tableView === 'prs' ? `1px solid ${colors.border.primary}` : 'none',
            backgroundColor: colors.background.tertiary
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{
                  margin: '0',
                  fontSize: '20px',
                  fontWeight: '600',
                  color: colors.text.accent
                }}>
                  {tableView === 'productivity' ? 'Developer Productivity Analysis' : 'Recent Pull Requests'}
                </h2>
                <p style={{
                  margin: '4px 0 0 0',
                  fontSize: '14px',
                  color: colors.text.secondary
                }}>
                  {tableView === 'productivity' 
                    ? 'Analyze developer performance and drill down into individual contributions'
                    : 'Browse individual PRs with detailed filtering and sorting options'
                  }
                </p>
              </div>
              
              {/* View Toggle */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setTableView('productivity')}
                  style={{
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    borderRadius: '8px',
                    border: `1px solid ${colors.border.primary}`,
                    backgroundColor: tableView === 'productivity' ? colors.impact[4] : colors.background.primary,
                    color: tableView === 'productivity' ? 'white' : colors.text.primary,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  👥 Developer View
                </button>
                <button
                  onClick={() => setTableView('prs')}
                  style={{
                    padding: '10px 16px',
                    fontSize: '14px',
                    fontWeight: '600',
                    borderRadius: '8px',
                    border: `1px solid ${colors.border.primary}`,
                    backgroundColor: tableView === 'prs' ? colors.impact[4] : colors.background.primary,
                    color: tableView === 'prs' ? 'white' : colors.text.primary,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  📄 PR View
                </button>
              </div>
            </div>

            {/* Conditional Filter Controls for PR View Only */}
            {tableView === 'prs' && (
              <>
                {/* Filter Controls */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginTop: '20px'
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
                      {projects.map(project => (
                        <option key={project} value={project}>{project}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Date Range Filter */}
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
                      Date Range
                    </label>
                    <select
                      value={selectedDateRange}
                      onChange={(e) => setSelectedDateRange(e.target.value)}
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
                      <option value="All Time">All Time</option>
                      <option value="Last 30 Days">Last 30 Days</option>
                      <option value="Last 3 Months">Last 3 Months</option>
                      <option value="Last 6 Months">Last 6 Months</option>
                      <option value="Post-Cursor Only">Post-Cursor Only</option>
                      <option value="Pre-Cursor Only">Pre-Cursor Only</option>
                    </select>
                  </div>
                  
                  {/* Results Count */}
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
                      Show Results
                    </label>
                    <select
                      value={displayCount}
                      onChange={(e) => setDisplayCount(Number(e.target.value))}
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
                      <option value={10}>10 PRs</option>
                      <option value={25}>25 PRs</option>
                      <option value={50}>50 PRs</option>
                      <option value={100}>100 PRs</option>
                    </select>
                  </div>
                </div>
                
                {/* Filter Results Summary */}
                <div style={{
                  marginTop: '16px',
                  padding: '12px 16px',
                  backgroundColor: colors.background.primary,
                  border: `1px solid ${colors.border.primary}`,
                  borderRadius: '6px',
                  fontSize: '13px',
                  color: colors.text.secondary
                }}>
                  Showing {displayedPRs.length} of {filteredTotal} filtered results 
                  {filteredTotal !== totalPRs && ` (${totalPRs.toLocaleString()} total PRs)`}
                </div>
              </>
            )}
          </div>

          {/* Conditional Table Content */}
          {tableView === 'productivity' ? (
            <DeveloperProductivityTable data={productivityData} allPRs={filteredPRs} colors={colors} />
          ) : (
            // Original PR Table content
            <div style={{ overflowX: 'auto' }}>
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                fontSize: '14px'
              }}>
                <thead>
                  <tr style={{ backgroundColor: colors.background.tertiary }}>
                    <th 
                      onClick={() => handleSort('title')}
                      style={{ 
                        textAlign: 'left', 
                        padding: '20px 28px', 
                        color: colors.text.secondary,
                        fontWeight: '600',
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: `1px solid ${colors.border.primary}`,
                        cursor: 'pointer',
                        userSelect: 'none',
                        transition: 'color 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = colors.text.accent;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = colors.text.secondary;
                      }}
                    >
                      Pull Request {getSortIndicator('title')}
                    </th>
                    <th 
                      onClick={() => handleSort('developer')}
                      style={{ 
                        textAlign: 'left', 
                        padding: '20px 28px', 
                        color: colors.text.secondary,
                        fontWeight: '600',
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: `1px solid ${colors.border.primary}`,
                        cursor: 'pointer',
                        userSelect: 'none',
                        transition: 'color 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = colors.text.accent;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = colors.text.secondary;
                      }}
                    >
                      Developer & Team {getSortIndicator('developer')}
                    </th>
                    <th 
                      onClick={() => handleSort('impactScore')}
                      style={{ 
                        textAlign: 'center', 
                        padding: '20px 28px', 
                        color: colors.text.secondary,
                        fontWeight: '600',
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: `1px solid ${colors.border.primary}`,
                        cursor: 'pointer',
                        userSelect: 'none',
                        transition: 'color 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = colors.text.accent;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = colors.text.secondary;
                      }}
                    >
                      Impact {getSortIndicator('impactScore')}
                    </th>
                    <th 
                      onClick={() => handleSort('aiUsage')}
                      style={{ 
                        textAlign: 'left', 
                        padding: '20px 28px', 
                        color: colors.text.secondary,
                        fontWeight: '600',
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: `1px solid ${colors.border.primary}`,
                        cursor: 'pointer',
                        userSelect: 'none',
                        transition: 'color 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = colors.text.accent;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = colors.text.secondary;
                      }}
                    >
                      AI Usage {getSortIndicator('aiUsage')}
                    </th>
                    <th 
                      onClick={() => handleSort('date')}
                      style={{ 
                        textAlign: 'left', 
                        padding: '20px 28px', 
                        color: colors.text.secondary,
                        fontWeight: '600',
                        fontSize: '13px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: `1px solid ${colors.border.primary}`,
                        cursor: 'pointer',
                        userSelect: 'none',
                        transition: 'color 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = colors.text.accent;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = colors.text.secondary;
                      }}
                    >
                      Date {getSortIndicator('date')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayedPRs.map((pr) => (
                    <tr key={pr.id} style={{
                      borderBottom: `1px solid ${colors.border.primary}`,
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = colors.background.tertiary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}>
                      <td style={{ 
                        padding: '24px 28px',
                        verticalAlign: 'top'
                      }}>
                        <div>
                          <div style={{ 
                            fontWeight: '600', 
                            color: colors.text.accent,
                            marginBottom: '6px',
                            fontSize: '15px'
                          }}>
                            {pr.title}
                          </div>
                          <div style={{ 
                            color: colors.text.secondary, 
                            fontSize: '13px',
                            lineHeight: '1.4',
                            marginBottom: '8px'
                          }}>
                            {pr.description}
                          </div>
                          <div style={{
                            backgroundColor: colors.background.primary,
                            border: `1px solid ${colors.border.primary}`,
                            borderRadius: '6px',
                            padding: '8px 12px',
                            fontSize: '12px',
                            color: colors.text.secondary,
                            lineHeight: '1.3'
                          }}>
                            <strong style={{ color: colors.text.primary }}>Impact Reasoning:</strong> {pr.explanation}
                          </div>
                        </div>
                      </td>
                      <td style={{ 
                        padding: '24px 28px',
                        verticalAlign: 'top'
                      }}>
                        <div>
                          <div style={{ 
                            fontWeight: '600', 
                            color: colors.text.accent,
                            marginBottom: '4px'
                          }}>
                            {pr.developer}
                          </div>
                          <div style={{ 
                            color: colors.text.secondary, 
                            fontSize: '13px'
                          }}>
                            {pr.team}
                          </div>
                        </div>
                      </td>
                      <td style={{ 
                        padding: '24px 28px', 
                        textAlign: 'center',
                        verticalAlign: 'top'
                      }}>
                        {getImpactBadge(pr.impactScore)}
                      </td>
                      <td style={{ 
                        padding: '24px 28px',
                        verticalAlign: 'top'
                      }}>
                        {getAIUsageBar(pr.aiUsage)}
                      </td>
                      <td style={{ 
                        padding: '24px 28px', 
                        color: colors.text.secondary,
                        fontSize: '13px',
                        verticalAlign: 'top'
                      }}>
                        {new Date(pr.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
