import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { 
  // XMarkIcon,
  // HomeIcon, 
  BriefcaseIcon, 
  // ClipboardIcon,
  // ChartBarIcon,
  // UserIcon
} from 'lucide-react';

const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
const navigation = [
  { name: 'Overview', href: '/dashboard' },
  { name: 'Job Board', href: '/dashboard/jobs' },
  { name: 'Applications', href: '/dashboard/applications' },
  { name: 'Documents', href: '/dashboard/documents' },
  { name: 'Analytics', href: '/dashboard/analytics' },
  { name: 'Profile', href: '/dashboard/profile' },
];

export default function Sidebar({ open, setOpen }) {
  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={classNames(
          "relative z-50 lg:hidden",
          open ? "fixed inset-0 bg-gray-900/80 backdrop-blur-sm" : "hidden"
        )}
      >
        <div className="fixed inset-0 flex">
          <div className="relative mr-16 flex w-full max-w-xs flex-1">
            <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
              <button 
                type="button" 
                onClick={() => setOpen(false)}
                aria-label="Close sidebar"
              >
                <BriefcaseIcon className="h-6 w-6 text-white" />
              </button>
            </div>
            
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
              <SidebarContent />
            </div>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <SidebarContent />
        </div>
      </div>
    </>
  );
}

Sidebar.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired
};

function SidebarContent() {
  const location = useLocation();
  
  return (
    <>
      <div className="flex h-16 shrink-0 items-center">
        <BriefcaseIcon className="h-8 w-8 text-blue-600" />
        <span className="ml-2 text-xl font-bold">JobTracker</span>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={classNames(
                      location.pathname === item.href
                        ? 'bg-gray-50 text-blue-600'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50',
                      'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'
                    )}
                  >
                    <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </nav>
    </>
  );
}