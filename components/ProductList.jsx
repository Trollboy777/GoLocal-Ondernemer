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
function ProductCreatePopup({ onCancel, onSave }) {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        image_url: "",
        weight: "",
        category_id: "",
    });
    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Afbeeldingen ophalen van de database
        const fetchImages = async () => {
            try {
                setLoading(true);
                const response = await fetch("http://145.24.223.203:80/products");
                const data = await response.json();
                const availableImages = data.data.products.map((product) => product.image_url);
                setImages([...new Set(availableImages)]); // Zorg voor unieke afbeeldingen
            } catch (err) {
                console.error("Fout bij ophalen van afbeeldingen:", err);
            } finally {
                setLoading(false);
            }
        };

        // Categorieën ophalen
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await fetch("http://145.24.223.203:80/categories");
                const data = await response.json();
                setCategories(data.data.categories || []);
            } catch (err) {
                console.error("Fout bij ophalen van categorieën:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validatie: Controleer vereiste velden
        if (!formData.name || !formData.price || !formData.image_url || !formData.category_id) {
            alert("Alle verplichte velden moeten ingevuld zijn.");
            return;
        }

        formData.price = parseFloat(formData.price) || 0;
        formData.weight = parseFloat(formData.weight) || 1;

        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Product maken</h2>
                {loading ? (
                    <p>Laden...</p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Naam"
                            required
                        />
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Beschrijving"
                            rows="3"
                        />
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Prijs (bijv. 19.99)"
                            required
                        />
                        {/* Dropdown voor categorieën */}
                        <select
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        >
                            <option value="" disabled>
                                Selecteer een categorie
                            </option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {/* Dropdown voor afbeelding keuze */}
                        <select
                            name="image_url"
                            value={formData.image_url}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            required
                        >
                            <option value="" disabled>
                                Selecteer een afbeelding
                            </option>
                            {images.map((image, index) => (
                                <option key={index} value={image}>
                                    {image}
                                </option>
                            ))}
                        </select>
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

// Component: Popup voor productbewerking (blijft ongewijzigd)
function ProductEditPopup({ product, onCancel, onSave }) {
    const [formData, setFormData] = useState(product);

    useEffect(() => {
        setFormData(product);
    }, [product]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    Product bewerken
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        value={formData.name || ""}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Naam"
                    />
                    <input
                        type="number"
                        name="price"
                        value={formData.price || ""}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Prijs"
                    />
                    <input
                        type="text"
                        name="image_url"
                        value={formData.image_url || ""}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Afbeeldings-URL"
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
export default function ProductList({onTitleClick}) {
    const [products, setProducts] = useState([]);
    const [editableProduct, setEditableProduct] = useState(null);
    const [companyId, setCompanyId] = useState(null);
    const [showCreatePopup, setShowCreatePopup] = useState(false);

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

    const handleCreateNewProduct = (newProduct) => {
        if (!newProduct.image_url) {
            console.error("Afbeelding is niet geselecteerd!");
            alert("Zorg ervoor dat je een afbeelding selecteert.");
            return;
        }

        const payload = {
            name: newProduct.name,
            description: newProduct.description || "Geen beschrijving opgegeven",
            price: parseFloat(newProduct.price),
            image_url: newProduct.image_url, // Controleer dit veld opnieuw!
            weight: parseFloat(newProduct.weight) || 1,
            company_id: companyId,
            category_id: newProduct.category_id,
        };

        console.debug("Controleer payload: ", JSON.stringify(payload, null, 2)); // Helpt debugging enorm!

        fetch("http://145.24.223.203:80/products", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "fail") {
                    console.error("Fout van server: ", data.message);
                    alert(`Er is een fout opgetreden: ${data.message}`);
                } else {
                    console.log("Product succesvol aangemaakt!");
                    fetchProducts(companyId); // Ververs producten
                    setShowCreatePopup(false);
                }
            })
            .catch((err) => {
                console.error("Netwerk of JSON-fout: ", err);
            });
    };

    return (
        <div className="flex flex-col h-full relative">
            <div
                className="text-2xl font-bold mb-4 px-6 pt-6 text-gray-800 border-b-2 border-blue-500 pb-2 inline-block cursor-pointer"
                onClick={onTitleClick} // <-- HIER IS DE VERANDERING
            >
                <h2 className="text-2xl font-bold mb-4 px-6 pt-6 text-gray-800  ">
                    Producten
                </h2>
            </div>


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
                                <img
                                    src={
                                        product.image_url?.startsWith("http")
                                            ? product.image_url
                                            : `http://145.24.223.203/${product.image_url}`
                                    }
                                    alt={product.name}
                                    className="h-20 w-20 object-cover rounded-lg shadow-sm"
                                />
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
                                <button
                                    onClick={() => setEditableProduct(product)}
                                    className="bg-white p-3 rounded-full border border-gray-200 shadow-sm hover:bg-gray-100 transition-colors flex items-center justify-center"
                                >
                                    <Pencil className="w-5 h-5 text-gray-600" />
                                </button>
                                <button
                                    onClick={() =>
                                        fetch(`http://145.24.223.203:80/products/${product._id}`, {
                                            method: "DELETE",
                                            headers: {
                                                Authorization: `Bearer ${localStorage.getItem("token")}`,
                                            },
                                        })
                                            .then(() => fetchProducts(companyId))
                                            .catch((err) =>
                                                console.error("Fout bij verwijderen product:", err)
                                            )
                                    }
                                    className="bg-white p-3 rounded-full border border-gray-200 shadow-sm hover:bg-gray-100 transition-colors flex items-center justify-center"
                                >
                                    <Trash2 className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        </div>
                    ))}
            </div>

            <button
                onClick={() => setShowCreatePopup(true)}
                className="absolute bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center z-10"
            >
                <Plus className="w-8 h-8" />
            </button>

            {editableProduct && (
                <ProductEditPopup
                    product={editableProduct}
                    onCancel={() => setEditableProduct(null)}
                    onSave={(updatedProduct) => {
                        fetch(
                            `http://145.24.223.203:80/products/${updatedProduct._id}`,
                            {
                                method: "PATCH",
                                headers: {
                                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify(updatedProduct),
                            }
                        )
                            .then(() => {
                                setEditableProduct(null);
                                fetchProducts(companyId);
                            })
                            .catch((err) =>
                                console.error("Fout bij opslaan product:", err)
                            );
                    }}
                />
            )}

            {showCreatePopup && (
                <ProductCreatePopup
                    onCancel={() => setShowCreatePopup(false)}
                    onSave={handleCreateNewProduct}
                />
            )}
        </div>
    );
}