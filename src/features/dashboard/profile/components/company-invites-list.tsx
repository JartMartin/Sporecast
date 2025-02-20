import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CompanyInvite } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { CompanyInviteDialog } from "./company-invite-dialog";
import { Users, Copy, Clock } from "lucide-react";

interface CompanyInvitesListProps {
  companyId: string;
}

export function CompanyInvitesList({ companyId }: CompanyInvitesListProps) {
  const [invites, setInvites] = useState<CompanyInvite[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchInvites = async () => {
      try {
        const { data, error } = await supabase
          .from('company_invites')
          .select('*')
          .eq('company_id', companyId)
          .is('used_at', null)
          .gt('expires_at', new Date().toISOString())
          .order('created_at', { ascending: false });

        if (error) throw error;
        setInvites(data || []);
      } catch (error: any) {
        console.error('Error fetching invites:', error);
        toast({
          title: "Error",
          description: "Failed to load invites",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInvites();

    // Subscribe to changes
    const subscription = supabase
      .channel('company_invites_changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'company_invites',
        filter: `company_id=eq.${companyId}` 
      }, fetchInvites)
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [companyId, toast]);

  const copyInviteDetails = (invite: CompanyInvite) => {
    const inviteText = `Company ID: ${invite.company_id}\nInvite Code: ${invite.invite_code}`;
    navigator.clipboard.writeText(inviteText);
    toast({
      title: "Copied",
      description: "Invite details copied to clipboard",
    });
  };

  if (loading) {
    return (
      <div className="h-[100px] flex items-center justify-center">
        <div className="text-sm text-muted-foreground">Loading invites...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Active Invites</h4>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowInviteDialog(true)}
          className="gap-2"
        >
          <Users className="h-4 w-4" />
          Invite Member
        </Button>
      </div>

      <div className="space-y-3">
        {invites.length === 0 ? (
          <div className="text-sm text-muted-foreground text-center py-4">
            No active invites. Create one to add team members.
          </div>
        ) : (
          invites.map((invite) => (
            <Card key={invite.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    {invite.email && (
                      <span className="text-sm font-medium truncate">
                        {invite.email}
                      </span>
                    )}
                    <span className="text-xs px-1.5 py-0.5 bg-teal-50 text-teal-700 rounded-full">
                      {invite.company_role}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" />
                    <span>
                      Expires {new Date(invite.expires_at).toLocaleDateString()}
                    </span>
                  </div>
                  <code className="text-xs font-mono mt-2 block">
                    {invite.invite_code}
                  </code>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyInviteDetails(invite)}
                  className="flex-shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <CompanyInviteDialog
        open={showInviteDialog}
        onOpenChange={setShowInviteDialog}
        companyId={companyId}
      />
    </div>
  );
}