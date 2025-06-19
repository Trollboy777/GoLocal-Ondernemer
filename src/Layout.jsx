import {Link, Outlet} from 'react-router';


function Layout() {
    return (
        <div>
            <header>
                <nav>
                    <img src="/assets/GoLocallogo.png" alt="Bedrijfslogo" className="h-10" />

                    <Link to={`/`}>Logout</Link>
                </nav>
            </header>
            <main>
                <Outlet/>
            </main>
        </div>
    );
}

export default Layout;