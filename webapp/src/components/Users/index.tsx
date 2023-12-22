import {
    TABLE_HEAD,
    TABLE_HEAD_MOBILE,
    biWeeklyFactor,
    checkIsMobile,
    formatCurrency,
    generateRandomTableName,
    getDrawerPlacement,
    weeksInMonth,
  } from "@/constants/Budgets.constant";
  import { NumericFormat } from "react-number-format";
  import {
    ArrowPathIcon,
    InboxArrowDownIcon,
    CreditCardIcon,
    PlusIcon,
    TrashIcon
  } from "@heroicons/react/24/outline";
  import { PencilSquareIcon } from "@heroicons/react/24/solid";
  import {
    Button,
    Chip,
    Drawer,
    IconButton,
    Input,
    Tooltip,
    Typography,
  } from "@material-tailwind/react";
  import { useEffect, useState, useRef, useContext, Fragment } from "react";
  import { scroller } from "react-scroll";
  import BudgetsContext from "../../Budgets.context";
  import { CategoryChartv2 } from "../Chart/CategoryChartv2";
import { IncomeTableProps } from "../../../../type/Budgets.type";
  
  interface incomeInputProps {
      id?: string;
      name: string;
      monthlyAmount: number;
      note: string;
  }
  
  const isMobile = checkIsMobile();
  
  const tableId = generateRandomTableName();
  
  const tableHead = [
      'Email',
      'Username',
      'City',
      'Gender',
      'IsStaff',
      'IsSuperAdmin',
      'Verified',
      'Delete',
      'Edit'
  ]
  
  export const Users: React.FC<IncomeTableProps> = () => {
    let mainColor = "bg-[#1E90FF]";
    mainColor = "bg-softGreenApp";
    const [users, setUsers] = useState([])
    const [selectedData, setSelectedData] = useState({})
    const [open, setOpen] = useState(false)
    const handleOpenModal = (data) => {
        setSelectedData({ ...data })
        setOpen(true)
    }
    const handleFormSubmit = async (data: any) => {
        try {
            // Fetch registration data from the API
            const response = await fetch(`/api/users`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data
                }),
            });

            // If registration is successful, navigate to the login page
            if (response.ok) {
                const user = await response.json();
                fetchUsers()
                console.log('userrrrrrrrrrrrrr', user)
            }
        } catch (error) {
            console.log('error');
        }
    }

    const deleteUser = async (data: any) => {
        try {
            // Fetch registration data from the API
            const response = await fetch(`/api/users?id=${data?._id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            // If registration is successful, navigate to the login page
            if (response.ok) {
                const user = await response.json();
                fetchUsers()
                console.log('userrrrrrrrrrrrrr', user)
            }
        } catch (error) {
            console.log('error');
        }
    }

    const fetchUsers = async () => {
        const response = await fetch(`/api/users/`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
            const data = await response.json();
            setUsers([...data?.data])
            console.log('rrresponse', data?.data)
        } else {
            // setErrMsg('User not found or email already verified');
        }
    }
    const updateBooleanData = async (rowData, updatedData) => {
        let data = {
            ...rowData,
            ...updatedData,
        }
        console.log(data)
        handleFormSubmit(data)

        // console.log('dataaaa', data)
    }

    useEffect(() => {
        fetchUsers()
    }, [])
  
    return (
        <div>
        <div className="flex flex-col lg:p-3 p-1 w-screen lg:w-full printable-content">
          <div className=" gap-5 flex flex-col">
            <div className="flex flex-col lg:flex-row w-full  gap-5">
            <div
          className={`flex text-textPrimary flex-col bg-white shadow-md rounded-lg overflow-hidden w-full h-fit ${
            isMobile ? "text-[10px]" : "text-[14px]"
          }`}
        >
          <div
            className={`flex justify-between items-center py-2 px-3 ${mainColor} `}
          >
            <div className="flex text-xs lg:text-[14px] font-bold items-center text-white gap-2">
              {/* <button
                className="flex  gap-2 hover:underline"
                onClick={handleOpenGroupUpdate}
              > */}
                <>
                <InboxArrowDownIcon strokeWidth={2} className="w-4 h-4 " />
                User
                </>
              {/* </button> */}
  
              <Tooltip
                className="border border-blue-gray-50 bg-white px-4 py-3 shadow-xl shadow-black/10"
                content={
                  <div className="w-80">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal opacity-80"
                    >
                      <></>
                    </Typography>
                  </div>
                }
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#fff"
                  strokeWidth={2}
                  className="h-5 w-5 cursor-pointer text-blue-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
              </Tooltip>
            </div>
            {/* <button
              className={`flex ${mainColor} items-center justify-center py-1 px-2.5 rounded-md gap-1 text-white text-xs lg:text-[14px] font-bold`}
              onClick={handleOpenInsert}
            >
              <PlusIcon strokeWidth={3} className="w-4 h-4  text-white" />
              New
            </button> */}
          </div>
          <hr className={`${mainColor} h-0.5`} />
          {/* {!["Income", "Expense"].includes(groupName) && (
            <CategoryChartv2 groupName={groupName} />
          )} */}
  
          <div className="p-0">
            <div
              id={tableId}
              className="w-full  overflow-scroll lg:overflow-hidden "
            >
              <table className={`w-full text-left md:w-4/5 lg:w-3/4 xl:w-2/3 text-left `}>
                <thead>
                  <tr>
                    {tableHead.map((head, index) => {
                     const colS = ['Email', 'Delete', 'Edit', 'Username', 'City' ].includes(head)
                    return (
                      <th
                        key={head}
                        colSpan={2}
                        className={` bg-blue-gray-50/50 p-2 
                  md:p-4 ${index == 0 ? "text-left" : "text-center"}`}
                      >
                        {head}
                      </th>
                    )
                  }
                    )}
                  </tr>
                </thead>
                <tbody>
                  {users?.map((item, index) => {
                    const classes =
                      "p-2 md:p-4 border-b border-blue-gray-50 text-center";
                    return (
                      <Fragment key={index}>
                        <tr>
                          <td colSpan={2} className="p-2 md:p-4 border-b border-blue-gray-50 text-left">
                          <Chip
                              variant="ghost"
                              color="green"
                              value={item.email}
                            />
                          </td>
                          <td colSpan={2} className={`${classes} text-left`}>
                            <Chip
                              variant="ghost"
                              color="green"
                              value={item.username}
                            />
                          </td>
                          <td colSpan={2} className={`${classes} text-left`}>
                          <div className="flex">                            
                               {item.city} 
                          </div>
                          </td>
                          <td colSpan={2} className={`${classes} text-left`}>
                          <div className="flex">                            
                               {item.gender} 
                          </div>
                          </td>
                          <td colSpan={2} className={`${classes} text-left`}>
                          <div className="flex">
                          <Button 
                          onClick={() => updateBooleanData(item, { isStaff: !item.isStaff })}
                          color="green" size="sm">
                             {item.isStaff? 'Staff' : 'Normal'} 
                          </Button>                            
                          </div>
                          </td>
                          <td colSpan={2} className={`${classes} text-left`}>
                          <div className="flex">
                          <Button 
                          onClick={() => updateBooleanData(item, { isSuperAdmin: !item.isSuperAdmin })}
                          color="green" size="sm">
                             {item.isSuperAdmin? 'Admin': 'Normal'}
                          </Button>                                                        
                          </div>
                          </td>
                          <td colSpan={2} className={`${classes} text-left`}>
                          <div className="flex">
                          <Button 
                          onClick={() => updateBooleanData(item, { verified: !item.verified })}
                          color="green" size="sm">
                             {item.verified? 'Verified' : 'UnVerified'}
                          </Button>                             
                          </div>
                          </td>  
                          <td colSpan={2} className={classes}>
                            <IconButton
                              variant="text"
                              onClick={() => deleteUser(item)}
                            >
                              <TrashIcon className="h-5 w-5" />
                            </IconButton>
                          </td>
                          <td colSpan={2} className={classes}>
                            <IconButton
                              disabled
                              variant="text"
                              onClick={() => deleteUser(item)}
                            >
                              <PencilSquareIcon className="h-5 w-5" />
                            </IconButton>
                          </td>
                        </tr>
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
            </div>
          </div>
        </div>
      </div>
        // kkkkkkk
    );
  }
  