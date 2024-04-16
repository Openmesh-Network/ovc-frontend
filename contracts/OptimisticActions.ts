export const OptimisticActionsContract = {
  address: "0x58D3618B97fDdc2aE66BC26EDE23582d407aCf03",
  abi: [
    {
      type: "function",
      name: "createAction",
      inputs: [
        {
          name: "_manager",
          type: "address",
          internalType: "contract IDAOManager",
        },
        { name: "_role", type: "uint256", internalType: "uint256" },
        {
          name: "_actions",
          type: "tuple[]",
          internalType: "struct IDAO.Action[]",
          components: [
            { name: "to", type: "address", internalType: "address" },
            { name: "value", type: "uint256", internalType: "uint256" },
            { name: "data", type: "bytes", internalType: "bytes" },
          ],
        },
        { name: "_failureMap", type: "uint256", internalType: "uint256" },
        { name: "_metadata", type: "string", internalType: "string" },
      ],
      outputs: [{ name: "id", type: "uint32", internalType: "uint32" }],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "executeAction",
      inputs: [
        { name: "_dao", type: "address", internalType: "contract IDAO" },
        { name: "_id", type: "uint32", internalType: "uint32" },
      ],
      outputs: [
        { name: "returnValues", type: "bytes[]", internalType: "bytes[]" },
        { name: "failureMap", type: "uint256", internalType: "uint256" },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "getAction",
      inputs: [
        { name: "_dao", type: "address", internalType: "contract IDAO" },
        { name: "_id", type: "uint32", internalType: "uint32" },
      ],
      outputs: [
        {
          name: "request",
          type: "tuple",
          internalType: "struct ITrustlessActions.ActionRequest",
          components: [
            { name: "executed", type: "bool", internalType: "bool" },
            {
              name: "manager",
              type: "address",
              internalType: "contract IDAOManager",
            },
            { name: "role", type: "uint256", internalType: "uint256" },
            {
              name: "actions",
              type: "tuple[]",
              internalType: "struct IDAO.Action[]",
              components: [
                { name: "to", type: "address", internalType: "address" },
                { name: "value", type: "uint256", internalType: "uint256" },
                { name: "data", type: "bytes", internalType: "bytes" },
              ],
            },
            { name: "failureMap", type: "uint256", internalType: "uint256" },
          ],
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "getOptimsticAction",
      inputs: [
        { name: "_dao", type: "address", internalType: "contract IDAO" },
        { name: "_id", type: "uint32", internalType: "uint32" },
      ],
      outputs: [
        {
          name: "request",
          type: "tuple",
          internalType: "struct IOptimisticActions.OptimisticActionRequest",
          components: [
            { name: "executableFrom", type: "uint64", internalType: "uint64" },
          ],
        },
      ],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "owner",
      inputs: [],
      outputs: [{ name: "", type: "address", internalType: "address" }],
      stateMutability: "pure",
    },
    {
      type: "function",
      name: "rejectAction",
      inputs: [
        { name: "_id", type: "uint32", internalType: "uint32" },
        { name: "_metadata", type: "string", internalType: "string" },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "setAdmin",
      inputs: [
        { name: "_dao", type: "address", internalType: "contract IDAO" },
        { name: "_admin", type: "address", internalType: "address" },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "setExecuteDelay",
      inputs: [
        { name: "_dao", type: "address", internalType: "contract IDAO" },
        { name: "_executeDelay", type: "uint64", internalType: "uint64" },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "supportsInterface",
      inputs: [
        { name: "_interfaceId", type: "bytes4", internalType: "bytes4" },
      ],
      outputs: [{ name: "", type: "bool", internalType: "bool" }],
      stateMutability: "view",
    },
    {
      type: "event",
      name: "ActionCreated",
      inputs: [
        { name: "id", type: "uint32", indexed: true, internalType: "uint32" },
        {
          name: "dao",
          type: "address",
          indexed: true,
          internalType: "contract IDAO",
        },
        {
          name: "manager",
          type: "address",
          indexed: false,
          internalType: "contract IDAOManager",
        },
        {
          name: "role",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
        {
          name: "actions",
          type: "tuple[]",
          indexed: false,
          internalType: "struct IDAO.Action[]",
          components: [
            { name: "to", type: "address", internalType: "address" },
            { name: "value", type: "uint256", internalType: "uint256" },
            { name: "data", type: "bytes", internalType: "bytes" },
          ],
        },
        {
          name: "failureMap",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
        {
          name: "metadata",
          type: "string",
          indexed: false,
          internalType: "string",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "ActionExecuted",
      inputs: [
        { name: "id", type: "uint32", indexed: true, internalType: "uint32" },
        {
          name: "dao",
          type: "address",
          indexed: true,
          internalType: "contract IDAO",
        },
        {
          name: "executor",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "returnValues",
          type: "bytes[]",
          indexed: false,
          internalType: "bytes[]",
        },
        {
          name: "failureMap",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "AdminSet",
      inputs: [
        {
          name: "dao",
          type: "address",
          indexed: true,
          internalType: "contract IDAO",
        },
        {
          name: "admin",
          type: "address",
          indexed: false,
          internalType: "address",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "OptimisticActionCreated",
      inputs: [
        { name: "id", type: "uint32", indexed: true, internalType: "uint32" },
        {
          name: "dao",
          type: "address",
          indexed: true,
          internalType: "contract IDAO",
        },
        {
          name: "executableFrom",
          type: "uint64",
          indexed: false,
          internalType: "uint64",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "OptimisticActionRejected",
      inputs: [
        { name: "id", type: "uint32", indexed: true, internalType: "uint32" },
        {
          name: "dao",
          type: "address",
          indexed: true,
          internalType: "contract IDAO",
        },
        {
          name: "metadata",
          type: "string",
          indexed: false,
          internalType: "string",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "OptimisticExecuteDelaySet",
      inputs: [
        {
          name: "dao",
          type: "address",
          indexed: true,
          internalType: "contract IDAO",
        },
        {
          name: "executeDelay",
          type: "uint64",
          indexed: false,
          internalType: "uint64",
        },
      ],
      anonymous: false,
    },
    { type: "error", name: "OptimisticRequestNotExecutableYet", inputs: [] },
    { type: "error", name: "Overflow", inputs: [] },
    { type: "error", name: "RequestAlreadyExecuted", inputs: [] },
    { type: "error", name: "RequestDoesNotExist", inputs: [] },
    { type: "error", name: "SenderIsNotAdmin", inputs: [] },
  ],
} as const;
