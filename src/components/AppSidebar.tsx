import { Calendar, Home, Users, Briefcase, BookOpen, Settings, HelpCircle, User, FileText, Shield, BarChart3, AlertTriangle, Search, Star, UserPlus, Sparkles, LucideIcon, DollarSign } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useRole } from "@/contexts/RoleContext"
import { useAuth } from "@/contexts/AuthContext"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"

// Navigation item types
interface NavigationItem {
  title: string;
  url: string;
  icon: LucideIcon;
  tab?: string;
  scrollTo?: string;
}

const studentNavigation = [
  {
    title: "Dashboard",
    url: "/student-dashboard",
    icon: Home,
  },
  {
    title: "Resources",
    url: "/resources",
    icon: BookOpen,
  },
  {
    title: "My Profile",
    url: "/profile",
    icon: User,
  },
  {
    title: "Payouts",
    url: "/payouts",
    icon: DollarSign,
  },
  {
    title: "Settings",
    url: "/student/settings",
    icon: Settings,
  },
]

const clientNavigation = [
  {
    title: "Browse Talent",
    url: "/",
    icon: Home,
    tab: "students",
    scrollTo: "students",
  },
  {
    title: "Post a Job",
    url: "/post-job",
    icon: Briefcase,
  },
  {
    title: "My Profile",
    url: "/client/profile",
    icon: User,
  },
  {
    title: "Settings",
    url: "/client/settings",
    icon: Settings,
  },
]

const adminNavigation = [
  {
    title: "Admin Dashboard",
    url: "/admin-dashboard",
    icon: Shield,
  },
  {
    title: "User Management",
    url: "/admin/users",
    icon: Users,
  },
  {
    title: "Review Jobs",
    url: "/admin/review-jobs",
    icon: Briefcase,
  },
  {
    title: "Spotlight Success",
    url: "/admin/spotlight",
    icon: Sparkles,
  },
  {
    title: "Learning Resources",
    url: "/admin/learning-resources",
    icon: BookOpen,
  },
  {
    title: "System Analytics",
    url: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Reports & Issues",
    url: "/admin/reports",
    icon: AlertTriangle,
  },
]

const studentQuickActions = [
  {
    title: "Browse Jobs",
    url: "/browse-jobs",
    icon: Search,
  },
  {
    title: "Browse Students",
    url: "/browse-students", 
    icon: Users,
  },
  {
    title: "Learning Resources",
    url: "/resources",
    icon: BookOpen,
  },
]

// Guest-specific actions (accessible without auth)
const guestStudentQuickActions = [
  {
    title: "Browse Jobs",
    url: "/browse-jobs",
    icon: Search,
  },
  {
    title: "Browse Students",
    url: "/browse-students",
    icon: Users,
  },
  {
    title: "Learning Resources", 
    url: "/resources",
    icon: BookOpen,
  },
]

// Authenticated student actions
const authStudentQuickActions = [
  {
    title: "Browse Jobs",
    url: "/browse-jobs",
    icon: Search,
  },
  {
    title: "My Applications",
    url: "/my-applications",
    icon: FileText,
  },
  {
    title: "Saved Jobs",
    url: "/saved-jobs",
    icon: Star,
  },
]

const clientQuickActions = [
  {
    title: "Browse Students",
    url: "/browse-students",
    icon: Users,
  },
  {
    title: "Manage Jobs",
    url: "/manage-jobs",
    icon: Settings,
  },
]

const adminQuickActions = [
  {
    title: "System Settings",
    url: "/admin/settings",
    icon: Settings,
  },
  {
    title: "Platform Stats",
    url: "/admin/stats",
    icon: BarChart3,
  },
]

export function AppSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { role } = useRole()
  const { isGuest, loading, user } = useAuth()
  // Determine sidebar by current route first, then fall back to role.
  const path = location.pathname || '/'
  // Always use client sidebar on homepage
  const isHome = path === '/';
  const isAdminArea = /^\/admin(\b|[-/])/.test(path) || path === '/admin-dashboard'
  const isStudentArea = /^\/student(\b|[-/])/.test(path) ||
    path === '/student-dashboard' ||
    path === '/resources' ||
    path === '/all-resources' ||
    path === '/payouts'
  const isClientArea = !isAdminArea && !isStudentArea // everything else defaults to client
  let navigationItems;
  let quickActions;
  if (isHome) {
    navigationItems = [
      { title: "Browse Talent", url: "/", icon: Home, tab: "students", scrollTo: "students" },
      { title: "Post a Job", url: "/post-job", icon: Briefcase },
      { title: "My Profile", url: "/client/profile", icon: User },
      { title: "Settings", url: "/client/settings", icon: Settings },
    ];
    quickActions = [
      { title: "Browse Students", url: "/browse-students", icon: Users },
      { title: "Manage Jobs", url: "/manage-jobs", icon: Settings },
    ];
  } else {
    // Use role from context instead of inferring from URL
    const effectiveRole = role;
    if (effectiveRole === 'student') {
      // Use dynamic route for student's own profile when possible
      const dynStudentNav = studentNavigation.map((item) =>
        item.title === 'My Profile' && user?.id
          ? { ...item, url: `/student/${user.id}` }
          : item
      )
      navigationItems = dynStudentNav
    } else if (effectiveRole === 'admin') {
      navigationItems = adminNavigation
    } else {
      navigationItems = clientNavigation
    }
    
    // Choose appropriate quick actions based on role and authentication status
    if (effectiveRole === 'student') {
      quickActions = isGuest ? guestStudentQuickActions : authStudentQuickActions;
    } else if (effectiveRole === 'admin') {
      quickActions = adminQuickActions;
    } else {
      quickActions = clientQuickActions;
    }
  }
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const handleNavigation = (item: NavigationItem) => {
    // If guest, redirect to signup for blocked routes only
    const guestBlockedRoutes = ["/client/profile", "/client/settings", "/student/settings", "/profile", "/post-job", "/manage-jobs"];
    if (isGuest && guestBlockedRoutes.includes(item.url)) {
      navigate('/auth', { state: { signup: true } });
      return;
    }
    if (item.tab) {
      navigate(item.url, { state: { activeTab: item.tab, scrollTo: item.scrollTo } });
    } else {
      navigate(item.url);
      if (item.url === '/' || item.url.includes('dashboard')) {
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      }
    }
  }

  const isItemActive = (item: NavigationItem) => {
    if (location.pathname !== item.url) return false
    
    // For items with tabs, check if we're on the right tab
    if (item.tab) {
      // We can't directly access the activeTab state here, so we'll use a different approach
      // For now, we'll only highlight "Browse Talent" when on the home page without a specific tab
      return item.title === "Browse Talent"
    }
    
    return true
  }

  const getRoleColor = () => {
    switch (role) {
      case 'admin':
      case 'developer':
        return 'from-red-500 to-red-600'
      case 'student': return 'from-blue-500 to-blue-600'
      default: return 'from-primary to-accent'
    }
  }

  const getRoleLabel = () => {
    switch (role) {
      case 'admin': return 'Admin Panel'
      case 'developer': return 'Developer Panel'
      case 'student': return 'Student Portal'
      default: return 'Talent Hub'
    }
  }

  const getDashboardPath = () => {
    switch (role) {
      case 'admin':
      case 'developer':
        return '/admin-dashboard'
      case 'student':
        return '/student-dashboard'
      default:
        return '/'
    }
  }

  const handleHomeClick = () => {
    if (isGuest) {
      navigate('/')
    } else {
      navigate(getDashboardPath())
    }
    // Always scroll to top when navigating home
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 100)
  }

  return (
    <Sidebar className="border-r border-primary/10">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <button
            onClick={handleHomeClick}
            className={`w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center cursor-pointer`}
            aria-label="Go to home"
            title="Home"
          >
            <Home className="text-primary-foreground h-4 w-4" />
          </button>
          <div>
            <h2 className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              MyVillage
            </h2>
            <p className="text-xs text-muted-foreground">
              {getRoleLabel()}
            </p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => handleNavigation(item)}
                    isActive={isItemActive(item)}
                    className="cursor-pointer"
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {quickActions.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {quickActions.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      onClick={() => handleNavigation(item)}
                      className="cursor-pointer"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {isGuest && (
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => navigate('/auth', { state: { signup: true } })}
                    className="cursor-pointer text-muted-foreground hover:text-foreground"
                  >
                    <UserPlus />
                    <span className="text-xs">Create Account</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
    </Sidebar>
  )
}
