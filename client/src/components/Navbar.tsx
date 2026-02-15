import { NavLink } from 'react-router-dom';

const Navbar = () => {
    const linkStyles = ({ isActive }: { isActive: boolean }) =>
        `px-4 py-2 rounded-lg transition-all duration-200 font-medium ${
            isActive
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-700 hover:bg-gray-100'
        }`;

    return (
        <nav className='sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200'>
            <div className='max-w-6xl mx-auto px-4'>
                <div className='flex items-center justify-between h-16'>
                    <NavLink to='/' className='text-xl font-bold text-blue-600'>
                        AirGrab
                    </NavLink>
                    <div className='flex items-center gap-2'>
                        <NavLink to='/' className={linkStyles} end>
                            Grab
                        </NavLink>
                        <NavLink to='/drop' className={linkStyles}>
                            Drop
                        </NavLink>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
