import React from "react";

export interface OptionItem {
  name: string;
  value: string;
}

interface Props {
  option: OptionItem;
  handleOptionSelect: (value: string) => void;
  handleOptionShow: (value: boolean) => void;
}
export const CustomOption = ({
  option,
  handleOptionSelect,
  handleOptionShow,
}: Props) => {
  const handleClick = () => {
    handleOptionSelect(option.value);
    handleOptionShow(false);
  };
  return (
    <li
      className={`relative cursor-default select-none py-2.5 pl-5 
pr-9 text-gray-700 hover:bg-gray-200 rounded-lg font-normal 
hover:cursor-pointer text-[14px]`}
      onClick={handleClick}
    >
      <div className="flex">
        <span className="truncate">{option.name}</span>
      </div>
    </li>
  );
};
