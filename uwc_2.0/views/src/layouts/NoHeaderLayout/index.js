
const NoHeaderLayout = ({children}) => {
    return (
        <div className="w-full h-[100vh] overflow-overlay">
            {children}
        </div>
    );
}

export default NoHeaderLayout;