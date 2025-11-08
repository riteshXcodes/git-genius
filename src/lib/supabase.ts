
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadFile = async (file: File) => {
    try {
        // Check if a file was uploade
        let safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        let filePath = `uploads/${safeFileName}`;
        let counter = 1;

        // Get existing files
        const { data: existingFiles, error: listError } = await supabase
            .storage
            .from('audio-files')
            .list('uploads/');

        if (listError) throw listError;

        const existingFileNames = existingFiles?.map(f => f.name) || [];

        // Ensure unique filename
        while (existingFileNames.includes(safeFileName)) {
            const nameParts = safeFileName.split('.');
            const extension = nameParts.pop();
            const baseName = nameParts.join('.');
            safeFileName = `${baseName}-${counter}.${extension}`;
            filePath = `uploads/${safeFileName}`;
            counter++;
        }

        // Upload file
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('audio-files')
            .upload(filePath, file, {
                contentType: 'audio/*',
            });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: publicData } = supabase.storage
            .from('audio-files')
            .getPublicUrl(filePath);

        const publicURL = publicData.publicUrl;

        console.log('File uploaded successfully:', publicURL);

        return { success: true, url: publicURL, data: uploadData };

    } catch (error) {
        console.error('Error uploading file:', error);
        return { success: false, message: 'Error uploading file' };
    }
}