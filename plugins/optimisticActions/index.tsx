import { NotFound } from "@/components/not-found";
import ProposalCreate from "./pages/new";
import ProposalList from "./pages/proposal-list";
import ProposalDetail from "./pages/proposal";
import { useUrl } from "@/hooks/useUrl";
import { departments } from "@/ovc-indexer/contracts/departments";
import Daos from "./pages/dao-list";
import { Address, zeroHash } from "viem";
import { VerifiedContributorTagTrustlessManagementContract } from "@/contracts/VerifiedContributorTagTrustlessManagement";
import { deployment } from "@/ovc-indexer/contracts/deployment";
import { AddressTrustlessManagementContract } from "@/contracts/AddressTrustlessManagement";
import { OptimisticActionsContract } from "@/contracts/OptimisticActions";
import { ActionTemplate } from "@/components/input/action/preset-action-form";

export const daos = departments
  .map((d) => {
    return {
      name: d.name as string,
      description: d.description as string,
      dao: d.smart_account as Address,
      tag: d.tag,
      trustlessManagement:
        VerifiedContributorTagTrustlessManagementContract.address as Address,
      role: BigInt(d.tag),
      templates: [ActionTemplate.DepartmentMemberPayment],
    };
  })
  .concat([
    {
      name: "All Verified Contributors",
      description: "All Verified Contributors",
      dao: deployment.departments.departmentDaos.departmentFactory
        .departmentOwner.dao,
      tag: zeroHash,
      trustlessManagement:
        deployment.departments.verifiedContributorCountTrustlessManagement,
      role: BigInt(1),
      templates: [ActionTemplate.MintOVC],
    },
  ]);

export default function PluginPage() {
  // Select the inner pages to display depending on the URL hash
  const { hash } = useUrl();

  if (!hash || hash === "#/") {
    return <Daos />;
  }
  const sanitizedHash = hash.replace("#/", "");
  const splitter = sanitizedHash.indexOf("/");

  let [daoAddress, page] = [
    sanitizedHash.slice(0, splitter === -1 ? sanitizedHash.length : splitter),
    splitter === -1 ? "" : sanitizedHash.slice(splitter + 1),
  ];
  if (page.endsWith("/")) {
    page = page.substring(0, page.length - 1);
  }
  const dao = daos.find(
    (d) => d.dao.toLowerCase() === daoAddress.toLowerCase()
  );
  if (!dao) {
    return <h2>Dao with address {daoAddress} not found.</h2>;
  }

  if (!page)
    return (
      <ProposalList
        dao={dao.dao}
        trustlessManagement={dao.trustlessManagement}
        role={dao.role}
      />
    );
  else if (page === "new")
    return (
      <ProposalCreate
        dao={dao.dao}
        tag={dao.tag}
        creationTrustlessManagement={dao.trustlessManagement}
        creationRole={dao.role}
        executionTrustlessManagement={
          AddressTrustlessManagementContract.address
        }
        executionRole={BigInt(OptimisticActionsContract.address)}
        templates={dao.templates}
      />
    );
  else if (page.startsWith("proposals/")) {
    const id = page.replace("proposals/", "");
    const idAsNumber = Number.parseInt(id);
    if (Number.isNaN(idAsNumber)) {
      return <h2>Proposal id not a valid number.</h2>;
    }

    return (
      <ProposalDetail
        dao={dao.dao}
        trustlessManagement={dao.trustlessManagement}
        role={dao.role}
        id={idAsNumber}
      />
    );
  }

  // Default not found page
  return <NotFound />;
}
