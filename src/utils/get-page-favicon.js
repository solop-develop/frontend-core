import store from '@/store'

export default function getPageFavicon() {
  const { logoUrl } = store.getters['user/getSystem']
  let link = document.querySelector("link[rel~='icon']")
  console.log({ link })
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
  }
  link.href = logoUrl
  return link
}
