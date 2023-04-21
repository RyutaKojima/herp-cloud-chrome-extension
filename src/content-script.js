const loadOption = () => {
    const key = 'option-data'

    return new Promise((resolve) => {
        // noinspection JSUnresolvedVariable
        chrome.storage.sync.get(key, (value) => {
            resolve(value[key]);
        });
    })
}

(async () => {
    const options = await loadOption();
    const mapping = options.mapping ?? []

    document.addEventListener('click', (event) => {
        const userNameElement = event.target.closest('.user-selector__user')?.querySelector('.user-selector__name')
        if (!userNameElement) {
            return
        }

        const name = userNameElement.innerText
        const trimName = name.replaceAll(/\s+/g, '');

        // 名前マッチングしてChatworkタグを追加する
        const matchCase = mapping.find((value) => value.name === trimName)
        if (matchCase) {
            const textarea = document.querySelector('.candidacy-discussion__textarea textarea')
            textarea.value = textarea.value + matchCase.tag
        }
    })

})()
