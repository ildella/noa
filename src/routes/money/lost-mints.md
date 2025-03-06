# Quotes to get back

```sh
http get https://mint.minibits.cash/Bitcoin/v1/mint/quote/bolt11/BNlt-xjMzvoPhYOXX8ZJZG8ZEXU70YaXnbYdOSXa
http get https://8333.space:3338/v1/mint/quote/bolt11/zW0snEmQKEXHzdrM7RacdrPfDsx6Pj1E0SLeimRB


Ys2krWjlnBN-7wjI_AHOaVWnuIgTkleSYKRA3oqV
http get https://mint.minibits.cash/Bitcoin/v1/mint/quote/bolt11/Ys2krWjlnBN-7wjI_AHOaVWnuIgTkleSYKRA3oqV
```


  // const receiveMinted = async cashuWallet => {
  //   const mintQuote = {
  //     expiry: null,
  //     paid: true,
  //     pubkey: 'npub1z4vdnms0r2m0txrd8z8k8x74rrkusxtdvwgjsf9nslvrdz8wrlts7rvy2k',
  //     quote: 'BNlt-xjMzvoPhYOXX8ZJZG8ZEXU70YaXnbYdOSXa',
  //     request: 'lnbc1u1pnemqlapp59r5spakkcpf32trxw82hv79v9yt28cp2ehduusgg53k4reauwcesdq8w3jhxaqcqzzsxqyz5vqrzjqvueefmrckfdwyyu39m0lf24sqzcr9vcrmxrvgfn6empxz7phrjxvrttncqq0lcqqyqqqqlgqqqqqqgq2qsp5dsaqlt555vq6qnyqlcr7cekvke6t74pe3f3ej2yusapee9xkza7s9qxpqysgqp936mmmr296wxtdw044tn3kxqfhjthuxstwuj5gkfvejaadwqfdyqxud68tc6kr0spcjqp90dagwf5dlx6rmz7dnlgluefyje5eavugqf0yf3z',
  //     state: 'PAID',
  //   }
  //   const mintQuoteChecked = await cashuWallet.checkMintQuote(mintQuote.quote)
  //   console.log(mintQuoteChecked.state, MintQuoteState.PAID)
  //   if (mintQuoteChecked.state === MintQuoteState.PAID) {
  //     const {proofs} = await cashuWallet.mintProofs(100, mintQuote.quote)
  //     console.log({proofs})
  //   }
  // }
