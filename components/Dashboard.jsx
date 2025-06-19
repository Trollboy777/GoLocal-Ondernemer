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
            {/* Achtergrond van de kolom zelf is lichtgrijs, geen border-r */}
            <div className="flex flex-col w-1/3 bg-gray-50 rounded-xl shadow-md overflow-hidden"> {/* overflow-hidden voor ronde hoeken bij scroll */}
                <ProductList />
            </div>

            {/* Bedrijfsinformatie Kolom */}
            {/* Achtergrond van de kolom zelf is lichtgrijs, geen border-r */}
            <div className="flex flex-col w-1/3 bg-gray-50 rounded-xl shadow-md overflow-hidden"> {/* overflow-hidden voor ronde hoeken bij scroll */}
                <div className="p-6"> {/* Padding toegevoegd voor inhoud Bedrijfsinformatie */}
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800">Bedrijfsinformatie</h2> {/* Titelstijl uit afbeelding */}
                    <CreateCompanyForm />
                </div>
                {/* De "Preview op de telefoon" verplaatst naar aparte div in CreateCompanyForm voor styling */}
                {/* Omdat CreateCompanyForm zelf al een aparte div is, hoeft dit hier niet dubbel */}
            </div>

            {/* Accountinformatie Kolom */}
            {/* Achtergrond van de kolom zelf is lichtgrijs */}
            <div className="flex flex-col w-1/3 bg-gray-50 rounded-xl shadow-md overflow-hidden"> {/* overflow-hidden voor ronde hoeken bij scroll */}
                <AccountForm /> {/* AccountForm component hier plaatsen */}
            </div>
        </div>
    );
}