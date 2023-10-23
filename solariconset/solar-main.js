function fetchSvgSprite() {
    const iconUrl = "/solar-icon.svg";
    fetch(iconUrl)
    .then((response) => response.text())
        .then((svgText) => {
        const svgContainer = document.querySelector(".solar-svg");
        svgContainer.insertAdjacentHTML("beforeend", svgText);
    })
};
fetchSvgSprite();

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        generateIconList();
        addIconClickListener();
        handleSearchForm();
        handleQuickGroup();
        handleQuickBtn();
    }, 500)
});

function generateIconList() {
    const groups = document.querySelectorAll("symbol");
    const iconContainer = document.querySelector(".icon-container");

    groups.forEach((group) => {
        const iconTitle = group.getAttribute("id");
        const displayedIconTitle = iconTitle.replace("solar-", "").replace("-linear", "").replace("-bold", "");
        const parentGroup = group.parentElement.getAttribute("id");

        let groupContainer = iconContainer.querySelector(`.icon-group-${parentGroup}`);
        if (!groupContainer) {
            groupContainer = createIconGroupContainer(parentGroup);
            iconContainer.appendChild(groupContainer);
        }

        const iconWrap = createIconItem(iconTitle, displayedIconTitle);
        groupContainer.appendChild(iconWrap);
    });
}

function createIconGroupContainer(parentGroup) {
    const groupContainer = document.createElement("div");
    groupContainer.classList.add(`icon-group-${parentGroup}`);

    const groupTitle = document.createElement("div");
    groupTitle.classList.add("group-title");
    groupTitle.textContent = parentGroup;

    groupContainer.appendChild(groupTitle);
    return groupContainer;
}

function createIconItem(iconTitle, displayedIconTitle) {
    const iconWrap = document.createElement("button");
    iconWrap.classList.add("icon-item");

    const itemTitle = document.createElement("span");
    itemTitle.classList.add("item-title", iconTitle);
    itemTitle.textContent = displayedIconTitle;

    const newSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    newSvg.classList.add("solar-icon");
    newSvg.setAttribute("width", "24");
    newSvg.setAttribute("height", "24");
    newSvg.setAttribute("viewBox", "0 0 24 24");

    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", `#${iconTitle}`);
    newSvg.appendChild(use);

    iconWrap.appendChild(newSvg);
    iconWrap.appendChild(itemTitle);

    return iconWrap;
}

function showPopUp(iconName) {
    const popUpWrap = createPopUpWrap(iconName);
    document.body.appendChild(popUpWrap);
    hljs.highlightAll();
    popUpWrap.style.display = "flex";

    popUpWrap.addEventListener("click", (e) => {
        if (e.target === popUpWrap) {
            document.body.removeChild(popUpWrap);
        }
    });
}

function createPopUpWrap(iconName) {
    const popUpWrap = document.createElement("div");
    popUpWrap.classList.add("pop-up-wrap");
    
    const popUp = document.createElement("div");
    popUp.classList.add("pop-up");

    const popUpInner = document.createElement("div");
    popUpInner.classList.add("pop-up-inner");
    
    const popUpTitle = document.createElement("div");
    popUpTitle.classList.add("pop-up-title");
    popUpTitle.textContent = iconName;
    
    const popUpMarkup = document.createElement("div");
    popUpMarkup.classList.add("pop-up-markup");
    popUpMarkup.insertAdjacentHTML("beforeend", `<pre><code>&lt;svg class="solar-icon" width="24" height="24" viewBox="0 0 24 24"&gt;&lt;use href="#${iconName}"&gt;&lt;/use&gt;&lt;/svg&gt;</code></pre>`);

    const popUpIcon = document.createElement("div");
    popUpIcon.classList.add("pop-up-icon");
    popUpIcon.insertAdjacentHTML("beforeend", `<svg class="solar-icon" width="24" height="24" viewBox="0 0 24 24"><use href="#${iconName}"></use></svg>`);

    popUp.appendChild(popUpIcon);
    popUp.appendChild(popUpInner);
    popUpInner.appendChild(popUpTitle);
    popUpInner.appendChild(popUpMarkup);
    popUpWrap.appendChild(popUp);

    addCopyButtonToElement(popUpTitle);
    addCopyButtonToElement(popUpMarkup);

    return popUpWrap;
}

function addIconClickListener() {
    const iconItems = document.querySelectorAll(".icon-item");
    iconItems.forEach(item => {
        item.addEventListener("click", () => {
            const titleClass = item.querySelector(".item-title").classList[1];
            showPopUp(titleClass);
        });
    });
}

function addCopyButtonToElement(element) {
    const copyBtn = document.createElement("button");
    copyBtn.setAttribute("type", "button");
    copyBtn.classList.add("copy-btn");
    copyBtn.insertAdjacentHTML("beforeend", `<svg class="solar-icon" width="24" height="24" viewBox="0 0 24 24"><use href="#solar-clipboard-check-linear"></use></svg>`);

    copyBtn.addEventListener("click", () => {
        const textArea = document.createElement("textarea");
        textArea.value = element.textContent;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        copyBtn.classList.add("complete");
        const completeTextNode = document.createTextNode("Copy~!");
        copyBtn.appendChild(completeTextNode);

        setTimeout(() => {
            copyBtn.classList.remove("complete");
            copyBtn.removeChild(completeTextNode);
        }, 2000);
    });

    element.appendChild(copyBtn);
}

function handleSearchForm() {
    const searchBtn = document.querySelector(".search-btn");
    const searchInput = document.querySelector(".search-input");
    const icons = document.querySelectorAll(".icon-item");

    searchBtn.addEventListener("click", enterSearch);
    searchInput.addEventListener("input", enterSearch);

    function enterSearch() {
        const searchTerm = searchInput.value.toLowerCase();
        const iconGroups = document.querySelectorAll("[class^='icon-group-']")
        iconGroups.forEach((group) => {
            let hasVisibleIcons = false; 

            const iconsInGroup = group.querySelectorAll(".icon-item");
            iconsInGroup.forEach((icon) => {
                const title = icon.querySelector(".item-title").textContent.toLowerCase();
                const groupTitle = group.querySelector(".group-title").textContent.toLowerCase();
                if (title.includes(searchTerm) || groupTitle.includes(searchTerm)) {
                    icon.style.display = "flex";
                    hasVisibleIcons = true; 
                } else {
                    icon.style.display = "none";
                }
            });

            if (!hasVisibleIcons) {
                group.style.display = "none";
            } else {
                group.style.display = "grid";
            }
        });
    }
}

function handleQuickGroup() {
    const quickListBtns = document.querySelectorAll(".quick-list button");

    quickListBtns.forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const targetGroupClass = e.target.classList[0];
            const targetGroup = document.querySelector(`div.${targetGroupClass}`);

            if (targetGroup) {
                targetGroup.scrollIntoView({
                    behavior: "smooth"
                });
            }
        });
    });
}

function handleQuickBtn() {
    const quickBtn = document.querySelector(".quick-btn");
    const quickList = document.querySelector(".quick-list");
    quickBtn.addEventListener("click", (e) => {
        if (quickList.classList.contains("open")) {
            quickList.classList.remove("open");
            quickList.style.visivility = "hidden";
            quickList.style.opacity = "0";
        } else {
            quickList.classList.add("open");
            quickList.style.visivility = "visible";
            quickList.style.opacity = "1";
        }
    });
}