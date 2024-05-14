import axios from "axios"
const BasicAxios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
})

BasicAxios.defaults.withCredentials = true

BasicAxios.interceptors.request.use(
  (config) => {
    const el = document.querySelector("#message")

    el.classList.remove("message")
    el.innerHTML = ""
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

BasicAxios.interceptors.response.use(
  (response) => {
    const message = response.data?.message
    if (message) {
      setResponseMessage(message, "var(--color-success)")
    }

    return response
  },

  (error) => {
    const message = error?.response?.data?.message
    if (message) {
      setResponseMessage(message, "var(--color-error)")
    }

    return Promise.reject(error)
  }
)
export default BasicAxios

function setResponseMessage(message, color) {
  const el = document.querySelector("#message")
  if (el) {
    el.classList.add("message")
    el.innerHTML = message
    el.style = `background-color: ${color}; color: white;`
    setTimeout(() => {
      el.classList.remove("message")
      el.innerHTML = ""
    }, 3000)
  }
}
