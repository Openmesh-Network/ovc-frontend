import { NotFound } from "@/components/not-found";
import ProposalCreate from "./pages/new";
import ProposalList from "./pages/proposal-list";
import ProposalDetail from "./pages/proposal";
import { useUrl } from "@/hooks/useUrl";
import { departments } from "@/ovc-indexer/contracts/departments";
import Departments from "./pages/department-list";

export default function PluginPage() {
  // Select the inner pages to display depending on the URL hash
  const { hash } = useUrl();

  if (!hash || hash === "#/") {
    return <Departments />;
  }
  const sanitizedHash = hash.replace("#/", "");
  const splitter = sanitizedHash.indexOf("/");

  let [tag, page] = [
    sanitizedHash.slice(0, splitter === -1 ? sanitizedHash.length : splitter),
    splitter === -1 ? "" : sanitizedHash.slice(splitter + 1),
  ];
  if (page.endsWith("/")) {
    page = page.substring(0, page.length - 1);
  }
  const department = departments.find((d) => d.tag === tag);
  if (!department) {
    return <h2>Department with tag {tag} not found.</h2>;
  }

  if (!page)
    return (
      <ProposalList plugin={department.dao.tagVoting} tag={department.tag} />
    );
  else if (page === "new")
    return (
      <ProposalCreate
        dao={department.dao.dao}
        plugin={department.dao.tagVoting}
        tag={department.tag}
        smartAccount={department.smart_account}
        crosschainAccount={department.crosschain_account}
      />
    );
  else if (page.startsWith("proposals/")) {
    const id = page.replace("proposals/", "");
    let idAsBigInt: bigint;
    try {
      idAsBigInt = BigInt(id);
    } catch {
      return <h2>Proposal id not a valid number.</h2>;
    }

    return (
      <ProposalDetail
        plugin={department.dao.tagVoting}
        tag={department.tag}
        id={idAsBigInt}
      />
    );
  }

  // Default not found page
  return <NotFound />;
}
