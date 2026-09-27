import type { PlanetVisual } from "@/lib/emotion/types";
import type { Temperament } from "@/lib/temperament/types";

export type ShareSnapshot = {
  temperament: Temperament;
  status: {
    label: string;
    intensity: 1 | 2 | 3 | 4 | 5;
    visual: PlanetVisual;
    note?: string;
  };
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
