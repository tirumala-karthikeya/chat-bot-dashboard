
import React, { useEffect, useState } from 'react';
import { checkServiceAvailability } from '../utils/backendConfig';
import { AlertCircle, CheckCircle } from 'lucide-react';

const StatusMonitor: React.FC = () => {
  const [status, setStatus] = useState({
    nextAgi: false,
    database: false,
    loading: true
  });

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const availability = await checkServiceAvailability();
        setStatus({
          ...availability,
          loading: false
        });
      } catch (error) {
        console.error('Error checking service availability:', error);
        setStatus({
          nextAgi: false,
          database: false,
          loading: false
        });
      }
    };

    checkStatus();
    // Set up periodic checks
    const interval = setInterval(checkStatus, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  if (status.loading) {
    return (
      <div className="text-xs text-muted-foreground p-2">
        Checking services...
      </div>
    );
  }

  return (
    <div className="text-xs p-2 space-y-1">
      <div className="flex items-center gap-1.5">
        {status.nextAgi ? (
          <CheckCircle size={14} className="text-green-500" />
        ) : (
          <AlertCircle size={14} className="text-amber-500" />
        )}
        <span className={status.nextAgi ? "text-muted-foreground" : "text-amber-500"}>
          Next AGI API {status.nextAgi ? 'Connected' : 'Disconnected'}
        </span>
      </div>
      
      <div className="flex items-center gap-1.5">
        {status.database ? (
          <CheckCircle size={14} className="text-green-500" />
        ) : (
          <AlertCircle size={14} className="text-red-500" />
        )}
        <span className={status.database ? "text-muted-foreground" : "text-red-500"}>
          Database {status.database ? 'Connected' : 'Disconnected'}
        </span>
      </div>
    </div>
  );
};

export default StatusMonitor;
