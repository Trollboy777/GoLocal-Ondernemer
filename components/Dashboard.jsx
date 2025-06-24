// src/Layout.jsx
import React, { useState } from "react";
import CreateCompanyForm from "./CreateCompanyForm.jsx";
import ProductList from "./ProductList.jsx";
import AccountForm from "./AccountForm.jsx";

export default function Layout() {
    const [activePanel, setActivePanel] = useState(null);

    const getColumnWidth = (panelName) => {
        if (activePanel === null) {
            return "md:w-1/3";
        } else if (activePanel === panelName) {
            return "md:w-2/3";
        } else {
            return "md:w-1/6";
        }
    };

    const getPanelClasses = (panelName) => {
        const baseClasses = "flex flex-col rounded-xl shadow-md transition-all duration-300 ease-in-out";
        if (activePanel === panelName || activePanel === null) {
            return `${baseClasses} bg-gray-50`;
        } else {
            return `${baseClasses} bg-gray-100 shadow-sm`;
        }
    };

    // handleClick blijft hier, maar wordt doorgegeven als prop
    const handlePanelClick = (panelName) => {
        setActivePanel(activePanel === panelName ? null : panelName);
    };

    return (
        <div className="flex flex-col h-auto overflow-y-auto
                        md:flex-row md:h-screen md:overflow-hidden
                        w-full bg-white p-2 md:p-4 gap-4 md:gap-6">

            {/* Producten Kolom */}
            <div
                className={`w-full h-auto md:h-full ${getColumnWidth('products')} ${getPanelClasses('products')}`}
                // onClick en cursor-pointer HIER VERWIJDERD
            >
                {/* Geef de click handler door als prop */}
                <ProductList onTitleClick={() => handlePanelClick('products')} />
            </div>

            {/* Bedrijfsinformatie Kolom */}
            <div
                className={`w-full h-auto md:h-full ${getColumnWidth('company')} ${getPanelClasses('company')}`}
                // onClick en cursor-pointer HIER VERWIJDERD
            >
                {/* Geef de click handler door als prop */}
                <CreateCompanyForm onTitleClick={() => handlePanelClick('company')} />
            </div>

            {/* Accountinformatie Kolom */}
            <div
                className={`w-full h-auto md:h-full ${getColumnWidth('account')} ${getPanelClasses('account')}`}
                // onClick en cursor-pointer HIER VERWIJDERD
            >
                {/* Geef de click handler door als prop */}
                <AccountForm onTitleClick={() => handlePanelClick('account')} />
            </div>
        </div>
    );
}