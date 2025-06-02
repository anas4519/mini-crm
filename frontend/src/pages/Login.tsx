import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleLoginSuccess = (credentialResponse: any) => {
    // Use the login function from AuthContext
    login(credentialResponse);
    navigate("/");
  };

  const handleLoginError = () => {
    setError("Login failed. Please try again.");
  };

  const handleManualLogin = () => {
    // For demo purposes, create a mock credential
    const mockCredential = {
      credential: "mock_credential_token",
      clientId: "mock_client_id",
      select_by: "user",
    };
    login(mockCredential);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/30 p-4">
      <Card className="w-full max-w-md shadow-xl border-0">
        <CardHeader className="text-center space-y-1">
          <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
          <CardDescription className="text-lg">
            Sign in to access your CRM dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center space-y-4">
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={handleLoginError}
                useOneTap
                theme="filled_blue"
                shape="pill"
                text="signin_with"
                size="large"
              />
              
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              
              <div className="relative w-full my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>
              
              <Button 
                onClick={handleManualLogin} 
                variant="outline" 
                className="w-full"
              >
                Continue without Google
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;