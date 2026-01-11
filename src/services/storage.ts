
export interface Doc {
    id: number;
    name: string;
    type: string;
    size: string;
    uploaded: string;
    status: 'processing' | 'completed' | 'error';
    risk: 'low' | 'medium' | 'high' | null;
    analysis?: any;
    errorMessage?: string;
}

const STORAGE_KEY = 'legal_ai_documents';

export const getDocuments = (): Doc[] => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error("Failed to load documents from storage", error);
        return [];
    }
};

export const saveDocuments = (documents: Doc[]) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
    } catch (error) {
        console.error("Failed to save documents to storage", error);
    }
};

export const addDocument = (doc: Doc) => {
    const docs = getDocuments();
    docs.unshift(doc);
    saveDocuments(docs);
};

// --- Cases Storage ---

export interface Case {
    id: string;
    title: string;
    type: string;
    status: 'Discovery' | 'Filing' | 'Review' | 'Closed';
    nextEvent: string;
    date: string;
    members: number;
    description?: string;
}

const CASES_STORAGE_KEY = 'legal_ai_cases';

export const getCases = (): Case[] => {
    try {
        const stored = localStorage.getItem(CASES_STORAGE_KEY);
        // Default Mock Data if empty, to give user good first experience
        if (!stored) {
            const defaultCases: Case[] = [
                {
                    id: "CA-2024-001",
                    title: "TechCorp v. StartUp Inc.",
                    type: "Intellectual Property",
                    status: "Discovery",
                    nextEvent: "Deposition Phase",
                    date: "Jan 15, 2026",
                    members: 3
                },
                {
                    id: "CA-2023-089",
                    title: "Estate of J. Smith",
                    type: "Probate",
                    status: "Filing",
                    nextEvent: "Court Hearing",
                    date: "Feb 02, 2026",
                    members: 1
                }
            ];
            saveCases(defaultCases);
            return defaultCases;
        }
        return JSON.parse(stored);
    } catch (error) {
        console.error("Failed to load cases", error);
        return [];
    }
};

export const saveCases = (cases: Case[]) => {
    try {
        localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(cases));
    } catch (error) {
        console.error("Failed to save cases", error);
    }
};

export const addCase = (newCase: Case) => {
    const cases = getCases();
    cases.unshift(newCase);
    saveCases(cases);
};

export const deleteCase = (id: string) => {
    const cases = getCases();
    const filtered = cases.filter(c => c.id !== id);
    saveCases(filtered);
};

