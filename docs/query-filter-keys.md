# Query Filter Keys (Frontend)

Dokumen ini jadi referensi key query URL untuk state filter/pagination halaman.

## Konvensi Umum

- Search text: `q`
- Pagination page: `page`
- Fallback kompatibilitas lama:
  - `search` masih dibaca jika `q` belum ada.

## Admin Pages

- `/admin/chains`
  - `q`, `page`

- `/admin/tokens`
  - `q`, `chainId`, `page`

- `/admin/rpcs`
  - `q`, `chainId`, `active`, `page`

- `/admin/contracts`
  - `q`, `chainId`, `type`, `page`

- `/admin/merchants`
  - `q`, `page`

- `/admin/users`
  - `q`, `page`

- `/admin/teams`
  - `q`

- `/admin/payment-bridges`
  - `page`

- `/admin/bridge-configs`
  - `sourceChainId`, `destChainId`, `bridgeId`, `page`

- `/admin/fee-configs`
  - `chainId`, `tokenId`, `page`

- `/admin/layerzero-configs`
  - `sourceChainId`, `destChainId`, `activeOnly`, `page`

- `/admin/route-policies`
  - `sourceChainId`, `destChainId`, `page`

- `/admin/crosschain-config`
  - `sourceChainId`, `destChainId`, `status`

## App / Payments

- `/app`
  - `chainId`, `destChainId`, `tokenAddress`, `destTokenAddress`, `amount`, `receiver`

- `/payments`
  - `page`

- `/payment-requests`
  - `page`

