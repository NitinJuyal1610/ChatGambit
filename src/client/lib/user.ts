export const getUser = () => {
  const userId = sessionStorage.getItem('userId');
  const userName = sessionStorage.getItem('userName');
  return {
    userId,
    userName,
  };
};
