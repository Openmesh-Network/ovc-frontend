import { IconType } from "@aragon/ods";

type PluginItem = {
  /** The URL fragment after /plugins */
  id: string;
  /** The name of the folder within `/plugins` */
  folderName: string;
  /** Title on menu */
  title: string;
  icon: IconType;
};

export const plugins: PluginItem[] = [
  {
    id: "leaderboard",
    folderName: "leaderboard",
    title: "Leaderboard",
    icon: IconType.CALENDAR,
  },
  {
    id: "token-voting",
    folderName: "tokenVoting",
    title: "Verified Contributor Voting",
    icon: IconType.BLOCKCHAIN_BLOCKCHAIN,
  },
  {
    id: "tag-voting",
    folderName: "tagVoting",
    title: "Department Voting",
    icon: IconType.BLOCKCHAIN_BLOCKCHAIN,
  },
  {
    id: "optimistic-actions",
    folderName: "optimisticActions",
    title: "Optimistic Actions",
    icon: IconType.BLOCKCHAIN_BLOCK,
  },
];
