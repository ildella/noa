export default {
  test: {
    include: [
      'tests/unit/**/*.{test,spec}.?(c|m)[jt]s?(x)',
      'tests/cashu/**/*.{test,spec}.?(c|m)[jt]s?(x)',
    ],
    testTimeout: 50000,
  },
}
