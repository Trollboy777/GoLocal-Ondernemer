import { Link, Outlet } from 'react-router';
import logo from './assets/GoLocallogo.png';

function Layout() {
    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-white shadow-md">
                <nav className="flex items-center justify-between px-6 py-4">
                    {/* Logo links */}
                    <img src={logo} className="h-10" alt="GoLocal logo" />

                    {/* Rechts: info & logout */}
                    <div className="flex items-center gap-6 text-sm text-gray-700">
                        <span className="font-medium">Ingelogd als gebruiker</span>
                        <Link to="/" className="text-blue-600 hover:underline">
                            Uitloggen
                        </Link>
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
