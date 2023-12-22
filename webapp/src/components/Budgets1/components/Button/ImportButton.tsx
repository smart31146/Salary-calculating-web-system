import { InboxArrowDownIcon } from "@heroicons/react/24/outline";
import { Button, MenuItem } from "@material-tailwind/react";
import React, { useRef } from "react";

interface Props {
  budgetId: string | undefined;
  reloalData: () => void;
}

export const ImportButton = ({ budgetId, reloalData }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function convertCSVStringToObjectArray(csvString: string): any[] {
    const lines: string[] = csvString.split("\n");
    const headers: string[] = lines[0].split(",");

    for (let i = 0; i < headers.length; i++) {
      headers[i] = headers[i].trim();
    }

    const objects: any[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values: string[] = lines[i].split(",");
      const obj: any = {};

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = values[j] ? values[j].trim() : values[j];
      }
      objects.push(obj);
    }

    return objects;
  }

  const handleFileChange = (event: any) => {
    const fileReader = new FileReader();
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      fileReader.onload = function (event: any) {
        const text = event.target.result;
        const data = convertCSVStringToObjectArray(text);
        uploadFile(data);
        console.log(data);
      };

      fileReader.readAsText(file);
    }
  };

  const handleUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const uploadFile = async (importFile: any) => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (!importFile || importFile.length == 0) {
      alert("The file does not meet the required format, please check again.");
      return;
    }
    const response = await fetch(`/api/budget/import`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(JSON.stringify({ data: importFile, budgetId })),
    });

    reloalData();
  };
  return (
    <div>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <MenuItem className="flex items-center gap-3" onClick={handleUpload}>
        <InboxArrowDownIcon className="h-5 w-5" />
        Import
      </MenuItem>
    </div>
  );
};
