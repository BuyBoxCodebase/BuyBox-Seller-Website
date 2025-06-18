export interface TotalRevenue {
    amount: string;
    change: string;
}

export interface Subscriptions {
    count: number;
    change: string;
}

export interface Sales {
    count: number;
    change: string;
}

export interface ActiveRow {
    count: string;
    change: string;
}

export interface Customer {
    initials: string;
    name: string;
    email: string;
    amount: string;
}

export interface RecentSales {
    totalSales: number;
    customers: Customer[];
}

export type MonthlyData = Array<{
    name: string;
    total: number;
}>;

export interface Analytics {
    totalRevenue: TotalRevenue;
    subscriptions: Subscriptions;
    sales: Sales;
    activeNow: ActiveRow;
    recentSales: RecentSales;
    monthlyData: MonthlyData;
}