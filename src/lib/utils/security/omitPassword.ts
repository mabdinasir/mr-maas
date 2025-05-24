/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import { User } from '@models/user'

export const omitPassword = (user: User) => {
    const { password, ...userWithoutPassword } = user
    return userWithoutPassword
}
