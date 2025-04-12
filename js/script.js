; ((document, window, undefined) => {

  "use strict"

  /**
   * Mermaid diagrams.
   *
   * First, take all Markdown ```mermaid elements and finesse them into a
   * div.mermaid with the original source in a <details>. It's worth noting
   * that Mermaid uses commonly-encoded entities like > (&gt;) which this
   * strategy deals with e.g. $el.textContent.
   *
   * Second, initialize Mermaid with the `securityLevel` set to "loose" as the
   * diagrams are first-party authored and the `theme` set to "dark" if that
   * is the preferred color scheme. Also, `logLevel` if something goes wrong.
   */

  document.querySelectorAll("pre.mermaid").forEach($el => $el.outerHTML = `
    <div class="mermaid">${$el.textContent}</div>
    <details>
      <summary>Diagram source</summary>
      <pre>${$el.textContent}</pre>
    </details>
  `)

  mermaid.initialize({
    logLevel: "error",
    securityLevel: "loose",
    theme: (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ?
      "dark" :
      "default"
  })

  /**
   * Syntax highlighting.
   */

  hljs.initHighlightingOnLoad()

  /**
   * Add the nice hash-link to headers.
   * Inspired by CodePen: https://blog.codepen.io/2016/11/17/anchor-links-post-headers/
   *
   * The main goal is to keep slugs as "clean" as possible:
   * 1. if possible, use the `id` already on the element
   * 2. if not, `slugify` the contents of the element
   * 3. check for any duplicates from the above steps
   * 4. finally, append a unique number to duplicates
   */

  const slugify = (text) => {
    return text.toString().toLowerCase().trim()
      .replace(/\s+/g, "-")     // Replace spaces with -
      .replace(/&/g, "-and-")   // Replace & with "and"
      .replace(/[^\w\-]+/g, "") // Remove all non-word chars
      .replace(/\-\-+/g, "-")   // Replace multiple - with single -
  }

  const $headers = Array.from(document.querySelectorAll("article h2, article h3, article h4, article h5, article h6"))

  // Get all slugs before doing anything else
  const slugs = $headers.map($header => $header.id || slugify($header.textContent))
  // Find duplicates (to make them unique later)
  const dupes = slugs.reduce((acc, slug, index, slugs) => slugs.indexOf(slug) !== index && acc.indexOf(slug) === -1 ? acc.concat(slug) : acc, [])
  // Seed the unique number
  let uniq = 0

  for (const $header of $headers) {
    let slug = $header.id || slugify($header.textContent)
    slug = (dupes.includes(slug)) ? `${slug}-${uniq++}` : slug

    const $link = document.createElement("a")
    $link.innerHTML = "#"
    $link.className = "header-hash"
    $link.href = `#${slug}`
    $link.id = slug

    // Remove `id` from header (avoid having duplicate `id`s)
    if ($header.id)
      $header.removeAttribute("id")

    $header.insertBefore($link, $header.firstChild)
  }

})(document, window)
