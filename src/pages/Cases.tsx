import { useState, useEffect } from 'react';
import { Calendar, MapPin, Users, Plus, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Case, getCases, addCase, deleteCase } from '../services/storage';

const Cases = () => {
    const [activeTab, setActiveTab] = useState('active');
    const [cases, setCases] = useState<Case[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [newCase, setNewCase] = useState<Partial<Case>>({
        title: '',
        type: 'General',
        status: 'Discovery',
        nextEvent: '',
        date: '',
        members: 1
    });

    useEffect(() => {
        loadCases();
    }, []);

    const loadCases = () => {
        setCases(getCases());
    };

    const handleDelete = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this case?')) {
            deleteCase(id);
            loadCases();
        }
    };

    const handleAddCase = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCase.title || !newCase.date) return;

        const caseToAdd: Case = {
            id: `CA-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
            title: newCase.title!,
            type: newCase.type || 'General',
            status: newCase.status as any || 'Discovery',
            nextEvent: newCase.nextEvent || 'Review',
            date: newCase.date!,
            members: newCase.members || 1
        };

        addCase(caseToAdd);
        loadCases();
        setIsModalOpen(false);
        setNewCase({ title: '', type: 'General', status: 'Discovery', nextEvent: '', date: '', members: 1 });
    };

    const filteredCases = cases.filter(c => {
        if (activeTab === 'active') return c.status !== 'Closed';
        if (activeTab === 'closed') return c.status === 'Closed';
        return true;
    });

    return (
        <div className="space-y-6 relative">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-dark">Case Management</h1>
                    <p className="text-gray-500 mt-1">Track deadlines, filings, and case progressions.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>New Case</span>
                </button>
            </div>

            <div className="bg-white border-b border-light-border">
                <div className="flex space-x-8 px-6">
                    {['active', 'closed', 'archived'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`py-4 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === tab
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-dark'
                                }`}
                        >
                            {tab} Cases
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence>
                    {filteredCases.length === 0 ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 text-center text-gray-500 bg-white rounded-xl border border-dashed border-gray-300">
                            No cases found in this category.
                        </motion.div>
                    ) : (
                        filteredCases.map((c) => (
                            <motion.div
                                key={c.id}
                                layout
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white p-6 rounded-xl border border-light-border shadow-sm hover:shadow-md transition-all cursor-pointer group"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">{c.id}</span>
                                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${c.status === 'Discovery' ? 'bg-blue-100 text-blue-700' :
                                                c.status === 'Filing' ? 'bg-purple-100 text-purple-700' :
                                                    c.status === 'Closed' ? 'bg-gray-100 text-gray-700' :
                                                        'bg-orange-100 text-orange-700'
                                                }`}>{c.status}</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-dark group-hover:text-primary transition-colors">{c.title}</h3>
                                        <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                                            <div className="flex items-center space-x-1">
                                                <Users className="w-4 h-4" />
                                                <span>{c.members} Team Members</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <MapPin className="w-4 h-4" />
                                                <span>{c.type}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right pl-6 border-l border-gray-100 flex flex-col items-end">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-1">Next Deadline</p>
                                        <div className="flex items-center justify-end space-x-2 text-dark font-medium">
                                            <Calendar className="w-4 h-4 text-primary" />
                                            <span>{c.date}</span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">{c.nextEvent}</p>

                                        <button
                                            onClick={(e) => handleDelete(c.id, e)}
                                            className="mt-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                            title="Delete Case"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Add Case Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
                    >
                        <div className="p-4 border-b border-light-border flex justify-between items-center bg-gray-50">
                            <h2 className="font-bold text-dark">Add New Case</h2>
                            <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-gray-500" /></button>
                        </div>

                        <form onSubmit={handleAddCase} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Case Title</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                                    placeholder="e.g., Smith v. Jones"
                                    value={newCase.title}
                                    onChange={e => setNewCase({ ...newCase, title: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        className="w-full p-2 border border-gray-300 rounded-lg outline-none"
                                        value={newCase.type}
                                        onChange={e => setNewCase({ ...newCase, type: e.target.value })}
                                    >
                                        <option>General</option>
                                        <option>Corporate</option>
                                        <option>Intellectual Property</option>
                                        <option>Criminal</option>
                                        <option>Family</option>
                                        <option>Probate</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        className="w-full p-2 border border-gray-300 rounded-lg outline-none"
                                        value={newCase.status}
                                        onChange={e => setNewCase({ ...newCase, status: e.target.value as any })}
                                    >
                                        <option value="Discovery">Discovery</option>
                                        <option value="Filing">Filing</option>
                                        <option value="Review">Review</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Next Deadline</label>
                                    <input
                                        required
                                        type="date"
                                        className="w-full p-2 border border-gray-300 rounded-lg outline-none"
                                        value={newCase.date}
                                        onChange={e => setNewCase({ ...newCase, date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Next Event</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-lg outline-none"
                                        placeholder="e.g., Court Hearing"
                                        value={newCase.nextEvent}
                                        onChange={e => setNewCase({ ...newCase, nextEvent: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full btn-primary py-2 mt-2">Create Case</button>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default Cases;
