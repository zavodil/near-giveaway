const LoadingIndicator = ({ isLoading }) => {
  return (
    <>
      {isLoading ? (
        <div className="my-4 mx-auto loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
      ) : (
        <div className="my-4 h-12 w-12"></div>
      )}
    </>
  );
};

export default LoadingIndicator;
