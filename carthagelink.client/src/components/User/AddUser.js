import { useState } from "react";

export default function New() {
    const [entry, setEntry] = useState({
        Name: "",
        Email: "",
        Phone: "",
        Role: "Factory Admin", // Default to "Factory Admin"
        FactoryName: "",    
        LicenseKey: "",
        AssignedDevices: [] 
    });

    const addNewUser = () => {
        fetch("https://localhost:7086/api/User/Super-admin/create-user", { 
            method: "POST", 
            body: JSON.stringify(entry), 
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then((response) => {
            if (!response.ok) throw new Error('Failed to add user');
            return response.json();
        })
        .then(() => {
            alert("User added successfully!"); 
            window.location = "/";
        })
        .catch((e) => {
            console.error("Error adding new User:", e);
            alert("Failed to add user. Please try again.");
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEntry(prev => ({
            ...prev,
            [name]: name === "AssignedDevices" ? value.split(",") : value,
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <div className="bg-white shadow rounded-lg p-8">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Add New User</h1>
                        <p className="mt-2 text-sm text-gray-500">Enter user details below</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="Name"
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="Email"
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="user@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="Phone"
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="+1234567890"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                                Role
                            </label>
                            <select
                                id="role"
                                name="Role"
                                value={entry.Role} // Value set to "Factory Admin"
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                required
                            >
                                <option value="Factory Admin">Factory Admin</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="factory" className="block text-sm font-medium text-gray-700 mb-1">
                                Factory Name
                            </label>
                            <input
                                type="text"
                                id="factory"
                                name="FactoryName"
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Main Factory"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="license" className="block text-sm font-medium text-gray-700 mb-1">
                                License Key
                            </label>
                            <input
                                type="text"
                                id="license"
                                name="LicenseKey"
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="ABC-123-XYZ"
                                required
                            />
                        </div>

                        <div className="col-span-2">
                            <label htmlFor="devices" className="block text-sm font-medium text-gray-700 mb-1">
                                Assigned Devices
                            </label>
                            <input
                                type="text"
                                id="devices"
                                name="AssignedDevices"
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                placeholder="DEV001,DEV002"
                            />
                            <p className="mt-1 text-xs text-gray-500">Enter comma-separated device IDs</p>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-center space-x-4">
                        <button
                            onClick={() => window.location = "/"}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={addNewUser}
                            className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Add User
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
