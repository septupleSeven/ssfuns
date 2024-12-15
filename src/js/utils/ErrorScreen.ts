export class ErrorScreen {
    constructor() {}

    removeContents(){
        document.querySelector("main")?.remove();
    }

    showErrorScreen(){
        const errorScreenNode = `
            <div id="error_screen">
              <div class="title_container">
                <span class="material-icons">
                  error
                </span>
                <h1>Error</h1>
              </div>
              <p class="desc">사용 중인 브라우저 또는 하드웨어 환경에서는 WebGL을 사용할 수 없습니다.</p>
            </div>
        `;

        document.querySelector("body")?.insertAdjacentHTML("afterbegin", errorScreenNode);
    }
}