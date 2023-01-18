import { useMemo } from "react";
import { FormSelectInputOption } from "../types";
import { StyledFormSelectInputItem } from "./styles";
import CheckboxCheckedIcon from "@mui/icons-material/CheckBox";
import CheckboxUncheckedIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import RadioCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";

interface MenuItemProps {
  currentValue: string | string[];
  option: FormSelectInputOption;
  multiple: boolean;
  handleSelectedItem: (val: string) => void;
  handleUnselectedItem: (val: string) => void;
}

const FormSelectInputItem = ({ currentValue, option, handleSelectedItem, handleUnselectedItem, multiple }: MenuItemProps) => {
  const isChecked = useMemo(
    () => (multiple ? (currentValue as string[])?.indexOf(option.value) > -1 : (currentValue as string) === option.value),
    [currentValue, multiple, option]
  );

  const handleOnChange = () => {
    if (isChecked) {
      handleUnselectedItem(option.value);
    } else {
      handleSelectedItem(option.value);
    }
  };

  const getIcon = () => {
    if (multiple) {
      if (isChecked) return <CheckboxCheckedIcon />;
      return <CheckboxUncheckedIcon />;
    } else {
      if (isChecked) return <RadioCheckedIcon />;
      return <RadioUncheckedIcon />;
    }
  };

  return (
    <StyledFormSelectInputItem htmlFor={`option-${option.value}`}>
      <span>{option.label || "---"}</span>
      {getIcon()}
      <input id={`option-${option.value}`} checked={isChecked} onChange={handleOnChange} type={multiple ? "checkbox" : "radio"} />
    </StyledFormSelectInputItem>
  );
};

export { FormSelectInputItem };
