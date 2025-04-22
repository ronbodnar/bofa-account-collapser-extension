;(function () {
  const STORAGE_KEY = "collapsedAccounts"

  let collapsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")

  function toggleAccount(container, adx) {
    const isCollapsed = collapsed[adx]
    collapsed[adx] = !isCollapsed
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collapsed))
    applyCollapseState(container, adx)
  }

  function applyCollapseState(container, adx) {
    const isCollapsed = collapsed[adx]

    const children = [...container.children].filter(
      (el) =>
        !el.classList.contains("AccountName") &&
        !el.classList.contains("AccountBalance") &&
        !el.classList.contains("gripperContainer")
    )

    for (const child of children) {
      child.style.display = isCollapsed ? "none" : ""
    }

    const btn = container.querySelector(".collapse-toggle")
    if (btn) btn.textContent = isCollapsed ? "+" : "-"
  }

  function init() {
    const accountItems = document.querySelectorAll(".AccountItem")
    accountItems.forEach((item) => {
      const adx = item.dataset.adx
      if (!adx) return

      if (!item.querySelector(".collapse-toggle")) {
        const btn = document.createElement("button")
        btn.textContent = collapsed[adx] ? "+" : "-"
        btn.className = "collapse-toggle"

        const nameSpan = item.querySelector(".AccountName")
        if (nameSpan) {
          nameSpan.prepend(btn)
          btn.addEventListener("click", () => toggleAccount(item, adx))
          applyCollapseState(item, adx)
        }
      }
    })
  }

  // Re-init on mutation (Bank of America uses AJAX)
  const observer = new MutationObserver(init)
  observer.observe(document.body, { childList: true, subtree: true })

  window.addEventListener("DOMContentLoaded", init)
  init()
})()
