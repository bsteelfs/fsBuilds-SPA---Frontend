import { fsBuilderUrl, fsEpmlUrl } from "../consts"

export const scriptLoader = (storefront, attributes = null) => {
  const scriptId = "fsc-api"

  document.getElementById(scriptId)?.remove()

  const script = document.createElement("script")
  script.src = fsBuilderUrl
  script.type = "text/javascript"
  script.id = scriptId
  script.setAttribute("data-continuous", "true")
  script.dataset.storefront = storefront

  if (attributes) {
    attributes.forEach((attr) => {
      script.setAttribute(attr.name, attr.value)
    })
  }

  return script
}

export const loadEpmlScript = () => {
  const script = document.createElement("script")
  script.src = fsEpmlUrl
  script.id = "fsc-epml"
  script.setAttribute("data-payment-component-id", "payment-portal-component")
  document.body.appendChild(script)

  return script
}

export const fadeSkeletonAway = (timeout = 1200) => {
  setTimeout(() => {
    const elements = document.querySelectorAll(
      "#fsc-embedded-checkout-skeleton"
    )

    elements.forEach((element) => {
      if (element.style.opacity !== "0") {
        element.style.opacity = "0"
        element.style.transition = "opacity 0.1s"
      }
    })
  }, timeout)
}

export const fsSecretKey = () => {
  const combined =
    import.meta.env.VITE_FS_USERNAME_SECRET +
    ":" +
    import.meta.env.VITE_FS_PASSWORD_SECRET

  const base64Encoded = btoa(combined)

  return "Basic " + base64Encoded
}
