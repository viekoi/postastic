"use client"
import React from 'react'
import Modal from './modal'
import { useModal } from '@/hooks/use-modal-store'
import NewPostForm from '../forms/new-post-form'

const NewPostModal = () => {

   const {isOpen,onClose} = useModal()

    
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
        <NewPostForm/>
    </Modal>
  )
}

export default NewPostModal
