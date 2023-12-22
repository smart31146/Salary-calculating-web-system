import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import React, { useEffect, useRef, useState } from "react";

import { CustomOption, OptionItem } from "./CustomOption";

interface Props {
  options: OptionItem[];
  value: string;
  onChange: (value: string) => void;
}
export const CustomSelect = ({ options, value, onChange }: Props) => {
  const [showOption, setShowOptionState] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>("");
  const selectRef = useRef<HTMLDivElement>(null);

  const setShowOption = (value: boolean) => {
    if (options.length == 0 && value) return;
    setShowOptionState(value);
  };

  const handleOptionSelect = (value: string) => {
    onChange(value);
  };

  const checkShowName = () => {
    const tmp = options.filter((option: OptionItem) => {
      return option.value.toString() === value.toString();
    });

    if (tmp.length > 0) setDisplayName(tmp[0].name);
  };

  useEffect(() => {
    checkShowName();
  }, [value, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setShowOption(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full">
      <div
        className="flex  h-12 items-center  bg-white shadow-sm lg:opacity-100 opacity-95 lg:border-2
       rounded-lg"
      >
        <div className="relative w-full" ref={selectRef}>
          <div
            className="cselect py-3 pl-6 hover:cursor-pointer shadow-sm w-full flex  text-gray-700 text-base rounded-lg"
            onClick={(e) => {
              e.preventDefault();
              setShowOption(!showOption);
            }}
          >
            {options.length > 0 ? displayName : "No data"}
            <div
              className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2  
          focus:outline-none text-gray-700"
            >
              <IconChevronDown
                strokeWidth={2.5}
                className={` text-gray-500 h-6 w-6 transition-transform duration-0 lg:duration-200 ${
                  showOption ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>

          <div
            className={`absolute w-full transform transition-transform duration-0 lg:duration-200 origin-top ${
              showOption ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
            }`}
          >
            <ul
              className="z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-gray-50 lg:bg-white lg:border-2
            text-base shadow-sm focus:outline-none sm:text-sm p-1 transition-opacity duration-200"
            >
              {options.map((option: OptionItem, index) => (
                <CustomOption
                  key={index}
                  option={option}
                  handleOptionSelect={handleOptionSelect}
                  handleOptionShow={setShowOption}
                />
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
