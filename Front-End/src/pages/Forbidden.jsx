import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

const Forbidden = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 text-center">
            <ShieldAlert className="h-24 w-24 text-destructive mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-2">403 Forbidden</h1>
            <p className="text-lg text-gray-600 mb-8 max-w-md">
                You do not have permission to access this page. Please contact your administrator if you believe this is a mistake.
            </p>
            <Button asChild>
                <Link to="/">Go Back Home</Link>
            </Button>
        </div>
    );
};

export default Forbidden;
