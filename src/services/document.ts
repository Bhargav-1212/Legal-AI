// This service is now a pass-through since extraction happens on the backend.
// We keep the file validation logic here for better UX.

export const validateFile = (file: File): string | null => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
        return "Invalid file type. Please upload PDF, DOCX, or TXT.";
    }

    if (file.size > maxSize) {
        return "File is too large (max 10MB).";
    }

    return null;
};
