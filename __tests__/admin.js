import { fireEvent, render, screen, waitFor, act } from '@testing-library/react'
import React from 'react'
import '@testing-library/jest-dom'
import axios from 'axios'
import Admin from 'src/pages/admin'
import UpdateAdmin from '@components/admin/update-admin'
import AddAdmin from '@components/admin/add-admin'

jest.mock('axios')

const mockPermissions = [
  {
    module: {
      alias_name: 'Admin'
    },
    view: true,
    update: true,
    remove: true,
    add: true
  }
]

const mockAdminData = [
  {
    u_id: 1,
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@example.com',
    phone: '1234567890',
    alternate_phone: '0987654321',
    status: true,
    is_superadmin: false
  }
]

describe('Admin Component', () => {
  beforeEach(async () => {
    localStorage.setItem('user', JSON.stringify(mockPermissions))
    axios.get = jest.fn().mockResolvedValue({ data: { data: { adminData: mockAdminData } } })
    render(<Admin />)
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled()
    })
  })
  test('Admin List Rendering Test', async () => {
    const adminList = await screen.findByTestId('admin-list')
    expect(adminList).toBeInTheDocument()
  })
  test('renders Admin list from API', async () => {
    await waitFor(() => {
      expect(screen.getByText('Name')).toBeInTheDocument()
      expect(screen.getByText('Email')).toBeInTheDocument()
      expect(screen.getByText('Phone')).toBeInTheDocument()
      expect(screen.getByText('Alternate Phone')).toBeInTheDocument()
      expect(screen.getByText('Status')).toBeInTheDocument()
      expect(screen.getByText('Action')).toBeInTheDocument()
    })
  })
  test('handles error when API request fails', async () => {
    axios.get.mockRejectedValueOnce(new Error('API request failed'))
    render(<Admin />)
    await waitFor(() => {
      expect(screen.getByText('Error Fetching Data')).toBeInTheDocument()
    })
  })
  test('clicking Edit button opens edit modal', async () => {
    const edit = screen.getByTestId('edit-admin')
    expect(edit).toBeInTheDocument()
    fireEvent.click(edit)
    await waitFor(() => {
      expect(screen.getByTestId('edit-admin-modal')).toBeInTheDocument()
      expect(screen.getByText('Edit Admin')).toBeInTheDocument()
    })
  })
  test('clicking View button to see view model', async () => {
    const view = screen.getByTestId('view-admin')
    expect(view).toBeInTheDocument()
    fireEvent.click(view)
    expect(screen.getByText('View Admin')).toBeInTheDocument()
  })
  test('clicking Delete button opens delete modal', async () => {
    const deleteAdmin = screen.getByTestId('delete-admin')
    expect(deleteAdmin).toBeInTheDocument()
    fireEvent.click(deleteAdmin)
    await waitFor(() => {
      expect(screen.getByTestId('delete-admin-modal')).toBeInTheDocument()
      expect(screen.getByText('Delete Admin')).toBeInTheDocument()
    })
  })
  test('clicking Add button to see add model', async () => {
    const add = screen.getByTestId('add-admin')
    expect(add).toBeInTheDocument()
    fireEvent.click(add)
    const elements = screen.getAllByText('Add Admin')
    elements.forEach(element => {
      expect(element).toBeInTheDocument()
    })
  })
  test('clicking Delete button and then click confirm delete button to delete admin - Success', async () => {
    const mockResponseData = { data: { statusCode: 200 } }
    jest.spyOn(axios, 'delete').mockResolvedValue(mockResponseData)
    render(<Admin />)
    const deleteAdmin = screen.getByTestId('delete-admin')
    fireEvent.click(deleteAdmin)
    expect(screen.getByText('Delete Admin')).toBeInTheDocument()
    const confirmDelete = screen.getByTestId('confirm-delete')
    fireEvent.click(confirmDelete)
    await waitFor(() => {
      expect(screen.queryByText('Delete Admin')).not.toBeInTheDocument()
      expect(screen.queryAllByText('User deleted successfully!')[0]).toBeInTheDocument()
    })
  })
  test('handles error when deleting admin', async () => {
    jest.spyOn(axios, 'delete').mockRejectedValueOnce(new Error('Delete request failed'))
    render(<Admin />)
    const deleteAdmin = screen.getByTestId('delete-admin')
    fireEvent.click(deleteAdmin)
    expect(screen.getByText('Delete Admin')).toBeInTheDocument()
    const confirmDelete = screen.getByTestId('confirm-delete')
    fireEvent.click(confirmDelete)
    await waitFor(() => {
      expect(screen.getByText('Error deleting Admin')).toBeInTheDocument()
    })
  })
})
describe('Edit Admin Component', () => {
  const admin = {
    first_name: 'Jhon',
    last_name: 'deo',
    email: 'jhon@gmail.com',
    phone: 9087654321,
    alternate_phone: 7689043210,
    country: 'USA',
    state: 'California',
    city: 'Los Angeles',
    pincode: '900260',
    status: true
  }
  test('renders admin details with correct values', () => {
    const { getByLabelText, getByTestId } = render(<UpdateAdmin admin={admin} />)
    expect(getByLabelText('First name')).toHaveValue(admin.first_name)
    expect(getByLabelText('Last name')).toHaveValue(admin.last_name)
    expect(getByLabelText('Email address')).toHaveValue(admin.email)
    expect(getByLabelText('Phone number')).toHaveValue(admin.phone.toString())
    expect(getByLabelText('Alternative Phone No:')).toHaveValue(admin.alternate_phone.toString())
    expect(getByLabelText('Country')).toHaveValue(admin.country)
    expect(getByLabelText('State')).toHaveValue(admin.state)
    expect(getByLabelText('City')).toHaveValue(admin.city)
    expect(getByLabelText('Pincode')).toHaveValue(admin.pincode)
    expect(getByTestId('active')).toBeChecked()
  })
  test('Update Admin With Empty Fields to Get Validation Error', async () => {
    const onUpdate = jest.fn()
    const handleEditButton = jest.fn()
    render(<UpdateAdmin admin={admin} onUpdate={onUpdate} handleEditButton={handleEditButton} />)
    const first_name = screen.getByTestId('first_name')
    const state = screen.getByTestId('state')
    const city = screen.getByTestId('city')
    const last_name = screen.getByTestId('last_name')
    const email = screen.getByTestId('email')
    const phone = screen.getByTestId('phone')
    const country = screen.getByTestId('country')
    const alternate_phone = screen.getByTestId('alternate_phone')
    fireEvent.change(first_name, { target: { value: '' } })
    fireEvent.change(state, { target: { value: '' } })
    fireEvent.change(city, { target: { value: '' } })
    fireEvent.change(pincode, { target: { value: '' } })
    fireEvent.change(last_name, { target: { value: '' } })
    fireEvent.change(email, { target: { value: '' } })
    fireEvent.change(phone, { target: { value: '' } })
    fireEvent.change(alternate_phone, { target: { value: '' } })
    fireEvent.change(country, { target: { value: '' } })
    const saveButton = screen.getByTestId('save-changes')
    act(() => {
      fireEvent.click(saveButton)
    })
    await waitFor(() => {
      expect(screen.getByText('First name is required')).toBeInTheDocument()
      expect(screen.getByText('State is required')).toBeInTheDocument()
      expect(screen.getByText('City is required')).toBeInTheDocument()
      expect(screen.getByText('Last name is required')).toBeInTheDocument()
      expect(screen.getByText('Email is required')).toBeInTheDocument()
      expect(
        screen.getByText('phone must be a `number` type, but the final value was: `NaN` (cast from the value `""`).')
      ).toBeInTheDocument()
      expect(
        screen.getByText(
          'alternate_phone must be a `number` type, but the final value was: `NaN` (cast from the value `""`).'
        )
      ).toBeInTheDocument()
      expect(screen.getByText('Country is required')).toBeInTheDocument()
    })
  })
  test('successfully updates admin upon form submission', async () => {
    const mockResponse = { status: 201 }
    axios.patch = jest.fn().mockResolvedValue(mockResponse)
    const onUpdate = jest.fn()
    const handelEditbutton = jest.fn()
    render(<UpdateAdmin admin={admin} onUpdate={onUpdate} handelEditbutton={handelEditbutton} />)
    const saveButton = screen.getByLabelText('save')
    act(() => {
      fireEvent.click(saveButton)
    })
    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled()
      expect(handelEditbutton).toHaveBeenCalled()
      expect(screen.getByText('Admin updated successfully')).toBeInTheDocument()
    })
  })
  test('handles error when updating Admin', async () => {
    const mockError = new Error('Update request failed')
    axios.patch = jest.fn().mockRejectedValue(mockError)
    const onUpdate = jest.fn()
    const handelEditbutton = jest.fn()
    render(<UpdateAdmin admin={admin} onUpdate={onUpdate} handelEditbutton={handelEditbutton} />)
    const saveButton = screen.getByLabelText('save')
    fireEvent.click(saveButton)
    await waitFor(() => {
      expect(onUpdate).not.toHaveBeenCalled()
      expect(handelEditbutton).not.toHaveBeenCalled()
      expect(screen.getByText('Error updating admin')).toBeInTheDocument()
    })
  })
})

describe('Admin Add Component', () => {
  const admin = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@gmail.com',
    password: 'John@1234',
    phone: '1234567890',
    alternate_phone: '0987654321',
    country: 'USA',
    state: 'California',
    city: 'Los Angeles',
    pincode: '90026',
    role_u_id: 'ROL10000000010'
  }

  beforeEach(() => {
    axios.get = jest.fn().mockResolvedValue({
      data: {
        data: [
          { u_id: 'ROL1000000001', name: 'super-admin' },
          { u_id: 'ROL1000000009', name: 'Owner' },
          { u_id: 'ROL1000000010', name: 'admin' }
        ]
      }
    })
  })

  test('Add New Admin Success', async () => {
    axios.post = jest.fn().mockResolvedValue({ data: { statusCode: 201 } })
    const onUpdate = jest.fn()
    const handelAddbutton = jest.fn()

    render(<AddAdmin onUpdate={onUpdate} handelAddbutton={handelAddbutton} />)

    fireEvent.change(screen.getByLabelText('First name'), { target: { value: admin.first_name } })
    fireEvent.change(screen.getByLabelText('Last name'), { target: { value: admin.last_name } })
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: admin.email } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: admin.password } })
    fireEvent.change(screen.getByLabelText('Role'), { target: { value: admin.role_u_id } })
    fireEvent.change(screen.getByLabelText('Phone number'), { target: { value: admin.phone } })
    fireEvent.change(screen.getByLabelText('Alternative Phone No:'), { target: { value: admin.alternate_phone } })
    fireEvent.change(screen.getByLabelText('City'), { target: { value: admin.city } })
    fireEvent.change(screen.getByLabelText('State'), { target: { value: admin.state } })
    fireEvent.change(screen.getByLabelText('Country'), { target: { value: admin.country } })
    fireEvent.change(screen.getByLabelText('Pincode'), { target: { value: admin.pincode } })

    const saveButton = screen.getByTestId('add-admin-button')

    act(() => {
      fireEvent.click(saveButton)
    })

    await waitFor(() => {
      expect(onUpdate).toHaveBeenCalled()
      expect(handelAddbutton).toHaveBeenCalled()
      expect(screen.getByText('Admin added successfully')).toBeInTheDocument()
    })
  })

  test('Add New Admin Error', async () => {
    axios.post = jest.fn().mockRejectedValue({ data: { statusCode: 500 } })
    const onUpdate = jest.fn()
    const handelAddbutton = jest.fn()

    act(() => {
      render(<AddAdmin onUpdate={onUpdate} handelAddbutton={handelAddbutton} />)
    })

    fireEvent.change(screen.getByLabelText('First name'), { target: { value: admin.first_name } })
    fireEvent.change(screen.getByLabelText('Last name'), { target: { value: admin.last_name } })
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: admin.email } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: admin.password } })
    fireEvent.change(screen.getByLabelText('Role'), { target: { value: admin.role_u_id } })
    fireEvent.change(screen.getByLabelText('Phone number'), { target: { value: admin.phone } })
    fireEvent.change(screen.getByLabelText('Alternative Phone No:'), { target: { value: admin.alternate_phone } })
    fireEvent.change(screen.getByLabelText('City'), { target: { value: admin.city } })
    fireEvent.change(screen.getByLabelText('State'), { target: { value: admin.state } })
    fireEvent.change(screen.getByLabelText('Country'), { target: { value: admin.country } })
    fireEvent.change(screen.getByLabelText('Pincode'), { target: { value: admin.pincode } })

    const saveButton = screen.getByTestId('add-admin-button')

    act(() => {
      fireEvent.click(saveButton)
    })

    await waitFor(() => {
      expect(onUpdate).not.toHaveBeenCalled()
      expect(handelAddbutton).not.toHaveBeenCalled()
      expect(screen.getByText('Admin cannot be created')).toBeInTheDocument()
    })
  })

  test('Add New Admin to enter empty Fields to get Validation Error', async () => {
    const mockResponse = { status: 201 }
    axios.patch = jest.fn().mockResolvedValue(mockResponse)
    const onUpdate = jest.fn()
    const handelAddbutton = jest.fn()

    render(<AddAdmin onUpdate={onUpdate} handelAddbutton={handelAddbutton} />)

    fireEvent.change(screen.getByLabelText('First name'), { target: { value: '' } })
    fireEvent.change(screen.getByLabelText('Last name'), { target: { value: '' } })
    fireEvent.change(screen.getByLabelText('Email address'), { target: { value: '' } })
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: '' } })
    fireEvent.change(screen.getByLabelText('Role'), { target: { value: '' } })
    fireEvent.change(screen.getByLabelText('Phone number'), { target: { value: '' } })
    fireEvent.change(screen.getByLabelText('Alternative Phone No:'), { target: { value: '' } })
    fireEvent.change(screen.getByLabelText('City'), { target: { value: '' } })
    fireEvent.change(screen.getByLabelText('State'), { target: { value: '' } })
    fireEvent.change(screen.getByLabelText('Country'), { target: { value: '' } })
    fireEvent.change(screen.getByLabelText('Pincode'), { target: { value: '' } })

    const saveButton = screen.getByTestId('add-admin-button')

    act(() => {
      fireEvent.click(saveButton)
    })

    await waitFor(() => {
      expect(screen.getByText('First name is required')).toBeInTheDocument()
      expect(screen.getByText('Last name is required')).toBeInTheDocument()
      expect(screen.getByText('Email is required')).toBeInTheDocument()
      expect(screen.getByText('Phone number is required')).toBeInTheDocument()
    })
  })
})

describe('Password Visibility Toggle', () => {
  test('toggles the password visibility on button click', () => {
    render(<AddAdmin />)

    const toggleButton = screen.getByLabelText('Show password')
    fireEvent.click(toggleButton)
    expect(screen.getByTestId('visibility-off-icon')).toBeInTheDocument()

    fireEvent.click(toggleButton)
    expect(screen.getByTestId('visibility-icon')).toBeInTheDocument()
  })
})
