"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { PRData } from '@/lib/dataGenerator';
import { useMemo } from 'react';

interface ImpactTrendsChartProps {
  data: PRData[];
  groupBy: 'developer' | 'team' | 'quarter';
  selectedEntities: string[];
  colors: {
    background: { primary: string; secondary: string; tertiary: string };
    text: { primary: string; secondary: string; accent: string; muted: string };
    border: { primary: string; secondary: string };
  };
}

export default function ImpactTrendsChart({ 
  data, 
  groupBy, 
  selectedEntities, 
  colors 
}: ImpactTrendsChartProps) {
  
  // Generate chart data
  const chartData = useMemo(() => {
    // Group data by time periods (quarters)
    const timeGroups: { [key: string]: PRData[] } = {};
    
    data.forEach(pr => {
      if (!timeGroups[pr.quarter]) {
        timeGroups[pr.quarter] = [];
      }
      timeGroups[pr.quarter].push(pr);
    });
    
    // Helper function to sort quarters chronologically
    const sortQuarters = (a: string, b: string) => {
      const parseQuarter = (quarter: string) => {
        const [q, year] = quarter.split(' ');
        return parseInt(year) * 4 + parseInt(q.substring(1));
      };
      return parseQuarter(a) - parseQuarter(b);
    };
    
    // Get all quarters in the data range and fill gaps
    const allQuarters = ['Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025', 'Q3 2025'];
    const existingQuarters = Object.keys(timeGroups);
    
    // Calculate average impact scores for each entity in each time period
    const result = allQuarters.map(quarter => {
      const prs = timeGroups[quarter] || [];
      const point: { [key: string]: string | number | null } = { quarter, period: quarter };
      
      selectedEntities.forEach(entity => {
        const entityPRs = prs.filter(pr => {
          switch (groupBy) {
            case 'developer':
              return pr.developer === entity;
            case 'team':
              return pr.team === entity;
            case 'quarter':
              return pr.quarter === entity;
            default:
              return false;
          }
        });
        
        if (entityPRs.length > 0) {
          const avgImpact = entityPRs.reduce((sum, pr) => sum + pr.impactScore, 0) / entityPRs.length;
          point[entity] = Number(avgImpact.toFixed(2));
        } else {
          point[entity] = null;
        }
      });
      
      return point;
    });
    
    return result;
  }, [data, groupBy, selectedEntities]);
  
  // Color palette for lines
  const lineColors = [
    '#58a6ff', // Blue
    '#3fb950', // Green  
    '#ffc107', // Yellow
    '#fd7e14', // Orange
    '#f85149', // Red
    '#a5a5a5', // Gray
    '#8b949e', // Light gray
    '#6e7681'  // Dark gray
  ];
  
  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: { 
    active?: boolean; 
    payload?: Array<{ dataKey: string; value: number; color: string }>; 
    label?: string; 
  }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: colors.background.secondary,
          border: `1px solid ${colors.border.primary}`,
          borderRadius: '8px',
          padding: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ 
            margin: '0 0 8px 0', 
            color: colors.text.accent, 
            fontWeight: '600',
            fontSize: '14px'
          }}>
            {label}
          </p>
          {payload.map((entry: { dataKey: string; value: number; color: string }, index: number) => (
            <p key={index} style={{ 
              margin: '4px 0', 
              color: entry.color, 
              fontSize: '13px'
            }}>
              <span style={{ fontWeight: '500' }}>{entry.dataKey}:</span> {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  
  // Get entity display name
  const getEntityDisplayName = (entity: string) => {
    if (groupBy === 'developer') {
      return entity.split(' ')[0]; // First name only for cleaner display
    }
    return entity;
  };
  
  return (
    <div style={{
      width: '100%',
      height: '400px',
      backgroundColor: colors.background.secondary,
      border: `1px solid ${colors.border.primary}`,
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)'
    }}>
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{
          margin: '0',
          fontSize: '18px',
          fontWeight: '600',
          color: colors.text.accent
        }}>
          Impact Trends Over Time
        </h3>
        <p style={{
          margin: '4px 0 0 0',
          fontSize: '13px',
          color: colors.text.secondary
        }}>
          Average impact scores by {groupBy} across quarters
        </p>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={colors.border.primary}
            opacity={0.3}
          />
          <XAxis 
            dataKey="quarter"
            stroke={colors.text.secondary}
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            stroke={colors.text.secondary}
            fontSize={12}
            domain={[1, 5]}
            tickCount={5}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ 
              color: colors.text.secondary,
              fontSize: '12px',
              paddingTop: '16px'
            }}
          />
          
          {selectedEntities.map((entity, index) => (
            <Line
              key={entity}
              type="monotone"
              dataKey={entity}
              stroke={lineColors[index % lineColors.length]}
              strokeWidth={2}
              dot={{ fill: lineColors[index % lineColors.length], strokeWidth: 2, r: 4 }}
              connectNulls={false}
              name={getEntityDisplayName(entity)}
            />
          ))}
          
          {/* Cursor Launch Reference Line */}
          <ReferenceLine 
            x="Q1 2025" 
            stroke="#ff6b6b" 
            strokeWidth={2}
            strokeDasharray="5 5"
            label={{ 
              value: "Cursor Launch", 
              position: "top", 
              style: { 
                fill: colors.text.accent, 
                fontWeight: '600',
                fontSize: '12px'
              } 
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 