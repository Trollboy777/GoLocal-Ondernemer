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

    const handleClick = (panelName) => {
        setActivePanel(activePanel === panelName ? null : panelName);
    };

    return (
        // Hoofdcontainer:
        // Op mobiel: flex-col, h-auto (past zich aan de totale inhoud aan), overflow-y-auto om alles te scrollen
        // Op desktop: md:flex-row, md:h-screen (vult de schermhoogte), md:overflow-hidden (scrollen gebeurt in de kolommen)
        <div className="flex flex-col h-auto overflow-y-auto
                        md:flex-row md:h-screen md:overflow-hidden
                        w-full bg-white p-2 md:p-4 gap-4 md:gap-6">

            {/* Producten Kolom */}
            <div
                // Op mobiel: w-full (hele breedte), h-auto (past zich aan inhoud aan)
                // Op desktop: md:h-full (vult de hoogte van de main flex container), dynamische breedte
                className={`w-full h-auto md:h-full ${getColumnWidth('products')} ${getPanelClasses('products')} cursor-pointer`}
                onClick={() => handleClick('products')}
            >
                <ProductList />
            </div>

            {/* Bedrijfsinformatie Kolom */}
            <div
                className={`w-full h-auto md:h-full ${getColumnWidth('company')} ${getPanelClasses('company')} cursor-pointer`}
                onClick={() => handleClick('company')}
            >
                <CreateCompanyForm />
            </div>

            {/* Accountinformatie Kolom */}
            <div
                className={`w-full h-auto md:h-full ${getColumnWidth('account')} ${getPanelClasses('account')} cursor-pointer`}
                onClick={() => handleClick('account')}
            >
                <AccountForm />
            </div>
        </div>
    );
}