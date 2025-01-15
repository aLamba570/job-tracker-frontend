import { TrendingUpIcon, TrendingDownIcon } from 'lucide-react';

const classNames = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

const StatsOverview = () => {  // Changed to const declaration
  const stats = [
    { 
      name: 'Total Applications', 
      value: '12', 
      change: '+2', 
      changeType: 'increase',
      icon: TrendingUpIcon 
    },
    { 
      name: 'Active Applications', 
      value: '8', 
      change: '-1', 
      changeType: 'decrease',
      icon: TrendingDownIcon 
    },
    { 
      name: 'Interviews Scheduled', 
      value: '3', 
      change: '+1', 
      changeType: 'increase',
      icon: TrendingUpIcon 
    },
    { 
      name: 'Response Rate', 
      value: '75%', 
      change: '+5%', 
      changeType: 'increase',
      icon: TrendingUpIcon 
    },
  ];

  return (
    <div>
      <h3 className="text-base font-semibold leading-6 text-gray-900">Last 30 days</h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-blue-500 p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
              <p
                className={classNames(
                  item.changeType === 'increase' ? 'text-green-600' : 'text-red-600',
                  'ml-2 flex items-baseline text-sm font-semibold'
                )}
              >
                {item.change}
              </p>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default StatsOverview;  // Add this line