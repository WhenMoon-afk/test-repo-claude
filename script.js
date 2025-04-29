document.addEventListener('DOMContentLoaded', function() {
    // Add search functionality
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.id = 'search-commands';
    searchInput.placeholder = 'Search commands...';
    searchInput.classList.add('search-input');
    
    const searchContainer = document.createElement('div');
    searchContainer.classList.add('search-container');
    searchContainer.appendChild(searchInput);
    
    const header = document.querySelector('header');
    header.appendChild(searchContainer);
    
    // Style the search input
    const style = document.createElement('style');
    style.textContent = `
        .search-container {
            margin: 20px auto;
            max-width: 500px;
        }
        .search-input {
            width: 100%;
            padding: 10px 15px;
            border: 2px solid #3f51b5;
            border-radius: 20px;
            font-size: 16px;
            outline: none;
            transition: box-shadow 0.3s;
        }
        .search-input:focus {
            box-shadow: 0 0 8px rgba(63, 81, 181, 0.6);
        }
        .highlight {
            background-color: yellow;
            font-weight: bold;
        }
        .hidden {
            display: none;
        }
    `;
    document.head.appendChild(style);
    
    // Implement search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const allCommands = document.querySelectorAll('li');
        
        allCommands.forEach(item => {
            const commandText = item.textContent.toLowerCase();
            if (commandText.includes(searchTerm)) {
                item.classList.remove('hidden');
                
                // Reset previous highlights
                item.innerHTML = item.innerHTML.replace(/<mark class="highlight">|<\/mark>/g, '');
                
                if (searchTerm.length > 0) {
                    // Highlight matching text
                    const commandName = item.querySelector('.command-name');
                    const commandDesc = item.querySelector('.command-desc');
                    
                    if (commandName.textContent.toLowerCase().includes(searchTerm)) {
                        const regex = new RegExp(searchTerm, 'gi');
                        commandName.innerHTML = commandName.textContent.replace(
                            regex, 
                            match => `<mark class="highlight">${match}</mark>`
                        );
                    }
                    
                    if (commandDesc.textContent.toLowerCase().includes(searchTerm)) {
                        const regex = new RegExp(searchTerm, 'gi');
                        commandDesc.innerHTML = commandDesc.textContent.replace(
                            regex, 
                            match => `<mark class="highlight">${match}</mark>`
                        );
                    }
                }
            } else {
                item.classList.add('hidden');
            }
        });
        
        // Show/hide category headers based on visible commands
        document.querySelectorAll('.category').forEach(category => {
            const visibleCommands = category.querySelectorAll('li:not(.hidden)').length;
            if (visibleCommands === 0) {
                category.classList.add('hidden');
            } else {
                category.classList.remove('hidden');
            }
        });
    });
    
    // Add back-to-top button
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '&uarr;';
    backToTopBtn.classList.add('back-to-top');
    document.body.appendChild(backToTopBtn);
    
    // Style the button
    const btnStyle = document.createElement('style');
    btnStyle.textContent = `
        .back-to-top {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: #3f51b5;
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            font-size: 24px;
            cursor: pointer;
            opacity: 0;
            transition: opacity 0.3s;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        }
        .back-to-top.visible {
            opacity: 1;
        }
        .back-to-top:hover {
            background-color: #303f9f;
        }
    `;
    document.head.appendChild(btnStyle);
    
    // Show/hide the button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top when button is clicked
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add click event to command items for copying
    document.querySelectorAll('.command-name').forEach(cmd => {
        cmd.style.cursor = 'pointer';
        cmd.title = 'Click to copy command name';
        
        cmd.addEventListener('click', function() {
            const text = this.textContent;
            navigator.clipboard.writeText(text).then(() => {
                // Create and show toast notification
                const toast = document.createElement('div');
                toast.textContent = `Copied: ${text}`;
                toast.classList.add('toast');
                document.body.appendChild(toast);
                
                // Style for toast
                toast.style.position = 'fixed';
                toast.style.bottom = '20px';
                toast.style.left = '50%';
                toast.style.transform = 'translateX(-50%)';
                toast.style.backgroundColor = '#333';
                toast.style.color = '#fff';
                toast.style.padding = '10px 20px';
                toast.style.borderRadius = '4px';
                toast.style.zIndex = '1000';
                
                // Remove toast after 2 seconds
                setTimeout(() => {
                    toast.remove();
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });
    });
});
