import config from '../config'
import { USER_ROLE } from '../modules/user/user.constrant'
import { UserModel } from '../modules/user/user.model'

const superUser = {
  id: '0001',
  email: 'moyuriakther97@gmail.com',
  password: config.super_admin_password,
  needsPasswordChange: false,
  role: USER_ROLE.superAdmin,
  status: 'in-progress',
  isDeleted: false,
}

const seedSuperAdmin = async () => {
  const isSuperAdminExist = await UserModel.findOne({
    role: USER_ROLE.superAdmin,
  })
  if (!isSuperAdminExist) {
    await UserModel.create(superUser)
  }
}

export default seedSuperAdmin
