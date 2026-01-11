
export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    reasoning?: string;
    data?: any;
}

export const analyzeDocument = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/analyze-document', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Analysis failed");
        }

        return await response.json();
    } catch (error: any) {
        console.error("Analysis Error:", error);
        throw error;
    }
};

export const conductResearch = async (query: string) => {
    try {
        const response = await fetch('/api/legal-research', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Research failed");
        }

        return await response.json();
    } catch (error: any) {
        console.error("Research Error:", error);
        throw error;
    }
};
