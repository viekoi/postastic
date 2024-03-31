"use client"
import React from 'react'
import Modal from './modal'
import { useEditProfileModal } from '@/hooks/use-modal-store'

const EditProfileModal = () => {
 const {isOpen,onClose} = useEditProfileModal()
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
        Edit
    </Modal>
  )
}

export default EditProfileModal
