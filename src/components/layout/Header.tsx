
import { Bell, Search, User } from 'lucide-react';

const Header = () => {
    return (
        <header className="h-16 bg-white border-b border-light-border flex items-center justify-between px-8 sticky top-0 z-10 glass-panel bg-opacity-90">
            <div className="flex items-center w-96">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search cases, documents, or research..."
                        className="w-full pl-10 pr-4 py-2 bg-light-bg border border-transparent focus:bg-white focus:border-primary/20 rounded-lg text-sm transition-all outline-none"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-6">
                <button className="relative p-2 text-gray-500 hover:text-primary transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full ring-2 ring-white"></span>
                </button>

                <div className="flex items-center space-x-3 pl-6 border-l border-gray-100">
                    <div className="text-right hidden md:block">
                        <p className="text-sm font-medium text-dark">Sarah Anderson</p>
                        <p className="text-xs text-gray-500">Senior Partner</p>
                    </div>
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                        <User className="w-6 h-6 text-gray-400" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
