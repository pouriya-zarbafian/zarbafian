var svgManager: SvgManager;

function init() {

    let width: number = window.innerWidth;
    let height: number = window.innerHeight;
    svgManager = new SvgManager(Html.svg, width, height);
    svgManager.init();
}