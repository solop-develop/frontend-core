import defaultSettings from '@/settings'
import i18n from '@/lang'

export default function getPageTitle({
  key,
  nameSystem
}) {
  const title = nameSystem || defaultSettings.title
  const hasKey = i18n.te(`route.${key}`)
  if (hasKey) {
    const pageName = i18n.t(`route.${key}`)
    return `${pageName} - ${title}`
  }
  return `${title}`
}
