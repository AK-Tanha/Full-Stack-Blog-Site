
const Loading = ({ isSmall }) => {
  if (isSmall) {
    return (
      <div className="w-5 h-5 rounded-full animate-spin border-2 border-solid border-white border-t-transparent"></div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[200px] w-full">
      <div className="w-12 h-12 rounded-full animate-spin
                    border-4 border-solid border-indigo-500 border-t-transparent"></div>
    </div>
  );
};

export default Loading;
