export interface User {
    email: string
    displayName: string
    roles: string[]
    token: string
    profilePicture: any
}

export interface User_Address {
    firstName: string
    lastName: string
    streetAddress: string
    complexName: string
    suburb: string
    city: string
    province: string
    postalCode: number
}
