import {CashuMint, CashuWallet, getEncodedToken} from '@cashu/cashu-ts'

let mintUrl = 'http://localhost:3338'
const unit = 'sat'

export function setMintUrl (url) {
  mintUrl = url
}

export async function createMintQuote (amount, description = '') {
  const mint = new CashuMint(mintUrl)
  const wallet = new CashuWallet(mint, {unit})
  const quote = await wallet.createMintQuote(amount, description)
  return quote
}

export async function mintProofs (amount, quoteId) {
  const mint = new CashuMint(mintUrl)
  const wallet = new CashuWallet(mint, {unit})
  const proofs = await wallet.mintProofs(amount, quoteId)
  return proofs
}

export async function createMeltQuote (invoice) {
  const mint = new CashuMint(mintUrl)
  const wallet = new CashuWallet(mint, {unit})
  const quote = await wallet.createMeltQuote(invoice)
  return quote
}

export async function meltProofs (quote, proofs) {
  const mint = new CashuMint(mintUrl)
  const wallet = new CashuWallet(mint, {unit})
  const response = await wallet.meltProofs(quote, proofs)
  return response
}

export async function generateCashuPaymentRequest (amount) {
  const mint = new CashuMint(mintUrl)
  const wallet = new CashuWallet(mint, {unit})
  const quote = await wallet.createMintQuote(amount)
  return quote.request
}

export async function sendTokens (amount, proofs, paymentRequest) {
  const mint = new CashuMint(mintUrl)
  const wallet = new CashuWallet(mint, {unit})
  const sendResponse = await wallet.send(amount, proofs)
  const encodedToken = getEncodedToken({mint: mintUrl, proofs: sendResponse.send})
  return encodedToken
}

export async function receiveTokens (paymentRequest) {
  const mint = new CashuMint(mintUrl)
  const wallet = new CashuWallet(mint, {unit})
  const response = await wallet.receive(paymentRequest)
  return response
}
