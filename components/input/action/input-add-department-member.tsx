import { FC, useState } from "react";
import {
  Address,
  Hash,
  encodeFunctionData,
  isAddress,
  zeroAddress,
} from "viem";
import { Button, Dropdown, InputText, TextAreaRichText } from "@aragon/ods";
import { Action } from "@/utils/types";
import { parseBigInt } from "@/utils/bigint";
import { VerifiedContributorTagManagerContract } from "@/ovc-indexer/contracts/VerifiedContributorTagManager";
import { TasksContract } from "@/ovc-indexer/openrd-indexer/contracts/Tasks";
import { deployment } from "@/ovc-indexer/contracts/deployment";
import axios from "axios";
import { AddToIpfsRequest, AddToIpfsResponse } from "@/pages/api/addToIpfs";
import { UserReturn } from "@/ovc-indexer/api/return-types";
import { reviver } from "@/ovc-indexer/openrd-indexer/utils/json";

interface InputAddDepartmentMemberProps {
  dao: Address;
  tag: Hash;
  onAddActions: (actions: Action[]) => any;
}
export const InputAddDepartmentMember: FC<InputAddDepartmentMemberProps> = ({
  dao,
  tag,
  onAddActions,
}) => {
  const [newMember, setNewMember] = useState<string>("");
  const [responsibility, setResponsibility] = useState<string>("");
  const [salary, setSalary] = useState<
    {
      tokenName: string;
      tokenContract: string;
      amount: string;
    }[]
  >([]);

  const actionEntered = async () => {
    if (!isAddress(newMember)) {
      throw new Error(`Invalid value for newMember: ${newMember}`);
    }
    const newMemberAddress = newMember;
    const newMemberNfts = await axios
      .get(`/indexer/user/${newMemberAddress}`)
      .then(
        (response) =>
          JSON.parse(JSON.stringify(response.data), reviver) as UserReturn
      )
      .then((response) => response.verifiedContributors);
    const newMemberNftId = newMemberNfts.at(0);
    if (newMemberNftId === undefined) {
      throw new Error(
        `${newMember} doesn't hold any Verified Contributor NFT.`
      );
    }

    const taskInfo = {
      title: `Department Membership of ${newMemberAddress}`,
      tags: [{ tag: "Department Task" }],
      description: `<p>Member is responsible for:</p>${responsibility}`,
    };
    const request: AddToIpfsRequest = {
      json: JSON.stringify(taskInfo),
    };

    const metadata = await axios
      .post("/api/addToIpfs", request)
      .then((response) => response.data as AddToIpfsResponse)
      .then((response) => response.cid)
      .then((cid) => `ipfs://${cid}`);
    const deadline = BigInt(
      Math.round(new Date().getTime() / 1000) + 60 * 24 * 60 * 60 // 60 days from now (will be extended every payment)
    );
    const manager = dao;
    const disputeManager =
      deployment.smartAccounts.departments.disputeDepartment;
    const budget = salary.map((salaryItem) => {
      if (!isAddress(salaryItem.tokenContract)) {
        throw new Error(`Invalid salary token ${salaryItem.tokenContract}`);
      }
      const salaryAmount = parseBigInt(salaryItem.amount);
      if (!salaryAmount) {
        throw new Error(`Invalid salary amount ${salaryItem.amount}`);
      }

      return {
        tokenContract: salaryItem.tokenContract,
        amount: salaryAmount,
      };
    });
    const preapprove = [
      {
        applicant: newMemberAddress,
        nativeReward: [],
        reward: budget.map((budgetItem) => {
          return {
            nextToken: true,
            to: newMemberAddress,
            amount: budgetItem.amount,
          };
        }),
      },
    ];

    onAddActions([
      {
        to: VerifiedContributorTagManagerContract.address,
        value: BigInt(0),
        data: encodeFunctionData({
          abi: VerifiedContributorTagManagerContract.abi,
          functionName: "addTag",
          args: [newMemberNftId, tag],
        }),
      },
      {
        to: TasksContract.address,
        value: BigInt(0),
        data: encodeFunctionData({
          abi: TasksContract.abi,
          functionName: "createTask",
          args: [
            metadata,
            deadline,
            manager,
            disputeManager,
            budget,
            preapprove,
          ],
        }),
      },
    ]);
    setNewMember("");
    setResponsibility("");
    setSalary([]);
  };

  return (
    <div className="my-6">
      <div className="mb-3">
        <InputText
          label="Add Verified Contributor"
          placeholder="0x1234..."
          variant={!newMember || isAddress(newMember) ? "default" : "critical"}
          value={newMember}
          onChange={(e) => setNewMember(e.target.value || "")}
        />
        <TextAreaRichText
          label="Member Responsibilities"
          placeholder="- Filling in this placeholder and filling in the rest of the fields"
          value={responsibility}
          onChange={(value) => setResponsibility(value || "")}
        />
        <div>
          {salary.map((salaryItem, i) => (
            <div key={i}>
              <span>Salary item #{i + 1}</span>
              <Dropdown.Container label={salaryItem.tokenName}>
                <Dropdown.Item
                  onSelect={() => {
                    setSalary(
                      salary.map((item, index) => {
                        if (index === i) {
                          return {
                            ...item,
                            tokenName: "USDT",
                            tokenContract: "0x0",
                          };
                        }

                        return item;
                      })
                    );
                  }}
                >
                  USDT
                </Dropdown.Item>
              </Dropdown.Container>
              <InputText
                label="Amount"
                placeholder="0"
                variant={
                  parseBigInt(salaryItem.amount) !== undefined
                    ? "default"
                    : "critical"
                }
                value={salaryItem.amount}
                onChange={(e) => {
                  setSalary(
                    salary.map((item, index) => {
                      if (index === i) {
                        return {
                          ...item,
                          amount: e.target.value || "",
                        };
                      }

                      return item;
                    })
                  );
                }}
              />
              <Button
                onClick={() =>
                  setSalary(salary.filter((_, index) => index !== i))
                }
              >
                X
              </Button>
            </div>
          ))}
          <Button
            onClick={() =>
              setSalary(
                salary.concat([
                  {
                    tokenName: "Select token",
                    tokenContract: zeroAddress,
                    amount: "0",
                  },
                ])
              )
            }
          >
            Add salary token
          </Button>
        </div>
      </div>
      <Button onClick={() => actionEntered().catch(console.error)}>
        Add action
      </Button>
    </div>
  );
};
