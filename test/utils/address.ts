export function validAddress(value: string) {
  return /^0x[a-fA-F0-9]{40}$/i.test(value);
}
