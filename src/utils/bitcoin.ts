import * as bitcoin from 'bitcoinjs-lib';
import { ECPairFactory } from 'ecpair';
import * as secp256k1 from 'tiny-secp256k1';

const ECPair = ECPairFactory(secp256k1);

export function isValidPrivateKey(privateKey: string): boolean {
  try {
    const buffer = Buffer.from(privateKey, 'hex');
    return buffer.length === 32;
  } catch {
    return false;
  }
}

export function privateKeyToAddress(privateKey: string): string {
  try {
    const keyPair = ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'));
    const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
    return address || '';
  } catch {
    return '';
  }
}

export function isInRange(privateKey: string, start: string, end: string): boolean {
  const pkNum = BigInt(`0x${privateKey}`);
  const startNum = BigInt(`0x${start}`);
  const endNum = BigInt(`0x${end}`);
  return pkNum >= startNum && pkNum <= endNum;
}