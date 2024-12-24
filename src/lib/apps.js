export const categories = [
  {
    name: 'Identity and Profile',
    // description: 'Full-featured apps to manage your identity and your profile',
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
    name: 'Social',
    description: 'Twitter-like clients. Pick the one you like.',
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
      {
        name: 'Primal',
        logo: 'apps/primal.svg',
        os: 'Android',
        identifiers: {
          android: 'net.primal.android',
          ios: 'primal/id1673134518',
          web: 'https://primal.net/',
        },
      },
    ],
  },
]
