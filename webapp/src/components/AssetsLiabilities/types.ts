export interface DrawerProps {
    openDrawerState: boolean;
    toggleDrawer: any;
    selectedChartId: string | number;
    onUpdate?: any;
    dataToUpdate?: any;
    action: 'Create' | 'Update'
    selectedAssetCategory?:any
}

export interface LiabilityProps {
    selectedChartId: string | number 
    selectedChartLiabilitiesData: any; 
    onUpdateLiabilityData?: any;
    onLiabilityDelete?: any;
    selectedChartData?: any;
}

export interface AssetProps {
    selectedChartId: string | number
    selectedChartAssetData: any;
    onUpdateAssetData?: any;
    onAssetDelete?: any;
    selectedChartData?: any;
}

export type ActionType = 'Create' | 'Update';