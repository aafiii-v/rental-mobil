import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Eye } from "lucide-react";

const Manager = () => {
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModal, setIsDetailModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [sortOption, setSortOption] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const token = localStorage.getItem("token");
  const currentUserRole = localStorage.getItem("role");
  const navigate = useNavigate();

  const usersPerPage = 6;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (currentUserRole !== "Admin") {
      navigate("/profile");
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await fetch("https://localhost:44350/api/User/GetAllUser", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.StatusDesc || "Failed to fetch users");
        setUsers(data.data || []);
      } catch (err) {
        setErrorMessage(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token, navigate, currentUserRole]);

  const handleDelete = async () => {
    try {
      const res = await fetch(
        `https://localhost:44350/api/User/DeleteUser/${selectedUser.id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.StatusDesc || "Delete failed");

      setUsers(users.filter((u) => u.id !== selectedUser.id));
      setIsDeleteModal(false);
      setSelectedUser(null);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  const handleUpdate = (user) => {
    setSelectedUser(user);
    setIsDetailModal(false);
    setIsModalOpen(true);
  };

  const handleDetail = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    setIsDetailModal(true);
  };

  const handleSaveUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `https://localhost:44350/api/User/UpdateUser/${selectedUser.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedUser),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.StatusDesc || "Update failed");

      setUsers(
        users.map((u) => (u.id === selectedUser.id ? selectedUser : u))
      );
      setIsModalOpen(false);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  // Sorting + Filtering
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortOption === "asc") return a.name.localeCompare(b.name);
    if (sortOption === "desc") return b.name.localeCompare(a.name);
    if (sortOption === "admin") return a.role === "Admin" ? -1 : 1;
    if (sortOption === "user") return a.role === "User" ? -1 : 1;
    return 0;
  });

  if (loading)
    return <p className="text-center mt-20 text-white">Loading users...</p>;

  // Pagination
  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = sortedUsers.slice(startIndex, startIndex + usersPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-950 to-gray-800 p-10 pt-35 text-white">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg"
        >
          ← Kembali
        </button>

        {/* Search bar*/}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name or role ...."
          className="bg-gray-800 px-4 py-2 rounded-lg border border-gray-600 text-white w-180"
        />

        {/* Sorting dropdown */}
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-600"
        >
          <option value="asc">A-Z</option>
          <option value="desc">Z-A</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      <h2 className="text-4xl font-bold text-yellow-400 mb-8 text-center">
        Manage Users
      </h2>

      {errorMessage && (
        <p className="text-red-500 text-center mb-4">{errorMessage}</p>
      )}

      {/* List Users */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {currentUsers.length > 0 ? (
          currentUsers.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between bg-gray-800 rounded-xl shadow-md p-5 border border-gray-700 hover:shadow-yellow-500/20 transition"
            >
              {/* Info User */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-500 text-black font-bold text-lg">
                  {u.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white">{u.name}</h3>
                  <p className="text-sm text-gray-400">{u.email}</p>
                  <p className="text-sm text-gray-400 flex items-center gap-1">
                    <Phone size={16} /> {u.phoneNumber}
                  </p>
                </div>
              </div>

              {/* Role + Actions */}
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${u.role === "Admin"
                    ? "bg-yellow-500 text-black"
                    : "bg-blue-500 text-white"
                    }`}
                >
                  {u.role}
                </span>

                <button
                  onClick={() => handleUpdate(u)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition"
                >
                  Update
                </button>
                <button
                  onClick={() => {
                    setSelectedUser(u);
                    setIsDeleteModal(true);
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition"
                >
                  Delete
                </button>

                <button
                  onClick={() => handleDetail(u)}
                  className="bg-gray-600 hover:bg-gray-500 p-2 rounded-lg"
                >
                  <Eye size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">No users found</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded ${currentPage === 1
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-600"
              }`}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1
                ? "bg-yellow-600 font-bold"
                : "bg-gray-700 hover:bg-gray-600"
                }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded ${currentPage === totalPages
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-yellow-500 hover:bg-yellow-600"
              }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Modal Update / Detail */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-bold text-yellow-400 mb-6">
              {isDetailModal ? "Detail User" : "Update User"}
            </h2>
            <form
              onSubmit={
                isDetailModal ? (e) => e.preventDefault() : handleSaveUpdate
              }
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                value={selectedUser.name}
                readOnly={isDetailModal}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, name: e.target.value })
                }
                placeholder="Name"
                className="p-3 rounded bg-gray-800 text-white"
              />
              <input
                type="text"
                value={selectedUser.userName}
                readOnly={isDetailModal}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    userName: e.target.value,
                  })
                }
                placeholder="Username"
                className="p-3 rounded bg-gray-800 text-white"
              />
              <input
                type="email"
                value={selectedUser.email}
                readOnly={isDetailModal}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, email: e.target.value })
                }
                placeholder="Email"
                className="p-3 rounded bg-gray-800 text-white"
              />
              <input
                type="text"
                value={selectedUser.phoneNumber}
                readOnly={isDetailModal}
                onChange={(e) =>
                  setSelectedUser({
                    ...selectedUser,
                    phoneNumber: e.target.value,
                  })
                }
                placeholder="Phone Number"
                className="p-3 rounded bg-gray-800 text-white"
              />
              <select
                value={selectedUser.role}
                disabled={isDetailModal}
                onChange={(e) =>
                  setSelectedUser({ ...selectedUser, role: e.target.value })
                }
                className="p-3 rounded bg-gray-800 text-white"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
                >
                  {isDetailModal ? "Close" : "Cancel"}
                </button>
                {!isDetailModal && (
                  <button
                    type="submit"
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-4 py-2 rounded"
                  >
                    Save
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Delete Confirmation */}
      {isDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-full max-w-md text-center">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">
              Konfirmasi Hapus
            </h2>
            <p className="text-gray-300 mb-6">
              Apakah kamu yakin ingin menghapus akun{" "}
              <span className="font-semibold">{selectedUser.name}</span>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsDeleteModal(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                No
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Manager;
