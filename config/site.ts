export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Verified Contributor Dashboard" as const,
  description: "Openmesh Verified Contributor Dashboard" as const,
  links: {
    rewards: "https://rewards.openmesh.network",
    circle: "https://circle.openmesh.network",
  },
};
