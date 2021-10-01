const insertUser = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('ok');
    }, 1000);
  });
 };

 const getAllUsers = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([]);
    }, 1000);
  });
 };

 const getUser = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
 };

 const getUserFriends = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([]);
    }, 1000);
  });
 };

 const getUserFriendsCount = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(0);
    }, 1000);
  });
 };

 module.exports = {
   insertUser,
   getAllUsers,
   getUser,
   getUserFriends,
   getUserFriendsCount
 };
