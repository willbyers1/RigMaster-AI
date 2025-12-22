
export enum RigType {
  DESKTOP = 'DESKTOP',
  LAPTOP = 'LAPTOP'
}

export enum ResolutionTarget {
  P1080 = '1080p',
  P1440 = '1440p',
  P2160 = '4K'
}

export interface RigProfile {
  id: string;
  name: string;
  type: RigType;
  cpu: string;
  gpu: string;
  ram: number;
  resolution: ResolutionTarget;
  purchaseDate: string;
  lastPasteChange?: string;
  lastFanClean?: string;
}

export interface FPSResult {
  low: number;
  medium: number;
  ultra: number;
  bottleneck: string;
  confidence: number;
}

export interface MaintenanceStatus {
  type: 'PASTE' | 'FAN';
  label: string;
  daysRemaining: number;
  percentage: number;
  isCritical: boolean;
  dueDate: Date;
}
