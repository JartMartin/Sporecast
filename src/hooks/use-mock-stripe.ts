import { useState } from 'react';
import { useToast } from './use-toast';
import { mockStripe } from '@/lib/mock-stripe';

export function useMockStripe() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const createCheckoutSession = async (commodityId: string) => {
    setLoading(true);
    try {
      const session = await mockStripe.createCheckoutSession(commodityId);
      
      // Simulate successful payment
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to success URL
      window.location.href = session.success_url;
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelSubscription = async (commodityId: string) => {
    setLoading(true);
    try {
      await mockStripe.cancelSubscription(commodityId);
      
      toast({
        title: "Success",
        description: "Your subscription has been canceled.",
      });
    } catch (error: any) {
      console.error('Cancel error:', error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    createCheckoutSession,
    cancelSubscription
  };
}