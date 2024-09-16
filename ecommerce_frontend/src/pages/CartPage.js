import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarTop from '../components/layout/NavBarTop';
import EcomNavbar from '../components/layout/EcomNavbar';
import Cart from '../components/Cart';

const CartPage = () => {
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
        <Cart onUpdateCart={handlerRefresh} onUpdateNavbar={handlerRefreshNavbar}/>
        </>

    );
};

export default CartPage;
