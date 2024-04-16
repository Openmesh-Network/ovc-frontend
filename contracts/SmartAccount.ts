// Abi of smart account using BaseInstaller
export const SmartAccountContract = {
  abi: [
    // Smart Account
    {
      type: "function",
      name: "multicall",
      inputs: [{ name: "data", type: "bytes[]", internalType: "bytes[]" }],
      outputs: [{ name: "results", type: "bytes[]", internalType: "bytes[]" }],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "performCall",
      inputs: [
        { name: "to", type: "address", internalType: "address" },
        { name: "value", type: "uint256", internalType: "uint256" },
        { name: "data", type: "bytes", internalType: "bytes" },
      ],
      outputs: [{ name: "returnValue", type: "bytes", internalType: "bytes" }],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "performDelegateCall",
      inputs: [
        { name: "to", type: "address", internalType: "address" },
        { name: "data", type: "bytes", internalType: "bytes" },
      ],
      outputs: [{ name: "returnValue", type: "bytes", internalType: "bytes" }],
      stateMutability: "nonpayable",
    },
    // Smart Account Modules
    {
      type: "function",
      name: "getModule",
      inputs: [
        { name: "functionSelector", type: "bytes4", internalType: "bytes4" },
      ],
      outputs: [{ name: "module", type: "address", internalType: "address" }],
      stateMutability: "view",
    },
    {
      type: "event",
      name: "ModuleSet",
      inputs: [
        {
          name: "functionSelector",
          type: "bytes4",
          indexed: false,
          internalType: "bytes4",
        },
        {
          name: "module",
          type: "address",
          indexed: false,
          internalType: "address",
        },
      ],
      anonymous: false,
    },
    {
      type: "error",
      name: "FunctionNotFound",
      inputs: [
        { name: "functionSelector", type: "bytes4", internalType: "bytes4" },
      ],
    },
    // Smart Account Ownable
    {
      type: "function",
      name: "owner",
      inputs: [],
      outputs: [{ name: "", type: "address", internalType: "address" }],
      stateMutability: "view",
    },
    {
      type: "event",
      name: "NewOwner",
      inputs: [
        {
          name: "account",
          type: "address",
          indexed: false,
          internalType: "address",
        },
      ],
      anonymous: false,
    },
    {
      type: "error",
      name: "NotOwner",
      inputs: [
        { name: "account", type: "address", internalType: "address" },
        { name: "owner", type: "address", internalType: "address" },
      ],
    },
    // Smart Account ERC165
    {
      type: "function",
      name: "supportsInterface",
      inputs: [{ name: "interfaceId", type: "bytes4", internalType: "bytes4" }],
      outputs: [{ name: "", type: "bool", internalType: "bool" }],
      stateMutability: "view",
    },
    {
      type: "event",
      name: "InterfaceSupportedChanged",
      inputs: [
        {
          name: "interfaceId",
          type: "bytes4",
          indexed: true,
          internalType: "bytes4",
        },
        {
          name: "supported",
          type: "bool",
          indexed: false,
          internalType: "bool",
        },
      ],
      anonymous: false,
    },
  ],
} as const;
