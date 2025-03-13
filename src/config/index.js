import { settingsOptions } from '@/components/settings/settingsOptions';

export const width = window.innerWidth || document.documentElement.clientWidth || 800;
export const height = window.innerHeight || document.documentElement.clientHeight || 600;

export const margin = { top: 0, right: 50, bottom: 0, left: 50 };
export const innerWidth = width - margin.left - margin.right;
export const innerHeight = height - margin.top - margin.bottom;

export const barHeight = 40;
export const barWidth = width - margin.left - margin.right;

export const cellColor = settingsOptions.filter(option => option && option.property === 'tableCellColor')[0].default;
export const hoverColor = '#f0f0f0';