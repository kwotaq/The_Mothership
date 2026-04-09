export const SearchBox = ({setFilter}: { setFilter: (value: string) => void }) => {

    return (
        <div className="interactive-panel p-2 mr-6">
            <input className="w-full h-full outline-none bg-transparent"
                type="text"
                placeholder="Search..."
                onChange={(e) => {
                    setFilter(e.target.value)
                }}/>
        </div>
    )
}