import React, { useEffect, useState } from "react";
import { Camera, Plus, X } from 'lucide-react';

function getUserIdFromToken() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.id;
    } catch (e) {
        console.error('Token decoding failed:', e);
        return null;
    }
}

export default function CreateCompanyForm() {
    const [editMode, setEditMode] = useState(false);
    const [company_id, setCompany_id] = useState(null);
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image_url: '',
        category_id: '',
        tagInput: '',
        tag: [],
        adress: {
            coordinates: { x: '', y: '', z: '' },
            zipcode: '',
            street: '',
            city: ''
        },
        open_times: {
            monday: '', tuesday: '', wednesday: '', thursday: '',
            friday: '', saturday: '', sunday: ''
        }
    });

    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await fetch("http://145.24.223.203:80/categories");
                const data = await response.json();
                setCategories(data.data.categories);
            } catch (error) {
                console.error("Fout bij ophalen categorieën:", error);
            }
        }
        fetchCategories();
    }, []);

    const inputClasses = "w-full bg-blue-50 p-3 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-400";
    const labelClasses = "font-medium text-gray-700 mb-1 block";
    const sectionTitleClasses = "text-lg font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-2";

    useEffect(() => {
        async function fetchOwnCompany() {
            try {
                const response = await fetch('http://145.24.223.203:80/companies', {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                });

                const data = await response.json();
                const userId = getUserIdFromToken();

                const myCompany = data.data.companies.find((comp) => {
                    const compUserId = Array.isArray(comp.user_id) ? comp.user_id[0] : comp.user_id;
                    return compUserId === userId;
                });

                if (myCompany) {
                    setFormData(prev => {
                        const updatedAdress = {
                            ...prev.adress,
                            ...(myCompany.adress || {})
                        };
                        if (!updatedAdress.coordinates) {
                            updatedAdress.coordinates = { x: '', y: '', z: '' };
                        }

                        return {
                            ...prev,
                            ...myCompany,
                            tagInput: '',
                            adress: updatedAdress,
                            open_times: {
                                ...prev.open_times,
                                ...(myCompany.open_times || {})
                            }
                        };
                    });
                    setCompany_id(myCompany._id);
                    setEditMode(true);
                }
            } catch (err) {
                console.error('Fout bij ophalen eigen bedrijf:', err);
            }
        }

        fetchOwnCompany();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAdressChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            adress: {
                ...prev.adress,
                [name]: value
            }
        }));
    };

    const handleCoordinateChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            adress: {
                ...prev.adress,
                coordinates: {
                    ...prev.adress.coordinates,
                    [name]: value
                }
            }
        }));
    };

    const handleOpenTimeChange = (day, value) => {
        setFormData(prev => ({
            ...prev,
            open_times: {
                ...prev.open_times,
                [day]: value
            }
        }));
    };

    const handleAddTag = () => {
        if (formData.tagInput.trim() && !formData.tag.includes(formData.tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tag: [...prev.tag, formData.tagInput.trim()],
                tagInput: ''
            }));
        }
    };

    const handleDeleteTag = (tagToDelete) => {
        setFormData(prev => ({
            ...prev,
            tag: prev.tag.filter(tag => tag !== tagToDelete)
        }));
    };

    const handleSubmit = async () => {
        const bodyData = { ...formData };
        delete bodyData.tagInput;

        if (Object.values(bodyData.open_times).every(x => x === '')) {
            delete bodyData.open_times;
        }

        const method = editMode ? 'PATCH' : 'POST';
        const url = editMode
            ? `http://145.24.223.203:80/companies/${company_id}`
            : 'http://145.24.223.203:80/companies';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(bodyData)
            });

            const data = await response.json();

            if (response.ok) {
                alert(editMode ? "Bedrijf succesvol bijgewerkt" : "Bedrijf succesvol toegevoegd");
                if (!editMode) {
                    setEditMode(true);
                    setCompany_id(data.data.company._id);
                }
            } else {
                alert(data.message || 'Fout bij aanmaken bedrijf');
            }
        } catch (err) {
            console.error('Fout:', err);
            alert('Netwerkfout');
        }
    };

    return (
        <div className="flex flex-col h-full">
            <h2 className="text-2xl font-bold mb-4 px-6 pt-6 text-gray-800 border-b-2 border-blue-500 pb-2 inline-block">
                {editMode ? 'Bedrijf Bewerken' : 'Nieuw Bedrijf Aanmaken'}
            </h2>

            <div className="flex-1 bg-gray-50 px-6 py-4 overflow-y-auto space-y-4">
                <div className="space-y-4">
                    <h3 className={sectionTitleClasses}>Algemene Informatie</h3>
                    <input name="name" placeholder="Naam" value={formData.name} onChange={handleChange} className={inputClasses} />
                    <input name="description" placeholder="Beschrijving" value={formData.description} onChange={handleChange} className={inputClasses} />
                    <input name="image_url" placeholder="Afbeelding URL" value={formData.image_url} onChange={handleChange} className={inputClasses} />
                    <select name="category_id" value={formData.category_id} onChange={handleChange} className={inputClasses}>
                        <option value="">Selecteer een categorie</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-4">
                    <h3 className={sectionTitleClasses}>Tags</h3>
                    <div className="flex items-center gap-2">
                        <input
                            name="tagInput"
                            placeholder="Voeg tag toe"
                            value={formData.tagInput}
                            onChange={(e) => setFormData(prev => ({ ...prev, tagInput: e.target.value }))}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                            className={inputClasses + " flex-grow"}
                        />
                        <button onClick={handleAddTag} className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors flex-shrink-0">
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tag.map(tag => (
                            <span key={tag} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                {tag}
                                <button onClick={() => handleDeleteTag(tag)} className="text-red-500 hover:text-red-700 ml-1">
                                    <X className="w-4 h-4" />
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className={sectionTitleClasses}>Adres</h3>
                    <input name="street" placeholder="Straat" value={formData.adress.street} onChange={handleAdressChange} className={inputClasses} />
                    <input name="zipcode" placeholder="Postcode" value={formData.adress.zipcode} onChange={handleAdressChange} className={inputClasses} />
                    <input name="city" placeholder="Stad" value={formData.adress.city} onChange={handleAdressChange} className={inputClasses} />
                    <input name="x" placeholder="X (lat)" value={formData.adress.coordinates.x} onChange={handleCoordinateChange} className={inputClasses} />
                    <input name="y" placeholder="Y (lon)" value={formData.adress.coordinates.y} onChange={handleCoordinateChange} className={inputClasses} />
                    <input name="z" placeholder="Z (hoogte)" value={formData.adress.coordinates.z} onChange={handleCoordinateChange} className={inputClasses} />
                </div>

                <div className="space-y-4">
                    <h3 className={sectionTitleClasses}>Openingstijden</h3>
                    {Object.keys(formData.open_times).map((day) => (
                        <div key={day}>
                            <label htmlFor={day} className="capitalize font-medium text-gray-700 mb-1 block">{day}:</label>
                            <input
                                id={day}
                                value={formData.open_times[day]}
                                onChange={(e) => handleOpenTimeChange(day, e.target.value)}
                                placeholder="bijv. 08:00-17:00"
                                className={inputClasses}
                            />
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleSubmit}
                    className="w-full mt-6 bg-blue-700 text-white p-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors shadow-md"
                >
                    {editMode ? 'Bedrijf Bewerken' : 'Bedrijf Aanmaken'}
                </button>
            </div>

            <div className="border-t pt-2 mt-4 text-center text-gray-500 text-sm px-4 pb-4">
                Preview op de telefoon
            </div>
        </div>
    );
}
