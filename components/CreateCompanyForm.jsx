import React, { useEffect, useState } from "react";

// JWT token helper
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

    const inputStyle = {
        backgroundColor: '#E6F4FF',
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        marginBottom: '10px',
        width: '100%'
    };

    // Fetch categorieën
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

    // 🟢 Fetch bedrijf van huidige gebruiker
    useEffect(() => {
        async function fetchOwnCompany() {
            try {
                console.log('PATCH naar bedrijf:', company_id);
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
                    setFormData(prev => ({
                        ...prev,
                        ...myCompany,
                        tagInput: '',
                    }));
                    setCompany_id(myCompany._id);
                    setEditMode(true);
                }
            } catch (err) {
                console.error('Fout bij ophalen eigen bedrijf:', err);
            }
        }

        fetchOwnCompany();
    }, []);

    // Handlers
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

    // UI
    return (
        <div className="space-y-4 text-sm text-gray-700">
            <h2 className="text-xl font-bold mb-4">
                {editMode ? 'Bedrijf Bewerken' : 'Nieuw Bedrijf Aanmaken'}
            </h2>

            <input name="name" placeholder="Naam" value={formData.name} onChange={handleChange} style={inputStyle} />
            <input name="description" placeholder="Beschrijving" value={formData.description} onChange={handleChange} style={inputStyle} />
            <input name="image_url" placeholder="Afbeelding URL" value={formData.image_url} onChange={handleChange} style={inputStyle} />

            <select name="category_id" value={formData.category_id} onChange={handleChange} style={inputStyle}>
                <option value="">Selecteer een categorie</option>
                {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
            </select>

            <div>
                <h4 className="font-medium">Tags</h4>
                <div className="flex items-center gap-2">
                    <input
                        name="tagInput"
                        placeholder="Voeg tag toe"
                        value={formData.tagInput}
                        onChange={(e) => setFormData(prev => ({ ...prev, tagInput: e.target.value }))}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                        style={inputStyle}
                    />
                    <button onClick={handleAddTag} className="bg-blue-500 text-white px-3 py-2 rounded">+</button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tag.map(tag => (
                        <span key={tag} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                            {tag} <button onClick={() => handleDeleteTag(tag)} className="text-red-500 ml-1">x</button>
                        </span>
                    ))}
                </div>
            </div>

            <h4 className="font-medium mt-4">Adres</h4>
            <input name="street" placeholder="Straat" value={formData.adress.street} onChange={handleAdressChange} style={inputStyle} />
            <input name="zipcode" placeholder="Postcode" value={formData.adress.zipcode} onChange={handleAdressChange} style={inputStyle} />
            <input name="city" placeholder="Stad" value={formData.adress.city} onChange={handleAdressChange} style={inputStyle} />
            <input name="x" placeholder="X (lat)" value={formData.adress.coordinates.x} onChange={handleCoordinateChange} style={inputStyle} />
            <input name="y" placeholder="Y (lon)" value={formData.adress.coordinates.y} onChange={handleCoordinateChange} style={inputStyle} />
            <input name="z" placeholder="Z (hoogte)" value={formData.adress.coordinates.z} onChange={handleCoordinateChange} style={inputStyle} />

            <h4 className="font-medium mt-4">Openingstijden</h4>
            {Object.keys(formData.open_times).map((day) => (
                <div key={day}>
                    <label className="capitalize">{day}</label>
                    <input
                        value={formData.open_times[day]}
                        onChange={(e) => handleOpenTimeChange(day, e.target.value)}
                        placeholder="bijv. 08:00-17:00"
                        style={inputStyle}
                    />
                </div>
            ))}

            <button
                onClick={handleSubmit}
                className="w-full mt-4 bg-green-600 text-white p-2 rounded hover:bg-green-700"
            >
                {editMode ? 'Bedrijf Bewerken' : 'Bedrijf Aanmaken'}
            </button>
        </div>
    );
}
