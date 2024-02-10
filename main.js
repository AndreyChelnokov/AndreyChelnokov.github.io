class Services {
    constructor(props) {
        this.services = props.services; // Array
        this.root = document.querySelector('#app');
        
        this.fileIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px"><path fill="#00b284" d="M 12.5 4 C 10.032499 4 8 6.0324991 8 8.5 L 8 39.5 C 8 41.967501 10.032499 44 12.5 44 L 35.5 44 C 37.967501 44 40 41.967501 40 39.5 L 40 18.5 A 1.50015 1.50015 0 0 0 39.560547 17.439453 L 39.544922 17.423828 L 26.560547 4.4394531 A 1.50015 1.50015 0 0 0 25.5 4 L 12.5 4 z M 12.5 7 L 24 7 L 24 15.5 C 24 17.967501 26.032499 20 28.5 20 L 37 20 L 37 39.5 C 37 40.346499 36.346499 41 35.5 41 L 12.5 41 C 11.653501 41 11 40.346499 11 39.5 L 11 8.5 C 11 7.6535009 11.653501 7 12.5 7 z M 27 9.1210938 L 34.878906 17 L 28.5 17 C 27.653501 17 27 16.346499 27 15.5 L 27 9.1210938 z"/></svg>';
        this.folderIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48px" height="48px"><path fill="#976e00" d="M 8.5 8 C 6.0324991 8 4 10.032499 4 12.5 L 4 35.5 C 4 37.967501 6.0324991 40 8.5 40 L 39.5 40 C 41.967501 40 44 37.967501 44 35.5 L 44 17.5 C 44 15.032499 41.967501 13 39.5 13 L 24.042969 13 L 19.572266 9.2753906 C 18.584055 8.4521105 17.339162 8 16.052734 8 L 8.5 8 z M 8.5 11 L 16.052734 11 C 16.638307 11 17.202555 11.205358 17.652344 11.580078 L 21.15625 14.5 L 17.652344 17.419922 C 17.202555 17.794642 16.638307 18 16.052734 18 L 7 18 L 7 12.5 C 7 11.653501 7.6535009 11 8.5 11 z M 24.042969 16 L 39.5 16 C 40.346499 16 41 16.653501 41 17.5 L 41 35.5 C 41 36.346499 40.346499 37 39.5 37 L 8.5 37 C 7.6535009 37 7 36.346499 7 35.5 L 7 21 L 16.052734 21 C 17.339162 21 18.584055 20.547889 19.572266 19.724609 L 24.042969 16 z"/></svg>';

        this.process();

        this.toggleListener();
    }

    /**
     * Скрыть/показать содержимое папки
     */
    toggleListener() {
        document.addEventListener('click', e => {
            const target = e.target;

            const isHeader = Boolean(target.closest('.node__header')); // Клик по элемент шапки узла или листа
            const $node = isHeader ? target.closest('.node') : null; // Узел с которым взаимодействуют
            const isFolder = $node ? $node.getAttribute('data-is-folder') == 'true' : false; // Ближайший родительский .node папка

            if (isHeader && isFolder) {
                $node.classList.toggle('node_active');
            }
        })
    }

    /**
     * Поиск родительского узла в DOM
     * @param parentId
     * @returns {Element}
     */
    findNodeContainer(parentId) {
        if (parentId === null) {
            return this.root;
        }

        const node = document.querySelector(`[data-node-id="${parentId}"]`);

        if (! node) {
            throw new Error('Для узла или листа нет родителя');
        }

        const nodeContentContainer = node.querySelector('.node__content');

        if (! nodeContentContainer) {
            throw new Error('Не найден .node__content в узле');
        }

        return nodeContentContainer;
    }

    /**
     * Возвращает массив отсортированного списка узлов для одного родителя
     * @param parentId
     * @returns {*}
     */
    getChildNodes(parentId) {
        const id = parentId || null;

        const nodes = this.bubbleSort(this.services.filter(service => service.head === id))

        return nodes;
    }

    bubbleSort(arr) {
        for (let j = 0; j < arr.length; j++) {
            for (let i = 0; i < arr.length - 1; i++) {
                const a = arr[i];
                const b = arr[i+1];

                if (a.sorthead > b.sorthead) {
                    const tmp = arr[i]

                    arr[i] = arr[i+1]
                    arr[i+1] = tmp
                }

            }
        }

        return arr;
    }

    /**
     * Рекурсивная отрисовка узлов
     * @param parentId
     */
    process(parentId) {
        const nodes = this.getChildNodes(parentId);

        if (! nodes.length) {
            // Если нет элементов - завершаем
            return;
        }

        for (let i = 0; i < nodes.length; i++ ) {
            const currentNode = nodes[i];

            const nodeHtml = this.createNode(currentNode);
            const parentContainer = this.findNodeContainer(currentNode.head);

            parentContainer.append(nodeHtml);

            // Ищем дочерние элементы если узел
            if (currentNode.node == 1) {
                this.process(currentNode.id)
            }
        }
    }

    /**
     * Создаем DOM-узел на основе данных узла/листа
     * @param nodeData
     * @returns {HTMLDivElement}
     */
    createNode(nodeData) {
        const node = document.createElement('div');

        node.classList.add('node');
        node.setAttribute('data-node-id', nodeData.id);

        nodeData.node ? node.classList.add('node_active') : null;
        nodeData.node ? node.setAttribute('data-is-folder', 'true') : node.setAttribute('data-is-folder', 'false');

        const toggle = `
            <div class="node__toggle">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <polygon points="7.293 4.707 14.586 12 7.293 19.293 8.707 20.707 17.414 12 8.707 3.293 7.293 4.707"/>
                </svg>
            </div>
        `;
        const price = `
            <span>-</span>
            <div class="node__price">${nodeData.price}</div>
        `;

        const nodeContent = `
            <div class="node__header">
                ${ nodeData.node ? toggle : '' }
                <div class="node__icon">${nodeData.node ? this.folderIcon : this.fileIcon}</div>
                <div class="node__header-content">
                    <div class="node__name">${nodeData.name}</div> 
                    ${ ! nodeData.node ? price : '' }
                </div>
                
            </div>
            <div class="node__content"></div>
        `;

        node.innerHTML = nodeContent;

        return node;
    }
}



const API_EXAMPLE_RESPONSE = {
    "services": [
        {
            "id": 1,
            "head": null,
            "name": "Проф.осмотр",
            "node": 0,
            "price": 100.0,
            "sorthead": 20
        },
        {
            "id": 2,
            "head": null,
            "name": "Хирургия",
            "node": 1,
            "price": 0.0,
            "sorthead": 10
        },
        {
            "id": 3,
            "head": 2,
            "name": "Удаление зубов",
            "node": 1,
            "price": 0.0,
            "sorthead": 10
        },
        {
            "id": 4,
            "head": 3,
            "name": "Удаление зуба",
            "node": 0,
            "price": 800.0,
            "sorthead": 10
        },
        {
            "id": 5,
            "head": 3,
            "name": "Удаление 8ого зуба",
            "node": 0,
            "price": 1000.0,
            "sorthead": 30
        },
        {
            "id": 6,
            "head": 3,
            "name": "Удаление осколка зуба",
            "node": 0,
            "price": 2000.0,
            "sorthead": 20
        },
        {
            "id": 7,
            "head": 2,
            "name": "Хирургические вмешательство",
            "node": 0,
            "price": 200.0,
            "sorthead": 10
        },
        {
            "id": 8,
            "head": 2,
            "name": "Имплантация зубов",
            "node": 1,
            "price": 0.0,
            "sorthead": 20
        },
        {
            "id": 9,
            "head": 8,
            "name": "Коронка",
            "node": 0,
            "price": 3000.0,
            "sorthead": 10
        },
        {
            "id": 10,
            "head": 8,
            "name": "Слепок челюсти",
            "node": 0,
            "price": 500.0,
            "sorthead": 20
        }
    ]
};
new Services({ services: API_EXAMPLE_RESPONSE.services })