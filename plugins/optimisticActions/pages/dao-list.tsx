import { ReactNode, useState } from "react";
import { Button, Card, IconType } from "@aragon/ods";
import Link from "next/link";
import { digestPagination } from "@/utils/pagination";
import { daos } from "..";

export default function Daos() {
  const [currentPage, setCurrentPage] = useState(0);

  const {
    visibleProposalIds: visibleDaos,
    showNext,
    showPrev,
  } = digestPagination(daos.length, currentPage);
  return (
    <MainSection>
      <SectionView>
        <h1 className="justify-self-start text-3xl font-semibold align-middle">
          Departments
        </h1>
      </SectionView>
      {visibleDaos.map((daoId) => (
        <Link href={`#/${daos[daoId].dao}`} className="w-full mb-4">
          <Card className="p-4">
            <div className="md:w-7/12 lg:w-3/4 xl:4/5 pr-4 text-nowrap text-ellipsis overflow-hidden">
              <h4 className="mb-1 text-lg text-neutral-300 line-clamp-1">
                {daos[daoId].name}
              </h4>
              <p className="text-base text-neutral-300 line-clamp-3">
                {daos[daoId].description}
              </p>
            </div>
          </Card>
        </Link>
      ))}
      <div className="w-full flex flex-row justify-end gap-2 mt-4 mb-10">
        <Button
          variant="tertiary"
          size="sm"
          disabled={!showPrev}
          onClick={() => setCurrentPage((page) => Math.max(page - 1, 0))}
          iconLeft={IconType.CHEVRON_LEFT}
        >
          Previous
        </Button>
        <Button
          variant="tertiary"
          size="sm"
          disabled={!showNext}
          onClick={() => setCurrentPage((page) => page + 1)}
          iconRight={IconType.CHEVRON_RIGHT}
        >
          Next
        </Button>
      </div>
    </MainSection>
  );
}

function MainSection({ children }: { children: ReactNode }) {
  return (
    <main className="flex flex-col items-center mt-6 w-screen max-w-full">
      {children}
    </main>
  );
}

function SectionView({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-row justify-between content-center w-full mb-6">
      {children}
    </div>
  );
}
