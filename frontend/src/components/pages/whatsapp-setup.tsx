import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WhatsAppSetupWizard } from '../whatsapp/WhatsAppSetupWizard';

export const WhatsAppSetup: React.FC = () => {
  const navigate = useNavigate();

  const handleSetupComplete = () => {
    navigate('/settings/whatsapp');
  };

  const handleCancel = () => {
    navigate('/settings');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <WhatsAppSetupWizard 
        onComplete={handleSetupComplete}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default WhatsAppSetup;