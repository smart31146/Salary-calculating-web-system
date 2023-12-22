import React, { useEffect, useState } from 'react';
import { AssetLiabilitiesHeader } from './Header'
import { AssetLiabilitiesChart } from './Chart'
import { Stack, Button, Grid } from '@mui/material';
import { AssetLiabilitiesIncomeTable } from './IncomeTable';
import { AssetsTable } from './AssetTable';
import { LiabilitiesTable } from './LiabilitiesTable';

export const AssetLiabilitiesContainer = () => {
    const [selectedChartId, setSelectedChartId] = useState('')
    const [selectedChartData, setSelectedChartData] = useState({})
    const [selectedChartIncome, setSelectedChartIncome] = useState([])
    const [selectedChartAssets, setSelectedChartAssets] = useState([])
    const [selectedChartLiabilities, setSelectedChartLiabilities] = useState([])
    const [chartData, setChartData] = useState([])
    const [hasIncomeDataUpdated, setHasIncomeDataUpdated] = useState(false)
    const [hasAssetDataUpdated, setHasAssetDataUpdated] = useState(false)
    const [hasLiabilityDataUpdated, setHasLiabilityDataUpdated] = useState(false)
    let user = JSON.parse(localStorage.getItem('user'))

    const handleOptionChange = (value) => {
        console.log('option changeee', value)
        setSelectedChartId(value)
        fetchSelectedChartIncome(user, value)
        fetchSelectedChartAssets(user, value)
        fetchSelectedChartLiabilities(user, value)
    }
    const onUpdateIncomeData = (value) => {
        setHasIncomeDataUpdated(value)
    }

    const onUpdateAssetData = (value) => {
        setHasAssetDataUpdated(value)
    }

    const onUpdateLiabilityData = (value) => {
        setHasLiabilityDataUpdated(value)
    }

    const fetchSelectedChartData = async (user, docId) => {
        if (!user?._id) {
            alert('You may need to login!')
            return
        }
        console.log('callinggg checkk')
        const response = await fetch(`/api/assetliabilities/chartdata/selected?docId=${docId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
            const data = await response.json();
            setSelectedChartData({ ...data?.data })
            console.log('rrresponse selected chart dataa', data)
        } else {
            console.log('eeeeeee', response)
            // setErrMsg('User not found or email already verified');
        }
    }
    const fetchSelectedChartIncome = async (user, docId) => {
        if (!user?._id) {
            alert('You may need to login!')
            return
        }
        console.log('callinggg nooo')
        const response = await fetch(`/api/assetliabilities/income?userId=${user?._id}&docId=${docId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
            const data = await response.json();
            setSelectedChartIncome([...data?.data])
            console.log('rrresponse selected income', data?.data)
        } else {
            console.log('eeeeeee', response)
            // setErrMsg('User not found or email already verified');
        }
        setHasIncomeDataUpdated(false)
    }

    const fetchSelectedChartAssets = async (user, docId) => {
        if (!user?._id) {
            alert('You may need to login!')
            return
        }
        console.log('callinggg nooo')
        const response = await fetch(`/api/assetliabilities/assets?userId=${user?._id}&docId=${docId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
            const data = await response.json();
            setSelectedChartAssets([...data?.data])
            console.log('rrresponse selected assets', data?.data)
        } else {
            console.log('eeeeeee', response)
            // setErrMsg('User not found or email already verified');
        }
        setHasAssetDataUpdated(false)
    }

    const fetchSelectedChartLiabilities = async (user, docId) => {
        if (!user?._id) {
            alert('You may need to login!')
            return
        }
        const response = await fetch(`/api/assetliabilities/liabilities?userId=${user?._id}&docId=${docId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
            const data = await response.json();
            setSelectedChartLiabilities([...data?.data])
            console.log('rrresponse selected liabilities', data?.data)
        } else {
            console.log('eeeeeee', response)
            // setErrMsg('User not found or email already verified');
        }
        setHasLiabilityDataUpdated(false)
    }

    const fetchAssetLiabilities = async () => {
        let user = JSON.parse(localStorage.getItem('user'))

        console.log('calling fetch asset liabilities', user?._id)
        if (!user?._id) {
            alert('You may need to login!')
            return
        }
        console.log('callinggg 1233')
        const response = await fetch(`/api/assetliabilities/chartdata?id=${user?._id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        if (response.ok) {
            const data = await response.json();
            const optionsAndValues = data?.data.map(d => {
                return { option: d?.chartName, value: d?._id }
            }) || []
            setChartData([...optionsAndValues])
            // fetchSelectedChartIncome(user, optionsAndValues?.[0]?.value)
            setSelectedChartId(optionsAndValues?.[0]?.value)
            console.log('rrresponse', data)
        } else {
            console.log('eeeeeee', response)
            // setErrMsg('User not found or email already verified');
        }
    }
    useEffect(() => {
        fetchAssetLiabilities()
    }, [])

    useEffect(() => {
        fetchSelectedChartData(user, selectedChartId)
    }, [selectedChartId])

    useEffect(() => {
        fetchSelectedChartIncome(user, selectedChartId)
    }, [selectedChartId, hasIncomeDataUpdated])

    useEffect(() => {
        fetchSelectedChartAssets(user, selectedChartId)
    }, [selectedChartId, hasAssetDataUpdated])

    useEffect(() => {
        fetchSelectedChartLiabilities(user, selectedChartId)
    }, [selectedChartId, hasLiabilityDataUpdated])


    return (
        <>
     <div className="flex flex-col lg:p-3 p-1 w-screen lg:w-full printable-content">
        <Stack gap={4}>
                <AssetLiabilitiesHeader
                    allCharts={chartData}
                    selectedChartId={selectedChartId}
                    handleOptionChange={handleOptionChange}
                    incomeList={selectedChartIncome}
                    assetList={selectedChartAssets}
                    liabilitiesList={selectedChartLiabilities}
                />
               <div className={`bg-softPurpleApp rounded-xl lg:py-5 my-4 flex justify-center`}>
                <AssetLiabilitiesChart 
                   assetData={selectedChartAssets}
                   liabilityData={selectedChartLiabilities}
                   incomeData={selectedChartIncome}
                   selectedChartData={selectedChartData}
                />
               </div>
                <AssetLiabilitiesIncomeTable
                    selectedIncomeData={selectedChartIncome}
                    selectedChartId={selectedChartId}
                    onUpdateIncomeData={onUpdateIncomeData}
                    onIncomeDelete={onUpdateIncomeData}
                    selectedChartData={selectedChartData}
                />
                <AssetsTable
                    selectedChartId={selectedChartId}
                    onUpdateAssetData={onUpdateAssetData}
                    onAssetDelete={onUpdateAssetData}
                    selectedChartData={selectedChartData}
                    selectedChartAssetData={selectedChartAssets}
                />
                <LiabilitiesTable
                    onLiabilityDelete={onUpdateLiabilityData}
                    onUpdateLiabilityData={onUpdateLiabilityData}
                    selectedChartId={selectedChartId}
                    selectedChartData={selectedChartData}
                    selectedChartLiabilitiesData={selectedChartLiabilities}
                />
      </Stack>
      </div>
        </>
    )
};
