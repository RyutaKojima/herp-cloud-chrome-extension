const addLine = (name = '', tag = '') => {
    const td = document.createElement('td')
    const label = document.createElement('label')
    const input = document.createElement('input');
    td.appendChild(label)
    label.appendChild(input)

    const TagTd = td.cloneNode(true)
    const inputTag = TagTd.querySelector('input');

    input.value = name
    input.className = 'input-name'
    inputTag.value = tag
    inputTag.className = 'input-tag'

    const tr = document.createElement('tr');
    tr.appendChild(td)
    tr.appendChild(TagTd)
    const tbodyElement = document.querySelector('table>tbody')
    tbodyElement.appendChild(tr)
}

const exportJson = (option) => {
    const blob = new Blob([JSON.stringify(option)], {type: 'text/plain'});
    const aTag = document.createElement('a');
    aTag.href = URL.createObjectURL(blob);
    aTag.target = '_blank';
    aTag.download = 'herp-extension-option.json';
    aTag.click();
    URL.revokeObjectURL(aTag.href);
}

const importJson = async (files) => {
    return new Promise((resolve, reject) => {
        if (files.length !== 1) {
            reject('ファイルが選択されていません')
        }

        const reader = new FileReader();
        reader.readAsText(files[0]);
        reader.onload = function () {
            const parseData = JSON.parse(reader.result)
            resolve(makeOptions(parseData))
        }
    })
}

const makeOptions = (overWrite) => {
    return {
        mapping: [],
        ...overWrite
    }
}

const loadOption = () => {
    const key = 'option-data'

    return new Promise((resolve) => {
        // noinspection JSUnresolvedVariable
        chrome.storage.sync.get(key, (value) => {
            resolve(makeOptions(value[key]));
        });
    })
}

const saveOption = (data) => {
    const key = 'option-data'

    // noinspection JSUnresolvedVariable
    chrome.storage.sync.set({
        [key]: data
    });
}

const reflectOptions = (options) => {
    const element = document.querySelector('table>tbody')
    while (element?.firstChild) {
        element.removeChild(element.firstChild)
    }

    options?.mapping?.forEach(mapping => {
        addLine(mapping.name, mapping.tag)
    })

    if (!options?.mapping?.length) {
        addLine()
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    let options = await loadOption();
    reflectOptions(options)

    const addButtonElement = document.querySelector('#add-line-button')
    addButtonElement.addEventListener('click', () => {
        addLine()
    })

    const saveButtonElement = document.querySelector('#save-button')
    saveButtonElement.addEventListener('click', () => {
        options.mapping = Array.from(document.querySelectorAll('table>tbody>tr'))
            .map((trElement) => {
                const nameElement = trElement.querySelector('input.input-name')
                const tagElement = trElement.querySelector('input.input-tag')

                const name = nameElement.value
                const trimName = name.replaceAll(/\s+/g, '');

                return {
                    name: trimName,
                    tag: tagElement.value,
                }
            })
            .filter((mapping) => mapping.name && mapping.tag)

        saveOption(options)
    })

    const exportButtonElement = document.querySelector('#export-button')
    exportButtonElement.addEventListener('click', () => {
        exportJson(options)
    })

    const importFileElement = document.querySelector('#import-file')
    importFileElement.addEventListener('change', async () => {
        options = await importJson(importFileElement.files)

        reflectOptions(options)

        window.alert('まだ保存されていません。' + "\n" + '内容を確認して保存ボタンを押してください')
    })
})
