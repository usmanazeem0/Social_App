import React, { useEffect, useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IconButton, Badge } from "@mui/material";
import PublicIcon from "@mui/icons-material/Public";
import socket from "../api/socket";

import axiosInstance from "../api/axiosInstance";

import "./Notifications.css";

export default function NotificationsDropdown() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [userId, setUserId] = useState(null);
  const dropdownRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      setUserId(decoded.id || decoded._id);
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }, []);

  const fetchFollowRequests = async () => {
    try {
      const res = await axiosInstance.get("/api/follow/requests");

      setReceivedRequests(res.data.receivedRequests || []);
    } catch (err) {
      console.error("Error fetching follow requests:", err);
    }
  };

  useEffect(() => {
    if (!userId) return;

    // Fetch initial requests
    fetchFollowRequests();

    // Register user with socket
    socket.emit("registerUser", userId);

    // Listen for new follow requests
    socket.on("followRequestSent", () => fetchFollowRequests());

    // listen for request updates
    socket.on("followRequestUpdated", () => fetchFollowRequests());

    // Clean up
    return () => {
      socket.off("followRequestSent");
      socket.off("followRequestUpdated");
    };
  }, [userId]);

  const handleAccept = async (senderId) => {
    try {
      const res = await axiosInstance.put(`/api/follow/accept/${senderId}`);

      // setReceivedRequests((prev) =>
      //   prev.filter((req) => req.sender !== senderId)
      // );

      // Force refresh the data from server
      await fetchFollowRequests();

      toast.success("Follow request accepted!", {
        autoClose: 2000,
        hideProgressBar: false,
      });
    } catch (err) {
      console.error("Accept error:", err.response?.data);
      toast.error("Failed to accept request", { autoClose: 2000 });
    }
  };

  const handleReject = async (senderId) => {
    try {
      const res = await axiosInstance.put(`/api/follow/reject/${senderId}`);

      // setReceivedRequests((prev) =>
      //   prev.filter((req) => req.sender !== senderId)
      // );

      // Force refresh the data from server
      await fetchFollowRequests();

      toast.error("Follow request rejected!", {
        autoClose: 2000,
        hideProgressBar: false,
      });
    } catch (err) {
      console.error("Reject error:", err.response?.data);
      toast.error("Failed to reject request", { autoClose: 2000 });
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "Recently";
    const date = new Date(dateStr);
    return isNaN(date.getTime())
      ? "Recently"
      : date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="notification-wrapper" ref={dropdownRef}>
      <IconButton
        onClick={() => setShowDropdown((prev) => !prev)}
        color="inherit"
      >
        <Badge badgeContent={receivedRequests.length} color="error">
          <PublicIcon />
        </Badge>
      </IconButton>
      {showDropdown && (
        <div className="notification-dropdown">
          {receivedRequests.length === 0 ? (
            <p className="empty">No new requests</p>
          ) : (
            <div className="requests-list">
              {receivedRequests.map((req) => (
                <div key={req._id} className="notification-card">
                  <div className="notification-profile">
                    <img
                      src={req.sender?.avatar || "/default-avatar.png"}
                      alt="avatar"
                      className="notification-avatar"
                    />
                    <div className="notification-user-info">
                      <p className="notification-username">
                        {req.sender?.firstName || "Unknown"}
                      </p>
                      <p className="notification-text">wants to follow you</p>
                      <span className="time">{formatTime(req.createdAt)}</span>
                    </div>
                  </div>
                  <div className="notification-actions">
                    <button
                      className="accept-btn"
                      onClick={() => handleAccept(req.sender?._id)}
                    >
                      Accept
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleReject(req.sender?._id)}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      <ToastContainer />
    </div>
  );

  // return (
  //   <div className="notification-wrapper" ref={dropdownRef}>
  //     <IconButton
  //       onClick={() => setShowDropdown((prev) => !prev)}
  //       color="inherit"
  //     >
  //       <Badge badgeContent={receivedRequests.length} color="error">
  //         <PublicIcon />
  //       </Badge>
  //     </IconButton>
  //     {showDropdown && (
  //       <div className="notification-dropdown">
  //         {receivedRequests.length === 0 ? (
  //           <p className="empty">No new requests</p>
  //         ) : (
  //           <div className="requests-list">
  //             {receivedRequests.map((req) => (
  //               <div key={req._id} className="notification-card">
  //                 <img
  //                   src={req.senderAvatar || "/default-avatar.png"}
  //                   alt="avatar"
  //                   className="avatar"
  //                 />
  //                 <div className="info">
  //                   <p>
  //                     <strong>{req.senderName || "Unknown"}</strong> wants to
  //                     follow you
  //                   </p>
  //                   <span className="time">{formatTime(req.createdAt)}</span>
  //                 </div>
  //                 <div className="actions">
  //                   <button onClick={() => handleAccept(req.sender)}>✓</button>
  //                   <button onClick={() => handleReject(req.sender)}>✕</button>
  //                 </div>
  //               </div>
  //             ))}
  //           </div>
  //         )}
  //       </div>
  //     )}
  //   </div>
  // );
}
