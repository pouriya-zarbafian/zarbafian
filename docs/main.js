function init() {
    console.log('Init');
    goto('home');
}
function goto(section) {
    const content = document.querySelector('#content');
    const req = new Request(section + '.html');
    fetch(req)
        .then((resp) => resp.text())
        .then((html) => {
        content.innerHTML = html;
    });
}
function openInTab(url) {
    window.open(url, '_blank').focus();
}
//# sourceMappingURL=main.js.map