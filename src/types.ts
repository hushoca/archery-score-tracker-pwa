export const allPoints = {
   "M": { point: 0, color: "#585858" },
   1:  { point: 1, color: "#a8a8a8" },
   2:  { point: 2, color: "#a8a8a8" },
   3:  { point: 3, color: "#000" },
   4:  { point: 4, color: "#000" },
   5:  { point: 5, color: "#2563eb" },
   6:  { point: 6, color: "#2563eb" },
   7:  { point: 7, color: "#c21737" },
   8:  { point: 8, color: "#c21737" },
   9:  { point: 9, color: "#d69824" },
   10: { point: 10, color: "#d69824" },
   "X": { point: 10, color: "#d69824" }
}

export type Point = keyof typeof allPoints;

export const orderedPoints = [ "M", 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "X" ] as const;

export interface Set {
    recordedAt : number;
    total: number;
    points: Point[];
}

export type DefaultReportData = { 
    arrowsShot : number;
    sessions: number;
    maxScore: number;
}

export type ExtendedReportData = DefaultReportData & {
    arrowsMissed : number;
    avgAccuracy: number;
    totalPointsScored : number;
}

export interface Session {
    id: string;
    arrowsPerSet: number;
    setCount: number | null;
    name?: string;
    startedAt : number;
    finishedAt? : number;
    sets: Set[];
    score: number;
    tags: string[];
}

export interface Tag {
    id: string;
    createdAt: number;
    usedBy: string[];
}

export const allDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
export type Days = typeof allDays[number];


export const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;
export type Months = typeof allMonths[number];