import { Link, Outlet, useNavigate } from 'react-router'; // <--- Veranderd van 'react-router' naar 'react-router-dom'
import logo from './assets/GoLocallogo.png';
import { useState, useEffect } from 'react'; // Importeer useState en useEffect

function Layout() {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Houd inlogstatus bij

    // Controleer inlogstatus bij het laden van de component
    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token); // is ingelogd als er een token is
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token'); // Verwijder het token
        setIsLoggedIn(false); // Update de inlogstatus
        navigate('/login'); // Leid de gebruiker om naar de inlogpagina
    };

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-white shadow-md">
                <nav className="flex items-center justify-between px-6 py-4">
                    {/* Logo links */}
                    <img src={logo} className="h-10" alt="GoLocal logo" />

                    {/* Rechts: info & logout */}
                    <div className="flex items-center gap-6 text-sm text-gray-700">
                        {isLoggedIn ? (
                            <>
                                <span className="font-medium">Ingelogd als ondernemer</span>
                                <button
                                    onClick={handleLogout}
                                    className="text-blue-600 hover:underline cursor-pointer"
                                    style={{ background: 'none', border: 'none', padding: 0, font: 'inherit' }} // Zorg dat het eruitziet als een link
                                >
                                    Uitloggen
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="text-blue-600 hover:underline">
                                Inloggen
                            </Link>
                        )}
                    </div>
                </nav>
            </header>

            <main className="flex-1 p-4">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;