import React from "react";
import CreateCompanyForm from "./CreateCompanyForm.jsx";
    export default function Layout() {
        return (
            //Producten
            <div className="flex h-screen w-full bg-gray-100 p-4 gap-4">
                <div className="flex flex-col w-1/3 bg-white rounded-xl shadow p-4">
                    <h2 className="text-xl font-semibold mb-4">Producten</h2>
                    <div className="flex-1 bg-blue-50 rounded-lg p-4 mb-4">
                        //productenlijst
                        <CreateCompanyForm/>
                    </div>
                    <div className="border-t pt-2 text-center text-gray-500">
                        Preview op de telefoon
                    </div>
                </div>

                //Bedrijfsinfo
                <div className="flex flex-col w-1/3 bg-white rounded-xl shadow p-4">
                    <h2 className="text-xl font-semibold mb-4">Bedrijfsinformatie</h2>
                    <div className="flex-1 bg-blue-50 rounded-lg p-4 mb-4">
                        //formulier met bedrijfsinfo
                    </div>
                    <div className="border-t pt-2 text-center text-gray-500">
                        Preview op de telefoon
                    </div>
                </div>

                //Accountinfo
                <div className="flex flex-col w-1/3 bg-white rounded-xl shadow p-4">
                    <h2 className="text-xl font-semibold mb-4">Accountinformatie</h2>
                    <div className="flex-1 bg-blue-50 rounded-lg p-4 mb-4">
                        //
                    </div>
                    <div className="border-t pt-2 text-center text-gray-500">
                        Preview op de telefoon
                    </div>
                </div>
            </div>
        );
    }

