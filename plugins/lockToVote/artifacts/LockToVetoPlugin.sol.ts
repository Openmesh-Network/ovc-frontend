import { Abi } from "viem";
export const LockToVetoPluginAbi: Abi = [
  {
    inputs: [
      { internalType: "uint256", name: "proposalId", type: "uint256" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "ClaimLockForbidden",
    type: "error",
  },
  {
    inputs: [
      { internalType: "address", name: "dao", type: "address" },
      { internalType: "address", name: "where", type: "address" },
      { internalType: "address", name: "who", type: "address" },
      { internalType: "bytes32", name: "permissionId", type: "bytes32" },
    ],
    name: "DaoUnauthorized",
    type: "error",
  },
  {
    inputs: [
      { internalType: "uint64", name: "limit", type: "uint64" },
      { internalType: "uint64", name: "actual", type: "uint64" },
    ],
    name: "DateOutOfBounds",
    type: "error",
  },
  {
    inputs: [
      { internalType: "uint64", name: "limit", type: "uint64" },
      { internalType: "uint64", name: "actual", type: "uint64" },
    ],
    name: "MinDurationOutOfBounds",
    type: "error",
  },
  {
    inputs: [
      { internalType: "uint256", name: "limit", type: "uint256" },
      { internalType: "uint256", name: "actual", type: "uint256" },
    ],
    name: "MinProposerVotingPowerOutOfBounds",
    type: "error",
  },
  { inputs: [], name: "NoVotingPower", type: "error" },
  {
    inputs: [{ internalType: "address", name: "sender", type: "address" }],
    name: "ProposalCreationForbidden",
    type: "error",
  },
  {
    inputs: [{ internalType: "uint256", name: "proposalId", type: "uint256" }],
    name: "ProposalExecutionForbidden",
    type: "error",
  },
  {
    inputs: [
      { internalType: "uint256", name: "proposalId", type: "uint256" },
      { internalType: "address", name: "account", type: "address" },
    ],
    name: "ProposalVetoingForbidden",
    type: "error",
  },
  {
    inputs: [
      { internalType: "uint256", name: "limit", type: "uint256" },
      { internalType: "uint256", name: "actual", type: "uint256" },
    ],
    name: "RatioOutOfBounds",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "previousAdmin",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "AdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "beacon",
        type: "address",
      },
    ],
    name: "BeaconUpgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "uint8", name: "version", type: "uint8" },
    ],
    name: "Initialized",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "voter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "LockClaimed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address[]",
        name: "members",
        type: "address[]",
      },
    ],
    name: "MembersAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address[]",
        name: "members",
        type: "address[]",
      },
    ],
    name: "MembersRemoved",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "definingContract",
        type: "address",
      },
    ],
    name: "MembershipContractAnnounced",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint32",
        name: "minVetoRatio",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "minDuration",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "minProposerVotingPower",
        type: "uint256",
      },
    ],
    name: "OptimisticGovernanceSettingsUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "creator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "startDate",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "endDate",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "bytes",
        name: "metadata",
        type: "bytes",
      },
      {
        components: [
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "value", type: "uint256" },
          { internalType: "bytes", name: "data", type: "bytes" },
        ],
        indexed: false,
        internalType: "struct IDAO.Action[]",
        name: "actions",
        type: "tuple[]",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "allowFailureMap",
        type: "uint256",
      },
    ],
    name: "ProposalCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
    ],
    name: "ProposalExecuted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "implementation",
        type: "address",
      },
    ],
    name: "Upgraded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "proposalId",
        type: "uint256",
      },
      {
        indexed: true,
        internalType: "address",
        name: "voter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "votingPower",
        type: "uint256",
      },
    ],
    name: "VetoCast",
    type: "event",
  },
  {
    inputs: [],
    name: "OPTIMISTIC_GOVERNANCE_INTERFACE_ID",
    outputs: [{ internalType: "bytes4", name: "", type: "bytes4" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "PROPOSER_PERMISSION_ID",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "UPDATE_OPTIMISTIC_GOVERNANCE_SETTINGS_PERMISSION_ID",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "UPGRADE_PLUGIN_PERMISSION_ID",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_proposalId", type: "uint256" }],
    name: "canExecute",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_proposalId", type: "uint256" },
      { internalType: "address", name: "_voter", type: "address" },
    ],
    name: "canVeto",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_proposalId", type: "uint256" },
      { internalType: "address", name: "_member", type: "address" },
    ],
    name: "claimLock",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "bytes", name: "_metadata", type: "bytes" },
      {
        components: [
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "value", type: "uint256" },
          { internalType: "bytes", name: "data", type: "bytes" },
        ],
        internalType: "struct IDAO.Action[]",
        name: "_actions",
        type: "tuple[]",
      },
      { internalType: "uint256", name: "_allowFailureMap", type: "uint256" },
      { internalType: "uint64", name: "_startDate", type: "uint64" },
      { internalType: "uint64", name: "_endDate", type: "uint64" },
    ],
    name: "createProposal",
    outputs: [{ internalType: "uint256", name: "proposalId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "dao",
    outputs: [{ internalType: "contract IDAO", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_proposalId", type: "uint256" }],
    name: "execute",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_proposalId", type: "uint256" }],
    name: "getProposal",
    outputs: [
      { internalType: "bool", name: "open", type: "bool" },
      { internalType: "bool", name: "executed", type: "bool" },
      {
        components: [
          { internalType: "uint64", name: "startDate", type: "uint64" },
          { internalType: "uint64", name: "endDate", type: "uint64" },
          { internalType: "uint64", name: "snapshotBlock", type: "uint64" },
          {
            internalType: "uint256",
            name: "minVetoVotingPower",
            type: "uint256",
          },
        ],
        internalType: "struct LockToVetoPlugin.ProposalParameters",
        name: "parameters",
        type: "tuple",
      },
      { internalType: "uint256", name: "vetoTally", type: "uint256" },
      {
        components: [
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "value", type: "uint256" },
          { internalType: "bytes", name: "data", type: "bytes" },
        ],
        internalType: "struct IDAO.Action[]",
        name: "actions",
        type: "tuple[]",
      },
      { internalType: "uint256", name: "allowFailureMap", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getVotingToken",
    outputs: [
      { internalType: "contract IERC20Upgradeable", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_proposalId", type: "uint256" },
      { internalType: "address", name: "_voter", type: "address" },
    ],
    name: "hasClaimedLock",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_proposalId", type: "uint256" },
      { internalType: "address", name: "_voter", type: "address" },
    ],
    name: "hasVetoed",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "implementation",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "contract IDAO", name: "_dao", type: "address" },
      {
        components: [
          { internalType: "uint32", name: "minVetoRatio", type: "uint32" },
          { internalType: "uint64", name: "minDuration", type: "uint64" },
          {
            internalType: "uint256",
            name: "minProposerVotingPower",
            type: "uint256",
          },
        ],
        internalType: "struct LockToVetoPlugin.OptimisticGovernanceSettings",
        name: "_governanceSettings",
        type: "tuple",
      },
      {
        internalType: "contract IERC20Upgradeable",
        name: "_token",
        type: "address",
      },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_account", type: "address" }],
    name: "isMember",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "_proposalId", type: "uint256" }],
    name: "isMinVetoRatioReached",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "minDuration",
    outputs: [{ internalType: "uint64", name: "", type: "uint64" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "minProposerVotingPower",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "minVetoRatio",
    outputs: [{ internalType: "uint32", name: "", type: "uint32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "pluginType",
    outputs: [
      { internalType: "enum IPlugin.PluginType", name: "", type: "uint8" },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "proposalCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "proxiableUUID",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "bytes4", name: "_interfaceId", type: "bytes4" }],
    name: "supportsInterface",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalVotingPower",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          { internalType: "uint32", name: "minVetoRatio", type: "uint32" },
          { internalType: "uint64", name: "minDuration", type: "uint64" },
          {
            internalType: "uint256",
            name: "minProposerVotingPower",
            type: "uint256",
          },
        ],
        internalType: "struct LockToVetoPlugin.OptimisticGovernanceSettings",
        name: "_governanceSettings",
        type: "tuple",
      },
    ],
    name: "updateOptimisticGovernanceSettings",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "newImplementation", type: "address" },
    ],
    name: "upgradeTo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "newImplementation", type: "address" },
      { internalType: "bytes", name: "data", type: "bytes" },
    ],
    name: "upgradeToAndCall",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_proposalId", type: "uint256" },
      { internalType: "uint256", name: "_amountToLock", type: "uint256" },
    ],
    name: "veto",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256", name: "_proposalId", type: "uint256" },
      { internalType: "uint256", name: "_amountToLock", type: "uint256" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
      { internalType: "uint8", name: "v", type: "uint8" },
      { internalType: "bytes32", name: "r", type: "bytes32" },
      { internalType: "bytes32", name: "s", type: "bytes32" },
    ],
    name: "vetoPermit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
