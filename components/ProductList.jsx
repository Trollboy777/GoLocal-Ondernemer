import React, { useEffect, useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";

export default function ProductList() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch("http://145.24.223.203:80/products")
            .then((res) => res.json())
            .then((data) => setProducts(data.data.products))
            .catch((err) => console.error("Fout bij ophalen producten:", err));
    }, []);

    return (
        <div className="flex flex-col w-full bg-white rounded-xl shadow-lg p-4 relative">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b-2 border-blue-500 pb-2 inline-block">
                Producten
            </h2>
            <div className="bg-green-500 text-white p-4">Tailwind werkt?</div>


            <div className="flex-1 bg-white p-2 mb-4 overflow-y-auto space-y-4">
                {products.map((product) => (
                    <div
                        key={product._id}
                        className="flex items-center justify-between bg-blue-50 rounded-xl px-4 py-4 border border-blue-100 shadow-md"
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
                            <button className="bg-white p-2.5 rounded-full border border-gray-200 shadow hover:bg-gray-100 transition">
                                <Pencil className="w-5 h-5 text-gray-600" />
                            </button>
                            <button className="bg-white p-2.5 rounded-full border border-gray-200 shadow hover:bg-gray-100 transition">
                                <Trash2 className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Plus-knop */}
            <button className="absolute bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200">
                <Plus className="w-6 h-6" />
            </button>

            {/* Footer preview */}
            <div className="border-t pt-2 mt-2 text-center text-gray-500 text-sm">
                Preview op de telefoon
            </div>
        </div>
    );
}
