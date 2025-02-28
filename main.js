document.addEventListener("DOMContentLoaded", function () {
    // Auth elements
    const authOverlay = document.getElementById("auth-overlay")
    const authUsername = document.getElementById("username")
    const authPassword = document.getElementById("password")
    const loginButton = document.getElementById("login")
    // Search bar elements
    const tagsContainer = document.getElementById("tags-container");
    const tagInput = document.getElementById("tag-input");
    const resetButton = document.getElementById("reset");
    const submitButton = document.getElementById("submit");
    // Keyword elements
    const suggestions = document.getElementsByClassName("suggestions")

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

    function removeSuggestion(tagText) {
        for (const elem of suggestions) {
            const suggestionItems = [...elem.children];
            const match = suggestionItems.find(item => item.textContent === tagText);
            if (match) match.style.display = "none";
        }
    }

    function restoreSuggestion(tagText) {
        for (const elem of suggestions) {
            const suggestionItems = [...elem.children];
            const match = suggestionItems.find(item => item.textContent === tagText);
            if (match) match.style.display = "inline-block";
        }
    }

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

    // Add keyword when clicked
    for (const elem of suggestions) {
        elem.addEventListener("click", function (e) {
            if (e.target.classList.contains("suggestion")) {
                addTag(e.target.textContent);
            }
        })
    };
});