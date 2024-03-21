import { InputText } from "@aragon/ods";
import { AbiParameter } from "viem";
import { decodeCamelCase } from "@/utils/case";
import {
  InputValue,
  isValidStringValue,
  handleStringValue,
  readableTypeName,
} from "@/utils/input-values";
import { useEffect, useState } from "react";

interface IInputParameterTextProps {
  abi: AbiParameter;
  idx: number;
  onChange: (paramIdx: number, value: InputValue) => any;
}

export const InputParameterText = ({
  abi,
  idx,
  onChange,
}: IInputParameterTextProps) => {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    // Clean up if another function is selected
    setValue(null);
  }, [abi, idx]);

  const handleValue = (val: string) => {
    setValue(val);

    const parsedValue = handleStringValue(val, abi.type);
    if (parsedValue === null) return;

    onChange(idx, parsedValue);
  };

  return (
    <div className="flex">
      <InputText
        name={
          "abi-input-" + idx + "-" + (abi.name || abi.internalType || abi.type)
        }
        addon={abi.name ? decodeCamelCase(abi.name) : "Parameter " + (idx + 1)}
        placeholder={
          abi.type
            ? readableTypeName(abi.type)
            : decodeCamelCase(abi.name) || ""
        }
        variant={
          value === null || isValidStringValue(value, abi.type)
            ? "default"
            : "critical"
        }
        value={value || ""}
        onChange={(e) => handleValue(e.target.value)}
      />
    </div>
  );
};
