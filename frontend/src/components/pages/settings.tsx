import React, { useState } from 'react';
import SettingsSidebar from '../settings/SettingsSidebar';
import GeneralSettings from '../settings/GeneralSettings';
import WhatsAppSettings from '../settings/WhatsAppSettings';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings />;
      case 'whatsapp':
        return <WhatsAppSettings />;
      default:
        return <GeneralSettings />;
    }
  };

  return (
    <div className="flex h-full gap-6">
      {/* Sidebar Container - Fixed */}
      <div className="w-[300px] h-fit rounded-lg bg-card shadow-sm overflow-hidden flex-shrink-0">
        <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
      
      {/* Content Container */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default Settings;