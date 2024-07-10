import { FC, useState } from "react";
import { Dropdown } from "@aragon/ods";
import { Action } from "@/utils/types";
import { InputMintOVC } from "./input-mint-ovc";
import { Address, Hash } from "viem";
import { InputAddDepartmentMember } from "./input-add-department-member";
import { InputDepartmentMemberPayment } from "./input-department-member-payment";
import { InputTokenBridge } from "./input-token-bridge";

export enum ActionTemplate {
  None,
  MintOVC,
  AddDepartmentMember,
  DepartmentMemberPayment,
  TokenBridge,
}

interface ActionTemplateFormProps {
  templates: ActionTemplate[];
  dao: Address;
  tag: Hash;
  onAddActions: (actions: Action[]) => any;
}
export const ActionTemplateForm: FC<ActionTemplateFormProps> = ({
  templates,
  dao,
  tag,
  onAddActions,
}) => {
  const [actionTemplate, setActionTemplate] = useState<ActionTemplate>(
    ActionTemplate.None
  );

  const actionsEntered = (actions: Action[]) => {
    onAddActions(actions);
    setActionTemplate(ActionTemplate.None);
  };

  return (
    <div className="my-6">
      <div className="mb-3">
        <Dropdown.Container label="Action">
          {templates.includes(ActionTemplate.MintOVC) && (
            <Dropdown.Item
              onSelect={() => setActionTemplate(ActionTemplate.MintOVC)}
            >
              Mint Verified Contributor
            </Dropdown.Item>
          )}
          {templates.includes(ActionTemplate.AddDepartmentMember) && (
            <Dropdown.Item
              onSelect={() =>
                setActionTemplate(ActionTemplate.AddDepartmentMember)
              }
            >
              Add Department Member
            </Dropdown.Item>
          )}
          {templates.includes(ActionTemplate.DepartmentMemberPayment) && (
            <Dropdown.Item
              onSelect={() =>
                setActionTemplate(ActionTemplate.DepartmentMemberPayment)
              }
            >
              Request Payment
            </Dropdown.Item>
          )}
          {templates.includes(ActionTemplate.TokenBridge) && (
            <Dropdown.Item
              onSelect={() => setActionTemplate(ActionTemplate.TokenBridge)}
            >
              Bridge LINK
            </Dropdown.Item>
          )}
        </Dropdown.Container>
      </div>
      {actionTemplate === ActionTemplate.MintOVC && (
        <InputMintOVC onAddActions={actionsEntered} />
      )}
      {actionTemplate === ActionTemplate.AddDepartmentMember && (
        <InputAddDepartmentMember
          onAddActions={actionsEntered}
          dao={dao}
          tag={tag}
        />
      )}
      {actionTemplate === ActionTemplate.DepartmentMemberPayment && (
        <InputDepartmentMemberPayment onAddActions={actionsEntered} dao={dao} />
      )}
      {actionTemplate === ActionTemplate.TokenBridge && (
        <InputTokenBridge onAddActions={actionsEntered} />
      )}
    </div>
  );
};
