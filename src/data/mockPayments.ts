export interface Payment {
  id: string | number;
  type: 'project_payment' | 'milestone_payment' | 'subscription' | 'learning_resource' | 'platform_fee' | 'refund';
  projectId?: string | number;
  applicationId?: string | number;
  learningResourceId?: string | number;
  payerId: string | number;
  payerName: string;
  payerType: 'student' | 'client' | 'platform';
  recipientId: string | number;
  recipientName: string;
  recipientType: 'student' | 'client' | 'platform';
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded' | 'disputed';
  paymentMethod: 'credit_card' | 'bank_transfer' | 'paypal' | 'stripe' | 'platform_balance';
  description: string;
  createdDate: string;
  processedDate?: string;
  platformFee: number;
  netAmount: number;
  reference: string;
  invoice?: {
    invoiceNumber: string;
    dueDate: string;
    taxAmount?: number;
  };
  metadata?: {
    stripePaymentId?: string;
    paypalTransactionId?: string;
    milestoneNumber?: number;
    notes?: string;
  };
}

export interface Payout {
  id: string | number;
  studentId: number;
  studentName: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  payoutMethod: 'bank_transfer' | 'paypal' | 'wise' | 'stripe_express';
  accountDetails: {
    accountType: string;
    maskedAccount: string;
  };
  requestDate: string;
  processedDate?: string;
  reference: string;
  fees: number;
  netAmount: number;
  includedPayments: string[];
}

export interface Transaction {
  id: string | number;
  userId: string | number;
  userName: string;
  userType: 'student' | 'client';
  type: 'debit' | 'credit';
  category: 'project_payment' | 'learning_resource' | 'platform_fee' | 'payout' | 'refund' | 'bonus';
  amount: number;
  currency: string;
  balance: number;
  description: string;
  date: string;
  relatedPaymentId?: string | number;
  relatedPayoutId?: string | number;
  status: 'completed' | 'pending' | 'failed';
}

export const mockPayments: Payment[] = [
  {
    id: 1,
    type: 'project_payment',
    projectId: 1,
    applicationId: 1,
    payerId: "client_1",
    payerName: "Local Boutique",
    payerType: "client",
    recipientId: 1,
    recipientName: "Alex Rivera",
    recipientType: "student",
    amount: 2800,
    currency: "USD",
    status: "completed",
    paymentMethod: "credit_card",
    description: "Payment for E-commerce Website Development",
    createdDate: "2024-01-17",
    processedDate: "2024-01-17",
    platformFee: 140,
    netAmount: 2660,
    reference: "PAY_001_20240117",
    invoice: {
      invoiceNumber: "INV-2024-001",
      dueDate: "2024-01-24",
      taxAmount: 0
    },
    metadata: {
      stripePaymentId: "pi_1234567890abcdef",
      notes: "Full project payment upon completion"
    }
  },
  {
    id: 2,
    type: 'milestone_payment',
    projectId: 2,
    applicationId: 2,
    payerId: "client_2",
    payerName: "Fitness Studio",
    payerType: "client",
    recipientId: 2,
    recipientName: "Jamie Patel",
    recipientType: "student",
    amount: 500,
    currency: "USD",
    status: "completed",
    paymentMethod: "paypal",
    description: "Milestone 1: Initial Design Concepts",
    createdDate: "2024-01-20",
    processedDate: "2024-01-20",
    platformFee: 25,
    netAmount: 475,
    reference: "PAY_002_20240120",
    metadata: {
      paypalTransactionId: "PAYID-123ABC789",
      milestoneNumber: 1
    }
  },
  {
    id: 3,
    type: 'milestone_payment',
    projectId: 2,
    applicationId: 2,
    payerId: "client_2",
    payerName: "Fitness Studio",
    payerType: "client",
    recipientId: 2,
    recipientName: "Jamie Patel",
    recipientType: "student",
    amount: 500,
    currency: "USD",
    status: "completed",
    paymentMethod: "paypal",
    description: "Milestone 2: Final Designs and Assets",
    createdDate: "2024-01-27",
    processedDate: "2024-01-27",
    platformFee: 25,
    netAmount: 475,
    reference: "PAY_003_20240127",
    metadata: {
      paypalTransactionId: "PAYID-456DEF012",
      milestoneNumber: 2
    }
  },
  {
    id: 4,
    type: 'learning_resource',
    learningResourceId: 1,
    payerId: 1,
    payerName: "Alex Rivera",
    payerType: "student",
    recipientId: "platform",
    recipientName: "MyVillage Platform",
    recipientType: "platform",
    amount: 29.99,
    currency: "USD",
    status: "completed",
    paymentMethod: "credit_card",
    description: "Resume Writing Workshop for Tech Professionals",
    createdDate: "2024-02-10",
    processedDate: "2024-02-10",
    platformFee: 0,
    netAmount: 29.99,
    reference: "PAY_004_20240210",
    metadata: {
      stripePaymentId: "pi_abcdef1234567890"
    }
  },
  {
    id: 5,
    type: 'project_payment',
    projectId: 3,
    applicationId: 3,
    payerId: "client_3",
    payerName: "Tech Startup",
    payerType: "client",
    recipientId: 3,
    recipientName: "Morgan Lee",
    recipientType: "student",
    amount: 2200,
    currency: "USD",
    status: "processing",
    paymentMethod: "bank_transfer",
    description: "Payment for 3D Product Visualization",
    createdDate: "2024-02-05",
    platformFee: 110,
    netAmount: 2090,
    reference: "PAY_005_20240205",
    metadata: {
      notes: "Bank transfer processing, expected to complete within 3-5 business days"
    }
  },
  {
    id: 6,
    type: 'learning_resource',
    learningResourceId: 2,
    payerId: 3,
    payerName: "Morgan Lee",
    payerType: "student",
    recipientId: "platform",
    recipientName: "MyVillage Platform",
    recipientType: "platform",
    amount: 79.99,
    currency: "USD",
    status: "completed",
    paymentMethod: "stripe",
    description: "Introduction to Freelancing: Building Your Client Base",
    createdDate: "2024-01-15",
    processedDate: "2024-01-15",
    platformFee: 0,
    netAmount: 79.99,
    reference: "PAY_006_20240115",
    metadata: {
      stripePaymentId: "pi_xyz789012345abc"
    }
  },
  {
    id: 7,
    type: 'platform_fee',
    projectId: 1,
    payerId: 1,
    payerName: "Alex Rivera",
    payerType: "student",
    recipientId: "platform",
    recipientName: "MyVillage Platform",
    recipientType: "platform",
    amount: 140,
    currency: "USD",
    status: "completed",
    paymentMethod: "platform_balance",
    description: "Platform service fee (5%)",
    createdDate: "2024-01-17",
    processedDate: "2024-01-17",
    platformFee: 0,
    netAmount: 140,
    reference: "FEE_001_20240117"
  },
  {
    id: 8,
    type: 'refund',
    projectId: "cancelled_project_1",
    payerId: "platform",
    payerName: "MyVillage Platform",
    payerType: "platform",
    recipientId: "client_4",
    recipientName: "Indie Studio",
    recipientType: "client",
    amount: 1000,
    currency: "USD",
    status: "completed",
    paymentMethod: "credit_card",
    description: "Refund for cancelled project",
    createdDate: "2024-01-30",
    processedDate: "2024-01-30",
    platformFee: 0,
    netAmount: 1000,
    reference: "REF_001_20240130",
    metadata: {
      notes: "Project cancelled by mutual agreement before work began"
    }
  }
];

export const mockPayouts: Payout[] = [
  {
    id: 1,
    studentId: 1,
    studentName: "Alex Rivera",
    amount: 2660,
    currency: "USD",
    status: "completed",
    payoutMethod: "bank_transfer",
    accountDetails: {
      accountType: "Checking Account",
      maskedAccount: "****1234"
    },
    requestDate: "2024-01-20",
    processedDate: "2024-01-22",
    reference: "PAYOUT_001_20240120",
    fees: 5.00,
    netAmount: 2655,
    includedPayments: ["PAY_001_20240117"]
  },
  {
    id: 2,
    studentId: 2,
    studentName: "Jamie Patel",
    amount: 950,
    currency: "USD",
    status: "completed",
    payoutMethod: "paypal",
    accountDetails: {
      accountType: "PayPal Account",
      maskedAccount: "jamie****@email.com"
    },
    requestDate: "2024-01-28",
    processedDate: "2024-01-29",
    reference: "PAYOUT_002_20240128",
    fees: 2.50,
    netAmount: 947.50,
    includedPayments: ["PAY_002_20240120", "PAY_003_20240127"]
  },
  {
    id: 3,
    studentId: 3,
    studentName: "Morgan Lee",
    amount: 2090,
    currency: "USD",
    status: "pending",
    payoutMethod: "wise",
    accountDetails: {
      accountType: "Wise Account",
      maskedAccount: "****5678"
    },
    requestDate: "2024-02-06",
    reference: "PAYOUT_003_20240206",
    fees: 15.00,
    netAmount: 2075,
    includedPayments: ["PAY_005_20240205"]
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: 1,
    userId: 1,
    userName: "Alex Rivera",
    userType: "student",
    type: "credit",
    category: "project_payment",
    amount: 2660,
    currency: "USD",
    balance: 2660,
    description: "Payment received for E-commerce Website Development",
    date: "2024-01-17",
    relatedPaymentId: 1,
    status: "completed"
  },
  {
    id: 2,
    userId: 1,
    userName: "Alex Rivera",
    userType: "student",
    type: "debit",
    category: "payout",
    amount: 2660,
    currency: "USD",
    balance: 0,
    description: "Payout to bank account ****1234",
    date: "2024-01-22",
    relatedPayoutId: 1,
    status: "completed"
  },
  {
    id: 3,
    userId: 2,
    userName: "Jamie Patel",
    userType: "student",
    type: "credit",
    category: "project_payment",
    amount: 475,
    currency: "USD",
    balance: 475,
    description: "Milestone 1 payment - Social Media Graphics",
    date: "2024-01-20",
    relatedPaymentId: 2,
    status: "completed"
  },
  {
    id: 4,
    userId: 2,
    userName: "Jamie Patel",
    userType: "student",
    type: "credit",
    category: "project_payment",
    amount: 475,
    currency: "USD",
    balance: 950,
    description: "Milestone 2 payment - Social Media Graphics",
    date: "2024-01-27",
    relatedPaymentId: 3,
    status: "completed"
  },
  {
    id: 5,
    userId: 2,
    userName: "Jamie Patel",
    userType: "student",
    type: "debit",
    category: "payout",
    amount: 950,
    currency: "USD",
    balance: 0,
    description: "Payout to PayPal jamie****@email.com",
    date: "2024-01-29",
    relatedPayoutId: 2,
    status: "completed"
  },
  {
    id: 6,
    userId: 3,
    userName: "Morgan Lee",
    userType: "student",
    type: "credit",
    category: "project_payment",
    amount: 2090,
    currency: "USD",
    balance: 2090,
    description: "Payment received for 3D Product Visualization",
    date: "2024-02-05",
    relatedPaymentId: 5,
    status: "pending"
  },
  {
    id: 7,
    userId: "client_1",
    userName: "Local Boutique",
    userType: "client",
    type: "debit",
    category: "project_payment",
    amount: 2800,
    currency: "USD",
    balance: 1200,
    description: "Payment for E-commerce Website Development to Alex Rivera",
    date: "2024-01-17",
    relatedPaymentId: 1,
    status: "completed"
  },
  {
    id: 8,
    userId: "client_2",
    userName: "Fitness Studio",
    userType: "client",
    type: "debit",
    category: "project_payment",
    amount: 1000,
    currency: "USD",
    balance: 3500,
    description: "Total payment for Social Media Graphics to Jamie Patel",
    date: "2024-01-27",
    relatedPaymentId: 3,
    status: "completed"
  },
  {
    id: 9,
    userId: 1,
    userName: "Alex Rivera",
    userType: "student",
    type: "debit",
    category: "learning_resource",
    amount: 29.99,
    currency: "USD",
    balance: 170.01,
    description: "Purchased: Resume Writing Workshop",
    date: "2024-02-10",
    relatedPaymentId: 4,
    status: "completed"
  },
  {
    id: 10,
    userId: 1,
    userName: "Alex Rivera",
    userType: "student",
    type: "credit",
    category: "bonus",
    amount: 200,
    currency: "USD",
    balance: 200,
    description: "New user welcome bonus",
    date: "2024-01-10",
    status: "completed"
  }
];

// Payment statistics
export const paymentStats = {
  totalPayments: mockPayments.length,
  totalVolume: mockPayments.reduce((sum, payment) => sum + payment.amount, 0),
  totalPlatformFees: mockPayments.reduce((sum, payment) => sum + payment.platformFee, 0),
  byStatus: {
    completed: mockPayments.filter(p => p.status === 'completed').length,
    processing: mockPayments.filter(p => p.status === 'processing').length,
    pending: mockPayments.filter(p => p.status === 'pending').length,
    failed: mockPayments.filter(p => p.status === 'failed').length,
    refunded: mockPayments.filter(p => p.status === 'refunded').length
  },
  byType: {
    project_payment: mockPayments.filter(p => p.type === 'project_payment').length,
    milestone_payment: mockPayments.filter(p => p.type === 'milestone_payment').length,
    learning_resource: mockPayments.filter(p => p.type === 'learning_resource').length,
    platform_fee: mockPayments.filter(p => p.type === 'platform_fee').length,
    refund: mockPayments.filter(p => p.type === 'refund').length
  },
  averageProjectPayment: mockPayments
    .filter(p => p.type === 'project_payment' || p.type === 'milestone_payment')
    .reduce((sum, p, _, arr) => sum + p.amount / arr.length, 0)
};

export const payoutStats = {
  totalPayouts: mockPayouts.length,
  totalAmount: mockPayouts.reduce((sum, payout) => sum + payout.amount, 0),
  totalFees: mockPayouts.reduce((sum, payout) => sum + payout.fees, 0),
  byStatus: {
    completed: mockPayouts.filter(p => p.status === 'completed').length,
    processing: mockPayouts.filter(p => p.status === 'processing').length,
    pending: mockPayouts.filter(p => p.status === 'pending').length,
    failed: mockPayouts.filter(p => p.status === 'failed').length
  },
  byMethod: {
    bank_transfer: mockPayouts.filter(p => p.payoutMethod === 'bank_transfer').length,
    paypal: mockPayouts.filter(p => p.payoutMethod === 'paypal').length,
    wise: mockPayouts.filter(p => p.payoutMethod === 'wise').length,
    stripe_express: mockPayouts.filter(p => p.payoutMethod === 'stripe_express').length
  }
};
