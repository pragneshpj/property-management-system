import React, { useEffect, useState } from 'react'
import { useTheme } from '@mui/material'
import { tokens } from '@theme/theme'
import axios from 'axios'
import DataTable from 'react-data-table-component'
import Head from 'next/head'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export const getRoleBackgroundColor = (role, colors) => {
  const Role = role.toLowerCase()

  if (Role === 'admin') {
    return colors.greenAccent[600]
  } else if (Role === 'super-admin') {
    return colors.redAccent[600]
  } else {
    const min = parseInt('3da58a', 16)
    const max = parseInt('4cceac', 16)
    const randomValue = Math.floor(Math.random() * (max - min + 1) + min)

    return '#' + randomValue.toString(16)
  }
}

const Permission = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const [permissionData, setPermissionData] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/permission`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        setPermissionData(response.data.data.permissionData)
      } catch (error) {
        toast.error('Error Fetching Data')
      }
    }
    fetchData()
  }, [])

  const columns = [
    {
      name: 'Name',
      selector: row => <span>{row.module}</span>
    },
    {
      name: 'Assign to',
      cell: row => (
        <div className='d-flex gap-2'>
          {row.role.map((role, index) => (
            <div
              className='fw-bold  d-flex jstify-content-center align-items-center  px-2 py-1 rounded-pill text-capitalize'
              key={index}
              style={{ backgroundColor: getRoleBackgroundColor(role, colors) }}
            >
              {role}
            </div>
          ))}
        </div>
      )
    }
  ]

  const tableCustomStyles = {
    head: {
      style: {
        fontSize: '20px',
        fontWeight: 'bold',
        paddingLeft: '0 8px',
        backgroundColor: colors.primary[500],
        color: colors.grey[100]
      }
    },
    headRow: {
      style: {
        fontSize: '20px',
        fontWeight: 'bold',
        paddingLeft: '0 8px',
        backgroundColor: colors.primary[500],
        color: colors.grey[100]
      }
    },

    headCells: {
      style: {
        fontSize: '20px',
        fontWeight: 'bold',
        paddingLeft: '0 8px',
        backgroundColor: colors.primary[500],
        color: colors.grey[100]
      }
    },
    subHeader: {
      style: {
        backgroundColor: colors.primary[500],
        color: colors.grey[100]
      }
    },
    cells: {
      style: {
        paddingLeft: '0 8px',
        justifyContent: 'start',
        fontSize: '16px',
        fontWeight: '400',
        backgroundColor: colors.primary[500],
        color: colors.grey[100]
      }
    },
    header: {
      style: {
        fontSize: '30px',
        fontWeight: 700,
        paddingLeft: '0px 8px',
        backgroundColor: colors.primary[500],
        color: colors.grey[100]
      }
    },
    rows: {
      style: {
        backgroundColor: colors.primary[500],
        color: colors.grey[100]
      }
    },
    noData: {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: colors.grey[100],
        backgroundColor: colors.primary[500]
      }
    },
    pagination: {
      style: {
        backgroundColor: colors.primary[500],
        color: colors.grey[100]
      },
      pageButtonsStyle: {
        borderRadius: '50%',
        height: '40px',
        width: '40px',
        padding: '8px',
        margin: 'px',
        cursor: 'pointer',
        transition: '0.4s',
        color: colors.grey[100],
        fill: colors.grey[100],
        backgroundColor: 'transparent',
        '&:disabled': {
          cursor: 'unset',
          color: colors.grey[100],
          fill: colors.grey[100]
        }
      }
    }
  }

  return (
    <>
      <Head>
        <title>Permission List</title>
        <meta name='description' content='Permission List Page' />
      </Head>
      <div data-testid='permission-list' className='p-2 rounded-2' style={{ backgroundColor: colors.primary[500] }}>
        <DataTable
          columns={columns}
          data={permissionData}
          title='Permission List'
          customStyles={tableCustomStyles}
          fixedHeader
          fixedHeaderScrollHeight='600px'
          className='scrollbar'
          noDataComponent={
            <div className='d-flex justify-content-center mt-5'>
              <h5 style={{ color: colors.grey[100] }}>There is No Data Available</h5>
            </div>
          }
        />
      </div>
      <ToastContainer draggable closeOnClick={true} position='top-right' autoClose={3000} />
    </>
  )
}

export default Permission
