import SearchBar from "../SearchBar"
import { useCallback, useState, memo } from "react"
import MCPDetail from "../McpDetail"
import { useMcpContext } from "../../../../context/McpContext/McpProvider"
import McpItem from "./components/McpItem"

const MCPList = () => {

    const [ showMCPDetail, setShowMCPDetail ] = useState({visible: false, id: null})
    const { mcps } = useMcpContext()

    const handleMCPPress = useCallback((id) => {
        setShowMCPDetail({visible: true, id: id})
    }, [])

    const handleCloseMCPDetail = useCallback(() => {
        setShowMCPDetail({visible: false, id: null})
    }, [])

    return (
        <div className="w-full flex">
            <div className="flex flex-col gap-4 min-w-full">
                <SearchBar className="h-12 mr-4"/>
                <section className="h-[500px] pr-4 overflow-auto">
                    {mcps?.map(mcp => (
                        <McpItem
                            key={mcp.id}
                            data={mcp}
                            onSelect={handleMCPPress}
                        />
                    ))}
                </section>
            </div>

            <section className={`min-w-full transition-all bg-white ${showMCPDetail.visible ? "block -translate-x-full": "translate-x-0"}`}>
                {showMCPDetail.visible && 
                <MCPDetail
                    id={showMCPDetail.id}
                    onClose={handleCloseMCPDetail}
                />}
            </section>
        </div>
    )
}

export default memo(MCPList)

