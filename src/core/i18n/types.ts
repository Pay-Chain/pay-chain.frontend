export type Locale = 'en' | 'id';

export interface Dictionary {
  common: {
    dashboard: string;
    payments: string;
    wallets: string;
    settings: string;
    logout: string;
    loading: string;
    error: string;
    success: string;
    new: string;
    create: string;
    cancel: string;
    save: string;
    back: string;
    previous: string;
    next: string;
    page_of: string;
    of: string;
  };
  dashboard: {
    welcome: string;
    subtitle: string;
    newPayment: string;
    stats: {
      total_payments: string;
      total_volume: string;
      active_wallets: string;
      pending: string;
    };
    quick_actions: {
      title: string;
      create_payment: {
        title: string;
        subtitle: string;
      };
      manage_wallets: {
        title: string;
        subtitle: string;
      };
      history: {
        title: string;
        subtitle: string;
      };
      settings: {
        title: string;
        subtitle: string;
      };
    };
    recent_transactions: string;
  };
  nav: {
    more: string;
    merchant: string;
    paymentRequests: string;
  };
  payments: {
    title: string;
    new_payment: string;
    history: string;
    send_to: string;
    amount: string;
    select_token: string;
    select_chain: string;
    details: string;
    source_chain: string;
    dest_chain: string;
    receiver: string;
    token_address: string;
    connect_wallet_notice: string;
    confirm: string;
  };
  wallets: {
    title: string;
    connect: string;
    connected: string;
    disconnect: string;
    loading: string;
    no_wallets: string;
    primary: string;
    set_primary: string;
  };
  auth: {
    login: string;
    register: string;
    email: string;
    password: string;
    name: string;
    sign_in: string;
    sign_up: string;
    have_account: string;
    no_account: string;
    welcome: string;
    sign_in_subtitle: string;
    remember_me: string;
    forgot_password: string;
    create_one: string;
    create_account: string;
    create_account_subtitle: string;
    steps: {
      account: string;
      wallet: string;
    };
    confirm_password: string;
    continue_wallet: string;
    wallet_required: string;
    create_account_action: string;
  };
  payment_requests: {
    title: string;
    create: string;
    subtitle: string;
    loading: string;
    no_requests_title: string;
    no_requests_desc: string;
    token: string;
    native: string;
    status: string;
    copy_link: string;
    copied: string;
  };
  pay_page: {
    loading: string;
    expired_error: string;
    network_error: string;
    pay_with: string;
    expires_in: string;
    expired: string;
    amount: string;
    token: string;
    from: string;
    to: string;
    memo: string;
    confirm: string;
    processing: string;
    success: string;
    connect_wallet: string;
    switch_chain: string;
    insufficient_balance: string;
  };
  error_page: {
    title: string;
    desc: string;
    retry: string;
    go_home: string;
  };
}
