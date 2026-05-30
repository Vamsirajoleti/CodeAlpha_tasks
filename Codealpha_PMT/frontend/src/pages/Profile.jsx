import { useState, useEffect } from "react";
import { getProfile, updateProfile } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { updateUser } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getProfile();
        setName(data.name);
        setEmail(data.email);
        setNewName(data.name);
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!newName.trim()) {
      setError("Name cannot be empty");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data } = await updateProfile({ name: newName });
      setName(data.name);
      updateUser({ name: data.name }); // update navbar too
      setEditing(false);
      setSuccess("Profile updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (n) => {
    if (!n) return "?";
    return n
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-gray-800 mb-6">My Profile</h1>

      <div className="card">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-3">
            {getInitials(name)}
          </div>
          <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
          <p className="text-sm text-gray-500">{email}</p>
        </div>

        {/* Success message */}
        {success && (
          <div className="bg-green-50 border border-green-100 text-green-600 text-sm px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Edit form */}
        {editing ? (
          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => { setNewName(e.target.value); setError(""); }}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="label">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="input-field bg-gray-50 text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
            </div>

            <div className="flex gap-3 pt-1">
              <button type="submit" disabled={loading} className="btn-primary flex-1">
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => { setEditing(false); setNewName(name); setError(""); }}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-4">
            <div>
              <p className="label">Full Name</p>
              <p className="text-gray-800 text-sm bg-gray-50 px-3 py-2.5 rounded-lg">{name}</p>
            </div>
            <div>
              <p className="label">Email</p>
              <p className="text-gray-800 text-sm bg-gray-50 px-3 py-2.5 rounded-lg">{email}</p>
            </div>
            <button
              onClick={() => setEditing(true)}
              className="btn-primary mt-1"
            >
              Edit Name
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
