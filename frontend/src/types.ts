export type AuthUser = { userId: number; name: string; email: string; role: string };

export type Customer = {
  id: number; firstName: string; lastName: string; fullName: string;
  email: string; age?: number; phone?: string; company?: string;
  photoUrl?: string; status: string; source?: string; tags?: string[];
  totalRevenue?: number; createdAt: string;
};

export type Product = {
  id: number; name: string; description: string; price: number;
  costPrice?: number; margin?: number; sku?: string; stock?: number;
  status: string; imageUrl?: string; categoryName?: string;
  lastUpdated: string; createdAt: string;
};

export type Deal = {
  id: number; title: string; value: number; probability: number;
  stage: string; customerName: string; customerId: number;
  assignedToName?: string; expectedCloseDate?: string;
  createdAt: string; notes?: string;
};

export type Activity = {
  id: number; type: string; title: string; description?: string;
  customerName?: string; dealTitle?: string; dueDate?: string;
  completedAt?: string; assignedToName?: string; priority: string;
  status: string; createdAt: string;
};

export type DashboardData = {
  totalCustomers: number; newCustomersThisMonth: number;
  activeDeals: number; totalPipelineValue: number;
  wonDealsThisMonth: number; wonRevenueThisMonth: number;
  conversionRate: number; activitiesPendingToday: number;
};

export type RevenueTrendPoint = { month: string; revenue: number };

export type PipelineFunnelStage = { stage: string; label: string; count: number; value: number };

export type TopProductPoint = { id: number; name: string; dealCount: number };

export type Notification = {
  id: number; type: string; title: string; message: string;
  read: boolean; link?: string; createdAt: string;
};

export type Page<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
};
