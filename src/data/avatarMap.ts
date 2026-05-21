export const avatarMap: Record<string, string> = {
  NFAX: './images/avatar-nfax.png', NFAS: './images/avatar-nfas.png',
  NFCX: './images/avatar-nfcx.png', NFCS: './images/avatar-nfcs.png',
  NTAX: './images/avatar-ntax.png', NTAS: './images/avatar-ntas.png',
  NTCX: './images/avatar-ntcx.png', NTCS: './images/avatar-ntcs.png',
  SFAX: './images/avatar-sfax.png', SFAS: './images/avatar-sfas.png',
  SFCX: './images/avatar-sfcx.png', SFCS: './images/avatar-sfcs.png',
  STAX: './images/avatar-stax.png', STAS: './images/avatar-stas.png',
  STCX: './images/avatar-stcx.png', STCS: './images/avatar-stcs.png',
};

export function getAvatar(code: string): string {
  return avatarMap[code] || './images/avatar-nfax.png';
}
