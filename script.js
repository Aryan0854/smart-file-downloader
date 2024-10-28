document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileUrl');
    const downloadBtn = document.getElementById('downloadBtn');
    const messageDiv = document.getElementById('message');

    const validateUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const showMessage = (text, type) => {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20">
                ${type === 'error' 
                    ? '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'
                    : '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>'
                }
            </svg>
            ${text}
        `;
    };

    const setLoading = (isLoading) => {
        if (isLoading) {
            downloadBtn.disabled = true;
            downloadBtn.innerHTML = `
                <span class="btn-content">
                    <svg class="btn-icon spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                    </svg>
                    Downloading...
                </span>
            `;
        } else {
            downloadBtn.innerHTML = `
                <span class="btn-content">
                    <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"></path>
                    </svg>
                    Download File
                </span>
            `;
            downloadBtn.disabled = !fileInput.value;
        }
    };

    const downloadFile = async () => {
        const url = fileInput.value;
        
        if (!validateUrl(url)) {
            showMessage('Please enter a valid URL', 'error');
            return;
        }

        setLoading(true);
        messageDiv.className = 'message hidden';

        try {
            const response = await fetch(url, { method: 'HEAD' });
            if (!response.ok) throw new Error('File not accessible');

            const link = document.createElement('a');
            link.href = url;
            link.download = url.split('/').pop() || 'downloaded-file';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showMessage('File download initiated successfully!', 'success');
            fileInput.value = '';
        } catch (err) {
            showMessage('Unable to download file. Please check the URL and try again.', 'error');
        } finally {
            setLoading(false);
        }
    };

    fileInput.addEventListener('input', (e) => {
        downloadBtn.disabled = !e.target.value;
        messageDiv.className = 'message hidden';
    });

    downloadBtn.addEventListener('click', downloadFile);

    fileInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && fileInput.value) {
            downloadFile();
        }
    });
});