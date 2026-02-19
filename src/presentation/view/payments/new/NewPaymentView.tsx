'use client';

import { Button, Input, Label } from '@/presentation/components/atoms';
import { useNewPayment } from './useNewPayment';
import { ArrowLeft, Send, AlertTriangle, Wallet } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/presentation/hooks';
import { useChainsQuery, useTokensQuery } from '@/data/usecase';
import { ChainSelector } from '@/presentation/components/organisms/ChainSelector';
import { TokenSelector } from '@/presentation/components/organisms/TokenSelector';
import { ChainItemData } from '@/presentation/components/molecules/ChainListItem';
import { TokenItemData } from '@/presentation/components/molecules/TokenListItem';
import { WalletConnectButton } from '@/presentation/components/molecules';
import { useBalance } from 'wagmi';
import { sanitizeNumber } from '@/core/utils/converters';
import { validateAddress, sanitizeNumberWithDecimals, formatMoneyDisplay, stripMoneyFormat } from '@/core/utils/validators';
import { formatUnits } from 'viem';
import { useMemo, useCallback, useState, useEffect } from 'react';


export function NewPaymentView() {
  const {
    form,
    loading,
    error,
    handleSubmit,
    primaryWallet,
    handleSourceChainSelect,
    handleDestChainSelect,
    handleTokenSelect,
    sourceChainId,
    destChainId,
    sourceTokenAddress,
    setValue,
  } = useNewPayment();
  const { t } = useTranslation();

  // Data fetching
  const { data: chains } = useChainsQuery();
  const { data: tokens } = useTokensQuery();

  // Map data to selector formats (include chainType for address validation)
  const chainItems: ChainItemData[] = useMemo(() =>
    chains?.items?.map(c => ({
      id: c.id.toString(),
      networkId: c.id.toString(),
      name: c.name,
      logoUrl: c.logoUrl,
      chainType: c.chainType,
    })) || [],
    [chains]
  );

  const tokenItems: TokenItemData[] = useMemo(() =>
    (tokens?.items as any[])?.map((t: any) => ({
      id: t.id,
      symbol: t.symbol,
      name: t.name,
      logoUrl: t.logoUrl,
      address: t.contractAddress,
      isNative: t.isNative,
      chainId: t.chainId,
      decimals: t.decimals,
    })) || [],
    [tokens]
  );

  const filteredTokens = useMemo(() => {
    if (!sourceChainId) return [];
    return tokenItems.filter(t => t.chainId === sourceChainId);
  }, [tokenItems, sourceChainId]);

  // Derive dest chain type for address validation
  const destChainType = useMemo(() => {
    if (!destChainId) return '';
    const chain = chainItems.find(c => c.id === destChainId);
    return (chain as any)?.chainType || '';
  }, [chainItems, destChainId]);

  // Derive selected token info for money formatter
  const selectedToken = useMemo(() => {
    if (!sourceTokenAddress) return null;
    return tokenItems.find(
      t => t.address === sourceTokenAddress ||
        (t.isNative && sourceTokenAddress === '0x0000000000000000000000000000000000000000')
    ) || null;
  }, [tokenItems, sourceTokenAddress]);

  const selectedTokenDecimals = selectedToken?.decimals ?? 18;
  const selectedTokenSymbol = selectedToken?.symbol ?? '';

  // Wagmi hooks for balance
  const { data: balanceData } = useBalance({
    address: primaryWallet?.address as `0x${string}`,
    // @ts-ignore - useBalance in v2 takes token
    token: (sourceTokenAddress === '0x0000000000000000000000000000000000000000' || !sourceTokenAddress)
      ? undefined
      : sourceTokenAddress as `0x${string}`,
    query: {
      enabled: !!primaryWallet?.address && !!sourceChainId,
    }
  });

  const formattedBalance = useMemo(() => {
    if (!balanceData) return '0';
    return formatUnits(balanceData.value, balanceData.decimals);
  }, [balanceData]);

  // Controlled display state for money formatting
  const [displayAmount, setDisplayAmount] = useState('');

  // Reset display when token changes
  useEffect(() => {
    setDisplayAmount('');
  }, [sourceTokenAddress]);

  const handleMaxClick = () => {
    if (formattedBalance) {
      const sanitized = sanitizeNumber(formattedBalance);
      setValue('amount', sanitized, { shouldValidate: true });
      setDisplayAmount(formatMoneyDisplay(sanitized));
    }
  };

  // Amount onChange: strip formatting → sanitize decimals → store raw in form → format for display
  const handleAmountChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = stripMoneyFormat(e.target.value);
    const sanitized = sanitizeNumberWithDecimals(raw, selectedTokenDecimals);
    setValue('amount', sanitized, { shouldValidate: true });
    setDisplayAmount(formatMoneyDisplay(sanitized));
  }, [selectedTokenDecimals, setValue]);

  // Real-time address validation — uses independent state (form.setError gets overridden by zodResolver)
  const receiverAddress = form.watch('receiverAddress');
  const [addressError, setAddressError] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (!receiverAddress || !destChainType) {
      setAddressError(undefined);
      return;
    }
    const result = validateAddress(receiverAddress, destChainType);
    if (result !== true) {
      setAddressError(result as string);
    } else {
      setAddressError(undefined);
    }
  }, [receiverAddress, destChainType]);

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="p-2 -ml-2 rounded-full hover:bg-white/5 transition-all duration-300 group"
        >
          <ArrowLeft className="w-5 h-5 text-muted group-hover:text-foreground transition-colors" />
        </Link>
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-purple/10 border border-accent-purple/20 mb-2">
            <Send className="w-3 h-3 text-accent-purple" />
            <span className="text-xs text-accent-purple font-medium">{t('payments.new_transfer_badge')}</span>
          </div>
          <h1 className="heading-2 text-foreground">{t('payments.new_payment')}</h1>
        </div>
      </div>

      {/* Form Card */}
      <div className="card-glass p-8 shadow-glass">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Payment Details Section */}
          <div className="space-y-6">
            <h2 className="heading-3 text-foreground flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent-purple/10 flex items-center justify-center">
                <span className="text-accent-purple text-sm font-bold">1</span>
              </div>
              {t('payments.details')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <ChainSelector
                  label={t('payments.source_chain')}
                  chains={chainItems}
                  selectedChainId={sourceChainId}
                  onSelect={handleSourceChainSelect}
                  placeholder={t('payments.select_source_chain')}
                />
                {form.formState.errors.sourceChainId && (
                  <p className="text-sm font-medium text-destructive animate-in slide-in-from-top-1 fade-in-20">
                    {form.formState.errors.sourceChainId.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <ChainSelector
                  label={t('payments.dest_chain')}
                  chains={chainItems}
                  selectedChainId={destChainId}
                  onSelect={handleDestChainSelect}
                  placeholder={t('payments.select_destination_chain')}
                />
                {form.formState.errors.destChainId && (
                  <p className="text-sm font-medium text-destructive animate-in slide-in-from-top-1 fade-in-20">
                    {form.formState.errors.destChainId.message}
                  </p>
                )}
              </div>
            </div>

            {/* Receiver Address — disabled until dest chain selected */}
            <Input
              label={t('payments.receiver')}
              placeholder={destChainId ? '0x...' : t('payments.select_destination_chain_first')}
              disabled={!destChainId}
              {...form.register('receiverAddress')}
              error={addressError || form.formState.errors.receiverAddress?.message}
            />

            {/* Token and Amount */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <TokenSelector
                  label={t('payments.token_address')}
                  tokens={filteredTokens}
                  selectedTokenId={tokenItems.find(t => t.address === sourceTokenAddress || (t.isNative && sourceTokenAddress === '0x0000000000000000000000000000000000000000'))?.id}
                  onSelect={handleTokenSelect}
                  disabled={!sourceChainId}
                  placeholder={sourceChainId ? t('payments.select_token') : t('payments.select_chain_first')}
                />
                {form.formState.errors.sourceTokenAddress && (
                  <p className="text-sm font-medium text-destructive animate-in slide-in-from-top-1 fade-in-20">
                    {form.formState.errors.sourceTokenAddress.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label className="flex justify-between items-center text-sm font-medium text-foreground/80 ml-1 mb-1.5">
                  {t('payments.amount')}
                  {balanceData && (
                    <span className="text-xs text-muted-foreground">
                      Max: {formattedBalance} {balanceData.symbol}
                    </span>
                  )}
                </Label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder={sourceTokenAddress ? '0' : t('payments.select_token_first')}
                    disabled={!sourceTokenAddress}
                    value={displayAmount}
                    onChange={handleAmountChange}
                    className="pr-24"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {selectedTokenSymbol && (
                      <span className="text-xs font-medium text-muted-foreground select-none">
                        {selectedTokenSymbol}
                      </span>
                    )}
                    {balanceData && (
                      <button
                        type="button"
                        onClick={handleMaxClick}
                        className="text-xs font-bold text-accent-purple hover:text-accent-purple/80 transition-colors bg-accent-purple/10 hover:bg-accent-purple/20 px-2 py-1 rounded"
                      >
                        MAX
                      </button>
                    )}
                  </div>
                </div>
                {form.formState.errors.amount && (
                  <p className="text-sm font-medium text-destructive animate-in slide-in-from-top-1 fade-in-20">
                    {form.formState.errors.amount.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Notices */}
          {!primaryWallet && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 animate-fade-in">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                <Wallet className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-amber-200 font-medium">{t('payments.connect_wallet_notice')}</p>
                <p className="text-amber-200/60 text-sm mt-1">{t('payments.connect_wallet_continue_notice')}</p>
                <div className="mt-3">
                  <WalletConnectButton size="sm" connectLabel={t('common.connect')} />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 animate-fade-in">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-red-400 font-medium">{t('payments.error_label')}</p>
                <p className="text-red-400/80 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {form.formState.errors.root && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 animate-fade-in">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-red-400 font-medium">{t('payments.form_error_label')}</p>
                <p className="text-red-400/80 text-sm mt-1">{form.formState.errors.root.message}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 flex justify-end gap-3 border-t border-white/10">
            <Link href="/dashboard">
              <Button type="button" variant="ghost">{t('common.cancel')}</Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              disabled={!primaryWallet || loading}
              glow
            >
              <Send className="w-4 h-4" />
              {t('payments.confirm')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
