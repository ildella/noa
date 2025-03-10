import {Command} from 'commander'
import {
  setMintUrl,
  createMintQuote,
  mintProofs,
  createMeltQuote,
  meltProofs,
  generateCashuPaymentRequest,
  sendTokens,
  receiveTokens,
} from './cashuFunctions.js'

const program = new Command()

// Set Mint URL
program
  .command('set-mint-url <url>')
  .description('Set the mint URL')
  .action(url => {
    setMintUrl(url)
    console.log(`Mint URL set to: ${url}`)
  })

// Create Mint Quote
program
  .command('create-mint-quote <amount>')
  .description('Create a mint quote for a given amount')
  .option('-d, --description <description>', 'Optional description for the quote')
  .action(async (amount, options) => {
    const quote = await createMintQuote(amount, options.description)
    console.log('Mint Quote:', quote)
  })

// Mint Proofs
program
  .command('mint-proofs <amount> <quoteId>')
  .description('Mint proofs for a given quote ID')
  .action((amount, quoteId) => {
    const proofs = mintProofs(amount, quoteId)
    console.log('Minted Proofs:', proofs)
  })

// Create Melt Quote
program
  .command('create-melt-quote <invoice>')
  .description('Create a melt quote for a given LN invoice')
  .action(invoice => {
    const quote = createMeltQuote(invoice)
    console.log('Melt Quote:', quote)
  })

// Melt Proofs
program
  .command('melt-proofs <quote> <proofs>')
  .description('Melt proofs for a given melt quote')
  .action((quote, proofs) => {
    const response = meltProofs(quote, JSON.parse(proofs))
    console.log('Melt Response:', response)
  })

// Generate Cashu Payment Request
program
  .command('generate-cashu-payment-request <amount>')
  .description('Generate a Cashu payment request for a given amount')
  .action(amount => {
    const paymentRequest = generateCashuPaymentRequest(amount)
    console.log('Cashu Payment Request:', paymentRequest)
  })

// Send Tokens
program
  .command('send-tokens <amount> <proofs> <paymentRequest>')
  .description('Send tokens to a Cashu payment request')
  .action((amount, proofs, paymentRequest) => {
    const encodedToken = sendTokens(amount, JSON.parse(proofs), paymentRequest)
    console.log('Encoded Token:', encodedToken)
  })

// Receive Tokens
program
  .command('receive-tokens <paymentRequest>')
  .description('Receive tokens from a Cashu payment request')
  .action(paymentRequest => {
    const response = receiveTokens(paymentRequest)
    console.log('Received Tokens:', response)
  })

// Parse arguments
program.parse(process.argv)
