import React, { useEffect, useState, useCallback } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";

// Hulpfunctie: Haalt het user ID op uit de JWT-token
function getUserIdFromToken() {
    try {
        const token = localStorage.getItem("token");
        if (!token) return null;
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.id;
    } catch (e) {
        console.error("Fout bij token decoding:", e);
        return null;
    }
}

// Component: Popup voor productcreatie
function ProductCreatePopup({ onCancel, onSave, companyId }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        weight: "",
        category_id: "",
        image_url: "", // Afbeelding URL. Optioneel gebruikt voor bestaande afbeeldingen bij bewerkingen.
    });
    const [categories, setCategories] = useState([]);
    const [imageFile, setImageFile] = useState(null); // Bestand voor upload
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Categories ophalen
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await fetch("http://145.24.223.203:80/categories");
                const data = await response.json();
                setCategories(data.data.categories || []);
            } catch (error) {
                console.error("Fout bij ophalen categorieën:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    // Formulier 'onChange'
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("description", formData.description || "Geen beschrijving");
        formDataToSend.append("price", parseFloat(formData.price));
        formDataToSend.append("weight", parseFloat(formData.weight) || 1);
        formDataToSend.append("category_id", formData.category_id);
        formDataToSend.append("company_id", companyId);

        if (imageFile) {
            console.log("Afbeelding uploaden:", imageFile.name);
            formDataToSend.append("image", imageFile);
        }

        try {
            const response = await fetch("http://145.24.223.203:80/products", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formDataToSend,
            });

            const data = await response.json();

            if (response.ok) {
                alert("Product aangemaakt!");
                onSave(data);
            } else {
                alert(data.message || "Fout bij aanmaken product.");
            }
        } catch (error) {
            console.error("Netwerkfout:", error);
            alert("Er is een probleem opgetreden.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Maak een nieuw product</h2>
                {loading ? (
                    <p>Laden...</p>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="block w-full p-2 mb-4 border rounded"
                            placeholder="Productnaam"
                        />
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="block w-full p-2 mb-4 border rounded"
                            placeholder="Beschrijving"
                        />
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="block w-full p-2 mb-4 border rounded"
                            placeholder="Prijs"
                        />
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            className="block w-full p-2 mb-4 border rounded"
                        >
                            <option value="">Selecteer een categorie</option>
                            {categories.map(cat => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        {formData.image_url && (
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Huidige afbeelding:</p>
                                <img
                                    src={`http://145.24.223.203/uploads/${formData.image_url}`}
                                    alt="Huidige afbeelding"
                                    className="h-20 w-20 object-cover rounded-lg shadow-md mb-3"
                                />
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                            className="block w-full p-2 mb-4 border rounded"
                        />
                        <input
                            type="number"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Gewicht (bijv. 1.5)"
                        />
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                            >
                                Annuleren
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                            >
                                Opslaan
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

// Component: Popup voor productbewerking (bewerkt naar bestand upload functionaliteit)
function ProductEditPopup({ product, onCancel, onSave }) {
    const [formData, setFormData] = useState(product);
    const [imageFile, setImageFile] = useState(null); // Voor een nieuwe upload
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch("http://145.24.223.203:80/categories");
                const data = await response.json();
                setCategories(data.data.categories || []); // Vul de categorieën
            } catch (err) {
                console.error("Fout bij ophalen van categorieën:", err);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        setFormData(product);
    }, [product]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("description", formData.description || "Geen beschrijving opgegeven");
        formDataToSend.append("price", parseFloat(formData.price));
        formDataToSend.append("weight", parseFloat(formData.weight) || 1);
        formDataToSend.append("category_id", formData.category_id);

        if (imageFile) {
            console.log("Nieuwe afbeelding geselecteerd:", imageFile.name);
            formDataToSend.append("image", imageFile);
        } else {
            console.log("Geen nieuwe afbeelding geselecteerd.");
        }

        try {
            const response = await fetch(`http://145.24.223.203:80/products/${formData._id}`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formDataToSend,
            });

            const data = await response.json();

            if (response.ok) {
                alert("Product succesvol bijgewerkt!");
                onSave(data);
            } else {
                alert(data.message || "Fout bij het bijwerken van het product.");
            }
        } catch (error) {
            console.error("Netwerkfout:", error);
            alert("Er is een probleem opgetreden.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Product bewerken</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Naam */}
                    <input
                        type="text"
                        name="name"
                        value={formData.name || ""}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Naam"
                        required
                    />

                    {/* Beschrijving */}
                    <textarea
                        name="description"
                        value={formData.description || ""}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Beschrijving"
                        rows="3"
                    />

                    {/* Prijs */}
                    <input
                        type="number"
                        name="price"
                        value={formData.price || ""}
                        onChange={handleChange}
                        step="0.01"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Prijs"
                        required
                    />

                    {/* Categorieën */}
                    <select
                        name="category_id"
                        value={formData.category_id || ""}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    >
                        <option value="">Selecteer een categorie</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    {/* Huidige afbeelding */}
                    {formData.image_url && (
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Huidige afbeelding:</p>
                            <img
                                src={formData.image_url}
                                alt="Huidige afbeelding"
                                className="h-20 w-20 object-cover rounded-lg shadow-md mb-3"
                            />
                        </div>
                    )}

                    {/* Nieuwe afbeelding uploaden */}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageFile(e.target.files[0])}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    {/* Gewicht */}
                    <input
                        type="number"
                        name="weight"
                        value={formData.weight || ""}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Gewicht"
                    />

                    {/* Actieknoppen */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                        >
                            Annuleren
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            Opslaan
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Hoofdcomponent: ProductList
export default function ProductList({ onTitleClick }) {
    const [products, setProducts] = useState([]);
    const [editableProduct, setEditableProduct] = useState(null);
    const [companyId, setCompanyId] = useState(null);
    const [showCreatePopup, setShowCreatePopup] = useState(false);

    // Haalt de lijst met producten op
    const fetchProducts = useCallback((companyId) => {
        if (!companyId) {
            console.error("Geen company_id aanwezig bij het ophalen van producten.");
            return;
        }

        fetch("http://145.24.223.203:80/products", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data && data.data && data.data.products) {
                    setProducts(data.data.products);
                }
            })
            .catch((err) => console.error("Fout bij ophalen producten:", err));
    }, []);

    // Haalt het bedrijf van de gebruiker op
    const fetchUserCompany = useCallback(async () => {
        try {
            const response = await fetch("http://145.24.223.203:80/companies", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const data = await response.json();
            const userId = getUserIdFromToken();

            const userCompany = data.data.companies.find((company) =>
                company.user_id.includes(userId)
            );

            if (userCompany) {
                setCompanyId(userCompany._id);
                fetchProducts(userCompany._id);
            }
        } catch (err) {
            console.error("Fout bij ophalen bedrijf:", err);
        }
    }, [fetchProducts]);

    useEffect(() => {
        fetchUserCompany();
    }, [fetchUserCompany]);

    // Verwerkt een nieuw aangemaakt product
    const handleCreateNewProduct = (newProduct) => {
        // Voeg het nieuwe product toe aan de lijst
        setProducts((prevProducts) => [...prevProducts, newProduct]);
        setShowCreatePopup(false); // Sluit popup
    };

    // Verwerkt een succesvol bijgewerkt product
    const handleUpdateProduct = (updatedProduct) => {
        // Werk de productlijst bij met de gewijzigde gegevens
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product._id === updatedProduct._id ? updatedProduct : product
            )
        );
        setEditableProduct(null); // Sluit popup
    };

    return (
        <div className="flex flex-col h-full relative">
            {/* Titel */}
            <div
                className="text-2xl font-bold mb-4 px-6 pt-6 text-gray-800 border-b-2 border-blue-500 pb-2 inline-block cursor-pointer"
                onClick={onTitleClick}
            >
                <h2 className="text-2xl font-bold mb-4 px-6 pt-6 text-gray-800">
                    Producten
                </h2>
            </div>

            {/* Productlijst */}
            <div className="flex-1 px-6 py-4 overflow-y-auto space-y-4">
                {products
                    .filter(
                        (product) =>
                            product.company_id === companyId || product.company_id?._id === companyId
                    )
                    .map((product) => (
                        <div
                            key={product._id}
                            className="flex items-center justify-between bg-white rounded-xl shadow-md p-4 border border-gray-100"
                        >
                            <div className="flex items-center gap-4">
                                {/* Afbeelding */}
                                <img
                                    src={
                                        product.image_url?.startsWith("http")
                                            ? product.image_url
                                            : `http://145.24.223.203/${product.image_url}`
                                    }
                                    alt={product.name}
                                    className="h-20 w-20 object-cover rounded-lg shadow-sm"
                                />
                                {/* Productgegevens */}
                                <div className="flex flex-col justify-center space-y-1">
                                    <p className="font-semibold text-gray-800 text-lg">
                                        {product.name}
                                    </p>
                                    <p className="text-base text-gray-600">
                                        € {product.price?.toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                {/* Bewerken */}
                                <button
                                    onClick={() => setEditableProduct(product)}
                                    className="bg-white p-3 rounded-full border border-gray-200 shadow-sm hover:bg-gray-100 transition-colors flex items-center justify-center"
                                >
                                    <Pencil className="w-5 h-5 text-gray-600" />
                                </button>
                                {/* Verwijderen */}
                                <button
                                    onClick={() => {
                                        const confirmDelete = window.confirm(
                                            `Weet je zeker dat je het product "${product.name}" wilt verwijderen?`
                                        );
                                        if (confirmDelete) {
                                            fetch(`http://145.24.223.203:80/products/${product._id}`, {
                                                method: "DELETE",
                                                headers: {
                                                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                                                },
                                            })
                                                .then(() => fetchProducts(companyId))
                                                .catch((err) =>
                                                    console.error("Fout bij verwijderen product:", err)
                                                );
                                        }
                                    }}
                                    className="bg-white p-3 rounded-full border border-gray-200 shadow-sm hover:bg-gray-100 transition-colors flex items-center justify-center"
                                >
                                    <Trash2 className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        </div>
                    ))}
            </div>

            {/* Nieuw product toevoegen */}
            <button
                onClick={() => setShowCreatePopup(true)}
                className="absolute bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center z-10"
            >
                <Plus className="w-8 h-8" />
            </button>

            {/* Popup voor productbewerking */}
            {editableProduct && (
                <ProductEditPopup
                    product={editableProduct}
                    onCancel={() => setEditableProduct(null)}
                    onSave={handleUpdateProduct}
                />
            )}

            {/* Popup voor nieuwe productcreatie */}
            {showCreatePopup && (
                <ProductCreatePopup
                    onCancel={() => setShowCreatePopup(false)}
                    companyId={companyId}
                    onSave={handleCreateNewProduct}
                />
            )}
        </div>
    );
}