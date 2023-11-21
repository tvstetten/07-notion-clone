'use client'

import { useEffect, useState } from "react"

import { SettingsModal } from "../modals/settings-modal"
import { CoverImageModal } from "../modals/cover-image-modal"

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])
  return (
    <>
      <SettingsModal />
      <CoverImageModal />
    </>
  )

  if (!isMounted) {
    return null
  }

  return (
    <>
      <SettingsModal />
    </>
  )
}