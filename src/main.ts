import "./style.css"
import typescriptLogo from "./typescript.svg"
import viteLogo from "/vite.svg"
import { reactive, effect } from "./reactivity"

const app = document.querySelector<HTMLDivElement>("#app")!
const count = reactive({ value: 0 })
const text = reactive({ x: window.innerWidth, y: window.innerHeight })

effect(() => {
  app.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button">${count.value}</button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
    <div class="read-the-docs">
      ${text.x} + ${text.y}
    </div>
  </div>
`

  const counter = document.querySelector<HTMLButtonElement>("#counter")!

  counter.onclick = function () {
    count.value++
  }

  window.onresize = function () {
    text.x = window.innerWidth
    text.y = window.innerHeight
  }
})
