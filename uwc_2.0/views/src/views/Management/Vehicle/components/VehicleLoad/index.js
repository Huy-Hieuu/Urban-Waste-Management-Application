

const VehicleLoad = ({value=0}) => {
    const percent = String(value * 100) + "%"

    return (
        <div className="flex items-center justify-start gap-2">
            <div className="bg-white border-b-2 w-[200px] h-[34px] relative">
                <div className={`absolute bg-red-400 h-full left-0 top-0 z-40`}
                    style={{width: percent}}
                />
            </div>
            <span>{percent}</span>
        </div>
    )
}

export default VehicleLoad