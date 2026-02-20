
const userRepo = require('../../../infrastructure/db/userRepo');

module.exports = async function updateUser({ userId, firstName, lastName, phone, address }) {
  const user = await userRepo.findById(userId);
  if (!user) throw Object.assign(new Error('Usuario no encontrado'), { status: 404 });

  user.updateProfile({ firstName, lastName, phone, address });
  await userRepo.updateProfile(user);

  return { id: user.id, firstName: user.firstName, lastName: user.lastName, phone: user.phone, address: user.address };
};
