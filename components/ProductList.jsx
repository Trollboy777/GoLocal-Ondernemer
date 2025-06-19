import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";

function ProductEditPopup({ product, onCancel, onSave }) {
    const [formData, setFormData] = useState(product);
    console.log("Editing product in ProductEditPopup:", product);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData); // Sla de wijzigingen op
    };

    return (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
                <h2 className="text-lg font-semibold mb-4">Product bewerken</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        value={formData.name || ""}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        placeholder="Naam"
                    />
                    <input
                        type="number"
                        name="price"
                        value={formData.price || ""}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        placeholder="Prijs"
                    />
                    <input
                        type="text"
                        name="image_url"
                        value={formData.image_url || ""}
                        onChange={handleChange}
                        className="w-full border rounded p-2"
                        placeholder="Afbeeldings-URL"
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 bg-gray-200 rounded"
                        >
                            Annuleren
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded"
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
    const [loading, setLoading] = useState(false); // Laadstatus

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        setLoading(true); // Laadstatus aan
        fetch("http://145.24.223.203:80/products")
            .then((res) => res.json())
            .then((data) => {
                setProducts(data.data.products);
                setLoading(false); // Laadstatus uit
            })
            .catch((err) => {
                console.error("Fout bij ophalen producten:", err);
                setLoading(false); // Laadstatus ook uit bij een fout
            });
    };

    const handleEditClick = (product) => {
        console.log("Clicked product for editing:", product);
        setEditableProduct(product);
    };

    const handleSave = (updatedProduct) => {
        fetch(`http://145.24.223.203:80/products/${updatedProduct._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProduct),
        })
            .then((res) => res.json())
            .then(() => {
                setEditableProduct(null);
                fetchProducts(); // Ververs productlijst
            })
            .catch((err) => console.error("Fout bij opslaan product:", err));
    };

    const handleDelete = (productId) => {
        fetch(`http://145.24.223.203:80/products/${productId}`, {
            method: "DELETE",
        })
            .then((res) => res.json())
            .then(() => {
                fetchProducts(); // Ververs productlijst
            })
            .catch((err) => console.error("Fout bij verwijderen product:", err));
    };

    const handleCancelEdit = () => {
        setEditableProduct(null);
    };

    return (
        <div className="flex flex-col w-full bg-white rounded-xl shadow-lg p-4 relative">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b-2 border-blue-500 pb-2 inline-block">
                Producten
            </h2>
            {loading ? ( // Toont indicator als producten laden
                <div className="text-center">
                    <p className="text-gray-700">Laden...</p>
                </div>
            ) : (
                <div className="flex-1 bg-white p-2 mb-4 overflow-y-auto space-y-4">
                    {products.map((product) => (
                        <div
                            key={product._id}
                            className="flex items-center justify-between bg-blue-50 rounded-xl px-4 py-4 border border-blue-100 shadow-md"
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={
                                        product.image_url?.startsWith("http")
                                            ? product.image_url
                                            : `http://145.24.223.203/${product.image_url || "default-image.jpg"}`
                                    }
                                    alt={product.name || "Geen naam"}
                                    className="h-20 w-20 object-cover rounded-lg shadow-sm"
                                />
                                <div className="flex flex-col justify-center space-y-1">
                                    <p className="font-semibold text-gray-800 text-lg">
                                        {product.name || "Geen naam"}
                                    </p>
                                    <p className="text-base text-gray-600">
                                        € {product.price?.toFixed(2) || "0.00"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => handleEditClick(product)}
                                    className="bg-white p-2.5 rounded-full border border-gray-200 shadow hover:bg-gray-100 transition"
                                >
                                    <Pencil className="w-5 h-5 text-gray-600" />
                                </button>
                                <button
                                    onClick={() => handleDelete(product._id)}
                                    className="bg-white p-2.5 rounded-full border border-gray-200 shadow hover:bg-gray-100 transition"
                                >
                                    <Trash2 className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <button className="absolute bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200">
                <Plus className="w-6 h-6" />
            </button>

            {editableProduct && (
                <ProductEditPopup
                    product={editableProduct}
                    onCancel={handleCancelEdit}
                    onSave={handleSave}
                />
            )}

            <div className="border-t pt-2 mt-2 text-center text-gray-500 text-sm">
                Preview op de telefoon
            </div>
        </div>
    );
}