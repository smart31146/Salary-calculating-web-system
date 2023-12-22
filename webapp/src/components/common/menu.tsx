import React, { useState } from 'react';
import {
    Select,
    Option,
    Card,
    CardBody,
    Typography,
    CardFooter,
    Button,
    Drawer,
    IconButton,
    Input,
    SpeedDial,
    SpeedDialHandler,
    SpeedDialContent,
    SpeedDialAction,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
  } from "@material-tailwind/react";
  import { PencilIcon } from "@heroicons/react/24/solid";
  import { ReactToPrint } from "react-to-print";
  import {
ArrowTopRightOnSquareIcon,
    CogIcon,
    HomeIcon,
    InboxArrowDownIcon,
    PencilSquareIcon,
    PlusIcon,
    Square3Stack3DIcon,
    PrinterIcon,
    TrashIcon,
    PlusCircleIcon,
    FolderPlusIcon,
    ClipboardDocumentIcon,
    ClipboardDocumentListIcon,
  } from "@heroicons/react/24/outline";

// const StyledMenuItem = withStyles((theme) => ({
//     root: {
//         '&:focus': {
//             backgroundColor: theme.palette.primary.main,
//             '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
//                 color: theme.palette.common.white,
//             },
//         },
//     },
// }))(MenuItem);

export default function CustomizedMenus() {
    const [openInsert, setOpenInsert] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [insertItem, setInsertItem] = useState({
        name: "",
    });

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleOpenInsert = () => {
        setInsertItem({
            name: "",
        });
        setOpenInsert(!openInsert);
    };

    return (
        <Menu placement="bottom-end">
            <MenuHandler>
                <button className="flex bg-softGreenApp items-center justify-center py-1 px-2.5 rounded-lg">
                    <PencilIcon
                        strokeWidth={2}
                        className="w-7 h-7  text-white rounded-lg "
                    />
                </button>
            </MenuHandler>
            <MenuList>
                <MenuItem
                    className="flex items-center gap-3"
                    onClick={handleOpenInsert}
                >
                    <ClipboardDocumentListIcon className="h-5 w-5" />
                    New budget
                  </MenuItem>
                <hr className="my-3 hover:outline-none" />
                <MenuItem
                    className="flex items-center gap-3"
                    // onClick={handleOpenUpdate}
                >
                    <ClipboardDocumentIcon className="h-5 w-5" />
                    Edit
                  </MenuItem>
                <MenuItem
                    className="flex items-center gap-3"
                    // onClick={deleteBudgetGroupAPI}
                >
                    <TrashIcon className="h-5 w-5" />
                    Delete
                  </MenuItem>

                <ReactToPrint
                    pageStyle={`
                    @media print {
                      body {
                         -webkit-print-color-adjust: exact;
                      }
                   }
        @page {
          size: 410mm 497mm;
          margin: 10mm;
        }
      }`}
                    trigger={() => (
                        <MenuItem className="flex items-center gap-3">
                            <PrinterIcon className="h-5 w-5" />
                            Print
                      </MenuItem>
                    )}
                    // content={() => contentRef.current}
                />

                {/* <ImportButton
                    budgetId={currentBudget?.id}
                    reloalData={fetchBudget}
                /> */}
                <MenuItem
                    className="flex items-center gap-3"
                    // onClick={handleExport}
                >
                    <ArrowTopRightOnSquareIcon className="h-5 w-5" />
                    Export
                  </MenuItem>
            </MenuList>
        </Menu>
    );
}
