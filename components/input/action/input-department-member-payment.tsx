import { FC, useEffect, useState } from "react";
import { Address, encodeFunctionData } from "viem";
import { Button, Dropdown, InputText } from "@aragon/ods";
import { Action } from "@/utils/types";
import { parseBigInt } from "@/utils/bigint";
import { TasksContract } from "@/ovc-indexer/openrd-indexer/contracts/Tasks";
import { Task, TaskState } from "@/ovc-indexer/openrd-indexer/types/tasks";
import { useAccount } from "wagmi";
import axios from "axios";
import { replacer, reviver } from "@/ovc-indexer/openrd-indexer/utils/json";
import { ObjectFilter } from "@/ovc-indexer/openrd-indexer/api/filter";
import { FilterTasksReturn } from "@/ovc-indexer/openrd-indexer/api/return-types";
import { defaultChain, defaultPublicClient } from "@/config/wagmi-config";

interface InputDepartmentMemberPaymentProps {
  dao: Address;
  onAddActions: (actions: Action[]) => any;
}
export const InputDepartmentMemberPayment: FC<
  InputDepartmentMemberPaymentProps
> = ({ dao, onAddActions }) => {
  const [taskId, setTaskId] = useState<bigint | undefined>(undefined);
  const [amounts, setAmounts] = useState<string[]>([]);

  const actionEntered = async () => {
    if (taskId === undefined) {
      throw new Error(`Invalid value for taskId: ${taskId}`);
    }

    const partialNativeReward: bigint[] = [];
    const partialReward = amounts.map((amount) => {
      const amountBigint = parseBigInt(amount);
      if (!amountBigint) {
        throw new Error(`Invalid amount ${amount}`);
      }

      return amountBigint;
    });

    onAddActions([
      {
        to: TasksContract.address,
        value: BigInt(0),
        data: encodeFunctionData({
          abi: TasksContract.abi,
          functionName: "partialPayment",
          args: [taskId, partialNativeReward, partialReward],
        }),
      },
    ]);
    setTaskId(undefined);
    setAmounts([]);
  };

  const { address } = useAccount();
  const [departmentTasks, setDepartmentTasks] = useState<bigint[]>([]);
  useEffect(() => {
    const getDepartmentTasks = async () => {
      if (!address) {
        setDepartmentTasks([]);
        return;
      }

      const filter: ObjectFilter = {
        chainId: {
          equal: defaultChain.id,
        },
        manager: {
          equal: dao.toLowerCase(),
          convertValueToLowercase: true,
        },
        state: {
          equal: TaskState.Taken,
        },
        executorApplication: {
          equal: 0,
        },
        applications: {
          objectFilter: {
            0: {
              objectFilter: {
                applicant: {
                  equal: address.toLowerCase(),
                  convertValueToLowercase: true,
                },
              },
            },
          },
        },
        cachedMetadata: {
          objectFilter: {
            tags: {
              some: {
                objectFilter: {
                  tag: {
                    equal: "Department Task",
                  },
                },
              },
            },
          },
        },
      };
      const response = await axios.post(
        "/openrd-indexer/filterTasks",
        JSON.parse(JSON.stringify(filter, replacer))
      );
      const tasks = JSON.parse(
        JSON.stringify(response.data),
        reviver
      ) as FilterTasksReturn;
      setDepartmentTasks(tasks.map((t) => t.taskId));
    };

    getDepartmentTasks().catch(console.error);
  }, [address, dao]);

  const [task, setTask] = useState<Task | undefined>(undefined);
  useEffect(() => {
    const getTask = async () => {
      if (taskId === undefined) {
        setTask(undefined);
        return;
      }

      const blockchainTask = await defaultPublicClient.readContract({
        abi: TasksContract.abi,
        address: TasksContract.address,
        functionName: "getTask",
        args: [taskId],
      });
      setTask(blockchainTask as any as Task); // Ignore readonly
    };

    getTask().catch(console.error);
  }, [taskId]);

  useEffect(() => {
    if (!task) {
      setAmounts([]);
      return;
    }

    setAmounts(task.budget.map((_) => "0")); // Initialize a 0 amount for each token
  }, [task]);

  return (
    <div className="my-6">
      <div className="mb-3">
        <Dropdown.Container label="Department Task">
          {departmentTasks.map((departmentTask, i) => (
            <Dropdown.Item key={i} onSelect={() => setTaskId(departmentTask)}>
              Task #{departmentTask.toString()}
            </Dropdown.Item>
          ))}
        </Dropdown.Container>
        {task &&
          task.budget.map((budgetItem, i) => (
            <InputText
              key={i}
              label={`Amount of ${budgetItem.tokenContract}`}
              value={amounts.at(i) ?? "0"}
              onChange={(e) => {
                amounts[i] = e.target.value;
              }}
            />
          ))}
      </div>
      <Button onClick={() => actionEntered().catch(console.error)}>
        Add action
      </Button>
    </div>
  );
};
