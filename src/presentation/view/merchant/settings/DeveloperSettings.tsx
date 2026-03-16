'use client';

import React, { useState, useEffect } from "react";
import { 
  Copy, 
  RefreshCcw, 
  Wifi, 
  WifiOff, 
  Terminal, 
  Save, 
  CheckCircle, 
  ShieldCheck,
  Key,
  ShieldAlert,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Database
} from "lucide-react";
import { toast } from "sonner";
import { 
  merchantRepository, 
  webhookRepository,
  apiKeyRepository 
} from "@/data/repositories/repository_impl";
import { useWebhookSettings } from "@/presentation/hooks/useWebhookSettings";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, Button, Input, Switch } from "@/presentation/components/atoms";
import { BaseModal } from "@/presentation/components/molecules";

/**
 * DeveloperSettings Component
 * 
 * Implements Phase 6.2: Merchant Self-Service Interface (Frontend Deep Dive).
 * Features a premium, dark-themed UI for managing Webhooks and API Keys.
 */
export const DeveloperSettings = () => {
    const queryClient = useQueryClient();
    const { status: pingStatus, sendTestPing } = useWebhookSettings();
    
    // State
    const [webhookUrl, setWebhookUrl] = useState("");
    const [isActive, setIsActive] = useState(false);
    const [merchant, setMerchant] = useState<any>(null);
    const [logs, setLogs] = useState<any[]>([]);
    const [apiKeys, setApiKeys] = useState<any[]>([]);
    const [isUpdating, setIsUpdating] = useState(false);
    
    // Key Modal State
    const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
    const [newKeyName, setNewKeyName] = useState("");
    const [createdSecret, setCreatedSecret] = useState<string | null>(null);

    // Fetch Initial Data
    useEffect(() => {
        const load = async () => {
            try {
                const [mRes, logRes, keyRes] = await Promise.all([
                    merchantRepository.getMe(),
                    webhookRepository.listLogs(1, 10),
                    apiKeyRepository.getApiKeys()
                ]);
                
                if (mRes.data) {
                    setMerchant(mRes.data);
                    setWebhookUrl(mRes.data.callbackUrl || "");
                    setIsActive(mRes.data.webhookIsActive || false);
                }
                if (logRes.data) setLogs(logRes.data.items || []);
                if (keyRes.data) setApiKeys(keyRes.data || []);
            } catch (e) {
                console.error("Failed to load settings data", e);
            }
        };
        load();
    }, []);

    const handleUpdate = async () => {
        setIsUpdating(true);
        try {
            const res = await merchantRepository.updateSettings({
                callbackUrl: webhookUrl,
                webhookIsActive: isActive
            });
            if (res.error) throw new Error(res.error);
            toast.success("Settings saved successfully");
            queryClient.invalidateQueries({ queryKey: ['merchant', 'me'] });
        } catch (e: any) {
            toast.error(e.message || "Failed to update settings");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleCreateKey = async () => {
        try {
            const res = await apiKeyRepository.createApiKey({ name: newKeyName, permissions: [] });
            if (res.data) {
                setCreatedSecret(res.data.secretKey);
                // Refresh keys
                const keyRes = await apiKeyRepository.getApiKeys();
                if (keyRes.data) setApiKeys(keyRes.data);
            }
        } catch (e) {
            toast.error("Failed to create API key");
        }
    };

    const handleRevokeKey = async (id: string) => {
        if (!confirm("Are you sure you want to revoke this API key?")) return;
        try {
            await apiKeyRepository.revokeApiKey(id);
            toast.success("API Key revoked");
            setApiKeys(prev => prev.map(k => k.id === id ? { ...k, isActive: false } : k));
        } catch (e) {
            toast.error("Failed to revoke key");
        }
    };

    return (
        <div className="p-4 md:p-12 space-y-12 bg-black min-h-screen text-slate-200">
             <div className="max-w-7xl mx-auto space-y-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tighter text-white">Developer Hub</h1>
                        <p className="text-slate-400 text-lg">Infrastructure settings for your merchant environment.</p>
                    </div>
                    <div className="flex gap-4">
                        <button 
                            onClick={handleUpdate} 
                            disabled={isUpdating}
                            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
                        >
                            {isUpdating ? <RefreshCcw className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
                            Save Changes
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-8">
                    {/* Left Panel: Configuration & Logs */}
                    <div className="col-span-12 lg:col-span-8 space-y-8">
                        
                        {/* Webhook Section */}
                        <section className="bg-slate-900/40 border border-slate-800 rounded-[32px] p-10 backdrop-blur-3xl overflow-hidden relative shadow-2xl">
                             <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                                <ShieldCheck size={180}/>
                             </div>
                             
                             <div className="flex justify-between items-center mb-10">
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <div className="bg-blue-500/10 p-2 rounded-xl text-blue-500">
                                        <Terminal size={24}/>
                                    </div>
                                    Webhook Notifications
                                </h2>
                                <button 
                                    onClick={() => sendTestPing(webhookUrl)}
                                    disabled={pingStatus === 'LOADING'}
                                    className="text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-full transition-all flex items-center gap-2"
                                >
                                    {pingStatus === 'LOADING' ? <RefreshCcw className="animate-spin w-3 h-3" /> : <Wifi className="w-3 h-3"/>}
                                    Send Test Ping
                                </button>
                             </div>

                             <div className="space-y-10">
                                <div>
                                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-4 ml-1">Payload Destination</label>
                                    <div className="relative">
                                        <input 
                                            className="w-full bg-slate-950 border-2 border-slate-800 p-6 rounded-2xl text-white font-mono text-lg focus:border-blue-500 transition-all shadow-inner outline-none pr-12"
                                            placeholder="https://hooks.yourdomain.com/v1/payments"
                                            value={webhookUrl}
                                            onChange={e => setWebhookUrl(e.target.value)}
                                        />
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-700">
                                            <Database size={20}/>
                                        </div>
                                    </div>
                                    <p className="text-slate-500 text-sm mt-4 flex items-center gap-2">
                                        <HelpCircle size={14}/>
                                        We recommend using a dedicated, authenticated endpoint for secure processing.
                                    </p>
                                </div>

                                <div className="p-8 bg-slate-950/50 border border-slate-800/80 rounded-2xl space-y-6">
                                    <div className="flex justify-between items-center">
                                        <div className="space-y-1">
                                            <h4 className="text-white font-bold text-lg">Active Traffic</h4>
                                            <p className="text-slate-500 text-sm">Send live notification data to your server.</p>
                                        </div>
                                        <button 
                                            onClick={() => setIsActive(!isActive)}
                                            className={`w-16 h-9 rounded-full relative transition-colors duration-300 ${isActive ? 'bg-green-600' : 'bg-slate-700'}`}
                                        >
                                            <div className={`w-7 h-7 bg-white rounded-full absolute top-1 left-1 transition-transform duration-300 ${isActive ? 'translate-x-7' : 'translate-x-0'} shadow-lg`} />
                                        </button>
                                    </div>
                                </div>
                             </div>

                             {merchant?.webhookSecret && (
                                <div className="mt-8 pt-8 border-t border-slate-800 flex items-center justify-between">
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Signing Secret</span>
                                        <div className="flex items-center gap-3">
                                            <code className="text-sm font-mono text-slate-400">
                                                {merchant.webhookSecret.substring(0, 16)}••••••••••••••••
                                            </code>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-slate-500 hover:text-white" onClick={() => {
                                        navigator.clipboard.writeText(merchant.webhookSecret);
                                        toast.success("Secret copied");
                                    }}>
                                        <Copy size={16}/>
                                    </Button>
                                </div>
                             )}
                        </section>

                        {/* API Keys Section */}
                        <section className="bg-slate-900/40 border border-slate-800 rounded-[32px] overflow-hidden backdrop-blur-3xl shadow-2xl">
                             <div className="p-8 border-b border-slate-800 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Key className="text-green-500" size={20}/>
                                    API Keys
                                </h3>
                                <button 
                                    onClick={() => { setIsKeyModalOpen(true); setCreatedSecret(null); }}
                                    className="text-xs font-bold text-green-500 hover:text-green-400 flex items-center gap-2 transition-colors"
                                >
                                    <RefreshCcw size={14}/>
                                    Generate New Key
                                </button>
                             </div>
                             <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-950/50 text-slate-600 text-[10px] font-black uppercase tracking-widest">
                                        <tr>
                                            <th className="px-8 py-4 text-slate-500">Name</th>
                                            <th className="px-8 py-4">Key Fingerprint</th>
                                            <th className="px-8 py-4">Status</th>
                                            <th className="px-8 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/50">
                                        {apiKeys.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-8 py-10 text-center text-slate-600 italic">No API keys generated yet</td>
                                            </tr>
                                        ) : apiKeys.map(key => (
                                            <tr key={key.id} className="hover:bg-slate-800/20 transition-all group">
                                                <td className="px-8 py-6 font-bold text-white text-sm">{key.name || 'Untitled'}</td>
                                                <td className="px-8 py-6 font-mono text-xs text-slate-500">
                                                    {key.keyHash?.substring(0, 12)}••••
                                                </td>
                                                <td className="px-8 py-6">
                                                    {key.isActive ? (
                                                        <span className="flex items-center gap-1.5 text-green-500 text-[10px] font-black uppercase">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                            Active
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-600 text-[10px] font-black uppercase">Revoked</span>
                                                    )}
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    {key.isActive && (
                                                        <button 
                                                            onClick={() => handleRevokeKey(key.id)}
                                                            className="text-red-500/50 hover:text-red-500 transition-colors"
                                                        >
                                                            <ShieldAlert size={18}/>
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                             </div>
                        </section>

                        {/* Recent Activity / Logs */}
                        <section className="bg-slate-900/40 border border-slate-800 rounded-[32px] overflow-hidden backdrop-blur-3xl shadow-2xl">
                             <div className="p-8 border-b border-slate-800 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white">Delivery History</h3>
                                <div className="text-slate-500 text-sm font-medium flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
                                    Live Stream
                                </div>
                             </div>
                             <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-950/50 text-slate-600 text-[10px] font-black uppercase tracking-widest">
                                        <tr>
                                            <th className="px-8 py-4">Event Type</th>
                                            <th className="px-8 py-4">Status</th>
                                            <th className="px-8 py-4">HTTP</th>
                                            <th className="px-8 py-4 text-right">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/50">
                                        {logs.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="px-8 py-10 text-center text-slate-600 italic">No webhook activity recorded</td>
                                            </tr>
                                        ) : logs.map(log => (
                                            <tr key={log.id} className="hover:bg-slate-800/20 transition-all cursor-pointer group">
                                                <td className="px-8 py-6">
                                                    <span className="font-bold text-white text-sm">{log.eventType}</span>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-[10px] font-black uppercase ${
                                                            log.deliveryStatus === 'delivered' ? 'text-green-500' : 
                                                            log.deliveryStatus === 'failed' ? 'text-red-500' : 'text-amber-500'
                                                        }`}>
                                                            {log.deliveryStatus}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 font-mono text-xs text-slate-500">
                                                    {log.httpStatus || "---"}
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <span className="text-slate-500 text-sm font-medium">
                                                        {new Date(log.createdAt).toLocaleTimeString()}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                             </div>
                        </section>
                    </div>

                    {/* Right Panel: Support & Ecosystem */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        <section className="bg-linear-to-br from-blue-600 to-indigo-700 rounded-[32px] p-10 text-white shadow-2xl shadow-blue-500/30 group">
                             <Wifi className="mb-6 group-hover:scale-110 transition-transform" size={48}/>
                             <h4 className="text-2xl font-black mb-4 leading-tight tracking-tight">Reliable Pipeline</h4>
                             <p className="text-blue-100 mb-8 font-medium text-lg leading-relaxed opacity-90">
                                We utilize a 10-tier retry system with exponential backoff to ensure your critical payment data arrives safely.
                             </p>
                             <button className="w-full bg-white text-blue-600 font-bold py-4 rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-xl">
                                Documentation 
                                <ExternalLink size={18}/>
                             </button>
                        </section>

                        <section className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 space-y-6">
                             <h5 className="text-white font-bold text-lg flex items-center gap-2">
                                <ShieldAlert className="text-amber-500" size={20}/>
                                Security Notice
                             </h5>
                             <p className="text-slate-400 text-sm leading-relaxed">
                                Always verify the <code className="text-blue-400">X-Webhook-Signature</code> header in your endpoint to ensure payloads originate from PaymentKita.
                             </p>
                             <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                                <div className="text-[10px] font-black text-slate-600 uppercase mb-2">Algorithm</div>
                                <div className="text-slate-300 font-mono text-sm">HMAC-SHA256</div>
                             </div>
                        </section>
                    </div>
                </div>
             </div>

             {/* API Key Modal */}
             <BaseModal
                isOpen={isKeyModalOpen}
                onClose={() => setIsKeyModalOpen(false)}
                title={createdSecret ? "API Key Generated" : "New Environment Key"}
                onConfirm={createdSecret ? () => setIsKeyModalOpen(false) : handleCreateKey}
                confirmLabel={createdSecret ? "Close" : "Generate Key"}
             >
                {createdSecret ? (
                    <div className="space-y-6">
                        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3">
                            <ShieldAlert className="text-amber-500 shrink-0" size={20}/>
                            <p className="text-amber-200 text-sm">
                                This secret will only be shown once. Please store it securely in your environment variables.
                            </p>
                        </div>
                        <div className="p-6 bg-slate-950 border border-slate-800 rounded-xl relative group">
                            <code className="text-white font-mono break-all text-sm">{createdSecret}</code>
                            <button 
                                onClick={() => {
                                    navigator.clipboard.writeText(createdSecret);
                                    toast.success("Secret copied");
                                }}
                                className="absolute right-4 top-4 text-slate-500 hover:text-white transition-all p-2 bg-slate-900 rounded-lg opacity-0 group-hover:opacity-100"
                            >
                                <Copy size={16}/>
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest block mb-1">Key Name</label>
                        <Input 
                            placeholder="e.g. Production Web Service"
                            value={newKeyName}
                            onChange={e => setNewKeyName(e.target.value)}
                        />
                    </div>
                )}
             </BaseModal>
        </div>
    );
};

export default DeveloperSettings;
