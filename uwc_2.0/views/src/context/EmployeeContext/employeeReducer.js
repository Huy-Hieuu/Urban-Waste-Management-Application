
const employeeReducer = (state, action) => {

    switch (action.type) {
        case 'get': 
            return action.data

        case 'delete':  {
            const { id: toRemoveId } = action.data
            const remainAssets = state.filter((item) => item.id !== toRemoveId)
            return remainAssets
        }

        case 'update': {
            const { id, data } = action.data
            let toUpdateIndex = state.findIndex((e) => e.id === id)
            state[toUpdateIndex] = data
            return [...state]
        }

        case 'patch': {
            const { id, data } = action.data
            let toUpdateIndex = state.findIndex((e) => e.id === id)
            for (let key in data) {
                state[toUpdateIndex][key] = data[key]
            }
            return [...state]
        }
        
        case 'add': {
            const { data } = action.data
            return [data, ...state]
        }

        default:
            return state
    }
}

export default employeeReducer