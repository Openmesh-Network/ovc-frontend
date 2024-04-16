export const DAOContract = {
  abi: [
    { type: "constructor", inputs: [], stateMutability: "nonpayable" },
    { type: "fallback", stateMutability: "nonpayable" },
    { type: "receive", stateMutability: "payable" },
    {
      type: "function",
      name: "EXECUTE_PERMISSION_ID",
      inputs: [],
      outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "REGISTER_STANDARD_CALLBACK_PERMISSION_ID",
      inputs: [],
      outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "ROOT_PERMISSION_ID",
      inputs: [],
      outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "SET_METADATA_PERMISSION_ID",
      inputs: [],
      outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "SET_TRUSTED_FORWARDER_PERMISSION_ID",
      inputs: [],
      outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "UPGRADE_DAO_PERMISSION_ID",
      inputs: [],
      outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "VALIDATE_SIGNATURE_PERMISSION_ID",
      inputs: [],
      outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "applyMultiTargetPermissions",
      inputs: [
        {
          name: "_items",
          type: "tuple[]",
          internalType: "struct PermissionLib.MultiTargetPermission[]",
          components: [
            {
              name: "operation",
              type: "uint8",
              internalType: "enum PermissionLib.Operation",
            },
            { name: "where", type: "address", internalType: "address" },
            { name: "who", type: "address", internalType: "address" },
            {
              name: "condition",
              type: "address",
              internalType: "address",
            },
            {
              name: "permissionId",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "applySingleTargetPermissions",
      inputs: [
        { name: "_where", type: "address", internalType: "address" },
        {
          name: "items",
          type: "tuple[]",
          internalType: "struct PermissionLib.SingleTargetPermission[]",
          components: [
            {
              name: "operation",
              type: "uint8",
              internalType: "enum PermissionLib.Operation",
            },
            { name: "who", type: "address", internalType: "address" },
            {
              name: "permissionId",
              type: "bytes32",
              internalType: "bytes32",
            },
          ],
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "daoURI",
      inputs: [],
      outputs: [{ name: "", type: "string", internalType: "string" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "deposit",
      inputs: [
        { name: "_token", type: "address", internalType: "address" },
        { name: "_amount", type: "uint256", internalType: "uint256" },
        { name: "_reference", type: "string", internalType: "string" },
      ],
      outputs: [],
      stateMutability: "payable",
    },
    {
      type: "function",
      name: "execute",
      inputs: [
        { name: "_callId", type: "bytes32", internalType: "bytes32" },
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
        {
          name: "_allowFailureMap",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      outputs: [
        { name: "execResults", type: "bytes[]", internalType: "bytes[]" },
        { name: "failureMap", type: "uint256", internalType: "uint256" },
      ],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "getTrustedForwarder",
      inputs: [],
      outputs: [{ name: "", type: "address", internalType: "address" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "grant",
      inputs: [
        { name: "_where", type: "address", internalType: "address" },
        { name: "_who", type: "address", internalType: "address" },
        {
          name: "_permissionId",
          type: "bytes32",
          internalType: "bytes32",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "grantWithCondition",
      inputs: [
        { name: "_where", type: "address", internalType: "address" },
        { name: "_who", type: "address", internalType: "address" },
        {
          name: "_permissionId",
          type: "bytes32",
          internalType: "bytes32",
        },
        {
          name: "_condition",
          type: "address",
          internalType: "contract IPermissionCondition",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "hasPermission",
      inputs: [
        { name: "_where", type: "address", internalType: "address" },
        { name: "_who", type: "address", internalType: "address" },
        {
          name: "_permissionId",
          type: "bytes32",
          internalType: "bytes32",
        },
        { name: "_data", type: "bytes", internalType: "bytes" },
      ],
      outputs: [{ name: "", type: "bool", internalType: "bool" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "initialize",
      inputs: [
        { name: "_metadata", type: "bytes", internalType: "bytes" },
        {
          name: "_initialOwner",
          type: "address",
          internalType: "address",
        },
        {
          name: "_trustedForwarder",
          type: "address",
          internalType: "address",
        },
        { name: "daoURI_", type: "string", internalType: "string" },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "initializeFrom",
      inputs: [
        {
          name: "_previousProtocolVersion",
          type: "uint8[3]",
          internalType: "uint8[3]",
        },
        { name: "_initData", type: "bytes", internalType: "bytes" },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "isGranted",
      inputs: [
        { name: "_where", type: "address", internalType: "address" },
        { name: "_who", type: "address", internalType: "address" },
        {
          name: "_permissionId",
          type: "bytes32",
          internalType: "bytes32",
        },
        { name: "_data", type: "bytes", internalType: "bytes" },
      ],
      outputs: [{ name: "", type: "bool", internalType: "bool" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "isValidSignature",
      inputs: [
        { name: "_hash", type: "bytes32", internalType: "bytes32" },
        { name: "_signature", type: "bytes", internalType: "bytes" },
      ],
      outputs: [{ name: "", type: "bytes4", internalType: "bytes4" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "protocolVersion",
      inputs: [],
      outputs: [{ name: "", type: "uint8[3]", internalType: "uint8[3]" }],
      stateMutability: "pure",
    },
    {
      type: "function",
      name: "proxiableUUID",
      inputs: [],
      outputs: [{ name: "", type: "bytes32", internalType: "bytes32" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "registerStandardCallback",
      inputs: [
        { name: "_interfaceId", type: "bytes4", internalType: "bytes4" },
        {
          name: "_callbackSelector",
          type: "bytes4",
          internalType: "bytes4",
        },
        { name: "_magicNumber", type: "bytes4", internalType: "bytes4" },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "revoke",
      inputs: [
        { name: "_where", type: "address", internalType: "address" },
        { name: "_who", type: "address", internalType: "address" },
        {
          name: "_permissionId",
          type: "bytes32",
          internalType: "bytes32",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "setDaoURI",
      inputs: [{ name: "newDaoURI", type: "string", internalType: "string" }],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "setMetadata",
      inputs: [{ name: "_metadata", type: "bytes", internalType: "bytes" }],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "setSignatureValidator",
      inputs: [{ name: "", type: "address", internalType: "address" }],
      outputs: [],
      stateMutability: "pure",
    },
    {
      type: "function",
      name: "setTrustedForwarder",
      inputs: [
        {
          name: "_newTrustedForwarder",
          type: "address",
          internalType: "address",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "supportsInterface",
      inputs: [{ name: "interfaceId", type: "bytes4", internalType: "bytes4" }],
      outputs: [{ name: "", type: "bool", internalType: "bool" }],
      stateMutability: "view",
    },
    {
      type: "function",
      name: "upgradeTo",
      inputs: [
        {
          name: "newImplementation",
          type: "address",
          internalType: "address",
        },
      ],
      outputs: [],
      stateMutability: "nonpayable",
    },
    {
      type: "function",
      name: "upgradeToAndCall",
      inputs: [
        {
          name: "newImplementation",
          type: "address",
          internalType: "address",
        },
        { name: "data", type: "bytes", internalType: "bytes" },
      ],
      outputs: [],
      stateMutability: "payable",
    },
    {
      type: "event",
      name: "AdminChanged",
      inputs: [
        {
          name: "previousAdmin",
          type: "address",
          indexed: false,
          internalType: "address",
        },
        {
          name: "newAdmin",
          type: "address",
          indexed: false,
          internalType: "address",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "BeaconUpgraded",
      inputs: [
        {
          name: "beacon",
          type: "address",
          indexed: true,
          internalType: "address",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "CallbackReceived",
      inputs: [
        {
          name: "sender",
          type: "address",
          indexed: false,
          internalType: "address",
        },
        {
          name: "sig",
          type: "bytes4",
          indexed: true,
          internalType: "bytes4",
        },
        {
          name: "data",
          type: "bytes",
          indexed: false,
          internalType: "bytes",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "Deposited",
      inputs: [
        {
          name: "sender",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "token",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "amount",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
        {
          name: "_reference",
          type: "string",
          indexed: false,
          internalType: "string",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "Executed",
      inputs: [
        {
          name: "actor",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "callId",
          type: "bytes32",
          indexed: false,
          internalType: "bytes32",
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
          name: "allowFailureMap",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
        {
          name: "failureMap",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
        {
          name: "execResults",
          type: "bytes[]",
          indexed: false,
          internalType: "bytes[]",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "Granted",
      inputs: [
        {
          name: "permissionId",
          type: "bytes32",
          indexed: true,
          internalType: "bytes32",
        },
        {
          name: "here",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "where",
          type: "address",
          indexed: false,
          internalType: "address",
        },
        {
          name: "who",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "condition",
          type: "address",
          indexed: false,
          internalType: "address",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "Initialized",
      inputs: [
        {
          name: "version",
          type: "uint8",
          indexed: false,
          internalType: "uint8",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "MetadataSet",
      inputs: [
        {
          name: "metadata",
          type: "bytes",
          indexed: false,
          internalType: "bytes",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "NativeTokenDeposited",
      inputs: [
        {
          name: "sender",
          type: "address",
          indexed: false,
          internalType: "address",
        },
        {
          name: "amount",
          type: "uint256",
          indexed: false,
          internalType: "uint256",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "NewURI",
      inputs: [
        {
          name: "daoURI",
          type: "string",
          indexed: false,
          internalType: "string",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "Revoked",
      inputs: [
        {
          name: "permissionId",
          type: "bytes32",
          indexed: true,
          internalType: "bytes32",
        },
        {
          name: "here",
          type: "address",
          indexed: true,
          internalType: "address",
        },
        {
          name: "where",
          type: "address",
          indexed: false,
          internalType: "address",
        },
        {
          name: "who",
          type: "address",
          indexed: true,
          internalType: "address",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "StandardCallbackRegistered",
      inputs: [
        {
          name: "interfaceId",
          type: "bytes4",
          indexed: false,
          internalType: "bytes4",
        },
        {
          name: "callbackSelector",
          type: "bytes4",
          indexed: false,
          internalType: "bytes4",
        },
        {
          name: "magicNumber",
          type: "bytes4",
          indexed: false,
          internalType: "bytes4",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "TrustedForwarderSet",
      inputs: [
        {
          name: "forwarder",
          type: "address",
          indexed: false,
          internalType: "address",
        },
      ],
      anonymous: false,
    },
    {
      type: "event",
      name: "Upgraded",
      inputs: [
        {
          name: "implementation",
          type: "address",
          indexed: true,
          internalType: "address",
        },
      ],
      anonymous: false,
    },
    {
      type: "error",
      name: "ActionFailed",
      inputs: [{ name: "index", type: "uint256", internalType: "uint256" }],
    },
    {
      type: "error",
      name: "AnyAddressDisallowedForWhoAndWhere",
      inputs: [],
    },
    {
      type: "error",
      name: "ConditionInterfacNotSupported",
      inputs: [
        {
          name: "condition",
          type: "address",
          internalType: "contract IPermissionCondition",
        },
      ],
    },
    {
      type: "error",
      name: "ConditionNotAContract",
      inputs: [
        {
          name: "condition",
          type: "address",
          internalType: "contract IPermissionCondition",
        },
      ],
    },
    { type: "error", name: "FunctionRemoved", inputs: [] },
    { type: "error", name: "GrantWithConditionNotSupported", inputs: [] },
    { type: "error", name: "InsufficientGas", inputs: [] },
    {
      type: "error",
      name: "NativeTokenDepositAmountMismatch",
      inputs: [
        { name: "expected", type: "uint256", internalType: "uint256" },
        { name: "actual", type: "uint256", internalType: "uint256" },
      ],
    },
    {
      type: "error",
      name: "PermissionAlreadyGrantedForDifferentCondition",
      inputs: [
        { name: "where", type: "address", internalType: "address" },
        { name: "who", type: "address", internalType: "address" },
        {
          name: "permissionId",
          type: "bytes32",
          internalType: "bytes32",
        },
        {
          name: "currentCondition",
          type: "address",
          internalType: "address",
        },
        { name: "newCondition", type: "address", internalType: "address" },
      ],
    },
    {
      type: "error",
      name: "PermissionsForAnyAddressDisallowed",
      inputs: [],
    },
    {
      type: "error",
      name: "ProtocolVersionUpgradeNotSupported",
      inputs: [
        {
          name: "protocolVersion",
          type: "uint8[3]",
          internalType: "uint8[3]",
        },
      ],
    },
    { type: "error", name: "ReentrantCall", inputs: [] },
    { type: "error", name: "TooManyActions", inputs: [] },
    {
      type: "error",
      name: "Unauthorized",
      inputs: [
        { name: "where", type: "address", internalType: "address" },
        { name: "who", type: "address", internalType: "address" },
        { name: "permissionId", type: "bytes32", internalType: "bytes32" },
      ],
    },
    {
      type: "error",
      name: "UnkownCallback",
      inputs: [
        {
          name: "callbackSelector",
          type: "bytes4",
          internalType: "bytes4",
        },
        { name: "magicNumber", type: "bytes4", internalType: "bytes4" },
      ],
    },
    { type: "error", name: "ZeroAmount", inputs: [] },
  ],
} as const;
