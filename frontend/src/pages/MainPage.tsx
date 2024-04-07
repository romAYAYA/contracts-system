import TableComponent from '../components/TableComponent.tsx'
import ContractForm from '../components/ContractForm.tsx'
import { Box } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { IData, IForm } from '../schemas/IData.ts'
import { isDebug } from '../../constants.tsx'
import axiosInstance from '../api.ts'
import axios from 'axios'


const MainPage = () => {
  const [data, setData] = useState<IData[]>([])
  const [totalSum, setTotalSum] = useState<number>(0)
  const [form, setForm] = useState<IForm>({
    comment: '',
    total: 0,
    file_path: null
  })
  const [fileSize, setFileSize] = useState<number>(0)
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null)

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setForm({ ...form, [name]: value })
  }

  const getData = async () => {
    try {
      const res = await axiosInstance.get('/contracts/')
      setData(res.data.data)
    } catch (error) {
      if (isDebug) {
        console.error(`Error: ${ error }`)
      }
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0]

    if (file) {
      const fileSizeInBytes = file.size
      const fileSizeInKB = fileSizeInBytes / 1024
      setFileSize(fileSizeInKB)
      setForm({ ...form, file_path: file || null })
    } else {
      setFileSize(0)
    }
  }

  const postData = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!selectedAgentId) {
      window.alert("Please select an agent.");
      return;
    }

    const formData = new FormData()
    // @ts-ignore
    formData.append('id', selectedAgentId)
    formData.append('comment', form.comment)
    formData.append('total', form.total.toString())
    if (form.file_path) {
      formData.append('file_path', form.file_path)
    } else {
      window.alert('Choose a file')
      return
    }

    try {
      const res = await axiosInstance.post(
        '/contract/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      console.log(formData);
      
      getData()
      if (isDebug) {
        console.log(res)
      }
    } catch (error) {
      if (isDebug) {
        console.error(`Error: ${ error }`)
      }
    }
  }

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    if (data) {
      setTotalSum(data.reduce((accumulator, row) => accumulator + parseFloat(row.total), 0))
    }
  }, [data])

  // todo переделать
  const register = async () => {
    try {
      const res = axios.post('http://localhost:8000/api/user/register/', {
        username: 'roman123',
        password: 'Romaasassdf12xcv43!'
      })
      console.log(res)
    }
    catch (err) {
      console.log(err)
    }

  }



  return (
    <>
      <Box
        sx={ { display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', gap: '5px' } }>
        <TableComponent data={ data } totalSum={ totalSum }/>
        
        <ContractForm // @ts-ignore 
        setSelectedAgentId={ setSelectedAgentId } postData={ postData } handleFileChange={ handleFileChange } form={ form }
                      handleInputChange={ handleInputChange } fileSize={ fileSize }/>

        <button onClick={register}>click</button>

      </Box>
    </>
  )
}

export default MainPage