function addProgressBar() {
    return {
        render: function (element, controller) {
            let table = document.createElement("div");
            element.appendChild(table);
            element.table = table;
        },
        update: function (element, controller, list, options) {
            //const cells = document.querySelectorAll('div[lsfusion-container="GRID(c)"] td.data-grid-last-cell');
            const cells = document.querySelectorAll('div[lsfusion-container="PROPERTY(progressBar(c))"]');
            console.log(cells);
            cells.forEach(cell => {
            console.log(cell);
                const progressText = cell.textContent.trim();
                const progress = parseInt(progressText);

                cell.textContent = '';
                cell.classList.add('progress-cell');

                const progressBar = document.createElement('div');
                progressBar.className = 'progress-bar';
                progressBar.style.width = list > 0 ? `${list}%` : '0%';

                const progressTextElem = document.createElement('span');
                progressTextElem.textContent = list > 0 ? `${list}%` : '0%';

                progressBar.appendChild(progressTextElem);
                cell.appendChild(progressBar);
            });
        }
    };
}
