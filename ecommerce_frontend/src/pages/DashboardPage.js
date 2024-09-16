import React, { useState } from 'react';
import NavbarTop from '../components/layout/NavBarTop';
import EcomNavbar from '../components/layout/EcomNavbar';
import DashboardContent from '../components/DashboardContent';

const DashboardPage = () => {
    const [refresh, setRefresh] = useState(false);
    const [refreshNavbar, setRefreshNavbar] = useState(false); // New state for refreshing navbar

    const handlerRefresh = () => {
        setRefresh(prev => !prev); // Toggle refresh to trigger effect in DashboardContent
    };

    const handlerRefreshNavbar = () => {
        setRefreshNavbar(prev => !prev); // Toggle refresh for EcomNavbar
    };

    return (
        <>
            <NavbarTop onUpdate={handlerRefresh} onUpdateNavbar={handlerRefreshNavbar}/>
            <EcomNavbar refresh={refreshNavbar} />
            <DashboardContent refresh={handlerRefresh} onUpdateNavbar={handlerRefreshNavbar} />
        </>
    );
};

export default DashboardPage;
