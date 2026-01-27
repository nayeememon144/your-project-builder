import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, 
  Download, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Receipt,
  Wallet,
  Calendar
} from 'lucide-react';

type PaymentRecord = {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'paid' | 'pending' | 'overdue';
  semester: string;
  transactionId?: string;
};

const paymentHistory: PaymentRecord[] = [
  { 
    id: '1', 
    description: 'Spring 2024 Tuition Fee', 
    amount: 52500, 
    dueDate: '2024-01-31', 
    status: 'pending',
    semester: 'Spring 2024'
  },
  { 
    id: '2', 
    description: 'Spring 2024 Lab Fee', 
    amount: 5000, 
    dueDate: '2024-01-31', 
    status: 'pending',
    semester: 'Spring 2024'
  },
  { 
    id: '3', 
    description: 'Fall 2023 Tuition Fee', 
    amount: 52500, 
    dueDate: '2023-09-15', 
    paidDate: '2023-09-10',
    status: 'paid',
    semester: 'Fall 2023',
    transactionId: 'TXN-2023-0912-001'
  },
  { 
    id: '4', 
    description: 'Fall 2023 Lab Fee', 
    amount: 5000, 
    dueDate: '2023-09-15', 
    paidDate: '2023-09-10',
    status: 'paid',
    semester: 'Fall 2023',
    transactionId: 'TXN-2023-0912-002'
  },
  { 
    id: '5', 
    description: 'Spring 2023 Tuition Fee', 
    amount: 52500, 
    dueDate: '2023-01-31', 
    paidDate: '2023-01-25',
    status: 'paid',
    semester: 'Spring 2023',
    transactionId: 'TXN-2023-0125-001'
  },
  { 
    id: '6', 
    description: 'Library Fine', 
    amount: 200, 
    dueDate: '2024-01-15', 
    status: 'overdue',
    semester: 'Spring 2024'
  },
];

const feeBreakdown = {
  tuition: 52500,
  labFee: 5000,
  libraryFee: 1500,
  examFee: 2000,
  developmentFee: 3000,
  total: 64000,
};

export const FeePaymentTracking = () => {
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);

  const pendingPayments = paymentHistory.filter(p => p.status !== 'paid');
  const paidPayments = paymentHistory.filter(p => p.status === 'paid');
  const totalPending = pendingPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalPaid = paidPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalDue = totalPending;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'overdue': return <AlertCircle className="w-4 h-4 text-destructive" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return <Badge className="bg-green-500 text-white">Paid</Badge>;
      case 'pending': return <Badge className="bg-yellow-500 text-white">Pending</Badge>;
      case 'overdue': return <Badge className="bg-destructive text-white">Overdue</Badge>;
      default: return null;
    }
  };

  const handlePayNow = () => {
    // Simulated payment gateway redirect
    alert('Redirecting to payment gateway...');
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-destructive">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">৳{totalDue.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Due</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">৳{totalPaid.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Paid</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">Jan 31, 2024</p>
                <p className="text-sm text-muted-foreground">Next Due Date</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending Payments ({pendingPayments.length})</TabsTrigger>
          <TabsTrigger value="history">Payment History</TabsTrigger>
          <TabsTrigger value="breakdown">Fee Breakdown</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <CardTitle>Pending Payments</CardTitle>
                  <CardDescription>Complete your pending fee payments before the due date</CardDescription>
                </div>
                <Button onClick={handlePayNow} disabled={totalDue === 0}>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay Now (৳{totalDue.toLocaleString()})
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {pendingPayments.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">All Caught Up!</h3>
                  <p className="text-muted-foreground">You have no pending payments.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingPayments.map((payment) => (
                    <div 
                      key={payment.id}
                      className={`border rounded-lg p-4 ${
                        payment.status === 'overdue' ? 'border-destructive bg-destructive/5' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          {getStatusIcon(payment.status)}
                          <div>
                            <h4 className="font-semibold">{payment.description}</h4>
                            <p className="text-sm text-muted-foreground">
                              Due: {new Date(payment.dueDate).toLocaleDateString('en-US', { 
                                year: 'numeric', month: 'long', day: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">৳{payment.amount.toLocaleString()}</p>
                          {getStatusBadge(payment.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium">Description</th>
                      <th className="text-left py-3 px-4 font-medium">Semester</th>
                      <th className="text-center py-3 px-4 font-medium">Amount</th>
                      <th className="text-center py-3 px-4 font-medium">Paid Date</th>
                      <th className="text-center py-3 px-4 font-medium">Status</th>
                      <th className="text-center py-3 px-4 font-medium">Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paidPayments.map((payment) => (
                      <tr key={payment.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <p className="font-medium">{payment.description}</p>
                          <p className="text-xs text-muted-foreground">{payment.transactionId}</p>
                        </td>
                        <td className="py-3 px-4">{payment.semester}</td>
                        <td className="py-3 px-4 text-center font-medium">
                          ৳{payment.amount.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {payment.paidDate && new Date(payment.paidDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {getStatusBadge(payment.status)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Semester Fee Breakdown</CardTitle>
              <CardDescription>Spring 2024 - BSc in Computer Science & Engineering</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b">
                  <span>Tuition Fee (15 Credits × ৳3,500)</span>
                  <span className="font-medium">৳{feeBreakdown.tuition.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span>Laboratory Fee</span>
                  <span className="font-medium">৳{feeBreakdown.labFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span>Library Fee</span>
                  <span className="font-medium">৳{feeBreakdown.libraryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span>Examination Fee</span>
                  <span className="font-medium">৳{feeBreakdown.examFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span>Development Fee</span>
                  <span className="font-medium">৳{feeBreakdown.developmentFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3 bg-primary/5 rounded-lg px-3">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-primary">৳{feeBreakdown.total.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Payment Methods Accepted</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">bKash</Badge>
                  <Badge variant="outline">Nagad</Badge>
                  <Badge variant="outline">Rocket</Badge>
                  <Badge variant="outline">Bank Transfer</Badge>
                  <Badge variant="outline">Debit/Credit Card</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
