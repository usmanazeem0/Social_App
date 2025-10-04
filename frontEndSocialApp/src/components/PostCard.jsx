// import React from "react";
// import { FaHeart, FaRegComment, FaUserCircle } from "react-icons/fa";

// const PostCard = ({ post }) => {
//   return (
//     <div className="bg-white shadow-md rounded-lg p-4 w-full mb-6 overflow-hidden">
//       {/* Profile + Name */}
//       <div className="flex items-center mb-1">
//         <FaUserCircle className="w-10 h-10 text-gray-400" />
//         <span className="ml-3 font-semibold">{post.user.firstName}</span>
//       </div>

//       {/* Time */}
//       <div className="text-sm text-gray-500 mb-2 ml-3">
//         {new Date(post.createdAt).toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         })}
//       </div>

//       {/* Title */}
//       <h2 className="text-lg font-semibold mb-1">{post.title}</h2>

//       {/* Description */}
//       <p className="text-gray-700 mb-3">{post.description}</p>

//       {/* Image */}
//       {post.imageUrl && (
//         <img
//           src={`http://localhost:5000/${post.imageUrl}`}
//           alt="Post"
//           className="w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] object-cover rounded-lg mb-3"
//         />
//       )}

//       {/* Like & Comment */}
//       <div className="flex items-center space-x-4 text-gray-600 mt-2">
//         <button className="flex items-center space-x-1 px-3 py-1 rounded hover:bg-red-50 hover:text-red-500 transition">
//           <FaHeart />
//           <span>{post.likes?.length || 0}</span>
//         </button>
//         <button className="flex items-center space-x-1 px-3 py-1 rounded hover:bg-blue-50 hover:text-blue-500 transition">
//           <FaRegComment />
//           <span>{post.comments?.length || 0}</span>
//         </button>
//       </div>
//     </div>
//   );
// };

// export default PostCard;
