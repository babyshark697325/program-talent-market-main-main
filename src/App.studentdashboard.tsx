import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./contexts/AuthContext";
import { RoleProvider } from "./contexts/RoleContext";
import { SavedJobsProvider } from "./contexts/SavedJobsContext";
import StudentDashboard from "./components/StudentDashboard";
import GlobalPreferencesBoot from "./components/GlobalPreferencesBoot";


const App: React.FC = () => {
  // ...existing code...

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <Router>
        <AuthProvider>
          <RoleProvider>
            <SavedJobsProvider>
              <div className="min-h-screen">
                <GlobalPreferencesBoot />
                <StudentDashboard />
              </div>
            </SavedJobsProvider>
          </RoleProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
