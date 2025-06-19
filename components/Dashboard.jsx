// src/Layout.jsx
import React from "react";
import CreateCompanyForm from "./CreateCompanyForm.jsx";
import ProductList from "./ProductList.jsx";
import AccountForm from "./AccountForm.jsx"; // Nieuw component

export default function Layout() {
    return (
        // Hoofdcontainer: bg-white, px-4 (of meer/minder naar smaak), gap-4
        // Voeg een lichte schaduw toe aan de container zelf als basis voor het "frame"
        <div className="flex h-screen w-full bg-white p-4 gap-6"> {/* p-4 voor algemene padding, gap-6 voor ruimere kolomscheiding */}

            {/* Producten Kolom */}
            {/* Achtergrond van de kolom zelf is lichtgrijs, shadow-md, overflow-hidden */}
            <div className="flex flex-col w-1/3 bg-gray-50 rounded-xl shadow-md overflow-hidden">
                <ProductList />
            </div>

            {/* Bedrijfsinformatie Kolom */}
            {/* Deze kolom zelf is flex-col en vult 1/3 breedte.
                De inhoud (CreateCompanyForm) moet de rest van de ruimte vullen en zelf scrollbaar zijn.
                Verwijder de extra, geneste div met w-1/3 etc.
                De titel voor Bedrijfsinformatie is nu IN CreateCompanyForm.jsx verplaatst, net als bij ProductList.
            */}
            <div className="flex flex-col w-1/3 bg-gray-50 rounded-xl shadow-md overflow-hidden">
                <CreateCompanyForm />
            </div>

            {/* Accountinformatie Kolom */}
            {/* Achtergrond van de kolom zelf is lichtgrijs, shadow-md, overflow-hidden */}
            <div className="flex flex-col w-1/3 bg-gray-50 rounded-xl shadow-md overflow-hidden">
                <AccountForm />
            </div>
        </div>
    );
}