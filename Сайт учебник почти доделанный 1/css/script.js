// Функция поиска и подсветки на текущей странице
function performSearch(inputElement, container) {
    if (!inputElement || !container) return;
    const query = inputElement.value.trim();
    removeHighlights();
    if (query === "") return;

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
    let node;
    const nodesToReplace = [];

    while (node = walker.nextNode()) {
        if (node.parentNode.tagName === 'SCRIPT' ||
            node.parentNode.tagName === 'STYLE' ||
            node.parentNode.tagName === 'INPUT' ||
            node.parentNode.tagName === 'TEXTAREA') continue;

        if (node.textContent.toLowerCase().includes(query.toLowerCase())) {
            nodesToReplace.push(node);
        }
    }

    nodesToReplace.forEach(node => {
        const span = document.createElement('span');
        span.innerHTML = node.textContent.replace(regex, '<mark class="highlight">$1</mark>');
        node.parentNode.replaceChild(span, node);
    });

    const firstResult = container.querySelector('.highlight');
    if (firstResult) {
        firstResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        alert("Ничего не найдено");
    }
}

function removeHighlights() {
    document.querySelectorAll('.highlight').forEach(h => {
        const parent = h.parentNode;
        const text = parent.textContent;
        const textNode = document.createTextNode(text);
        parent.replaceWith(textNode);
    });
}

// Обработчики для всех поисковых блоков на странице
document.addEventListener('DOMContentLoaded', () => {
    const main = document.querySelector('main');
    if (!main) return;

    document.querySelectorAll('.btn-search').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const searchBox = btn.closest('.search-box');
            const input = searchBox.querySelector('.search-input');
            performSearch(input, main);
        });
    });

    document.querySelectorAll('.search-input').forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const searchBox = input.closest('.search-box');
                const btn = searchBox.querySelector('.btn-search');
                if (btn) btn.click();
            }
        });
    });
});