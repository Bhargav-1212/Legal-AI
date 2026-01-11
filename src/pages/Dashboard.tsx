
import { FileText, Briefcase, Search, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, change, icon: Icon, delay }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="bg-white p-6 rounded-xl border border-light-border shadow-sm hover:shadow-md transition-shadow"
    >
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm text-gray-500 font-medium">{title}</p>
                <h3 className="text-3xl font-bold text-dark mt-2">{value}</h3>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg">
                <Icon className="w-6 h-6 text-primary" />
            </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
            <span className={change >= 0 ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
                {change > 0 ? '+' : ''}{change}%
            </span>
            <span className="text-gray-400 ml-2">from last month</span>
        </div>
    </motion.div>
);

import { useState, useEffect } from 'react';
import { getDocuments, type Doc } from '../services/storage';

const Dashboard = () => {
    const [recentDocs, setRecentDocs] = useState<Doc[]>([]);

    useEffect(() => {
        const docs = getDocuments();
        // Get top 3 most recent
        setRecentDocs(docs.slice(0, 3));
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-dark">Dashboard Overview</h1>
                <p className="text-gray-500 mt-1">Welcome back, Sarah. Here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Active Cases" value="24" change={12} icon={Briefcase} delay={0.1} />
                <StatCard title="Documents Analyzed" value="1,284" change={8.5} icon={FileText} delay={0.2} />
                <StatCard title="Research Queries" value="452" change={24} icon={Search} delay={0.3} />
                <StatCard title="Billable Hours" value="164h" change={-2} icon={Clock} delay={0.4} />
            </div>

            <div className="grid grid-cols-1 gap-8">
                <div className="w-full bg-white rounded-xl border border-light-border p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-dark mb-4">Recent Documents</h2>
                    <div className="space-y-4">
                        {recentDocs.length === 0 ? (
                            <p className="text-gray-500 text-sm">No documents analyzed yet.</p>
                        ) : (
                            recentDocs.map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between p-4 bg-light-bg rounded-lg group hover:bg-white hover:shadow-sm transition-all border border-transparent hover:border-primary/10">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-dark">{doc.name}</h4>
                                            <p className="text-xs text-gray-500">{doc.uploaded}</p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${doc.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            doc.status === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                        }`}>
                                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
