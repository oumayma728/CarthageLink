import Card from "../../../Layouts/User/Card.jsx";
import { useAuth } from "../../../../contexts/AuthContext.js";
import { useEffect } from "react";

export default function PersoInfoCard() {
    const { user, loading } = useAuth();
    
    useEffect(() => {
        console.log("Current user data:", user);
    }, [user]);
    
    if (loading) {
        return <div className="p-6">Loading user data...</div>;
    }

    return (
        <div className="p-6">
            <Card title="Personal Information">
                <div className="space-y-6 px-4 py-2">
                    {/* Personal Information Section */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</p>
                                <p className="text-sm dark:text-white">{user?.Name || 'No Name provided'}</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email address</p>
                                <p className="text-sm dark:text-white">{user?.email || 'No email provided'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</p>
                                <p className="text-sm dark:text-white">{user?.phone || 'No phone provided'}</p>
                            </div>
                        </div>
                        
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Role</p>
                            <p className="text-sm dark:text-white">{user?.role || 'No role specified'}</p>
                        </div>
                    </div>

                    {/* Address Section - Static for now */}
                    <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h3 className="text-base font-medium text-gray-900 dark:text-white">Address</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Country</p>
                                <p className="text-sm dark:text-white">Tunisia</p>
                            </div>

                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}