export default (method) => async (req, res) => {
  try {
    return await method(req, res);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(`${error.message}`, error);
    return res.redirect('/');
  }
};
