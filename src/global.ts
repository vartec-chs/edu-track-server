import { Role } from '@prisma/client'

export type JWTUser = {
	id: string
	roles: Role[]
}

export type Answer<T = null> = {
	status: 'success' | 'error'
	message: string
	data?: T
}
