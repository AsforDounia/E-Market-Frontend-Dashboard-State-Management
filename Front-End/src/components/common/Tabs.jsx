import Button from './Button';

const Tabs = ({ 
  tabs = [], 
  activeTab, 
  onChange,
  className = '' 
}) => {
  return (
    <div className={`flex gap-2 bg-gray-100 p-1 rounded-lg ${className}`}>
      {tabs.map((tab) => (
        <Button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          variant={activeTab === tab.value ? 'primary' : 'ghost'}
          className={'flex-1 py-3 px-4 rounded-md font-semibold text-sm transition-all flex items-center justify-center py-4'}
        >
          {tab.icon && <span className="mr-2">{tab.icon}</span>}
          {tab.label}
        </Button>
      ))}
    </div>
  );
};

export default Tabs;
