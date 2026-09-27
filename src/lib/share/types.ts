export type ShareSnapshot = {
  note: string;
  createdAt: string;
};

export type EncryptedShare = {
  iv: string;
  ciphertext: string;
};

export type ShareCreateRequest = {
  ciphertext: string;
  iv: string;
  expiresAt: string;
  revokeTokenHash: string;
  viewCodeHash?: string;
};

export type ShareLocal = {
  id: string;
  createdAt: string;
  revokeToken: string;
  expiresAt: string;
};
