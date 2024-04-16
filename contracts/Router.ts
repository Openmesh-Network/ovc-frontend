export const RouterContract = {
  abi: [
    {
      type: "function",
      name: "ccipSend",
      inputs: [
        {
          name: "destinationChainSelector",
          type: "uint64",
          internalType: "uint64",
        },
        {
          name: "message",
          type: "tuple",
          internalType: "struct Client.EVM2AnyMessage",
          components: [
            { name: "receiver", type: "bytes", internalType: "bytes" },
            { name: "data", type: "bytes", internalType: "bytes" },
            {
              name: "tokenAmounts",
              type: "tuple[]",
              internalType: "struct Client.EVMTokenAmount[]",
              components: [
                {
                  name: "token",
                  type: "address",
                  internalType: "address",
                },
                {
                  name: "amount",
                  type: "uint256",
                  internalType: "uint256",
                },
              ],
            },
            {
              name: "feeToken",
              type: "address",
              internalType: "address",
            },
            { name: "extraArgs", type: "bytes", internalType: "bytes" },
          ],
        },
      ],
      outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
      stateMutability: "payable",
    },
    {
      type: "function",
      name: "getFee",
      inputs: [
        {
          name: "destinationChainSelector",
          type: "uint64",
          internalType: "uint64",
        },
        {
          name: "message",
          type: "tuple",
          internalType: "struct Client.EVM2AnyMessage",
          components: [
            { name: "receiver", type: "bytes", internalType: "bytes" },
            { name: "data", type: "bytes", internalType: "bytes" },
            {
              name: "tokenAmounts",
              type: "tuple[]",
              internalType: "struct Client.EVMTokenAmount[]",
              components: [
                {
                  name: "token",
                  type: "address",
                  internalType: "address",
                },
                {
                  name: "amount",
                  type: "uint256",
                  internalType: "uint256",
                },
              ],
            },
            {
              name: "feeToken",
              type: "address",
              internalType: "address",
            },
            { name: "extraArgs", type: "bytes", internalType: "bytes" },
          ],
        },
      ],
      outputs: [{ name: "fee", type: "uint256", internalType: "uint256" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "getSupportedTokens",
      inputs: [
        { name: "chainSelector", type: "uint64", internalType: "uint64" },
      ],
      outputs: [
        { name: "tokens", type: "address[]", internalType: "address[]" },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "isChainSupported",
      inputs: [
        { name: "chainSelector", type: "uint64", internalType: "uint64" },
      ],
      outputs: [{ name: "supported", type: "bool", internalType: "bool" }],
      stateMutability: "view",
    },
    { type: "error", name: "InsufficientFeeTokenAmount", inputs: [] },
    { type: "error", name: "InvalidMsgValue", inputs: [] },
    {
      type: "error",
      name: "UnsupportedDestinationChain",
      inputs: [
        {
          name: "destChainSelector",
          type: "uint64",
          internalType: "uint64",
        },
      ],
    },
  ],
} as const;
