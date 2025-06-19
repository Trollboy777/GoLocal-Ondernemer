import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import CreateCompanyForm from "./CreateCompanyForm.jsx";

export default function Layout() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch("http://145.24.223.203:80/products")
            .then((res) => res.json())
            .then((data) => setProducts(data.data.products))
            .catch((err) => console.error("Fout bij ophalen producten:", err));
    }, []);

    return (
        <div className="flex h-screen w-full bg-gray-100 p-4 gap-4">
            {/* Producten */}
            <div className="flex flex-col w-1/3 bg-white rounded-xl shadow p-4">
                <h2 className="text-xl font-semibold mb-4">Producten</h2>
                <div className="flex-1 bg-blue-50 rounded-lg p-4 mb-4 overflow-auto space-y-4">
                    {products.map((product) => (
                        <div
                            key={product._id}
                            className="flex items-center justify-between bg-blue-100 rounded-xl shadow-md p-3"
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={
                                        product.image_url.startsWith("http")
                                            ? product.image_url
                                            : `http://145.24.223.203/${product.image_url}`
                                    }
                                    alt={product.name}
                                    className="h-16 w-16 object-cover rounded-md"
                                />
                                <div>
                                    <p className="font-semibold">{product.name}</p>
                                    <p className="text-sm">€ {product.price.toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="bg-white p-2 rounded-full shadow">
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <button className="bg-white p-2 rounded-full shadow">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="border-t pt-2 text-center text-gray-500">
                    Preview op de telefoon
                </div>
            </div>

            {/* Bedrijfsinformatie */}
            <div className="flex flex-col w-1/3 bg-white rounded-xl shadow p-4">
                <h2 className="text-xl font-semibold mb-4">Bedrijfsinformatie</h2>
                <div className="flex-1 bg-blue-50 rounded-lg p-4 mb-4">
                    <CreateCompanyForm/>
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
