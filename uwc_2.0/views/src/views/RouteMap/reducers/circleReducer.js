

const circleReducer = (state, action) => {

    switch (action.type) {
         case 'get': {
            return action.data
        }
        case 'delete':  {
            const { id: toRemoveId } = action.data
            const remainCircles = state.filter((e) => e.id !== toRemoveId)
            return remainCircles
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
            if (Array.isArray(data)) {
                return [...data, ...state]
            }
            return [data, ...state]
        }   
        case 'reset': 
            return []
        default:
            return []
    }
}

export default circleReducer