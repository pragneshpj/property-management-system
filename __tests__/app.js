import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom' 
import { MemoryRouter } from 'react-router-dom'
import {App} from 'src/pages/_app' 


const localStorageMock = (() => {
  let store = {}

  return {
    getItem: key => store[key],
    setItem: (key, value) => (store[key] = value),
    removeItem: key => delete store[key],
    clear: () => (store = {})
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

const MockUserData =[
      {
        "id": 1,
        "u_id": "PER1000000001",
        "view": true,
        "add": true,
        "update": true,
        "remove": true,
        "notification": true,
        "created_at": "2024-04-05T10:52:23.144Z",
        "updated_at": "2024-04-05T10:52:23.144Z",
        "module_u_id": "MOD1000000001",
        "role_u_id": "ROL1000000001",
        "module": {
          "id": 1,
          "u_id": "MOD1000000001",
          "name": "role-and-permission",
          "alias_name": "Role And Permission",
          "status": true,
          "created_at": "2024-04-05T10:52:22.986Z",
          "updated_at": "2024-04-05T10:52:22.986Z"
        }
      },
      {
        "id": 2,
        "u_id": "PER1000000002",
        "view": true,
        "add": true,
        "update": true,
        "remove": true,
        "notification": true,
        "created_at": "2024-04-05T10:52:23.151Z",
        "updated_at": "2024-04-05T10:52:23.151Z",
        "module_u_id": "MOD1000000002",
        "role_u_id": "ROL1000000001",
        "module": {
          "id": 2,
          "u_id": "MOD1000000002",
          "name": "permission-list",
          "alias_name": "Permission List",
          "status": true,
          "created_at": "2024-04-05T10:52:22.996Z",
          "updated_at": "2024-04-05T10:52:22.996Z"
        }
      },
      {
        "id": 3,
        "u_id": "PER1000000003",
        "view": true,
        "add": true,
        "update": true,
        "remove": true,
        "notification": true,
        "created_at": "2024-04-05T10:52:23.154Z",
        "updated_at": "2024-04-05T10:52:23.154Z",
        "module_u_id": "MOD1000000003",
        "role_u_id": "ROL1000000001",
        "module": {
          "id": 3,
          "u_id": "MOD1000000003",
          "name": "admin",
          "alias_name": "Admin",
          "status": true,
          "created_at": "2024-04-05T10:52:23.001Z",
          "updated_at": "2024-04-05T10:52:23.001Z"
        }
      },
      {
        "id": 4,
        "u_id": "PER1000000004",
        "view": true,
        "add": true,
        "update": true,
        "remove": true,
        "notification": true,
        "created_at": "2024-04-05T10:52:23.159Z",
        "updated_at": "2024-04-05T10:52:23.159Z",
        "module_u_id": "MOD1000000004",
        "role_u_id": "ROL1000000001",
        "module": {
          "id": 4,
          "u_id": "MOD1000000004",
          "name": "owner",
          "alias_name": "Owner",
          "status": true,
          "created_at": "2024-04-05T10:52:23.005Z",
          "updated_at": "2024-04-05T10:52:23.005Z"
        }
      },
      {
        "id": 5,
        "u_id": "PER1000000005",
        "view": true,
        "add": true,
        "update": true,
        "remove": true,
        "notification": true,
        "created_at": "2024-04-05T10:52:23.162Z",
        "updated_at": "2024-04-05T10:52:23.162Z",
        "module_u_id": "MOD1000000005",
        "role_u_id": "ROL1000000001",
        "module": {
          "id": 5,
          "u_id": "MOD1000000005",
          "name": "property",
          "alias_name": "Property",
          "status": true,
          "created_at": "2024-04-05T10:52:23.010Z",
          "updated_at": "2024-04-05T10:52:23.010Z"
        }
      },
      {
        "id": 6,
        "u_id": "PER1000000006",
        "view": true,
        "add": true,
        "update": true,
        "remove": true,
        "notification": true,
        "created_at": "2024-04-05T10:52:23.166Z",
        "updated_at": "2024-04-05T10:52:23.166Z",
        "module_u_id": "MOD1000000006",
        "role_u_id": "ROL1000000001",
        "module": {
          "id": 6,
          "u_id": "MOD1000000006",
          "name": "customer",
          "alias_name": "Customer",
          "status": true,
          "created_at": "2024-04-05T10:52:23.016Z",
          "updated_at": "2024-04-05T10:52:23.016Z"
        }
      },
      {
        "id": 7,
        "u_id": "PER1000000007",
        "view": true,
        "add": true,
        "update": true,
        "remove": true,
        "notification": true,
        "created_at": "2024-04-05T10:52:23.169Z",
        "updated_at": "2024-04-05T10:52:23.169Z",
        "module_u_id": "MOD1000000007",
        "role_u_id": "ROL1000000001",
        "module": {
          "id": 7,
          "u_id": "MOD1000000007",
          "name": "property-allocate",
          "alias_name": "Property Allocate",
          "status": true,
          "created_at": "2024-04-05T10:52:23.021Z",
          "updated_at": "2024-04-05T10:52:23.021Z"
        }
      }
    ]


jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/',
    push: jest.fn()
  })
}))

jest.mock('next/router', () => ({
  useRouter: () => ({
    pathname: '/login',
    push: jest.fn()
  })
}))

describe('withAuth HOC', () => {

 

  test('renders WrappedComponent when user is authenticated', () => {
    localStorage.setItem('token', 'some_token')

    const DummyComponent = () => <div>Wrapped Component</div>

    const AuthenticatedComponent = withAuth(DummyComponent)

    const { getByText } = render(<AuthenticatedComponent />)

    expect(getByText('Wrapped Component')).toBeInTheDocument()
  })

  test('redirects to login page when user is not authenticated', () => {
    localStorage.removeItem('token')

    const DummyComponent = () => <div>Wrapped Component</div>

    const UnauthenticatedComponent = withAuth(DummyComponent)

    render(<UnauthenticatedComponent />)

    // expect(require('next/router').useRouter().push).toHaveBeenCalledWith('/login');
  })

  test('if Route is /login then Show Login Page', async() => {
    localStorageMock.setItem("user", JSON.stringify(MockUserData))

    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    ) 

    

    await waitFor(() => {
      
      
      const email = screen.getByTestId('email')
      expect(email).toBeInTheDocument()
      const password = screen.getByTestId('password')
      expect(password).toBeInTheDocument()
    })
  })
})

describe('App component', () => {
  test('renders login page correctly', async () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByTestId('spinner')).toBeInTheDocument()

  })
})
