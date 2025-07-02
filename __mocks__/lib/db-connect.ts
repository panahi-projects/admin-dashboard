export default jest.fn().mockImplementation(async () => {
  return {
    connection: {
      readyState: 1,
    },
  };
});
