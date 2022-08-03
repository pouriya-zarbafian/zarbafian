function init() {
    console.log('Init');
    goto('home');
}

function goto(section: string) {

    const content = document.querySelector('#content');
    const req = new Request(section + '.html');

    fetch(req)
        .then( (resp) => resp.text() )
        .then( (html) => {
            content.innerHTML = html;
        });
}

function openInTab(url: string) {
    window.open(url, '_blank').focus();
}