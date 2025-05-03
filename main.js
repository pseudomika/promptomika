document.addEventListener("DOMContentLoaded", function () {
    // ==== COMMON FUNCTIONS ====
    function openInNewTab(url) {
        var win = window.open(url, '_blank');
        win.focus();
    }

    function hashCode(s) {
        return s.split("").reduce(function (a, b) {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
    }

    // ==== AUTHENTICATION ====
    const authOverlay = document.getElementById("auth-overlay")
    const authUsername = document.getElementById("username")
    const authPassword = document.getElementById("password")
    const loginButton = document.getElementById("login")

    function login() {
        const username = authUsername.value;
        const password = authPassword.value;
        if (!username || !password) return;
        if (hashCode(username) === 1424168624 && hashCode(password) === -935982680) {
            authOverlay.style.display = "none"
        };
    }

    loginButton.addEventListener("click", function () {
        login();
    })

    authUsername.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault()
            login()
        };
    })

    authPassword.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault()
            login()
        };
    })

    // ==== JABLE SHORTCUTS ====
    const shortcuts = {
        "link-favorites": "https://jable.tv/my/favourites/videos/",
        "link-watch-later": "https://jable.tv/my/favourites/videos-watch-later/",
        "link-zh-subtitles": "https://jable.tv/categories/chinese-subtitle/",
        "link-new-releases": "https://jable.tv/new-release/"
    };
    
    function bindShortcut(linkId, url) {
        const element = document.getElementById(linkId);
        if (element) {
            element.addEventListener("click", () => openInNewTab(url));
        }
    }
    
    // Bind all shortcuts
    Object.entries(shortcuts).forEach(([linkId, url]) => {
        bindShortcut(linkId, url);
    });

    // ==== SEARCH BAR ====
    const tagsContainer = document.getElementById("tags-container");
    const tagInput = document.getElementById("tag-input");
    const resetButton = document.getElementById("reset");
    const submitButton = document.getElementById("submit");

    function removeSuggestion(tagText) {
        const suggestionItems = document.getElementsByClassName("suggestion")
        const match = [...suggestionItems].find(item => item.textContent === tagText)
        if (match) match.style.display = "none";
    }

    function restoreSuggestion(tagText) {
        const suggestionItems = document.getElementsByClassName("suggestion")
        const match = [...suggestionItems].find(item => item.textContent === tagText)
        if (match) match.style.display = "inline-block";
    }

    function addTag(tagText) {
        // Prevent duplicates
        if ([...tagsContainer.children].some(tag => tag.textContent.includes(tagText))) return;

        const tag = document.createElement("div");
        tag.classList.add("tag");
        tag.innerHTML = `${tagText} <span>&times;</span>`;

        tag.querySelector("span").addEventListener("click", () => {
            tag.remove();
            restoreSuggestion(tagText);
        });

        tagsContainer.insertBefore(tag, tagInput);
        tagInput.value = "";
        removeSuggestion(tagText);
    }

    // Add keyword when clicked
    const suggestionItems = document.getElementsByClassName("suggestion")
    for (const item of suggestionItems) {
        item.addEventListener("click", function() {
            addTag(item.textContent)
        })
    }

    // Manually input new tag, click space or tab to complete
    tagInput.addEventListener("keydown", function (e) {
        if (e.key === " " || e.key === "Tab") {
            e.preventDefault();
            const tagText = tagInput.value.trim();
            if (tagText) addTag(tagText);
        }
    });

    // Click reset button to remove all keywords from search bar
    resetButton.addEventListener("click", function () {
        const tags = [...tagsContainer.querySelectorAll(".tag")]
        for (const tag of tags) {
            const tagName = tag.textContent.replace("×", "").trim()
            restoreSuggestion(tagName)

            tagsContainer.removeChild(tag)
        }
    })

    // Click submit button to view result
    submitButton.addEventListener("click", function () {
        const tags = [...tagsContainer.querySelectorAll(".tag")].map(tag => tag.textContent.replace("×", "").trim());

        if (tags.length) {
            const baseUrl = "https://jable.tv/search"
            const url = `${baseUrl}/${tags.join("-")}/`
            console.log(`Generated URL: ${url}`)
            openInNewTab(url)
        } else {
            console.warn("Search box is empty")
        }
    });
});