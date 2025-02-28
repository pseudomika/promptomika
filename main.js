document.addEventListener("DOMContentLoaded", function () {
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

    function OpenInNewTab(url) {
        var win = window.open(url, '_blank');
        win.focus();
    }

    // Manually input new tag, click space or tab to complete
    tagInput.addEventListener("keydown", function (e) {
        if (e.key === " " || e.key === "Tab") {
            e.preventDefault();
            const tagText = tagInput.value.trim();
            if (tagText) addTag(tagText);
        }
    });

    resetButton.addEventListener("click", function () {
        const tags = [...tagsContainer.querySelectorAll(".tag")]
        for (const tag of tags) {
            const tagName = tag.textContent.replace("×", "").trim()
            restoreSuggestion(tagName)

            tagsContainer.removeChild(tag)
        }
    })

    submitButton.addEventListener("click", function () {
        const tags = [...tagsContainer.querySelectorAll(".tag")].map(tag => tag.textContent.replace("×", "").trim());

        if (tags.length) {
            const baseUrl = "https://jable.tv/search"
            const url = `${baseUrl}/${tags.join("-")}/`
            console.log(`Generated URL: ${url}`)
            OpenInNewTab(url)
        } else {
            console.warn("Search box is empty")
        }
    });

    for (const elem of suggestions) {
        elem.addEventListener("click", function (e) {
            if (e.target.classList.contains("suggestion")) {
                addTag(e.target.textContent);
            }
        })
    };
});