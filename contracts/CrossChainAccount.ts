export const CrossChainAccountContract = {
  abi: [
    {
      type: "constructor",
      inputs: [
        { name: "_router", type: "address", internalType: "address" },
        {
          name: "_allowedOriginChainSelector",
          type: "uint64",
          internalType: "uint64",
        },
        {
          name: "_allowedOriginAddress",
          type: "address",
          internalType: "address",
        },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "allowedOriginAddress",
      inputs: [],
      outputs: [{ name: "", type: "address", internalType: "address" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "allowedOriginChainSelector",
      inputs: [],
      outputs: [{ name: "", type: "uint64", internalType: "uint64" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "ccipReceive",
      inputs: [
        {
          name: "message",
          type: "tuple",
          internalType: "struct Client.Any2EVMMessage",
          components: [
            { name: "messageId", type: "bytes32", internalType: "bytes32" },
            {
              name: "sourceChainSelector",
              type: "uint64",
              internalType: "uint64",
            },
            { name: "sender", type: "bytes", internalType: "bytes" },
            { name: "data", type: "bytes", internalType: "bytes" },
            {
              name: "destTokenAmounts",
              type: "tuple[]",
              internalType: "struct Client.EVMTokenAmount[]",
              components: [
                { name: "token", type: "address", internalType: "address" },
                { name: "amount", type: "uint256", internalType: "uint256" },
              ],
            },
          ],
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "getRouter",
      inputs: [],
      outputs: [{ name: "", type: "address", internalType: "address" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "supportsInterface",
      inputs: [{ name: "interfaceId", type: "bytes4", internalType: "bytes4" }],
      outputs: [{ name: "", type: "bool", internalType: "bool" }],
      stateMutability: "pure",
    },
    {
      type: "event",
      name: "Executed",
      inputs: [
        {
          name: "messageId",
          type: "bytes32",
          indexed: true,
          internalType: "bytes32",
        },
        {
          name: "to",
          type: "address",
          indexed: false,
          internalType: "address",
        },
        {
          name: "value",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
        { name: "data", type: "bytes", indexed: false, internalType: "bytes" },
        { name: "success", type: "bool", indexed: false, internalType: "bool" },
        {
          name: "returnValue",
          type: "bytes",
          indexed: false,
          internalType: "bytes",
        },
      ],
      anonymous: false,
    },
    {
      type: "error",
      name: "InvalidOriginAddress",
      inputs: [
        { name: "received", type: "address", internalType: "address" },
        { name: "expected", type: "address", internalType: "address" },
      ],
    },
    {
      type: "error",
      name: "InvalidOriginChainSelector",
      inputs: [
        { name: "received", type: "uint64", internalType: "uint64" },
        { name: "expected", type: "uint64", internalType: "uint64" },
      ],
    },
    {
      type: "error",
      name: "InvalidRouter",
      inputs: [{ name: "router", type: "address", internalType: "address" }],
    },
  ],
} as const;
