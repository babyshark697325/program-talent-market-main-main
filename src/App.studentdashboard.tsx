import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./contexts/AuthContext";
import { RoleProvider } from "./contexts/RoleContext";
import { SavedJobsProvider } from "./contexts/SavedJobsContext";
import StudentDashboard from "./components/StudentDashboard";
import { mockJobs } from "./data/mockJobs";
import GlobalPreferencesBoot from "./components/GlobalPreferencesBoot";

// Mock auth context for preview
const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
    </div>
  );
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"students" | "jobs">("students");

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <Router>
        <MockAuthProvider>
          <RoleProvider>
            <SavedJobsProvider>
              <div className="min-h-screen">
                <GlobalPreferencesBoot />
                <StudentDashboard 
                  jobs={mockJobs} 
                  setActiveTab={setActiveTab}
                />
              </div>
            </SavedJobsProvider>
          </RoleProvider>
        </MockAuthProvider>
      </Router>
    </ThemeProvider>
  );
};

export default App;
