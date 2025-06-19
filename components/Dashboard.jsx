import React from "react";
import CreateCompanyForm from "./CreateCompanyForm.jsx";
import ProductList from "./ProductList.jsx";

export default function Layout() {
    return (
        <div className="flex h-screen w-full bg-white p-4 gap-4"> {/* bg-gray-100 gewijzigd naar bg-white */}
            {/* Producten */}
            <div className="flex flex-col w-1/3 bg-white rounded-xl shadow p-4 border-r border-gray-300">
                <ProductList />
            </div>

            {/* Bedrijfsinformatie */}
            <div className="flex flex-col w-1/3 bg-white rounded-xl shadow p-4 border-r border-gray-300">
                <h2 className="text-xl font-semibold mb-4">Bedrijfsinformatie</h2>
                <div className="flex-1 bg-blue-50 rounded-lg p-4 mb-4">
                    <CreateCompanyForm />
                </div>
                <div className="border-t pt-2 text-center text-gray-500">
                    Preview op de telefoon
                </div>
            </div>

            {/* Accountinformatie */}
            <div className="flex flex-col w-1/3 bg-white rounded-xl shadow p-4">
                <h2 className="text-xl font-semibold mb-4">Accountinformatie</h2>
                <div className="flex-1 bg-blue-50 rounded-lg p-4 mb-4">
                    {/* account form */}
                </div>
                <div className="border-t pt-2 text-center text-gray-500">
                    Preview op de telefoon
                </div>
            </div>
        </div>
    );
}