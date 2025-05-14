
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  Tags,
  Gift,
  TruckIcon,
  Star,
  Settings
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="h-5 w-5" /> },
  { name: 'Users', path: '/users', icon: <Users className="h-5 w-5" /> },
  { name: 'Products', path: '/products', icon: <Package className="h-5 w-5" /> },
  { name: 'Categories', path: '/categories', icon: <Tags className="h-5 w-5" /> },
  { name: 'Orders', path: '/orders', icon: <ShoppingCart className="h-5 w-5" /> },
  { name: 'Promotions', path: '/promotions', icon: <Gift className="h-5 w-5" /> },
  { name: 'Shipping', path: '/shipping', icon: <TruckIcon className="h-5 w-5" /> },
  { name: 'Reviews', path: '/reviews', icon: <Star className="h-5 w-5" /> },
  { name: 'Settings', path: '/settings', icon: <Settings className="h-5 w-5" /> },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-gray-800">E-Commerce Admin</h1>
      </div>
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  location.pathname === item.path
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                {item.icon}
                <span className="ml-3">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-200" />
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">Admin User</p>
            <p className="text-xs text-gray-500">admin@example.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
