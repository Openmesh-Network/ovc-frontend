import { Button, InputText } from "@aragon/ods";
import { useState } from "react";
import { Address, isAddress } from "viem";
import { useAccount } from "wagmi";

interface DelegateModalProps {
  onDismissModal: () => void;
  onDelegate: (to: Address) => void;
}

const DelegateModal: React.FC<DelegateModalProps> = ({
  onDismissModal,
  onDelegate,
}) => {
  const account = useAccount();
  const [to, setTo] = useState(account.address ?? "");

  return (
    <>
      <div
        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
        onClick={() => onDismissModal()}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-auto my-6 mx-2 max-w-sm min-w-64 drop-shadow-xl"
        >
          {/*content*/}
          <div className="rounded-lg relative flex flex-col w-full bg-neutral-100 outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-3 rounded-t">
              <h3 className="text-lg pr-4 font-semibold text-neutral-700">
                Delegate
              </h3>
              <button
                className="bg-transparent hover:bg-neutral-200 active:bg-neutral-200 text-neutral-800 opacity-1 float-right text-3xl rounded-lg"
                onClick={() => onDismissModal()}
              >
                <span className="-mt-1 bg-transparent text-neutral-800 opacity-1 h-8 w-6 text-2xl block">
                  ×
                </span>
              </button>
            </div>
            {/*footer*/}
            <div className="p-3 w-full rounded-b-lg bg-neutral-50">
              <p className="text-sm">
                You are about to delegate your Verified Contributor voting
                right. To vote yourself, you will have to pick yourself as
                representative. This will create a transaction that you will
                need to sign.
              </p>
              <InputText
                label="Delegate to:"
                value={to}
                onChange={(e) => setTo(e.target.value || "")}
              />
              <Button
                className="w-full h-5 my-3 items-center"
                size="md"
                variant="tertiary"
                onClick={() => {
                  if (!isAddress(to)) {
                    console.error("Delegatee is not a valid address");
                    return;
                  }

                  onDelegate(to);
                }}
              >
                Delegate
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-neutral-900"></div>
    </>
  );
};

export default DelegateModal;
