import { Link } from "react-router-dom";


const Card = ({name,image,description}) => {
  return (
    // <div className="h-screen w-screen flex justify-center items-center">
      <div className="flex flex-col justify-start p-4 m-4 items-center h-[70%] w-[300px] bg-gray-300 rounded-3xl shrink-0">
        <div className="h-1/3 w-[85%]  rounded-2xl  overflow-hidden ">
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="items-center flex flex-col mt-8 w-[85%] mb-12">
          <h1 className="text-2xl font-bold ">{name}</h1>
          <p className="text-sm break-all text-center">{description}</p>
        </div>
        <Link to={`/profile/${name}`}>
        <button 
         className="bg-[#9b7b63] h-8 w-24 rounded-2xl hover:bg-[#815c3f]">
          Read More
        </button>
        </Link>
      </div>
    // </div>
  );
};

export default Card;
