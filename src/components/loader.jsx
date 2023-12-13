import { ThreeCircles as Loader } from "react-loader-spinner";

const Loading = ({ isLoading }) => {
  return (
    <div className={isLoading ? "full-page-loader" : ""}>
      {isLoading && (
        <Loader type="Puff" color="#00BFFF" height={100} width={100} />
      )}
    </div>
  );
};

export default Loading;
