import SalesforceForm from './SalesforceForm';
import { useAuth } from '../context/AuthContext';

export default function UserProfile() {

  const { user } = useAuth();

  if (!user) return <div>Loading user data...</div>;

  return (
    <div>
 
        <SalesforceForm 
          userId={user.id} 
          userName={user.name} 
          userEmail={user.email} 
        />
    
    </div>
  );
}