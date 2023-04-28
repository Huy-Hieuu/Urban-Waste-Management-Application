import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCutlery, faPen, faTrash, faCalendarAlt  } from "@fortawesome/free-solid-svg-icons"
import EButton from "../../../../components/EButton"

const AssetTable = ({
    columnNames = [
        'Id',
        'Fullname',
        'Role',
        'Contact',
        'Hired Date',
    ],
    AssetKeys=['id', 'fullname', 'role', 'contact', 'hired_date'],
    assets=[],
    gridClassName="",
    onDeleteAsset,
    onUpdateAsset,
    onCalendarAsset,
    ...cellComponents
}) => {

    return (
        <div className="flex flex-col">
            <section className={`grid grid-cols-5 ${gridClassName}`}>
                {columnNames.map((colName, index) => (
                    <h3 className="font-medium p-4"
                        key={colName}
                    >
                        {colName}
                    </h3>
                ))}
            </section>
            {assets.map((item, index) => (
                <AssetRow
                    key={item.id}
                    cols={columnNames.length}
                    asset={item}
                    assetKeys={AssetKeys}
                    gridClassName={gridClassName}
                    onDeleteAsset={onDeleteAsset}
                    onUpdateAsset={onUpdateAsset}
                    onCalendarAsset={onCalendarAsset}
                    {...cellComponents}
                />
            ))}
        </div>
    )
}

const AssetRow = ({
    onUpdateAsset,
    onDeleteAsset,
    onCalendarAsset,
    asset,
    assetKeys,
    gridClassName,
    // custom component
    ...customComponents
}) => {

    const handleDeletePress = () => {
        onDeleteAsset(asset.id)
    }

    const handleUpdatePress = (e) => {
        onUpdateAsset(asset.id)
    }

    const handleSchedulePress = () => {
        console.log("ASSET ID: ", asset.id);
        onCalendarAsset(asset.id)
    }

    return (
        <>
            <div className={`grid grid-cols-5 even:bg-slate-50 ${gridClassName}`}>
                {assetKeys.map((key, index) => {
                    if (Object.keys(customComponents).includes(key)) {
                        const CustomItemComponent = customComponents[key]
                        return <CustomItemComponent key={key} value={asset[key]} id={asset.id} data={asset}/>
                    }
                    return (
                        <div className="p-4"
                            key={key}
                        >
                            {asset[key]}
                        </div>
                )})}
                <ul className="flex gap-6 text-sm">
                    <EButton
                        className="text-teal-500"
                        onClick={handleUpdatePress}
                    >
                        <FontAwesomeIcon icon={faPen}/>
                    </EButton>
                    <EButton
                        className="text-red-400"
                        onClick={handleDeletePress}
                    >
                        <FontAwesomeIcon icon={faTrash}/>
                    </EButton>
                    <EButton
                        className="text-sky-500"
                        onClick={handleSchedulePress}
                    >
                        <FontAwesomeIcon icon={faCalendarAlt }/>
                    </EButton>
                </ul>
            </div>
        </>
    )
}

export default AssetTable