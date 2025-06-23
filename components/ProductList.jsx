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

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [editableProduct, setEditableProduct] = useState(null);
    const [companyId, setCompanyId] = useState(null);

    // Haalt producten op voor het bedrijf
    const fetchProducts = useCallback((companyId) => {
        if (!companyId) {
            console.error("Geen company_id aanwezig bij het ophalen van producten.");
            return;
        }

        console.log("Ophalen producten voor company_id:", companyId);

        fetch(`http://145.24.223.203:80/products?company_id=${companyId}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data && data.data && data.data.products) {
                    setProducts(data.data.products);
                } else {
                    console.error("Geen producten gevonden:", data);
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

            // Zoek het bedrijf dat hoort bij deze gebruiker
            const userCompany = data.data.companies.find((company) =>
                company.user_id.includes(userId)
            );

            if (userCompany) {
                setCompanyId(userCompany._id);
                fetchProducts(userCompany._id); // Haal de producten op voor dit bedrijf
            } else {
                console.error("Geen bedrijf gevonden voor deze gebruiker.");
            }
        } catch (err) {
            console.error("Fout bij ophalen bedrijf:", err);
        }
    }, [fetchProducts]);

    // useEffect om bedrijf en producten te laden
    useEffect(() => {
        (async () => {
            await fetchUserCompany(); // Wacht expliciet op de Promise
        })();
    }, [fetchUserCompany]);

    const handleEditClick = (product) => {
        setEditableProduct(product);
    };

    const handleSave = (updatedProduct) => {
        fetch(`http://145.24.223.203:80/products/${updatedProduct._id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(updatedProduct),
        })
            .then(() => {
                setEditableProduct(null);
                fetchProducts(companyId); // Hernieuw de productenlijst
            })
            .catch((err) =>
                console.error("Fout bij opslaan product:", err)
            );
    };

    const handleCancelEdit = () => {
        setEditableProduct(null);
    };

    const handleDeleteClick = (productId) => {
        if (window.confirm("Weet je zeker dat je dit product wilt verwijderen?")) {
            fetch(`http://145.24.223.203:80/products/${productId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
                .then(() => {
                    fetchProducts(companyId); // Vernieuw de lijst na verwijderen
                })
                .catch((err) =>
                    console.error("Fout bij verwijderen product:", err)
                );
        }
    };

    return (
        <div className="flex flex-col h-full relative">
            <h2 className="text-2xl font-bold mb-4 px-6 pt-6 text-gray-800 border-b-2 border-blue-500 pb-2 inline-block">
                Producten
            </h2>

            <div className="flex-1 px-6 py-4 overflow-y-auto space-y-4">
                {products.map((product) => (
                    <div
                        key={product._id}
                        className="flex items-center justify-between bg-white rounded-xl shadow-md p-4 border border-gray-100"
                    >
                        <div className="flex items-center gap-4">
                            <img
                                src={
                                    product.image_url.startsWith("http")
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
                                    € {product.price.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => handleEditClick(product)}
                                className="bg-white p-3 rounded-full border border-gray-200 shadow-sm hover:bg-gray-100 transition-colors flex items-center justify-center"
                            >
                                <Pencil className="w-5 h-5 text-gray-600" />
                            </button>
                            <button
                                onClick={() => handleDeleteClick(product._id)}
                                className="bg-white p-3 rounded-full border border-gray-200 shadow-sm hover:bg-gray-100 transition-colors flex items-center justify-center"
                            >
                                <Trash2 className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Plus-knop */}
            <button className="absolute bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center z-10">
                <Plus className="w-8 h-8" />
            </button>

            {editableProduct && (
                <ProductEditPopup
                    product={editableProduct}
                    onCancel={handleCancelEdit}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}