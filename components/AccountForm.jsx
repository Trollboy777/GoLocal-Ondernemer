// src/AccountForm.jsx
import React, { useState } from "react";
import { ChevronLeft, User, MapPin, Edit, LogOut } from 'lucide-react'; // Iconen voor de account sectie

export default function AccountForm({onTitleClick}) {
    // Voorbeeld state voor account info (pas aan naar je echte data structuur)
    const [accountInfo, setAccountInfo] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAccountInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveProfile = () => {
        // Implementeer logica om profielinfo op te slaan
        console.log("Profiel opslaan:", accountInfo);
        alert("Profielinformatie opgeslagen!");
    };

    const handleSavePassword = () => {
        // Implementeer logica om wachtwoord te wijzigen
        console.log("Wachtwoord opslaan:", accountInfo);
        alert("Wachtwoord gewijzigd!");
        // Eventueel wachtwoordvelden resetten
        setAccountInfo(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmNewPassword: '' }));
    };

    const inputClasses = "w-full bg-blue-50 p-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400";
    const labelClasses = "font-medium text-gray-700 mb-1 block";
    const saveButtonClasses = "w-full mt-4 bg-blue-700 text-white p-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors shadow-md";

    return (
        <div className="flex flex-col h-full rounded-xl overflow-hidden">
            <div
                className="text-2xl font-bold mb-4 px-6 pt-6 text-gray-800 border-b-2 border-blue-500 pb-2 inline-block cursor-pointer"
                onClick={onTitleClick} // <-- HIER IS DE VERANDERING
            >
                <h2 className="text-2xl font-bold mb-4 px-6 pt-6 text-gray-800 ">
                    Account informatie
                </h2>
            </div>


            {/* Profielfoto en Naam */}
            <div className="flex flex-col items-center p-6 pb-4">
                <div className="relative w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-blue-500">
                    <User className="w-16 h-16 text-gray-500" /> {/* Standaard gebruikersicoon */}
                    {/* Hier zou je een img tag plaatsen als er een profielfoto is */}
                </div>
                <h3 className="text-xl font-bold mt-3 text-gray-800">Gebruikersnaam</h3> {/* Naam of gebruikersnaam */}
                <p className="text-sm text-gray-500">Email@voorbeeld.com</p> {/* E-mailadres */}
            </div>

            {/* Accountinstellingen formulier */}
            <div className="flex-1 overflow-y-auto p-6 pt-0 space-y-5"> {/* Scrollbaar gedeelte */}
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Accountinformatie</h2> {/* Titel */}

                {/* Profielinformatie */}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="firstName" className={labelClasses}>Voornaam:</label>
                        <input id="firstName" name="firstName" placeholder="Voornaam" value={accountInfo.firstName} onChange={handleChange} className={inputClasses} />
                    </div>
                    <div>
                        <label htmlFor="lastName" className={labelClasses}>Achternaam:</label>
                        <input id="lastName" name="lastName" placeholder="Achternaam" value={accountInfo.lastName} onChange={handleChange} className={inputClasses} />
                    </div>
                    <div>
                        <label htmlFor="username" className={labelClasses}>Gebruikersnaam:</label>
                        <input id="username" name="username" placeholder="Gebruikersnaam" value={accountInfo.username} onChange={handleChange} className={inputClasses} />
                    </div>
                    <div>
                        <label htmlFor="email" className={labelClasses}>E-mail:</label>
                        <input id="email" name="email" type="email" placeholder="E-mail" value={accountInfo.email} onChange={handleChange} className={inputClasses} />
                    </div>
                    <button onClick={handleSaveProfile} className={saveButtonClasses}>
                        Opslaan
                    </button>
                </div>

                {/* Wachtwoord wijzigen */}
                <div className="space-y-4 pt-4 border-t border-gray-200"> {/* Scheiding tussen secties */}
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">Wachtwoord wijzigen</h3>
                    <div>
                        <label htmlFor="currentPassword" className={labelClasses}>Huidig wachtwoord:</label>
                        <input id="currentPassword" name="currentPassword" type="password" placeholder="Huidig wachtwoord" value={accountInfo.currentPassword} onChange={handleChange} className={inputClasses} />
                    </div>
                    <div>
                        <label htmlFor="newPassword" className={labelClasses}>Nieuw wachtwoord:</label>
                        <input id="newPassword" name="newPassword" type="password" placeholder="Nieuw wachtwoord" value={accountInfo.newPassword} onChange={handleChange} className={inputClasses} />
                    </div>
                    <div>
                        <label htmlFor="confirmNewPassword" className={labelClasses}>Herhaal nieuw wachtwoord:</label>
                        <input id="confirmNewPassword" name="confirmNewPassword" type="password" placeholder="Herhaal nieuw wachtwoord" value={accountInfo.confirmNewPassword} onChange={handleChange} className={inputClasses} />
                    </div>
                    <button onClick={handleSavePassword} className={saveButtonClasses}>
                        Opslaan
                    </button>
                </div>

                {/* Logout knop (optioneel, kan ook in de nav bar) */}
                <div className="pt-4 border-t border-gray-200 text-center">
                    <button className="text-red-500 font-semibold hover:text-red-700 transition-colors flex items-center justify-center mx-auto gap-2">
                        <LogOut className="w-5 h-5" /> Uitloggen
                    </button>
                </div>

                <div className="pt-4 border-t border-gray-200 text-center">
                    <button className="bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors flex items-center justify-center mx-auto gap-2 px-4 py-2 rounded">
                        <LogOut className="w-5 h-5" /> Account verwijderen
                    </button>
                </div>
            </div>
        </div>
    );
}