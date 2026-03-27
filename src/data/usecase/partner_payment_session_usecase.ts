import { useEffect, useRef } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { partnerPaymentSessionRepository } from '../repositories/repository_impl/partner_payment_session_repository_impl';
import { paymentRequestRepository } from '../repositories/repository_impl/common_repository_impl';
import type { ResolvePartnerPaymentCodeRequest } from '../model/request';

export function usePartnerPaymentSessionQuery(id: string, enabled = true) {
  const preferLegacyRef = useRef(false);

  useEffect(() => {
    // Reset strategy whenever route id changes.
    preferLegacyRef.current = false;
  }, [id]);

  return useQuery({
    queryKey: ['partnerPaymentSession', id],
    queryFn: async () => {
      const createPaymentResponse = await paymentRequestRepository.getCreatePaymentById(id);
      if (!createPaymentResponse.error && createPaymentResponse.data) {
        const payload = unwrapPartnerPayload(createPaymentResponse.data);
        if (payload !== null && payload !== undefined) return payload;
      }

      if (preferLegacyRef.current) {
        return fetchLegacyPaymentPayload(id, true);
      }

      const response = await partnerPaymentSessionRepository.getPartnerPaymentSession(id);

      if (!response.error && response.data) {
        const payload = unwrapPartnerPayload(response.data);
        if (payload !== null && payload !== undefined) return payload;
      }

      if (shouldFallbackToPublicPay(response.error)) {
        preferLegacyRef.current = true;
        return fetchLegacyPaymentPayload(id, true);
      }

      if (createPaymentResponse.error && !shouldFallbackToPublicPay(createPaymentResponse.error)) {
        throw new Error(createPaymentResponse.error);
      }
      if (response.error) throw new Error(response.error);
      throw new Error('Failed to fetch partner payment session');
    },
    enabled: enabled && !!id,
    refetchInterval: (query) => {
      const status = (query.state.data as { status?: string } | undefined)?.status;
      return status === 'PENDING' ? 5000 : false;
    },
  });
}

async function fetchLegacyPaymentPayload(id: string, skipCreatePaymentFetch = false): Promise<unknown> {
  if (!skipCreatePaymentFetch) {
    const createPaymentResponse = await paymentRequestRepository.getCreatePaymentById(id);
    const createPaymentPayload = !createPaymentResponse.error && createPaymentResponse.data
      ? unwrapPartnerPayload(createPaymentResponse.data)
      : null;
    if (createPaymentPayload !== null && createPaymentPayload !== undefined) {
      return createPaymentPayload;
    }

    if (createPaymentResponse.error && !shouldFallbackToPublicPay(createPaymentResponse.error)) {
      throw new Error(createPaymentResponse.error);
    }
  }

  const resolvedResponse = await paymentRequestRepository.getResolvedPublicPaymentRequest(id);
  const resolvedPayload = !resolvedResponse.error && resolvedResponse.data
    ? unwrapPartnerPayload(resolvedResponse.data)
    : null;

  const fallbackResponse = await paymentRequestRepository.getPublicPaymentRequest(id);
  const fallbackPayload = !fallbackResponse.error && fallbackResponse.data
    ? unwrapPartnerPayload(fallbackResponse.data)
    : null;

  if (resolvedPayload && fallbackPayload && typeof resolvedPayload === 'object') {
    return {
      ...(resolvedPayload as Record<string, unknown>),
      legacy_pay_data: fallbackPayload,
    };
  }
  if (resolvedPayload !== null && resolvedPayload !== undefined) return resolvedPayload;
  if (fallbackPayload !== null && fallbackPayload !== undefined) return fallbackPayload;

  if (resolvedResponse.error) throw new Error(resolvedResponse.error);
  if (fallbackResponse.error) throw new Error(fallbackResponse.error);
  throw new Error('Failed to fetch payment request');
}

function unwrapPartnerPayload(input: unknown): unknown {
  if (!input || typeof input !== 'object') return input;

  const first = input as Record<string, unknown>;
  const level1 = first.data ?? input;
  if (!level1 || typeof level1 !== 'object') return level1;

  const second = level1 as Record<string, unknown>;
  return second.data ?? level1;
}

function shouldFallbackToPublicPay(error?: string): boolean {
  if (!error) return false;
  const lowered = error.toLowerCase();
  return lowered.includes('not found') || lowered.includes('404') || lowered.includes('record not found');
}

export function useResolvePartnerPaymentCodeMutation() {
  return useMutation({
    mutationFn: async (request: ResolvePartnerPaymentCodeRequest) => {
      const response = await partnerPaymentSessionRepository.resolvePartnerPaymentCode(request);
      if (response.error) throw new Error(response.error);
      if (!response.data) throw new Error('Failed to resolve partner payment code');
      return response.data;
    },
  });
}
