import McpModel from "../models/mcps"
import RouteModel from "../models/route"

const getMcps = async () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({data: [
                McpModel.create({
                    //id: 0
                    name: "MCP 0",
                    location: {
                        x: 10.768384,
                        y: 106.658254
                    },
                    work_radius: 600,
                    location_name: "10 Le Thanh Ton",
                }),
                McpModel.create({
                    //id: 0
                    name: "MCP 1",
                    location: {
                        x: 10.762357,
                        y: 106.662085
                    },
                    work_radius: 600,
                    location_name: "102 Pham Ngu Lao",
                }),
                McpModel.create({
                    //id: 2
                    name: "MCP 2",
                    location: {
                        x: 10.757372,
                        y: 106.663417
                    },
                    location_name: "87 Cao Thang",
                    work_radius: 600,
                }),
                McpModel.create({
                    //id: 4
                    name: "MCP 3",
                    location: {
                        x: 10.762120,
                        y: 106.669341
                    },
                    location_name: "20 Le Thanh Ton",
                    work_radius: 600,
                }),
                McpModel.create({
                    //id: 2
                    name: "MCP 4",
                    location: {
                        x: 10.769650,
                        y: 106.670166
                    },
                    location_name: "102 Ta Quang Buu",
                    work_radius: 600,
                }),
                McpModel.create({
                    //id: 3
                    name: "MCP 5",
                    location: {
                        x: 10.775690,
                        y: 106.667341
                    },
                    location_name: "90 Bac Hai",
                    work_radius: 600,
                }),
            ]})
        }, 1000);
    })
}

const addMcp = async (data) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                data: McpModel.create(data)
            })
        },1000);
    })
}

const updateMcp = async (data) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({data})
        });
    })
}

const getRoutes = async () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({data: []})
        }, 1000);
    })
}

const addRoute = async (data) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({data: RouteModel.create(data)})
        }, 1000);
    })
}

const updateRoute = async (data) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({data: data})
        }, 1000);
    })
}

const getContains = async () => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({data: []})
        }, 1000);
    })
}

export {getContains, getMcps, getRoutes, updateMcp, addRoute, updateRoute, addMcp }