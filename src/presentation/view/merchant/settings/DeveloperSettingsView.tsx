'use client';

import React, { useState } from 'react';
import { useDeveloperSettings } from './useDeveloperSettings';
import { BaseModal } from '@/presentation/components/molecules';
import { Button, Card, Input, Switch } from '@/presentation/components/atoms';
import { 
  KeyRound, 
  Webhook, 
  Activity, 
  Copy, 
  Check, 
  ShieldAlert, 
  RefreshCw,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { useTranslation } from '@/presentation/hooks';

export default function DeveloperSettingsView() {
  const { t } = useTranslation();
  const {
    merchant,
    apiKeys,
    webhookLogs,
    isLoading,
    callbackUrl,
    setCallbackUrl,
    webhookActive,
    setWebhookActive,
    isUpdating,
    isTesting,
    handleUpdateWebhook,
    handleTestPing,
    handleCreateApiKey,
    handleRevokeApiKey,
  } = useDeveloperSettings();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const onHandleCreateApiKey = async () => {
    try {
      const result = await handleCreateApiKey(newKeyName);
      if (result) {
        setCreatedSecret(result.secretKey);
      }
    } catch (error) {
      // Error handled in hook
    }
  };

  const handleCopySecret = async () => {
    if (!createdSecret) return;
    await navigator.clipboard.writeText(createdSecret);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCreatedSecret(null);
    setNewKeyName('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-20">
        <RefreshCw className="w-8 h-8 animate-spin text-accent-green" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">Developer Hub</h1>
          <p className="text-muted">Manage your API keys, webhooks, and technical integration.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: API Keys & Webhook Settings */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Webhook Configuration */}
          <Card className="p-6 bg-white/5 border-white/10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent-blue/20 text-accent-blue">
                  <Webhook className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Webhook Settings</h2>
                  <p className="text-sm text-muted">Receive real-time notifications for payment events.</p>
                </div>
              </div>
              <Switch 
                checked={webhookActive} 
                onChange={setWebhookActive} 
                label={webhookActive ? "Enabled" : "Disabled"}
              />
            </div>

            <div className="space-y-4">
              <Input
                label="Endpoint URL"
                placeholder="https://your-domain.com/webhook"
                value={callbackUrl}
                onChange={(e) => setCallbackUrl(e.target.value)}
                description="We'll send POST requests to this URL with an HMAC-SHA256 signature."
              />
              
              <div className="flex gap-3">
                <Button 
                  onClick={handleUpdateWebhook} 
                  loading={isUpdating}
                  variant="primary"
                >
                  Save Changes
                </Button>
                <Button 
                  onClick={handleTestPing} 
                  loading={isTesting}
                  variant="secondary"
                  className="gap-2"
                >
                  <Activity className="w-4 h-4" />
                  Send Test Ping
                </Button>
              </div>
            </div>

            {merchant?.webhookSecret && (
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted uppercase">Signing Secret</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <code className="text-sm font-mono text-foreground break-all">
                    {merchant.webhookSecret.substring(0, 16).replace(/./g, '*')}
                  </code>
                  <Button variant="ghost" size="sm" className="h-8 text-accent-green hover:bg-accent-green/10">
                    <Check className="w-3.5 h-3.5 mr-2" />
                    Secure
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* API Keys Management */}
          <Card className="p-0 overflow-hidden bg-white/5 border-white/10">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent-green/20 text-accent-green">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">API Keys</h2>
                  <p className="text-sm text-muted">Use these keys to authenticate your server-side requests.</p>
                </div>
              </div>
              <Button onClick={() => setIsModalOpen(true)} variant="primary" size="sm" className="gap-2">
                <KeyRound className="w-4 h-4" />
                Create New Key
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-white/5 text-left text-xs font-medium text-muted uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Key ID</th>
                    <th className="px-6 py-4">Created</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {apiKeys?.map((key: any) => (
                    <tr key={key.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{key.name || 'Untitled'}</td>
                      <td className="px-6 py-4 text-sm font-mono text-muted">{key.keyHash.substring(0, 12)}...</td>
                      <td className="px-6 py-4 text-sm text-muted">{new Date(key.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        {key.isActive ? (
                          <Button onClick={() => handleRevokeApiKey(key.id)} variant="danger" size="sm">
                            Revoke
                          </Button>
                        ) : (
                          <span className="text-xs text-red-400 font-medium">Revoked</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Column: Webhook Logs */}
        <div className="space-y-6">
          <Card className="p-6 bg-white/5 border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Activity className="w-5 h-5 text-accent-purple" />
                Delivery Logs
              </div>
              <Button variant="ghost" size="sm" onClick={() => {}} className="text-muted hover:text-foreground p-0 h-auto">
                View all <ChevronRight className="w-4 h-4 inline" />
              </Button>
            </div>

            <div className="space-y-4">
              {webhookLogs?.items?.map((log: any) => (
                <div key={log.id} className="p-4 rounded-xl border border-white/10 bg-black/20 hover:bg-black/30 transition-all group">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground group-hover:text-accent-green transition-colors">
                        {log.eventType.replace('_', ' ')}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted">
                        <Clock className="w-3 h-3" />
                        {new Date(log.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                    <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      log.deliveryStatus === 'delivered' ? 'bg-emerald-500/10 text-emerald-400' :
                      log.deliveryStatus === 'failed' ? 'bg-red-500/10 text-red-400' :
                      'bg-amber-500/10 text-amber-400'
                    }`}>
                      {log.deliveryStatus}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-mono text-muted">
                      {log.httpStatus || '---'} {log.httpStatus === 200 ? 'OK' : ''}
                    </span>
                    <button className="text-[10px] text-accent-blue opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      Details <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              ))}
              {(!webhookLogs?.items || webhookLogs.items.length === 0) && (
                <div className="text-center py-10 text-muted italic space-y-2">
                  <Activity className="w-8 h-8 mx-auto opacity-20" />
                  <p>No webhook attempts yet</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* API Key Modal */}
      <BaseModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={createdSecret ? 'API Key Created' : 'Create New API Key'}
        description={createdSecret ? 'Please save this secret key safely. You will not be able to see it again.' : 'Give your key a name to identify it later.'}
        onConfirm={createdSecret ? closeModal : onHandleCreateApiKey}
        confirmLabel={createdSecret ? 'I have saved it' : 'Create Key'}
        isConfirmDisabled={!createdSecret && !newKeyName}
      >
        {createdSecret ? (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-200 text-sm flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 mt-0.5 shrink-0" />
              <span>Warning: This secret will be shown only once.</span>
            </div>
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 break-all font-mono text-sm text-foreground">
              {createdSecret}
            </div>
            <Button type="button" variant="secondary" onClick={handleCopySecret} className="w-full gap-2">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy Secret Key'}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Input
              label="Key Name"
              placeholder="e.g. Production Server"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              autoFocus
            />
          </div>
        )}
      </BaseModal>
    </div>
  );
}
