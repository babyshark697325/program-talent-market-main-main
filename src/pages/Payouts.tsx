
import React, { useEffect, useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Payout {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
}

const Payouts: React.FC = () => {
  const { user } = useAuth();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    supabase
      .from('payments')
      .select('id, amount, currency, status, created_at')
      .eq('payee_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          setError('Failed to load payouts.');
          setPayouts([]);
        } else {
          setPayouts(data || []);
          setError(null);
        }
        setLoading(false);
      });
  }, [user]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <PageHeader title="Payouts" description="View recent payouts and statuses" />
      <Card>
        <CardHeader>
          <CardTitle>Recent Payouts</CardTitle>
          <CardDescription>History will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : payouts.length === 0 ? (
            <p className="text-sm text-muted-foreground">No payouts yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Amount</th>
                    <th className="px-4 py-2 text-left">Currency</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payouts.map((payout) => (
                    <tr key={payout.id}>
                      <td className="px-4 py-2">{new Date(payout.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-2">{payout.amount.toFixed(2)}</td>
                      <td className="px-4 py-2">{payout.currency}</td>
                      <td className="px-4 py-2 capitalize">{payout.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Payouts;
