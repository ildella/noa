export const categories = [
  {
    name: 'Chat',
    description: 'Direct and group messaging.',
    apps: [
      {
        name: '0xChat',
        logo: 'apps/0xchat.png',
        os: 'iOS, Android',
        identifiers: {
          android: 'com.oxchat.nostr',
          ios: '0xchat/id1637607169',
        },
      },
    ],
  },
  {
    name: 'Wallets',
    description: 'Bitcoin wallets for everyday use.',
    apps: [
      {
        name: 'Cashu.me',
        logo: 'apps/cashume.png',
        os: 'web',
        identifiers: {
          web: 'https://cashu.me',
        },
      },
      {
        name: 'Minibits',
        logo: 'apps/minibits.png',
        os: 'Android',
        identifiers: {
          android: 'com.minibits_wallet',
        },
      },
    ],
  },
  {
    name: 'Social',
    description: 'Twitter-like clients.',
    apps: [
      {
        name: 'Amethyst',
        logo: 'apps/amethyst.png',
        os: 'Android',
        identifiers: {android: 'com.vitorpamplona.amethyst'},
      },
      {
        name: 'Damus',
        logo: 'apps/damus.png',
        os: 'iOS',
        identifiers: {ios: 'damus/id1628663131'},
      },
    ],
  },
  {
    name: 'Identity and Profile',
    description: 'When you need more than just this app.',
    apps: [
      {
        name: 'Amber',
        logo: 'apps/amber.svg',
        identifiers: {android: 'com.greenart7c3.nostrsigner'},
        description: 'Signer',
      },
      {
        name: 'Profile Manager',
        logo: 'apps/profile.png',
        identifiers: {web: 'https://metadata.nostr.com/'},
        description: 'Profile backup',
      },
    ],
  },
]
