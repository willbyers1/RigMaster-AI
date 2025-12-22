
import { RigType, MaintenanceStatus } from '../types';

/**
 * Maintenance Math:
 * Desktop Rules: Thermal paste every 24 months, Fan cleaning every 6 months.
 * Laptop Rules: Thermal paste every 15 months (runs hotter), Fan cleaning every 3 months.
 */

const INTERVALS = {
  [RigType.DESKTOP]: {
    PASTE: 24, // months
    FAN: 6    // months
  },
  [RigType.LAPTOP]: {
    PASTE: 15, // months
    FAN: 3     // months
  }
};

export function calculateMaintenance(
  type: RigType,
  purchaseDate: string,
  lastActionDate?: string,
  actionType: 'PASTE' | 'FAN' = 'FAN'
): MaintenanceStatus {
  const baseDate = new Date(lastActionDate || purchaseDate);
  const intervalMonths = actionType === 'PASTE' 
    ? INTERVALS[type].PASTE 
    : INTERVALS[type].FAN;
    
  const dueDate = new Date(baseDate);
  dueDate.setMonth(dueDate.getMonth() + intervalMonths);
  
  const today = new Date();
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Percentage calculation (total interval vs remaining)
  const totalDays = intervalMonths * 30.44;
  const percentage = Math.max(0, Math.min(100, (diffDays / totalDays) * 100));
  
  return {
    type: actionType,
    label: actionType === 'PASTE' ? 'Thermal Paste' : 'Fan Cleaning',
    daysRemaining: diffDays,
    percentage: Math.round(percentage),
    isCritical: diffDays <= 7,
    dueDate
  };
}
