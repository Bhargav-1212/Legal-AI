
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Search, Briefcase, Settings, Scale } from 'lucide-react';

const Sidebar = () => {
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: FileText, label: 'Documents', path: '/documents' },
        { icon: Search, label: 'Legal Research', path: '/research' },
        { icon: Briefcase, label: 'Case Management', path: '/cases' },
    ];

    return (
        <div className="h-screen w-64 bg-dark text-white flex flex-col fixed left-0 top-0 border-r border-white/10">
            <div className="p-6 flex items-center space-x-3 border-b border-white/10">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Scale className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight">LegalAI<span className="text-primary">Pro</span></span>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-white/10">
                <button className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 w-full transition-colors">
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Settings</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
