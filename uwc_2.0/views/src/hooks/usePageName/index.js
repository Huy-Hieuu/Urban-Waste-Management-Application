import { useEffect, useState } from "react";

const routesMap = {
    Dashboard: '/',
    Employee: '/employee',
    RouteMap: '/route-map',
    Vehicle: '/vehicle',
    Message: '/message',
    Schedule: '/schedule'
}

const usePageName = () => {
    const [ pageName, setPageName ] = useState("");
    const pages = {
        Dashboard: 'Dashboard',
        Employee : 'Employee',
        RouteMap : 'RouteMap',
        Vehicle: 'Vehicle',
        Message: 'Message',
        Schedule : 'Schedule',
    }
    const handleGetPageName = () => {
        let location = window.location.pathname;
        let currentPage = undefined;
        for (let page in routesMap) {
            if (location.includes(routesMap[page])) {
                currentPage = page
                if (currentPage === 'Schedule') currentPage = 'Employee'
            };
        }
        setPageName(currentPage);
    }

    useEffect(handleGetPageName);
    return {pageName, pages}
}

export default usePageName;